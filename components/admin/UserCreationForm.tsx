'use client';

import { useState } from 'react';

interface UserCreationFormProps {
  onSubmit: (data: { name: string, email: string }) => Promise<void>;
  onCancel: () => void;
}

export const UserCreationForm = ({ onSubmit, onCancel }: UserCreationFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ name, email });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6 max-w-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="heading-2">Новий користувач</h3>
        <button onClick={onCancel} className="btn-ghost px-2 py-1">✕</button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Ім&apos;я</label>
          <input 
            className="input-field" 
            placeholder="Іван Петренко" 
            value={name} onChange={e => setName(e.target.value)} required 
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input 
            className="input-field" 
            placeholder="user@example.com" type="email"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
        </div>
        <button 
          type="submit" disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Генерація...' : 'Створити та отримати пароль'}
        </button>
      </form>
    </div>
  );
};