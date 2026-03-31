'use client';

// components/layout/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pacifico } from 'next/font/google';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Layers, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: <Users size={20} />, label: 'Users', href: '/admin/user' },
  { icon: <Wrench size={20} />, label: 'Handymen', href: '/admin/handymen' },
  { icon: <Layers size={20} />, label: 'Categories', href: '/admin/categories' },
  { icon: <LogOut size={20} />, label: 'Sign Out', href: '/api/auth/logout' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // If using NextAuth.js
    // await signOut({ callbackUrl: '/' });
    
    // If using custom auth
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-[#2563eb] text-white flex flex-col flex-shrink-0">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-3">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: '"Pacifico", serif' }}>
              HandyPro
            </h3>
            <p className="text-primary-200 text-sm">Dashboard v1</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            if (item.label === 'Sign Out') {
              return (
                <li key={index}>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center px-4 py-3 rounded-lg font-medium transition-colors hover:text-white hover:bg-white/10 text-primary-200"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              );
            }
            
            return (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-primary-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-6 text-center text-primary-200 text-sm border-t border-primary-600">
        <p>© 2023 HandyPro</p>
        <p className="mt-1">All rights reserved</p>
      </div>
    </aside>
  );
}