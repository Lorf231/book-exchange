'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthListner';
import toast from 'react-hot-toast';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Ви вийшли з акаунту');
      router.push('/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      console.log(errorMessage);
      toast.error('Помилка при виході');
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-sm font-medium transition-colors duration-200 ${
      isActive 
        ? 'text-blue-600 bg-blue-50 px-3 py-2 rounded-md' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md'
    }`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                📚 BookExchange
              </Link>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              <Link href="/books" className={getLinkClass('/books')}>
                Бібліотека
              </Link>
              
              {user && (
                <Link href="/me/books" className={getLinkClass('/me/books')}>
                  Мої книги
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link href="/admin" className={getLinkClass('/admin')}>
                  🛡️ Адмін
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.role === 'admin' ? 'Адміністратор' : 'Користувач'}
                  </span>
                </div>

                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                >
                  Вийти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Увійти
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  Реєстрація
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="sm:hidden border-t border-gray-100 flex justify-around p-2 bg-gray-50">
          <Link href="/books" className="text-xs text-gray-600 p-2">Бібліотека</Link>
          {user && <Link href="/me/books" className="text-xs text-gray-600 p-2">Мої книги</Link>}
          {user?.role === 'admin' && <Link href="/admin" className="text-xs text-purple-600 p-2">Адмін</Link>}
      </div>
    </nav>
  );
};