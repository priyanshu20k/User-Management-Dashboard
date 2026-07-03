// UserTable.jsx - Displays the user table grid with sorting and action controls.

import { ArrowUpDown, ArrowUp, ArrowDown, Edit2, Trash2, Mail } from 'lucide-react';

// Picks a color palette based on name/department for user initials avatar
function getAvatarStyles(name, department) {
  const seed = (name?.charCodeAt(0) || 0) + (department?.charCodeAt(0) || 0);
  const palettes = [
    { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' },
    { bg: 'bg-blue-50 text-blue-700 border-blue-100', dot: 'bg-blue-500' },
    { bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', dot: 'bg-indigo-500' },
    { bg: 'bg-violet-50 text-violet-700 border-violet-100', dot: 'bg-violet-500' },
    { bg: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' },
    { bg: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' },
    { bg: 'bg-cyan-50 text-cyan-700 border-cyan-100', dot: 'bg-cyan-500' },
    { bg: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100', dot: 'bg-fuchsia-500' },
  ];
  return palettes[seed % palettes.length];
}

export default function UserTable({
  users,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  loading,
}) {
  
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 transition" />;
    }
    return sortDir === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-blue-600" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-blue-600" />
    );
  };

  const headers = [
    { field: 'id', label: 'ID', width: 'w-16' },
    { field: 'firstName', label: 'First Name', width: 'w-40' },
    { field: 'lastName', label: 'Last Name', width: 'w-40' },
    { field: 'email', label: 'Email Address' },
    { field: 'department', label: 'Department', width: 'w-48' },
  ];

  return (
    <div className="w-full overflow-x-auto rounded-t-xl bg-white">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border-b border-gray-100">
          <table className="min-w-full divide-y divide-gray-100 table-fixed">
            <thead className="bg-gray-50/70">
              <tr>
                {headers.map(({ field, label, width }) => (
                  <th
                    key={field}
                    scope="col"
                    onClick={() => onSort(field)}
                    className={`cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 transition group hover:bg-gray-100/50 ${width || ''}`}
                  >
                    <div className="flex items-center gap-1.5 select-none">
                      {label}
                      {renderSortIcon(field)}
                    </div>
                  </th>
                ))}
                <th
                  scope="col"
                  className="w-28 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 select-none"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                // loading lines placeholders
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-150 rounded-sm w-8" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-150 rounded-sm w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-150 rounded-sm w-24" /></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-150 rounded-sm w-44" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-gray-150" />
                        <div className="h-4 bg-gray-150 rounded-sm w-28" />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-150" />
                        <div className="h-8 w-8 rounded-lg bg-gray-150" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                // when no users match search filters
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="rounded-2xl bg-gray-50 p-4 text-gray-400 mb-3 border border-gray-100/50">
                        <Mail className="h-8 w-8" />
                      </div>
                      <h3 className="text-md font-semibold text-gray-900">No users found</h3>
                      <p className="mt-1 text-sm text-gray-500 max-w-sm">
                        Try adjusting your search filters or add a new user to the directory list.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                // show the filtered users
                users.map((user) => {
                  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
                  const styles = getAvatarStyles(user.firstName, user.department);

                  return (
                    <tr
                      key={user.id}
                      className="group/row hover:bg-gray-50/50 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 font-mono">
                        #{user.id}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className={`hidden sm:flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold border ${styles.bg}`}>
                            {initials}
                          </div>
                          <span className="truncate">{user.firstName}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        <span className="truncate">{user.lastName}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400 group-hover/row:text-blue-500 transition" />
                          <a href={`mailto:${user.email}`} className="truncate hover:underline">
                            {user.email}
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 border border-gray-200/40">
                          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                          {user.department}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onEdit(user)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition active:scale-95"
                            title="Edit User"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(user)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition active:scale-95"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}