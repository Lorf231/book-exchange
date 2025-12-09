'use client';

import { User } from '@/types/user';
import Icon from '@/components/Icon/Icon';

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  loading: boolean;
  onDelete: (id: string) => void;
  onMakeAdmin: (user: User) => void;
  onRefresh: () => void;
}

export const UsersTable = ({ 
  users, 
  currentUserId, 
  loading, 
  onDelete, 
  onMakeAdmin, 
  onRefresh 
}: UsersTableProps) => {
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
              <tr>
                <td colSpan={3} className="p-10 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Icon name="refresh" className="animate-spin text-gray-400" width={24} height={24} />
                    <span>Завантаження...</span>
                  </div>
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.uid} className="hover:bg-gray-50 transition-colors">
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg shrink-0 border border-blue-200">
                      {u.displayName ? (
                        u.displayName.charAt(0).toUpperCase()
                      ) : (
                        <Icon name="user" width={20} height={20} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{u.displayName || 'Без імені'}</div>
                      <div className="text-gray-500 text-xs">{u.email}</div>
                      <div className="text-gray-400 text-[10px] mt-0.5">UID: {u.uid}</div>
                    </div>
                  </div>
                </td>

                <td className="table-cell">
                  <span className={`px-2.5 py-1 inline-flex items-center gap-1.5 text-xs font-medium rounded-full ${
                    u.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    <Icon name={u.role === 'admin' ? 'shield' : 'user'} width={14} height={14} />
                    {u.role.toUpperCase()}
                  </span>
                </td>

                <td className="table-cell text-right">
                  {u.uid !== currentUserId ? (
                    <div className="flex justify-end gap-3 items-center">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => onMakeAdmin(u)} 
                          className="btn-link text-xs flex items-center gap-1"
                          title="Надати права адміністратора"
                        >
                          <Icon name="shield" width={16} height={16} />
                          Admin
                        </button>
                      )}
                      
                      <button 
                        onClick={() => onDelete(u.uid)} 
                        className="btn-link text-red-600 hover:text-red-800"
                        title="Видалити користувача з бази"
                      >
                        <Icon name="trash" width={18} height={18} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic text-xs flex items-center justify-end gap-1">
                      <Icon name="user" width={12} height={12} />
                      Це ви
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!loading && users.length === 0 && (
        <div className="p-10 text-center text-gray-500 flex flex-col items-center gap-3">
          <p>Користувачів не знайдено.</p>
          <button onClick={onRefresh} className="btn-link flex items-center gap-1">
             <Icon name="refresh" width={16} height={16} />
             Оновити
          </button>
        </div>
      )}
    </div>
  );
};