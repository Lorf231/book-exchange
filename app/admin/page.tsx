'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuthListner';
import { useBookStore } from '@/lib/store/bookStore';
import { useAdminStore } from '@/lib/store/adminStore';

import { AdminTabs } from '@/components/admin/AdminTabs';
import { AdminBooksTab } from '@/components/admin/AdminBooksTab';
import { AdminUsersTab } from '@/components/admin/AdminUsersTab';
import Icon from '@/components/Icon/Icon';

export default function AdminPage() {
  const router = useRouter();
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { fetchAllBooks, isLoading: booksLoading } = useBookStore();
  const { users, fetchUsers, isLoading: usersLoading } = useAdminStore();

  const isLoading = booksLoading || usersLoading;
  
  const [activeTab, setActiveTab] = useState<'users' | 'books'>('books');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) router.push('/login');
      else if (user?.role !== 'admin') {
        toast.error('Доступ заборонено');
        router.push('/');
      }
    }
  }, [isAuthenticated, user?.role, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      const loadAllData = async () => {
        await Promise.all([
          fetchAllBooks(),
          fetchUsers()
        ]);
      };
      loadAllData();
    }
  }, [user?.role, fetchAllBooks, fetchUsers]);

  const handleRefresh = () => {
    fetchAllBooks();
    fetchUsers();
    toast.success('Дані оновлено');
  };

  if (authLoading || user?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Завантаження...</div>;
  }

  return (
    <div className="page-container bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="heading-1">Панель Адміністратора</h1>
          <p className="text-sm text-gray-500 mt-1">Ви: <span className="font-bold">{user.displayName}</span></p>
        </div>
        <button onClick={handleRefresh} className="btn-link text-sm">
          <Icon name="refresh" className={isLoading ? "animate-spin" : ""} width={16} height={16} />
          Оновити дані
        </button>
      </div>

      <AdminTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'books' && (
        <AdminBooksTab users={users} />
      )}

      {activeTab === 'users' && (
        <AdminUsersTab />
      )}
    </div>
  );
}