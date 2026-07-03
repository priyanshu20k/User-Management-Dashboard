// App.jsx - Simple User Directory dashboard.
// Manages states for searching, sorting, filters, and paging.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  RefreshCw, 
  X, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

import { cleanUserData, makeFakeUsers } from './utils/mockGenerator.js';
import UserTable from './components/UserTable.jsx';
import UserFormModal from './components/UserFormModal.jsx';
import FilterPopup from './components/FilterPopup.jsx';
import PaginationControls from './components/PaginationControls.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';

export default function App() {
  // basic data states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedThisSession, setAddedThisSession] = useState(0);

  // searching & filtering
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const filterBtnRef = useRef(null);

  // sorting
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  // page configuration
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // popups
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null means adding, user object means editing

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  // temporary notices
  const [toasts, setToasts] = useState([]);

  // show a quick notification
  const notify = (msg, status = 'success') => {
    const randomId = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id: randomId, type: status, message: msg }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== randomId));
    }, 4000);
  };

  // load user list from placeholder api
  const loadUsers = async (isRefreshed = false) => {
    setLoading(true);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!res.ok) {
        throw new Error(`API gave status: ${res.status}`);
      }
      
      const rawData = await res.json();
      const cleaned = rawData.map(cleanUserData);
      
      // JSONPlaceholder only returns 10 items, but we need 105 total to show off paging limits nicely
      const extraUsers = makeFakeUsers(11, 95);
      const combinedList = [...cleaned, ...extraUsers];
      
      setUsers(combinedList);
      if (isRefreshed) {
        setAddedThisSession(0);
        notify('Directory reloaded from server successfully!', 'success');
      }
    } catch (err) {
      console.error('API load failed:', err);
      // use local backup if API is offline
      const backupList = makeFakeUsers(1, 105);
      setUsers(backupList);
      notify(`API offline (${err.message || 'connection failed'}). Using local backup records.`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // change sort column or toggle sort order
  const changeSort = (columnName) => {
    if (sortBy === columnName) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnName);
      setSortDir('asc');
    }
    setPage(1); // reset to page 1
  };

  // save user record (add or edit)
  const saveUser = async (formData) => {
    const isEditing = 'id' in formData;

    if (isEditing) {
      // update user
      if (formData.id <= 10) {
        const res = await fetch(`https://jsonplaceholder.typicode.com/users/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) {
          throw new Error('Update api failed');
        }
      } else {
        // mock delay for custom local user
        await new Promise((r) => setTimeout(r, 600));
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === formData.id ? { ...u, ...formData } : u))
      );
      notify(`Saved changes for ${formData.firstName} ${formData.lastName}.`, 'success');
    } else {
      // add new user
      const res = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Create api failed');
      }

      // calculate a new user ID
      const nextId = Math.max(...users.map((u) => u.id), 0) + 1;
      const newUser = {
        id: nextId,
        ...formData,
      };

      setUsers((prev) => [newUser, ...prev]);
      setAddedThisSession((prev) => prev + 1);
      notify(`${formData.firstName} ${formData.lastName} added to the directory.`, 'success');
    }
  };

  // confirm and delete user
  const deleteUser = async () => {
    if (!deletingUser) return;

    if (deletingUser.id <= 10) {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${deletingUser.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Delete api failed');
      }
    } else {
      // simulated delay
      await new Promise((r) => setTimeout(r, 500));
    }

    setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
    notify(`Deleted ${deletingUser.firstName} ${deletingUser.lastName}.`, 'success');
    setDeletingUser(null);
  };

  // click helpers
  const handleAddClick = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditClick = (person) => {
    setEditingUser(person);
    setShowForm(true);
  };

  const handleDeleteClick = (person) => {
    setDeletingUser(person);
    setShowDeleteConfirm(true);
  };

  const removeFilterField = (field) => {
    setActiveFilters((prev) => ({
      ...prev,
      [field]: '',
    }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      firstName: '',
      lastName: '',
      email: '',
      department: '',
    });
    setSearch('');
    setPage(1);
    notify('All search filters cleared.', 'info');
  };

  const activeFiltersCount = Object.values(activeFilters).filter(Boolean).length;

  // filters and search matching
  const matchingUsers = users.filter((u) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.department?.toLowerCase().includes(term);

    const matchesFirst = !activeFilters.firstName || u.firstName?.toLowerCase().includes(activeFilters.firstName.trim().toLowerCase());
    const matchesLast = !activeFilters.lastName || u.lastName?.toLowerCase().includes(activeFilters.lastName.trim().toLowerCase());
    const matchesEmail = !activeFilters.email || u.email?.toLowerCase().includes(activeFilters.email.trim().toLowerCase());
    const matchesDept = !activeFilters.department || u.department === activeFilters.department;

    return matchesSearch && matchesFirst && matchesLast && matchesEmail && matchesDept;
  });

  // sort users
  const sortedUsers = [...matchingUsers].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    } else {
      const numA = Number(valA) || 0;
      const numB = Number(valB) || 0;
      return sortDir === 'asc' ? numA - numB : numB - numA;
    }
  });

  // pagination setup
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const actualPage = Math.min(page, totalPages || 1);
  const pageUsers = sortedUsers.slice((actualPage - 1) * pageSize, actualPage * pageSize);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 font-sans text-gray-800 antialiased selection:bg-blue-500 selection:text-white">
      
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-2 text-white shadow-md shadow-blue-500/10">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-md font-bold tracking-tight text-gray-900 sm:text-lg">
                  User Directory
                </h1>
                <p className="hidden xs:block text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  Staff Management Suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadUsers(true)}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-600 shadow-xs hover:bg-gray-50 hover:text-gray-900 transition active:scale-97 disabled:opacity-50"
                title="Reload List"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
                <span className="hidden sm:inline">Reload API</span>
              </button>
              
              <button
                type="button"
                onClick={handleAddClick}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/10 hover:bg-blue-500 transition active:scale-97"
              >
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Statistics Panel */}
        <StatsPanel users={users} sessionCount={addedThisSession} />

        {/* Filters and Search */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-xs border border-gray-100 flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            
            <div className="relative flex-1 max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/30 pl-10 pr-4 py-2.5 text-sm outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative self-end md:self-auto">
              <button
                ref={filterBtnRef}
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition active:scale-98 ${
                  activeFiltersCount > 0 || showFilters
                    ? 'border-blue-200 bg-blue-50/40 text-blue-700 hover:bg-blue-50'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <FilterPopup
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={activeFilters}
                onFilterChange={(newFilters) => {
                  setActiveFilters(newFilters);
                  setPage(1);
                }}
                onReset={clearAllFilters}
                anchorRef={filterBtnRef}
              />
            </div>
          </div>

          {(activeFiltersCount > 0 || search) && (
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-50 pt-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 mr-1">
                Active Queries:
              </span>

              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 border border-blue-100">
                  Search: "{search}"
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="rounded-sm hover:bg-blue-100 text-blue-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null;
                const fieldLabel = key === 'firstName' ? 'First Name' : key === 'lastName' ? 'Last Name' : key;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-800 border border-gray-200"
                  >
                    <span className="text-gray-400 capitalize">{fieldLabel}:</span> {value}
                    <button
                      type="button"
                      onClick={() => removeFilterField(key)}
                      className="rounded-sm hover:bg-gray-200 text-gray-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                );
              })}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 hover:underline transition pl-1"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Directory Table Frame */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <UserTable
            users={pageUsers}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={changeSort}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            loading={loading}
          />
          
          <PaginationControls
            total={totalItems}
            page={actualPage}
            limit={pageSize}
            onPageChange={setPage}
            onLimitChange={(newPageSize) => {
              setPageSize(newPageSize);
              setPage(1);
            }}
          />
        </div>
      </main>

      {/* Forms & Dialog Modals */}
      <UserFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={saveUser}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingUser(null);
        }}
        user={deletingUser}
        onConfirm={deleteUser}
      />

      {/* Floating Alert Toasts Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-md w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-3 rounded-2xl p-4.5 shadow-xl border text-sm w-full ${
                toast.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-150 shadow-emerald-100/10'
                  : toast.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-150 shadow-red-100/10'
                  : 'bg-blue-50 text-blue-900 border-blue-150 shadow-blue-100/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : toast.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <HelpCircle className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div className="flex-1 font-medium">
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="shrink-0 rounded-lg p-0.5 text-gray-400 hover:bg-black/5 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
