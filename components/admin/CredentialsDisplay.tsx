'use client';

interface CredentialsDisplayProps {
  email: string;
  pass: string;
  onClose: () => void;
}

export const CredentialsDisplay = ({ email, pass, onClose }: CredentialsDisplayProps) => (
  <div className="p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm mb-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <span className="text-2xl">✅</span>
      <h4 className="font-bold text-lg text-green-800">Акаунт успішно створено!</h4>
    </div>
    <p className="text-green-700 mb-4">Скопіюйте ці дані та передайте користувачу.</p>
    
    <div className="bg-white p-4 rounded-lg border border-green-200 font-mono text-sm shadow-inner max-w-md">
      <div className="flex justify-between py-1 border-b border-gray-100">
        <span className="text-gray-500">Login:</span>
        <strong className="select-all text-gray-800">{email}</strong>
      </div>
      <div className="flex justify-between py-1 pt-2">
        <span className="text-gray-500">Password:</span>
        <strong className="bg-yellow-100 px-2 rounded select-all text-gray-900">{pass}</strong>
      </div>
    </div>
    
    <button 
      onClick={onClose}
      className="mt-4 btn-link text-green-700 hover:text-green-900"
    >
      Закрити
    </button>
  </div>
);