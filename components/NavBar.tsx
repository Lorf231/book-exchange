'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuthListner';
import toast from 'react-hot-toast';
import Icon from '@/components/Icon/Icon';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Ви вийшли з акаунту');
      router.push('/login');
    } catch {
      toast.error('Помилка при виході');
    }
  };

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "text-sm font-medium transition-colors duration-200 px-3 py-2 rounded-md inline-flex items-center gap-2";
    
    return isActive 
      ? `${baseClasses} text-blue-600 bg-blue-50` 
      : `${baseClasses} text-gray-500 hover:text-gray-900 hover:bg-gray-50`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <Icon name="book" className="text-blue-600" width={28} height={28} />
                <span>BookExchange</span>
              </Link>
            </div>

            <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
              {user && (
                <Link href="/books" className={getLinkClass('/books')}>
                  <span>Бібліотека</span>
                </Link>
              )}
              
              {user && (
                <Link href="/me/books" className={getLinkClass('/me/books')}>
                  <span>Мої книги</span>
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link href="/admin" className={getLinkClass('/admin')}>
                  <Icon name="shield" width={18} height={18} />
                  <span>Адмін</span>
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
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    {user.role === 'admin' && <Icon name="shield" width={12} height={12} />}
                    <span>{user.role === 'admin' ? 'Адміністратор' : 'Користувач'}</span>
                  </div>
                </div>

                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                  {user.displayName ? (
                    user.displayName.charAt(0).toUpperCase()
                  ) : (
                    <Icon name="user" width={20} height={20} />
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-md transition-colors"
                  title="Вийти"
                >
                  <Icon name="logout" width={20} height={20} />
                </button>
              </div>
            ) : (
              !isAuthPage && (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/login" 
                    className="text-gray-600 hover:text-gray-900 font-medium text-sm"
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
              )
            )}
          </div>
        </div>
      </div>
      
      {user && (
        <div className="sm:hidden border-t border-gray-100 flex justify-around p-2 bg-gray-50 fixed bottom-0 left-0 right-0 z-50 pb-safe">
            <Link href="/books" className="text-xs text-gray-600 p-2 flex flex-col items-center gap-1">
              <Icon name="search" width={20} height={20} />
              <span>Книги</span>
            </Link>
            
            <Link href="/me/books" className="text-xs text-gray-600 p-2 flex flex-col items-center gap-1">
              <Icon name="book" width={20} height={20} />
              <span>Мої</span>
            </Link>
            
            {user?.role === 'admin' && (
              <Link href="/admin" className="text-xs text-purple-600 p-2 flex flex-col items-center gap-1">
                <Icon name="shield" width={20} height={20} />
                <span>Адмін</span>
              </Link>
            )}
        </div>
      )}
    </nav>
  );
};