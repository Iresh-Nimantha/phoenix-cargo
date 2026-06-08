import { motion } from 'motion/react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trash2, CheckCircle, Clock, Mail } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import toast from 'react-hot-toast';

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: any;
  status: string;
  replied: boolean;
}

export default function ContactMessagesManager() {
  const { data: messages, loading } = useFirestoreCollection<ContactMessage>('contactMessages', { orderByField: 'submittedAt' });

  const toggleReplied = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'contactMessages', id), { replied: !current, status: !current ? 'replied' : 'new' });
      toast.success(!current ? 'Marked as replied' : 'Marked as unreplied');
    } catch {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteDoc(doc(db, 'contactMessages', id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Messages ({messages.length})</h2>

      <div className="space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`bg-white rounded-xl border shadow-sm p-5 ${msg.replied ? 'border-green-200' : 'border-gray-100'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{msg.name}</p>
                  {msg.replied ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                      <CheckCircle className="w-3 h-3" /> Replied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  )}
                </div>
                <a href={`mailto:${msg.email}`} className="text-xs text-gray-500 hover:text-cyan-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {msg.email}
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleReplied(msg.id, msg.replied)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${msg.replied ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                >
                  {msg.replied ? 'Undo Reply' : 'Mark Replied'}
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="font-medium text-sm text-[#800C30] mb-1">{msg.subject}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{msg.message}</p>
          </motion.div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-gray-400">No messages yet</div>
        )}
      </div>
    </div>
  );
}
