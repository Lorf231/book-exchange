'use client';

import { useEffect, useState } from 'react';
import { useBookStore } from '@/lib/store/bookStore';
import { BookList } from '@/components/books/BookList';
import { BookCard } from '@/components/books/BookCard';

export default function BooksListPage() {
  const { publicBooks, isLoading, fetchAllBooks } = useBookStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllBooks();
  }, [fetchAllBooks]);

  const filteredBooks = publicBooks.filter((book) => 
    book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Бібліотека обміну</h1>
        <input
          type="text"
          placeholder="Пошук..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      
      <BookList 
        books={filteredBooks}
        isLoading={isLoading}
        emptyMessage={searchQuery ? 'За вашим запитом нічого не знайдено 😔' : 'Книг поки немає.'}
        renderItem={(book) => (
          <BookCard 
            book={book} 
            href={`/books/${book.id}`} 
          />
        )}
      />
    </div>
  );
}