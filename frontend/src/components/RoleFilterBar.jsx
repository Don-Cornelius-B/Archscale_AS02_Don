import React from 'react';

const roles = ['All', 'Architect', 'Contractor', 'Supplier', 'Client'];

export default function RoleFilterBar({ selectedRole, onSelectRole }) {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-4">
      {roles.map(role => (
        <button
          key={role}
          onClick={() => onSelectRole(role)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            selectedRole === role
              ? 'bg-zinc-200 text-zinc-900 shadow-sm ring-2 ring-zinc-400 ring-offset-2 ring-offset-zinc-950'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
          }`}
        >
          {role}
        </button>
      ))}
    </div>
  );
}
