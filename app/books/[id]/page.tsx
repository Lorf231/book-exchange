'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import { doc, getDoc } from 'firebase/firestore';

import { useBookStore } from '@/lib/store/bookStore';
import { useAuth } from '@/hooks/useAuthListner';
import { db } from '@/lib/api/firebase';
import { bookService } from '@/lib/services/bookService';

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const { currentBook, isLoading, fetchBookById, clearCurrentBook } = useBookStore();
  const { user } = useAuth();
  
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (id) fetchBookById(id);
    return () => clearCurrentBook();
  }, [id, fetchBookById, clearCurrentBook]);

  const handleExchangeRequest = async () => {
    if (!user || !currentBook) return;

    setIsSending(true);
    const toastId = toast.loading('Підготовка запиту...');

    try {
      const ownerRef = doc(db, 'users', currentBook.ownerId);
      const ownerSnap = await getDoc(ownerRef);
      
      if (!ownerSnap.exists()) {
        throw new Error('Власника книги не знайдено');
      }
      
      const ownerData = ownerSnap.data();
      const ownerEmail = ownerData.email;
      const ownerName = ownerData.name || 'Користувач';
      const myBooks = await bookService.getUserBooks(user.uid);
      
      if (myBooks.length === 0) {
        toast.error('У вас немає книг для обміну! Додайте спочатку свої книги.', { id: toastId });
        setIsSending(false);
        return;
      }

      const offeredBooksList = myBooks.map(b => `- ${b.name} (${b.author})`).join('\n');

      const templateParams = {
        owner_email: ownerEmail,    
        owner_name: ownerName,
        requester_name: user.displayName || user.email,
        requester_email: user.email,
        book_name: currentBook.name,
        offered_books: offeredBooksList,
      };
      
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success('Запит на обмін успішно надіслано!', { id: toastId });

    } catch (error) {
      console.error(error);
      toast.error('Не вдалося надіслати запит', { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading || !currentBook) {
    return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Завантаження...</div>;
  }

  const isOwner = user?.uid === currentBook.ownerId;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/books" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Назад до списку
      </Link>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-96 md:h-auto bg-gray-100">
            <Image
              src={currentBook.photoUrl}
              alt={currentBook.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentBook.name}</h1>
            <p className="text-xl text-gray-600 mb-6 border-b pb-4">Автор: {currentBook.author}</p>

            <div className="space-y-4">
              {isOwner ? (
                <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-200">
                  Це ваша книга.
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl border">
                  <h3 className="font-semibold text-gray-800 mb-2">Хочете цю книгу?</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Натисніть кнопку, щоб надіслати власнику список ваших книг на пошту.
                  </p>
                  
                  {user ? (
                    <button 
                      onClick={handleExchangeRequest}
                      disabled={isSending}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md active:transform active:scale-95"
                    >
                      {isSending ? 'Відправка...' : 'Запропонувати обмін'}
                    </button>
                  ) : (
                    <Link 
                      href="/login"
                      className="block text-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg"
                    >
                      Увійдіть, щоб обмінятись
                    </Link>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-8 text-xs text-gray-400">
              ID книги: {currentBook.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}