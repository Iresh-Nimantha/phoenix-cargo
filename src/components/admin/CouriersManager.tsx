import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useContent } from '../../hooks/useContent';
import { Search, Trash2, Edit, Plus, Loader2, Link2 } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import AdminModal from './AdminModal';
import toast from 'react-hot-toast';

interface Courier {
  slug: string;
  name: string;
  portal: string;
}

const defaultCouriers: Courier[] = [
  { slug: 'dhl', name: 'DHL Express', portal: 'https://www.dhl.com/en/express/tracking.html?AWB=' },
  { slug: 'fedex', name: 'FedEx', portal: 'https://www.fedex.com/fedextrack/?trknbr=' },
  { slug: 'ups', name: 'UPS', portal: 'https://www.ups.com/track?loc=en_US&requester=ST&trackNums=' },
  { slug: 'usps', name: 'USPS', portal: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=' },
  { slug: 'aramex', name: 'Aramex', portal: 'https://www.aramex.com/track/shipments?shipmentNumber=' },
  { slug: 'sf-express', name: 'SF Express', portal: 'https://www.sf-international.com/wz/en/dynamic/waybillResult?billCodes=' },
  { slug: 'dpd', name: 'DPD', portal: 'https://www.dpd.com/tracking?parcelNo=' },
  { slug: 'gls', name: 'GLS', portal: 'https://gls-group.eu/EU/en/track-trace?match=' },
  { slug: 'royal-mail', name: 'Royal Mail', portal: 'https://www.royalmail.com/track-your-item#/tracking-results/' },
];

export default function CouriersManager() {
  const { content, loading } = useContent('couriers', { list: defaultCouriers });
  const [couriersList, setCouriersList] = useState<Courier[]>(defaultCouriers);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formPortal, setFormPortal] = useState('');

  useEffect(() => {
    if (content && Array.isArray(content.list)) {
      setCouriersList(content.list);
    }
  }, [content]);

  const handleNameChange = (val: string) => {
    setFormName(val);
    // Auto-generate slug from name if not editing an existing slug manually
    if (editingIndex === null) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormSlug(generated);
    }
  };

  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormName('');
    setFormSlug('');
    setFormPortal('');
    setModalOpen(true);
  };

  const handleOpenEdit = (index: number, courier: Courier) => {
    setEditingIndex(index);
    setFormName(courier.name);
    setFormSlug(courier.slug);
    setFormPortal(courier.portal);
    setModalOpen(true);
  };

  const handleDelete = async (index: number, courierName: string) => {
    if (!confirm(`Are you sure you want to delete ${courierName}?`)) return;

    const updatedList = couriersList.filter((_, i) => i !== index);
    setCouriersList(updatedList);
    setSaving(true);
    try {
      await setDoc(doc(db, 'content', 'couriers'), { list: updatedList }, { merge: true });
      toast.success(`${courierName} removed successfully!`);
    } catch {
      toast.error('Failed to update couriers list in database');
      // revert local state
      setCouriersList(couriersList);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      toast.error('Courier name is required');
      return;
    }
    if (!formSlug.trim()) {
      toast.error('Courier slug is required');
      return;
    }
    if (!formPortal.trim()) {
      toast.error('Direct portal URL is required');
      return;
    }

    const newCourier: Courier = {
      name: formName.trim(),
      slug: formSlug.trim().toLowerCase(),
      portal: formPortal.trim(),
    };

    let updatedList: Courier[];
    if (editingIndex !== null) {
      // Edit
      updatedList = [...couriersList];
      updatedList[editingIndex] = newCourier;
    } else {
      // Add new
      // Check for duplicate slugs
      if (couriersList.some((c) => c.slug === newCourier.slug)) {
        toast.error(`A courier with the slug "${newCourier.slug}" already exists!`);
        return;
      }
      updatedList = [...couriersList, newCourier];
    }

    setCouriersList(updatedList);
    setModalOpen(false);
    setSaving(true);

    try {
      await setDoc(doc(db, 'content', 'couriers'), { list: updatedList }, { merge: true });
      toast.success(editingIndex !== null ? 'Courier updated successfully!' : 'New courier added successfully!');
    } catch {
      toast.error('Failed to save couriers list to database');
      // Revert local state
      setCouriersList(couriersList);
    } finally {
      setSaving(false);
    }
  };

  const filtered = couriersList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSkeleton type="table" rows={6} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 leading-tight">Couriers Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage the list of active couriers displayed to users in the tracking console dropdown.
          </p>
        </div>
        
        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-[#800C30] hover:bg-[#800C30]/90 text-white rounded-xl transition text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-[#800C30]/10 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add Courier
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search couriers by name or slug..."
            className="pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50/50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500 w-full font-semibold text-gray-700 placeholder:font-normal placeholder:text-gray-400 transition-all"
          />
        </div>
        
        {saving && (
          <div className="flex items-center gap-2 text-cyan-600 text-xs font-bold uppercase tracking-wider">
            <Loader2 className="w-4 h-4 animate-spin" /> Saving database changes...
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs font-black text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Courier Name</th>
                <th className="px-6 py-4">Slug ID</th>
                <th className="px-6 py-4">Direct Portal URL Template</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((courier, index) => (
                <tr
                  key={courier.slug}
                  className="hover:bg-gray-50/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                    {courier.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold font-mono">
                      {courier.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-gray-500 max-w-xs truncate font-mono">
                    <a
                      href={courier.portal}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-600 inline-flex items-center gap-1 hover:underline"
                    >
                      <Link2 className="w-3.5 h-3.5" /> {courier.portal}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(index, courier)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        title="Edit Courier"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(index, courier.name)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Delete Courier"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-16 text-center text-gray-400 font-bold uppercase tracking-wider text-sm">
            No couriers found matching your search.
          </div>
        )}
      </div>

      {/* Edit / Add Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingIndex !== null ? 'Edit Courier details' : 'Add New Courier'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-[#800C30]/70 tracking-widest mb-1.5 ml-1">
              Courier Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. DHL Express, Aramex"
              className="w-full p-3 border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-gray-700 text-sm shadow-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#800C30]/70 tracking-widest mb-1.5 ml-1">
              Slug ID (System / API Key match) *
            </label>
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="e.g. dhl, fedex, aramex"
              disabled={editingIndex !== null}
              className="w-full p-3 border border-gray-200 bg-white disabled:bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-gray-700 text-sm shadow-sm transition-all font-mono"
            />
            {editingIndex !== null && (
              <p className="text-[10px] text-gray-400 font-semibold mt-1 ml-1">
                Slug IDs cannot be changed after creation.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-[#800C30]/70 tracking-widest mb-1.5 ml-1">
              Direct Portal URL *
            </label>
            <input
              type="url"
              value={formPortal}
              onChange={(e) => setFormPortal(e.target.value)}
              placeholder="https://www.dhl.com/.../tracking.html?AWB="
              className="w-full p-3 border border-gray-200 bg-white rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 font-bold text-gray-700 text-sm shadow-sm transition-all font-mono"
            />
            <p className="text-[10px] text-gray-400 font-semibold mt-1 ml-1">
              Official courier query portal URL. The tracking number will be appended directly to this string.
            </p>
          </div>

          <div className="pt-2 border-t border-gray-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl transition text-xs font-extrabold uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#800C30] hover:bg-[#800C30]/90 text-white rounded-xl transition text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#800C30]/10"
            >
              {editingIndex !== null ? 'Save Changes' : 'Create Courier'}
            </button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
