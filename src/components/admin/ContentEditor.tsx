import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useContent } from '../../hooks/useContent';
import { Loader2 } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import toast from 'react-hot-toast';

interface ContentEditorProps {
  sectionId: string;
  schema: { [key: string]: 'string' | 'text' | 'url' };
  initialData: any;
}

export default function ContentEditor({ sectionId, schema, initialData }: ContentEditorProps) {
  const { content, loading } = useContent(sectionId, initialData);
  const [formData, setFormData] = useState(initialData);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', sectionId), formData, { merge: true });
      toast.success(`${sectionId} content updated!`);
    } catch {
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSkeleton type="text" rows={6} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {Object.entries(schema).map(([key, type]) => (
        <div key={key}>
          <label className="block text-sm font-semibold text-gray-700 capitalize mb-1.5">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>
          {type === 'text' ? (
            <textarea
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-y min-h-[100px]"
              rows={4}
            />
          ) : (
            <input
              type={type === 'url' ? 'url' : 'text'}
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
              placeholder={type === 'url' ? 'https://...' : ''}
            />
          )}
          {type === 'url' && formData[key] && (
            <div className="mt-2">
              <img src={formData[key]} alt="Preview" className="h-20 rounded-lg object-cover border" onError={(e) => (e.currentTarget.style.display = 'none')} />
            </div>
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-[#0B2545] text-white font-semibold rounded-lg hover:bg-[#0B2545]/90 transition disabled:opacity-60"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
