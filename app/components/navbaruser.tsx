'use client';
import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NavbarUser({ name, role, initial }: any) {
  const [isOpen, setIsOpen] = useState(false); // State untuk dropdown profil desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State untuk hamburger menu mobile
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
    <>
      {/* ============================== */}
      {/* TAMPILAN DESKTOP (Sembunyi di HP) */}
      {/* ============================== */}
      <div className="hidden md:flex items-center space-x-6 md:space-x-8">
        <Link 
          href="/laporan"
          className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          Laporan Bulanan
        </Link>

        <div className="relative" ref={dropdownRef}>
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-800">{name}</span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md self-end mt-0.5">{role}</span>
            </div>
            <div className="h-9 w-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {initial}
            </div>
          </div>

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
      </div>

      {/* ============================== */}
      {/* TAMPILAN MOBILE (Hamburger Icon) */}
      {/* ============================== */}
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-800 hover:text-emerald-600 focus:outline-none p-2"
        >
          {isMobileMenuOpen ? (
            // Ikon Silang (X) kalau menu terbuka
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            // Ikon Hamburger (Garis 3) kalau menu tertutup
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          )}
        </button>
      </div>

      {/* ============================== */}
      {/* ISI MENU DROPDOWN MOBILE        */}
      {/* ============================== */}
      {isMobileMenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden z-50">
          <div className="px-6 py-5 flex flex-col space-y-5">
            
            {/* Info Profil */}
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-50">
              <div className="h-11 w-11 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm">
                {initial}
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-800">{name}</span>
                <span className="text-xs font-semibold text-emerald-600 mt-0.5">{role}</span>
              </div>
            </div>

            {/* Menu Laporan Bulanan */}
            <Link 
              href="/laporan"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-semibold text-gray-700 hover:text-emerald-700 flex items-center space-x-3"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Laporan Bulanan</span>
            </Link>

            {/* Tombol Logout */}
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center space-x-3 pt-2"
            >
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span>Keluar (Logout)</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
}