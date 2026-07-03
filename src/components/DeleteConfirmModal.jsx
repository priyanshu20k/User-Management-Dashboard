// DeleteConfirmModal.jsx - Confirmation popup for deleting a user record.

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  user,
  onConfirm,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // reset error state when open/close
  useEffect(() => {
    if (isOpen) {
      setDeleting(false);
      setError(null);
    }
  }, [isOpen]);

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
          />

          {/* popup card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 p-6"
          >
            {/* close icon */}
            <button
              type="button"
              onClick={onClose}
              disabled={deleting}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* content body */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="rounded-full bg-red-50 p-3 text-red-600 border border-red-100 mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900">
                Delete User Account
              </h3>
              
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{user.firstName} {user.lastName}</span>? 
                This will send a delete request to the server and remove them from your dashboard. This action is irreversible.
              </p>

              {error && (
                <p className="mt-3 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100 w-full">
                  {error}
                </p>
              )}
            </div>

            {/* button controls */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition active:scale-98 disabled:opacity-50"
              >
                Keep User
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-red-500 transition active:scale-98 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
