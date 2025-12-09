'use client';

import { useState } from 'react';
import { useBookStore } from '@/lib/store/bookStore';
import { BookList } from '@/components/books/BookList';
import { BookCard } from '@/components/books/BookCard';
import { BookCreationForm } from './BookCreationForm';
import { User } from '@/types/user';
import toast from 'react-hot-toast';

export const AdminBooksTab = ({ users }: { users: User[] }) => {
  const { publicBooks, deleteBook, addBook, fetchAllBooks } = useBookStore();
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (data: { name: string, author: string, ownerId: string, file: File }) => {
    await addBook(data);
    toast.success("Книгу додано!");
    setShowForm(false);
    fetchAllBooks();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Видалити назавжди?')) {
      await deleteBook(id);
      fetchAllBooks();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="heading-2">Список всіх книг ({publicBooks.length})</h2>
         <button 
          onClick={() => setShowForm(!showForm)}
          className={showForm ? 'btn-secondary' : 'btn-primary'}
        >
          {showForm ? 'Скасувати' : '+ Додати книгу'}
        </button>
      </div>

      {showForm && (
        <BookCreationForm 
          users={users} 
          onSubmit={handleAdd} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <BookList
        books={publicBooks}
        isLoading={false}
        renderItem={(book) => (
          <BookCard
            book={book}
            actionSlot={
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500 flex flex-col">
                  <span title={book.ownerId}>Owner: {book.ownerId.slice(0, 6)}...</span>
                </div>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="btn-danger text-xs py-1 px-3"
                >
                  Видалити
                </button>
              </div>
            }
          />
        )}
      />
    </div>
  );
};