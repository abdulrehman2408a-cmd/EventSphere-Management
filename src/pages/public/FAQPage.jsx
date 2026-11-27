import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

/**
 * FAQPage component
 * Answers common questions for Attendees, Exhibitors, and Organizers
 * in simple, natural English.
 */
export const FAQPage = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      category: 'Attendees & Ticketing',
      question: 'How do I get my ticket or digital pass?',
      answer: 'When you register for an expo on EventSphere, an electronic badge with a QR code is generated instantly. You can view, print, or download your badge anytime from your Attendee Dashboard or by clicking "View Pass". Simply show this QR code at the event gate for quick entry.'
    },
    {
      category: 'Attendees & Ticketing',
      question: 'Can I bookmark conference sessions to plan my day?',
      answer: 'Yes! On the Event Schedule page, click the bookmark icon next to any session. All bookmarked sessions will appear under "Bookmarked Sessions" in your Attendee Dashboard so you can easily reference your day\'s agenda.'
    },
    {
      category: 'Exhibitors & Booths',
      question: 'How do I choose and book an exhibition stall?',
      answer: 'Exhibitors can browse the interactive floor plan to see available booths (green), reserved spaces (amber), and booked stalls (gray). Clicking on any available booth shows its dimensions, location hall, and price. From there, you can submit a booking request directly.'
    },
    {
      category: 'Exhibitors & Booths',
      question: 'Can I register staff members to manage our stall?',
      answer: 'Yes. In the Exhibitor Portal under "Booth Staff Passes", you can add team members with their names and contact details so official staff credentials can be generated.'
    },
    {
      category: 'Organizers & Admin',
      question: 'Can organizers download a list of registered attendees?',
      answer: 'Yes. In the Admin Dashboard under "Attendees", organizers can filter attendees by event, search by name or company, and click "Export CSV" to download the attendee list in spreadsheet format.'
    },
    {
      category: 'Demo Mode',
      question: 'How does Demo Mode work?',
      answer: 'A top banner allows you to easily switch between Admin, Exhibitor, and Attendee roles with one click. All demo changes (like booking a booth, creating an event, or bookmarking sessions) are saved locally in your browser so you can test all features without needing a backend server.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          Help & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto">
          Helpful answers to common questions about attending events, booking exhibition stalls, and managing expos.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <Card
              key={index}
              className="p-5 cursor-pointer border border-slate-200 transition-all hover:border-slate-300"
              onClick={() => setOpenIdx(isOpen ? null : index)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    {faq.category}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900">
                    {faq.question}
                  </h3>
                </div>
                <div className={`p-1.5 rounded-lg text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </div>

              {isOpen && (
                <div className="pt-3 mt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
