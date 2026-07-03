// UserFormModal.jsx - Popup form to add or edit user profiles.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { DEPARTMENTS } from '../utils/mockGenerator.js';

export default function UserFormModal({ isOpen, onClose, user, onSave }) {
  const isEditing = !!user;

  // input fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  // validation and status state
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // fill form if editing
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setDepartment(user.department || '');
      setPhone(user.phone || '');
      setWebsite(user.website || '');
      setFormErrors({});
      setSubmitError(null);
    } else {
      setFirstName('');
      setLastName('');
      setEmail('');
      setDepartment('');
      setPhone('');
      setWebsite('');
      setFormErrors({});
      setSubmitError(null);
    }
  }, [user, isOpen]);

  // check if input fields are valid
  const validateForm = () => {
    const list = {};

    if (!firstName.trim()) {
      list.firstName = 'First name is required';
    } else if (firstName.trim().length < 2) {
      list.firstName = 'First name must be at least 2 characters';
    }

    if (!lastName.trim()) {
      list.lastName = 'Last name is required';
    } else if (lastName.trim().length < 2) {
      list.lastName = 'Last name must be at least 2 characters';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      list.email = 'Email address is required';
    } else if (!emailPattern.test(email.trim())) {
      list.email = 'Please enter a valid email address';
    }

    if (!department) {
      list.department = 'Please select a department';
    }

    setFormErrors(list);
    return Object.keys(list).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        department,
        phone: phone.trim() || undefined,
        website: website.trim() || undefined,
      };

      if (isEditing && user) {
        payload.id = user.id;
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || 'Failed to save user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* dark glass backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
          />

          {/* form modal popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                  {isEditing ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit User Details' : 'Add New User'}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Input form fields */}
            <form onSubmit={handleSubmit} className="p-6">
              {submitError && (
                <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm text-red-800 border border-red-100">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    disabled={saving}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Leanne"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-hidden transition ${
                      formErrors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/10'
                    }`}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {formErrors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    disabled={saving}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Graham"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-hidden transition ${
                      formErrors.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/10'
                    }`}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {formErrors.lastName}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled={saving}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. leanne.graham@example.com"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-hidden transition ${
                      formErrors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/10'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {formErrors.email}
                    </p>
                  )}
                </div>

                {/* Department */}
                <div className="sm:col-span-2">
                  <label htmlFor="department" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="department"
                    disabled={saving}
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-hidden transition bg-white ${
                      formErrors.department
                        ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  >
                    <option value="">Select a department...</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  {formErrors.department && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {formErrors.department}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    id="phone"
                    disabled={saving}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 123-4567"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/10 transition"
                  />
                </div>

                {/* Website */}
                <div>
                  <label htmlFor="website" className="block text-xs font-medium uppercase tracking-wider text-gray-500 mb-1.5">
                    Website (Optional)
                  </label>
                  <input
                    type="text"
                    id="website"
                    disabled={saving}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. www.hildegard.org"
                    className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/10 transition"
                  />
                </div>
              </div>

              {/* Form Action buttons */}
              <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition active:scale-98 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition active:scale-98 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEditing ? 'Save Changes' : 'Create User'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}