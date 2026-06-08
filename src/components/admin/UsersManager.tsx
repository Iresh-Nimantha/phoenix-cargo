import { motion } from 'motion/react';
import { useState } from 'react';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Trash2, Edit, Loader2 } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import AdminModal from './AdminModal';
import toast from 'react-hot-toast';

interface UserDoc {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt: any;
  lastLogin: any;
}

export default function UsersManager() {
  const { data: users, loading } = useFirestoreCollection<UserDoc>('users', { orderByField: 'createdAt' });
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<(UserDoc & { id: string }) | null>(null);
  const [editRole, setEditRole] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      toast.success('User deleted');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdateRole = async () => {
    if (!editUser) return;
    try {
      await updateDoc(doc(db, 'users', editUser.id), { role: editRole });
      toast.success('User role updated');
      setEditUser(null);
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">Users ({filtered.length})</h2>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500 w-full"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900 text-sm">{user.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => { setEditUser(user); setEditRole(user.role || 'user'); }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-400">No users found</div>
        )}
      </div>

      {/* Edit Modal */}
      <AdminModal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User Role">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Update role for <strong>{editUser?.name}</strong></p>
          <select
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleUpdateRole}
            className="w-full py-3 bg-[#800C30] text-white font-bold rounded-lg hover:bg-[#800C30]/90 transition"
          >
            Save Changes
          </button>
        </div>
      </AdminModal>
    </div>
  );
}
