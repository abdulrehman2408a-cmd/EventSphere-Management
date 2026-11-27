import React, { useEffect, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { Calendar, MapPin, Printer, Download, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

export const TicketModal = ({ isOpen, onClose, attendee, expo }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const qrData = attendee?.qrCodeData || JSON.stringify({
      ticketNumber: attendee?.ticketNumber || 'ESP-UNKNOWN',
      attendee: attendee?.attendeeName || attendee?.name || 'Guest',
      expo: expo?.title || attendee?.expoTitle || 'EventSphere Expo',
      valid: true
    });

    QRCode.toCanvas(canvasRef.current, qrData, {
      width: 120,
      margin: 1,
      color: { dark: '#0f172a', light: '#ffffff' }
    }, (err) => {
      if (err) console.error('QR generation error:', err);
    });
  }, [isOpen, attendee, expo]);

  if (!attendee && !expo) return null;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!canvasRef.current) {
      toast.error('QR code not ready');
      return;
    }
    try {
      const qrCanvas = canvasRef.current;
      const ticketCanvas = document.createElement('canvas');
      ticketCanvas.width = 600;
      ticketCanvas.height = 360;
      const ctx = ticketCanvas.getContext('2d');
      if (!ctx) {
        window.print();
        return;
      }

      // Card Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 600, 360);

      // Top colored accent bar
      const grad = ctx.createLinearGradient(0, 0, 600, 0);
      grad.addColorStop(0, '#3b82f6');
      grad.addColorStop(0.5, '#8b5cf6');
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 8);

      // Header Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, sans-serif';
      ctx.fillText('EVENTSPHERE MANAGEMENT', 28, 48);

      // Ticket Type Badge
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(attendee?.ticketType || 'VIP Delegate Pass', 28, 74);

      // Attendee Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px system-ui, sans-serif';
      const attendeeName = attendee?.attendeeName || attendee?.name || 'Guest Delegate';
      ctx.fillText(attendeeName, 28, 124);

      // Designation / Company
      ctx.fillStyle = '#38bdf8';
      ctx.font = '15px system-ui, sans-serif';
      ctx.fillText(attendee?.designation || 'Conference Delegate', 28, 150);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText(attendee?.company || '', 28, 172);

      // Expo Details
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 16px system-ui, sans-serif';
      const eventTitle = expo?.title || attendee?.expoTitle || 'EventSphere Expo';
      ctx.fillText(eventTitle.length > 40 ? eventTitle.slice(0, 37) + '...' : eventTitle, 28, 218);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px system-ui, sans-serif';
      const venue = expo?.venue || attendee?.venue || 'Expo Centre';
      ctx.fillText(`Venue: ${venue}`, 28, 242);

      // Ticket Number
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px monospace';
      ctx.fillText('PASS ID:', 28, 288);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(attendee?.ticketNumber || 'ESP-2026-0000', 28, 314);

      // White container for QR Code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(410, 80, 160, 160);

      // Render actual QR code into download canvas
      ctx.drawImage(qrCanvas, 420, 90, 140, 140);

      // Footer note
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillText('Scan at Entrance Turnstile', 418, 260);

      const link = document.createElement('a');
      link.download = `EventSphere-Pass-${attendee?.ticketNumber || 'ticket'}.png`;
      link.href = ticketCanvas.toDataURL('image/png');
      link.click();
      toast.success('Digital pass downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Download failed. Use Print instead.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed Delegate Pass
        </span>
        <h3 className="text-2xl font-black text-slate-900">EventSphere Digital Badge</h3>
        <p className="text-xs text-slate-500">Scan at entrance terminal for seamless turnstile access</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden border-2 border-slate-900 bg-gradient-to-b from-brand-navy via-brand-deep to-slate-900 text-white shadow-2xl p-6 print:border-none print:shadow-none">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-blue flex items-center justify-center font-black text-white text-xs">ES</div>
            <span className="font-bold tracking-tight text-sm">EVENTSPHERE</span>
          </div>
          <Badge variant="purple" size="sm">{attendee?.ticketType || 'VIP All-Access Pass'}</Badge>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={attendee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
            alt="Attendee"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-blue/50 shadow-md"
          />
          <div className="text-left">
            <h4 className="text-xl font-bold text-white tracking-tight">{attendee?.attendeeName || attendee?.name || 'Guest'}</h4>
            <p className="text-xs text-brand-blue font-medium">{attendee?.designation || 'Delegate'}</p>
            <p className="text-xs text-slate-400">{attendee?.company || ''}</p>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 text-left space-y-2 mb-6">
          <div className="text-xs font-semibold text-slate-300 line-clamp-1">
            {expo?.title || attendee?.expoTitle || 'EventSphere Expo'}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-brand-blue" />
            <span>{expo?.startDate ? formatDate(expo.startDate) : (expo?.dates || attendee?.dates || 'TBD')}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{expo?.venue || 'Expo Centre'}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 text-slate-900 flex items-center justify-between shadow-inner">
          <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass ID &amp; Gate</p>
            <p className="text-base font-black font-mono text-slate-900">{attendee?.ticketNumber || 'ESP-0000'}</p>
            <p className="text-[11px] text-slate-600 font-semibold mt-1">Hall Entrance: Gate 2 VIP</p>
          </div>
          <canvas ref={canvasRef} className="w-20 h-20 rounded-xl" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
        <Button variant="secondary" icon={Printer} onClick={handlePrint}>Print Badge</Button>
        <Button variant="primary" icon={Download} onClick={handleDownload}>Save Digital Pass</Button>
      </div>
    </Modal>
  );
};
