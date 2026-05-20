import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useContent } from '../../hooks/useContent';
import { Loader2 } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import toast from 'react-hot-toast';

interface ContentEditorProps {
  sectionId: string;
  schema: { [key: string]: 'string' | 'text' | 'url' | 'boolean' | 'url-list' };
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
          <label className="block text-sm font-bold text-[#0B2545] uppercase tracking-wider mb-2">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </label>

          {type === 'url-list' ? (
            <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
              {(() => {
                const list = Array.isArray(formData[key])
                  ? formData[key]
                  : typeof formData[key] === 'string'
                  ? formData[key].split(',').map((u: string) => u.trim()).filter(Boolean)
                  : [];

                const safeList = list.length > 0 ? list : [''];

                return (
                  <>
                    {safeList.map((url: string, index: number) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const newList = [...safeList];
                            newList[index] = e.target.value;
                            setFormData({ ...formData, [key]: newList });
                          }}
                          className="flex-1 p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm bg-white font-semibold text-gray-700"
                          placeholder="https://... (image or video URL)"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newList = safeList.filter((_, i) => i !== index);
                            setFormData({ ...formData, [key]: newList.length > 0 ? newList : [''] });
                          }}
                          className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition text-xs font-bold border border-red-200 uppercase tracking-widest"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, [key]: [...safeList, ''] });
                      }}
                      className="px-4 py-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 rounded-xl transition text-xs font-extrabold border border-cyan-200 uppercase tracking-widest flex items-center justify-center gap-1.5"
                    >
                      + Add Background Media URL
                    </button>
                  </>
                );
              })()}
            </div>
          ) : type === 'boolean' ? (
            <div className="flex items-center gap-3 py-1 bg-gray-50/50 p-3 rounded-xl border border-gray-100 max-w-xs">
              <label className="relative inline-flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={
                    formData[key] === true ||
                    formData[key] === 'true' ||
                    formData[key] === 1
                  }
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest select-none">
                {(formData[key] === true || formData[key] === 'true' || formData[key] === 1) ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ) : type === 'text' ? (
            <textarea
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-y min-h-[100px] font-semibold text-gray-700"
              rows={4}
            />
          ) : (
            <input
              type={type === 'url' ? 'url' : 'text'}
              value={formData[key] || ''}
              onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm font-semibold text-gray-700"
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
        className="flex items-center gap-2 px-8 py-3 bg-[#0B2545] text-white font-bold rounded-xl hover:bg-[#0B2545]/90 transition disabled:opacity-60 text-xs uppercase tracking-widest shadow-lg"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
