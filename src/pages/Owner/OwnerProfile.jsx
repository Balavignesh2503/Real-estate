import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';
import { Mail, Phone, Save, User as UserIcon } from 'lucide-react';

const OwnerProfile = () => {
  const { userInfo, setUserInfo } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const canLoad = useMemo(() => Boolean(userInfo?.token), [userInfo?.token]);

  useEffect(() => {
    const load = async () => {
      if (!canLoad) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const { data } = await userService.getMe();
        setForm({
          name: data?.name || userInfo?.name || '',
          email: data?.email || userInfo?.email || '',
          mobile: data?.mobile || userInfo?.mobile || '',
          password: '',
        });
      } catch (e) {
        setForm({
          name: userInfo?.name || '',
          email: userInfo?.email || '',
          mobile: userInfo?.mobile || '',
          password: '',
        });
        setError(e.response?.data?.message || e.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [canLoad, userInfo?.email, userInfo?.mobile, userInfo?.name]);

  const onChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canLoad) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        ...(form.password ? { password: form.password } : {}),
      };

      const { data } = await userService.updateMe(payload);

      setUserInfo({
        ...userInfo,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
      });

      setForm((prev) => ({ ...prev, password: '' }));
      setSuccess('Profile updated');
    } catch (e2) {
      setError(e2.response?.data?.message || e2.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Your account details</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-5">
        {loading ? (
          <div className="text-sm text-gray-500">Loading profile...</div>
        ) : (
          <>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-300 px-4 py-2 rounded-xl">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    value={form.name}
                    onChange={onChange('name')}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Mobile</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    value={form.mobile}
                    onChange={onChange('mobile')}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={onChange('email')}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Changing email may require you to login again if token validation fails.
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">New Password (optional)</label>
              <input
                type="password"
                value={form.password}
                onChange={onChange('password')}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm text-gray-900 dark:text-white"
                placeholder="Leave empty to keep current password"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="text-xs text-gray-500">
                Role: <span className="font-bold">{userInfo?.role || '-'}</span>
              </div>

              <button
                type="submit"
                disabled={saving || !canLoad}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary-600 text-white font-extrabold text-sm hover:bg-primary-700 disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default OwnerProfile;
