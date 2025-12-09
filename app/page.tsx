'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuthListner';

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
        Обмінюйтесь книгами <span className="text-blue-600">легко</span>
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-10">
        Дайте вашим прочитаним книгам друге життя. Знаходьте нові історії, спілкуйтеся з читачами та оновлюйте свою бібліотеку безкоштовно.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/books" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Переглянути книги
        </Link>
        
        {!user && !isLoading && (
          <Link 
            href="/register" 
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-50 transition"
          >
            Приєднатися
          </Link>
        )}
      </div>
    </div>
  );
}