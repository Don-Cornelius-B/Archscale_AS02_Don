import React from 'react';

const roles = ['All', 'Architect', 'Contractor', 'Supplier', 'Client'];

export default function RoleFilterBar({ selectedRole, onSelectRole }) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
      {roles.map(role => (
        <button
          key={role}
          onClick={() => onSelectRole(role)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            selectedRole === role
              ? 'bg-zinc-200 text-zinc-900'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
