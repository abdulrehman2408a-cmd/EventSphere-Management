import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { Menu, X, Calendar, Layers, Users, MapPin, Sparkles, ChevronDown, LogIn, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Expos', path: '/expos' },
    { name: 'Exhibitors', path: '/exhibitors' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Floor Plan', path: '/floor-plan' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' }
  ];

  const getDashboardRoute = () => {
    if (role === 'admin') return '/admin';
    if (role === 'exhibitor') return '/exhibitor';
    return '/attendee';
  };

  return (
    <header className="sticky top-[31px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-navy via-brand-deep to-brand-blue flex items-center justify-center text-white shadow-md shadow-brand-blue/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-blue transition-colors">
                Event<span className="text-brand-blue">Sphere</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest -mt-1">
                Management
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-brand-blue bg-blue-50/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={LayoutDashboard}
                  onClick={() => navigate(getDashboardRoute())}
                >
                  Go to {role === 'admin' ? 'Admin' : role === 'exhibitor' ? 'Exhibitor' : 'My'} Portal
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  icon={LogIn}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/register')}
                >
                  Register Now
                </Button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(getDashboardRoute())}
              >
                Dashboard
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-blue"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(getDashboardRoute());
                }}
              >
                Access {role?.toUpperCase()} Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                >
                  Register Free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
