'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  href?: string;
  actionSlot?: React.ReactNode;
  className?: string;
}

const BookCardContent = ({ book, actionSlot }: { book: Book, actionSlot?: React.ReactNode }) => (
  <>
    <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
      <Image
        src={book.photoUrl}
        alt={book.name}
        fill
        unoptimized
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
    <div className="p-4 grow flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-1 line-clamp-1" title={book.name}>
          {book.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-1">{book.author}</p>
      </div>
      
      {actionSlot && (
        <div className="mt-2" onClick={(e) => e.preventDefault()}>
          {actionSlot}
        </div>
      )}
    </div>
  </>
);

export const BookCard = ({ book, href, actionSlot, className = '' }: BookCardProps) => {
  const containerClasses = `group bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${className}`;

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        <BookCardContent book={book} actionSlot={actionSlot} />
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      <BookCardContent book={book} actionSlot={actionSlot} />
    </div>
  );
};