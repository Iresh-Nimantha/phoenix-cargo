import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { Upload, Trash2, Copy, Image, Loader2, CheckCircle } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import toast from 'react-hot-toast';

interface MediaAsset {
  fileName: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: any;
  storagePath: string;
}

export default function MediaManager() {
  const { data: assets, loading } = useFirestoreCollection<MediaAsset>('mediaAssets', { orderByField: 'uploadedAt' });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const storage = getStorage();
    setUploading(true);

    for (const file of Array.from(files)) {
      const storagePath = `uploads/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          (error) => {
            toast.error(`Upload failed: ${error.message}`);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            await addDoc(collection(db, 'mediaAssets'), {
              fileName: file.name,
              url,
              type: file.type,
              size: file.size,
              storagePath,
              uploadedAt: serverTimestamp(),
            });
            toast.success(`${file.name} uploaded!`);
            resolve();
          }
        );
      });
    }

    setUploading(false);
    setProgress(0);
  };

  const handleDelete = async (asset: MediaAsset & { id: string }) => {
    if (!confirm(`Delete ${asset.fileName}?`)) return;
    try {
      const storage = getStorage();
      await deleteObject(ref(storage, asset.storagePath)).catch(() => {});
      await deleteDoc(doc(db, 'mediaAssets', asset.id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  if (loading) return <LoadingSkeleton type="card" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Media Manager</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#800C30] text-white font-semibold rounded-lg hover:bg-[#800C30]/90 transition disabled:opacity-60 w-full sm:w-auto"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? `Uploading ${progress}%` : 'Upload Files'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="mb-6 bg-white rounded-xl p-4 border">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Drop zone */}
        <motion.div
          whileHover={{ scale: 1.02, borderColor: '#00A8E8' }}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-cyan-600 hover:bg-cyan-50/30 transition-all min-h-[200px]"
        >
          <Upload className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium">Drop files here</p>
          <p className="text-xs">or click to browse</p>
        </motion.div>

        {assets.map((asset, i) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
          >
            {asset.type.startsWith('image/') ? (
              <div className="h-40 overflow-hidden bg-gray-50">
                <img src={asset.url} alt={asset.fileName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="h-40 bg-gray-50 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-300" />
              </div>
            )}
            <div className="p-3">
              <p className="text-xs font-medium text-gray-900 truncate">{asset.fileName}</p>
              <p className="text-[10px] text-gray-400">{(asset.size / 1024).toFixed(1)} KB</p>
              <div className="flex gap-1.5 mt-2">
                <button
                  onClick={() => copyUrl(asset.url)}
                  className="flex-1 flex items-center justify-center gap-1 p-1.5 bg-gray-50 hover:bg-cyan-50 text-gray-500 hover:text-cyan-600 rounded-lg text-xs transition"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
                <button
                  onClick={() => handleDelete(asset)}
                  className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {assets.length === 0 && !uploading && (
        <div className="text-center py-12 text-gray-400">No media uploaded yet. Click upload to get started.</div>
      )}
    </div>
  );
}
