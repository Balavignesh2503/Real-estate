import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { layoutService } from '../../services/api';

const OwnerCreateLayout = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', imageUrl: '', location: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setUploadError('');
    setFile(f || null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const { data } = await layoutService.upload(file);
      setForm((prev) => ({ ...prev, imageUrl: data.imageUrl }));
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await layoutService.create(form);
      navigate(`/owner/layout/${data._id}/editor`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create layout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Layout</h1>
        <p className="text-gray-500 dark:text-gray-400">Add layout meta and image URL (upload integration next)</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input className="w-full rounded-lg" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Upload Layout File (JPEG / PNG / PDF)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="w-full"
            onChange={handleFileChange}
          />
          {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              disabled={!file || uploading}
              onClick={handleUpload}
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-bold text-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <div className="text-xs text-gray-500 self-center">
              {form.imageUrl ? `Uploaded: ${form.imageUrl}` : 'After upload, Image URL will be filled automatically.'}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image URL</label>
          <input className="w-full rounded-lg" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
          <p className="text-xs text-gray-500 mt-1">You can upload a file above or paste a URL.</p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input className="w-full rounded-lg" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full rounded-lg" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <button disabled={saving} className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 disabled:opacity-50">
          {saving ? 'Creating...' : 'Create Layout'}
        </button>
      </form>
    </div>
  );
};

export default OwnerCreateLayout;
