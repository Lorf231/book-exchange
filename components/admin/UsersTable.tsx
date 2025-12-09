'use client';

import { User } from '@/types/user';

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  loading: boolean;
  onDelete: (id: string) => void;
  onMakeAdmin: (user: User) => void;
  onRefresh: () => void;
}

export const UsersTable = ({ users, currentUserId, loading, onDelete, onMakeAdmin, onRefresh }: UsersTableProps) => {
  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="table-header">Користувач</th>
              <th className="table-header">Роль</th>
              <th className="table-header text-right">Дії</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={3} className="p-10 text-center text-gray-500">Завантаження...</td></tr>
            ) : users.map((u) => (
              <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                      {u.displayName ? u.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{u.displayName || 'Без імені'}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs font-medium rounded-full ${
                    u.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="table-cell text-right">
                  {u.uid !== currentUserId && (
                    <div className="flex justify-end gap-3">
                      {u.role !== 'admin' && (
                        <button onClick={() => onMakeAdmin(u)} className="btn-link text-sm">Admin</button>
                      )}
                      <button onClick={() => onDelete(u.uid)} className="btn-link text-red-600 hover:text-red-800 text-sm">Видалити</button>
                    </div>
                  )}
                  {u.uid === currentUserId && <span className="text-gray-400 italic text-xs">Це ви</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!loading && users.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          Користувачів не знайдено. <button onClick={onRefresh} className="btn-link">Оновити</button>
        </div>
      )}
    </div>
  );
};