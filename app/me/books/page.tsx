'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuthListner';
import { useBookStore } from '@/lib/store/bookStore';
import { useRouter } from 'next/navigation';
import { BookList } from '@/components/books/BookList';
import { BookCard } from '@/components/books/BookCard';

export default function MyBooksPage() {
  const router = useRouter();
  
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { myBooks, isLoading: isBooksLoading, fetchMyBooks, addBook, deleteBook } = useBookStore();

  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) router.push('/login');
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.uid) fetchMyBooks(user.uid);
  }, [user, fetchMyBooks]);

  const handleAddBook = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !file) return;
      setIsSubmitting(true);
      try {
        await addBook({ name, author, file, ownerId: user.uid });
        setName(''); setAuthor(''); setFile(null);
        (document.getElementById('fileInput') as HTMLInputElement).value = '';
      } catch (error) { } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Видалити цю книгу?')) { await deleteBook(id); }
  };

  if (isAuthLoading) return <div className="p-10 text-center">Завантаження...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Мої книги</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-100">
         <h2 className="text-xl font-semibold mb-4">Додати нову книгу</h2>
         <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Назва" value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded w-full" required />
              <input type="text" placeholder="Автор" value={author} onChange={e=>setAuthor(e.target.value)} className="border p-2 rounded w-full" required />
            </div>
            <input id="fileInput" type="file" accept="image/*" onChange={e=>setFile(e.target.files?e.target.files[0]:null)} className="block w-full text-sm" required />
            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Збереження...' : 'Додати'}</button>
         </form>
      </div>

      <BookList 
        books={myBooks} 
        isLoading={isBooksLoading}
        emptyMessage="У вас поки немає доданих книг."
        renderItem={(book) => (
          <BookCard 
            book={book} 
            actionSlot={
              <button
                onClick={() => handleDelete(book.id)}
                className="text-red-500 text-sm font-medium hover:text-red-700 hover:bg-red-50 py-1 px-2 rounded transition-colors"
              >
                Видалити
              </button>
            }
          />
        )}
      />
    </div>
  );
}