import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { Package, Plus, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const ExhibitorProducts = () => {
  const { exhibitors, addExhibitorProduct, removeExhibitorProduct } = useData();
  const { user } = useAuth();

  const exhibitor = exhibitors.find((e) => e.user === user?.id || e.user?._id === user?.id || e.id === user?.companyId || e._id === user?.exhibitorProfile) || {};
  const exhibitorId = exhibitor.id || exhibitor._id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    if (!exhibitorId) {
      toast.error('Exhibitor profile not found.');
      return;
    }

    addExhibitorProduct(exhibitorId, {
      name: productName,
      desc: productDesc
    });

    setProductName('');
    setProductDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Products & Solutions Showcase
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product offerings and services displayed on your public exhibitor profile.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Add Product / Solution
        </Button>
      </div>

      {/* Products Grid */}
      {!exhibitor.products || exhibitor.products.length === 0 ? (
        <EmptyState
          title="No Products in Catalog"
          description="You have not published any products or enterprise solutions yet. Add your first product to showcase it on your public exhibitor profile."
          actionLabel="Add Product"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exhibitor.products.map((prod, idx) => (
            <Card key={idx} className="p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue font-bold text-xs flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <button
                    onClick={() => removeExhibitorProduct(exhibitorId, idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-base text-slate-900">{prod.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{prod.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status: Live in Catalog</span>
                <span className="text-brand-blue font-semibold">Ready for Demos</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Showcase Offering"
        subtitle="Introduce a product or service to delegates visiting your stall"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Product / Service Name *
            </label>
            <input
              type="text"
              required
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. SysAI Enterprise Intelligence"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Description & Specifications *
            </label>
            <textarea
              required
              rows={4}
              value={productDesc}
              onChange={(e) => setProductDesc(e.target.value)}
              placeholder="Highlight capabilities, architecture, and live demo availability..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-blue"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Publish to Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
