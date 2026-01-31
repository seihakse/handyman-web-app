// components/layout/Sidebar.tsx
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Layers, 
  LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', active: true },
  { icon: <Users size={20} />, label: 'Users' },
  { icon: <Wrench size={20} />, label: 'Handymen' },
  { icon: <Layers size={20} />, label: 'Categories' },
  { icon: <LogOut size={20} />, label: 'Sign Out' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-primary-700 text-white flex flex-col flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-primary-700 rounded-lg flex items-center justify-center font-bold text-xl">
            H
          </div>
          <div>
            <h1 className="text-xl font-bold">HandyPro Admin</h1>
            <p className="text-primary-200 text-sm">Dashboard v2.1</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  item.active
                    ? 'sidebar-active text-white'
                    : 'text-primary-200 hover:text-white hover:bg-primary-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-6 text-center text-primary-200 text-sm border-t border-primary-600">
        <p>© 2023 HandyPro</p>
        <p className="mt-1">All rights reserved</p>
      </div>
    </aside>
  );
}