'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthListner';
import { useAdminStore } from '@/lib/store/adminStore';
import toast from 'react-hot-toast';
import { User } from '@/types/user';
import { UserCreationForm } from './UserCreationForm';
import { CredentialsDisplay } from './CredentialsDisplay';
import { UsersTable } from './UsersTable';

export const AdminUsersTab = () => {
  const { user: currentUser } = useAuth();

  const { users, isLoading, fetchUsers, createUser, deleteUser, updateUserRole } = useAdminStore();

  const [showForm, setShowForm] = useState(false);
  const [credentials, setCredentials] = useState<{email: string, pass: string} | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreate = async (data: { name: string, email: string }) => {
    setCredentials(null);
    try {
      const password = await createUser(data);
      toast.success('Користувача створено!');
      setCredentials({ email: data.email, pass: password });
      setShowForm(false);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Видалити користувача з БД?')) {
      await deleteUser(id);
    }
  };

  const handleMakeAdmin = async (targetUser: User) => {
    if (confirm(`Зробити ${targetUser.displayName} адміном?`)) {
      await updateUserRole(targetUser.uid, 'admin');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="heading-2">Список користувачів ({users.length})</h2>
         <button 
          onClick={() => { setShowForm(!showForm); setCredentials(null); }}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Скасувати' : '+ Новий користувач'}
        </button>
      </div>

      {credentials && (
        <CredentialsDisplay 
          email={credentials.email} 
          pass={credentials.pass} 
          onClose={() => setCredentials(null)} 
        />
      )}

      {showForm && !credentials && (
        <UserCreationForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      <UsersTable 
        users={users} 
        currentUserId={currentUser?.uid} 
        loading={isLoading}
        onDelete={handleDelete}
        onMakeAdmin={handleMakeAdmin}
        onRefresh={fetchUsers}
      />
    </div>
  );
};