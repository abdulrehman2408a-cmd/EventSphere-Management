import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Building2,
  Layers,
  Clock,
  Users,
  BarChart3,
  MessageSquare,
  Star,
  Settings,
  Sparkles,
  LogOut,
  Package,
  FileCheck,
  UserCheck,
  Bookmark,
  Bell,
  Ticket,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const adminNav = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Expo Management', path: '/admin/expos', icon: Calendar },
    { name: 'Exhibitors', path: '/admin/exhibitors', icon: Building2 },
    { name: 'Booth Floor Plan', path: '/admin/booths', icon: Layers },
    { name: 'Schedule Management', path: '/admin/schedule', icon: Clock },
    { name: 'Attendees & Passes', path: '/admin/attendees', icon: Users },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Communication', path: '/admin/communication', icon: MessageSquare },
    { name: 'Feedback & Reviews', path: '/admin/feedback', icon: Star },
    { name: 'Platform Settings', path: '/admin/settings', icon: Settings },
  ];

  const exhibitorNav = [
    { name: 'Exhibitor Overview', path: '/exhibitor', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/exhibitor/profile', icon: Building2 },
    { name: 'Products & Services', path: '/exhibitor/products', icon: Package },
    { name: 'Expo Applications', path: '/exhibitor/applications', icon: FileCheck },
    { name: 'My Booked Booths', path: '/exhibitor/booths', icon: Layers },
    { name: 'Booth Staff Pass', path: '/exhibitor/staff', icon: UserCheck },
    { name: 'Organizer Messages', path: '/exhibitor/messages', icon: MessageSquare },
    { name: 'Account Settings', path: '/exhibitor/settings', icon: Settings },
  ];

  const attendeeNav = [
    { name: 'Attendee Overview', path: '/attendee', icon: LayoutDashboard },
    { name: 'Registered Events', path: '/attendee/events', icon: Ticket },
    { name: 'Browse Exhibitors', path: '/attendee/directory', icon: Building2 },
    { name: 'Event Agenda', path: '/attendee/schedule', icon: Clock },
    { name: 'Bookmarked Sessions', path: '/attendee/bookmarks', icon: Bookmark },
    { name: 'Notification Center', path: '/attendee/notifications', icon: Bell },
    { name: 'Submit Feedback', path: '/attendee/feedback', icon: Star },
    { name: 'Profile Settings', path: '/attendee/settings', icon: Settings },
  ];

  const currentNav = role === 'admin' ? adminNav : role === 'exhibitor' ? exhibitorNav : attendeeNav;

  const roleTitle = role === 'admin' ? 'Organizer Suite' : role === 'exhibitor' ? 'Exhibitor Hub' : 'Delegate Portal';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-[31px] bottom-0 left-0 z-40 w-64 bg-brand-navy border-r border-slate-800 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Event<span className="text-brand-blue">Sphere</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block -mt-1">
                {roleTitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Navigation Menu
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin' || item.path === '/exhibitor' || item.path === '/attendee'}
                onClick={() => {
                  if (onClose) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Public Website
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-all"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            <span>View Public Website</span>
          </Link>
        </div>

        {/* User Profile Card & Logout */}
        <div className="p-4 border-t border-slate-800 bg-brand-deep/50">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={user?.name || 'User'}
              className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.organization || 'EventSphere User'}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-rose-950/70 hover:text-rose-300 text-slate-300 transition-colors border border-slate-700/60"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
