'use client';

import { Book } from '@/types/book';

interface BookListProps {
  books: Book[];
  isLoading: boolean;
  emptyMessage?: string;
  renderItem: (book: Book) => React.ReactNode; 
}

export const BookList = ({ 
  books, 
  isLoading, 
  emptyMessage = "Список книг порожній.", 
  renderItem 
}: BookListProps) => {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <div key={book.id} className="h-full">
            {renderItem(book)}
        </div>
      ))}
    </div>
  );
};