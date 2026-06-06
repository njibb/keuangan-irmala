'use client';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function NavbarUser({ name, role, initial }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        <div className="flex flex-col text-right">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{role}</span>
        </div>
        <div className="h-9 w-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {initial}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      )}
    </div>
  );
}