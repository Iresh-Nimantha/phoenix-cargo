import { motion } from 'motion/react';
import { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import toast from 'react-hot-toast';

interface QuoteRequest {
  userDetails: { name: string; email: string; phone: string; company?: string };
  quoteDetails: { service?: string; message?: string; cargo?: string; origin?: string; destination?: string };
  submittedAt: any;
  status: string;
  notes: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function QuoteRequestsManager() {
  const { data: quotes, loading } = useFirestoreCollection<QuoteRequest>('quoteRequests', { orderByField: 'submittedAt' });
  const [expanded, setExpanded] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'quoteRequests', id), { status });
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleAddNote = async (id: string) => {
    if (!noteInput.trim()) return;
    try {
      await updateDoc(doc(db, 'quoteRequests', id), { notes: noteInput });
      toast.success('Note saved');
      setNoteInput('');
    } catch {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this quote request?')) return;
    try {
      await deleteDoc(doc(db, 'quoteRequests', id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Quote Requests ({quotes.length})</h2>

      <div className="space-y-3">
        {quotes.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 transition"
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{q.userDetails?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{q.userDetails?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={q.status || 'new'}
                  onChange={(e) => { e.stopPropagation(); handleStatusChange(q.id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${statusColors[q.status] || statusColors.new}`}
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(q.id); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {expanded === q.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {/* Expanded Content */}
            {expanded === q.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t px-5 py-4 bg-gray-50/50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Phone</p>
                    <p>{q.userDetails?.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Company</p>
                    <p>{q.userDetails?.company || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Service</p>
                    <p>{q.quoteDetails?.service || q.quoteDetails?.cargo || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Route</p>
                    <p>
                      {q.quoteDetails?.origin && q.quoteDetails?.destination
                        ? `${q.quoteDetails.origin} → ${q.quoteDetails.destination}`
                        : '—'}
                    </p>
                  </div>
                </div>
                {q.quoteDetails?.message && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Message</p>
                    <p className="text-sm bg-white p-3 rounded-lg border">{q.quoteDetails.message}</p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <p className="text-gray-500 text-xs uppercase font-semibold mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Notes
                  </p>
                  {q.notes && <p className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 mb-2">{q.notes}</p>}
                  <div className="flex gap-2">
                    <input
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 p-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <button
                      onClick={() => handleAddNote(q.id)}
                      className="px-4 py-2 bg-[#0B2545] text-white text-sm font-semibold rounded-lg hover:bg-[#0B2545]/90 transition"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {quotes.length === 0 && (
          <div className="text-center py-12 text-gray-400">No quote requests yet</div>
        )}
      </div>
    </div>
  );
}
