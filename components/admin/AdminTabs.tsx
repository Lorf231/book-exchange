'use client';

interface AdminTabsProps {
  activeTab: 'books' | 'users';
  setActiveTab: (tab: 'books' | 'users') => void;
}

export const AdminTabs = ({ activeTab, setActiveTab }: AdminTabsProps) => {
  const getTabClass = (isActive: boolean) => `
    pb-4 px-2 text-sm font-medium transition-colors relative border-b-2 
    ${isActive 
      ? 'text-blue-600 border-blue-600' 
      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
    }
  `;

  return (
    <div className="flex border-b border-gray-200 mb-8 space-x-8">
      <button 
        onClick={() => setActiveTab('books')} 
        className={getTabClass(activeTab === 'books')}
      >
        Управління книгами
      </button>
      <button 
        onClick={() => setActiveTab('users')} 
        className={getTabClass(activeTab === 'users')}
      >
        Користувачі
      </button>
    </div>
  );
};