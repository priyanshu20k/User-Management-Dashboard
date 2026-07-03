// StatsPanel.jsx - Summary metrics for active records, teams, and session actions.

import { Users, Building2, TrendingUp, PlusCircle } from 'lucide-react';

export default function StatsPanel({ users, sessionCount }) {
  // basic counting calculations
  const totalUsers = users.length;
  
  // unique departments list
  const departmentsList = Array.from(new Set(users.map(u => u.department).filter(Boolean)));
  const totalDepts = departmentsList.length;

  // find which department has the most members
  const counts = {};
  users.forEach(u => {
    if (u.department) {
      counts[u.department] = (counts[u.department] || 0) + 1;
    }
  });

  let topDept = 'N/A';
  let topCount = 0;
  Object.entries(counts).forEach(([dept, num]) => {
    if (num > topCount) {
      topDept = dept;
      topCount = num;
    }
  });

  const cards = [
    {
      label: 'Total Users',
      value: totalUsers,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bg: 'bg-blue-50/50 border-blue-100',
      description: 'Active database records',
    },
    {
      label: 'Departments',
      value: totalDepts,
      icon: <Building2 className="h-5 w-5 text-emerald-600" />,
      bg: 'bg-emerald-50/50 border-emerald-100',
      description: 'Distinct organizational teams',
    },
    {
      label: 'Top Department',
      value: topDept,
      subValue: topDept !== 'N/A' ? `${topCount} members` : '',
      icon: <TrendingUp className="h-5 w-5 text-indigo-600" />,
      bg: 'bg-indigo-50/50 border-indigo-100',
      description: 'Most populated department',
    },
    {
      label: 'Session Actions',
      value: sessionCount === 0 ? '0' : `+${sessionCount}`,
      icon: <PlusCircle className="h-5 w-5 text-amber-600" />,
      bg: 'bg-amber-50/50 border-amber-100',
      description: 'Records added in this session',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`flex items-start justify-between rounded-2xl border p-5 bg-white shadow-xs transition duration-200 hover:shadow-sm ${card.bg}`}
        >
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {card.label}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 leading-none">
                {card.value}
              </span>
              {card.subValue && (
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {card.subValue}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {card.description}
            </p>
          </div>
          <div className="rounded-xl bg-white p-2.5 shadow-xs border border-gray-100">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}