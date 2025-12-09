'use client';

import { useState } from 'react';
import { User } from '@/types/user';
import toast from 'react-hot-toast';

interface BookCreationFormProps {
  users: User[];
  onSubmit: (data: { name: string, author: string, ownerId: string, file: File }) => Promise<void>;
  onCancel: () => void;
}

export const BookCreationForm = ({ users, onSubmit, onCancel }: BookCreationFormProps) => {
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !ownerId) {
      toast.error("Заповніть всі поля");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ name, author, ownerId, file });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="heading-2">Створення книги</h3>
        <button onClick={onCancel} className="btn-ghost px-2 py-1">✕</button>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <input 
              className="input-field" 
              placeholder="Назва книги" 
              value={name} onChange={e => setName(e.target.value)} required 
            />
          </div>
          <div>
            <input 
              className="input-field" 
              placeholder="Автор" 
              value={author} onChange={e => setAuthor(e.target.value)} required 
            />
          </div>
          <div>
            <select 
              className="input-field" 
              value={ownerId} onChange={e => setOwnerId(e.target.value)} required
            >
              <option value="">-- Оберіть власника --</option>
              {users.map(u => (
                <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-4 flex flex-col justify-between">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors h-full flex items-center justify-center">
            <input 
              type="file" accept="image/*"
              onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <button 
            type="submit" disabled={isSubmitting}
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Завантаження...' : 'Зберегти книгу'}
          </button>
        </div>
      </form>
    </div>
  );
};