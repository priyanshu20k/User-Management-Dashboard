// FilterPopup.jsx - Dropdown card containing inputs to filter user records.

import { motion, AnimatePresence } from 'motion/react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { DEPARTMENTS } from '../utils/mockGenerator.js';

export default function FilterPopup({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onReset,
}) {
  
  const changeInput = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const activeCount = Object.values(filters).filter(v => !!v).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* transparent overlay helper to click out */}
          <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
          
          {/* filters popup card */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 z-50 w-80 rounded-2xl bg-white p-5 shadow-xl border border-gray-100 ring-1 ring-black/5"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-sm text-gray-900">Advanced Filters</span>
                {activeCount > 0 && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Input field list */}
            <div className="space-y-4">
              {/* First Name filter */}
              <div>
                <label htmlFor="filter-firstName" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="filter-firstName"
                  value={filters.firstName}
                  onChange={(e) => changeInput('firstName', e.target.value)}
                  placeholder="Filter by first name..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/20 transition"
                />
              </div>

              {/* Last Name filter */}
              <div>
                <label htmlFor="filter-lastName" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="filter-lastName"
                  value={filters.lastName}
                  onChange={(e) => changeInput('lastName', e.target.value)}
                  placeholder="Filter by last name..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/20 transition"
                />
              </div>

              {/* Email filter */}
              <div>
                <label htmlFor="filter-email" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="filter-email"
                  value={filters.email}
                  onChange={(e) => changeInput('email', e.target.value)}
                  placeholder="Filter by email..."
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/20 transition"
                />
              </div>

              {/* Department selection filter */}
              <div>
                <label htmlFor="filter-department" className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Department
                </label>
                <select
                  id="filter-department"
                  value={filters.department}
                  onChange={(e) => changeInput('department', e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs bg-white outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-2 border-t border-gray-100 mt-5 pt-3.5">
              <button
                type="button"
                onClick={onReset}
                disabled={activeCount === 0}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition text-center"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
