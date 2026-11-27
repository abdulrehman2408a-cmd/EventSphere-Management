import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Footer component
 * Displayed at the bottom of all public pages with helpful links,
 * contact details, and a simple newsletter subscription form.
 */
export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    toast.success('Thank you for subscribing to EventSphere updates!');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Event<span className="text-blue-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              A modern, easy-to-use platform for organizing expos, reserving exhibition booths, and managing event attendees in one place.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Karachi Expo Centre & Lahore International Expo Complex</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+92 (21) 111-397-675</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                <span>support@eventsphere.pk</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/expos" className="hover:text-white transition-colors">Upcoming Expos</Link></li>
              <li><Link to="/exhibitors" className="hover:text-white transition-colors">Exhibitor Directory</Link></li>
              <li><Link to="/schedule" className="hover:text-white transition-colors">Event Schedule</Link></li>
              <li><Link to="/floor-plan" className="hover:text-white transition-colors">Floor Plan</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              User Portals
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/login" className="hover:text-white transition-colors">Organizer Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Exhibitor Portal</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Attendee Pass Center</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Exhibitor Registration</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Stay informed about upcoming expos, speaker announcements, and booth opportunities.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" /> Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 EventSphere Management. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300">About</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-300">Contact</Link>
            <span>•</span>
            <Link to="/faq" className="hover:text-slate-300">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
