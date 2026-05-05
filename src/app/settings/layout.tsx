// app/settings/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User, Lock, Wrench, ChevronRight, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isHandyman, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const navItems = [
    { label: 'Edit Profile', path: '/settings/edit-profile', icon: User },
    { label: 'Change Password', path: '/settings/change-password', icon: Lock },
    ...(isHandyman
      ? [{ label: 'Professional Info', path: '/settings/professional', icon: Wrench }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-72 shrink-0">
            {/* Profile card */}
            <Link
              href="/settings/edit-profile"
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-colors mb-4"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 shrink-0" />
            </Link>

            {/* Nav items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-2">
                Account
              </p>
              {navItems.map(({ label, path, icon: Icon }) => {
                const active = pathname === path;
                return (
                  <Link
                    key={path}
                    href={path}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors border-b border-gray-100 last:border-0 ${
                      active
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                );
              })}

              {/* Danger zone */}
              <div className="border-t border-gray-200 mt-1">
                <button
                  onClick={signOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}