import React, { useState, useEffect } from 'react';
import { useHealthcare } from '../../context/HealthcareContext';
import { PortalType } from '../../types';
import {
  Building2,
  User,
  Users,
  PhoneCall,
  Sliders,
  Split,
  Volume2,
  VolumeX,
  Contrast,
  Clock,
  ShieldCheck,
  Activity,
  HeartPulse
} from 'lucide-react';

export const GovHeader: React.FC = () => {
  const {
    portal,
    setPortal,
    lang,
    setLang,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    soundEnabled,
    setSoundEnabled,
    appointments,
    voiceTasks,
    activeFallback
  } = useHealthcare();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }) + ' IST'
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const pendingAppointmentsCount = appointments.filter(a => a.status === 'PENDING_ACCEPTANCE' || a.status === 'ARRIVED').length;
  const pendingVoiceCount = voiceTasks.filter(v => v.status === 'PENDING_CLAIM').length;

  const navItems: { id: PortalType; label: string; labelHi: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[] = [
    {
      id: 'hospital',
      label: 'Hospital Command',
      labelHi: 'अस्पताल कमांड',
      icon: <Building2 className="w-4 h-4" />,
      badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : undefined,
      badgeColor: 'bg-emerald-500 text-white'
    },
    {
      id: 'patient',
      label: 'Citizen / Patient App',
      labelHi: 'नागरिक / रोगी पोर्टल',
      icon: <User className="w-4 h-4" />
    },
    {
      id: 'asha',
      label: 'ASHA Sangini & PHC',
      labelHi: 'आशा संगिनी एवं पीएचसी',
      icon: <Users className="w-4 h-4" />,
      badge: pendingVoiceCount > 0 ? pendingVoiceCount : undefined,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'ivr',
      label: '104 Helpline & Voice STT',
      labelHi: '104 हेल्पलाइन एवं वॉयस',
      icon: <PhoneCall className="w-4 h-4" />
    },
    {
      id: 'fallback',
      label: 'Fallback & Automation Matrix',
      labelHi: 'ऑटोमेशन एवं फॉलबैक',
      icon: <Sliders className="w-4 h-4" />,
      badge: activeFallback ? 1 : undefined,
      badgeColor: 'bg-rose-500 text-white animate-pulse'
    },
    {
      id: 'splitscreen',
      label: 'Split-Screen Live Test',
      labelHi: 'लाइव स्प्लिट स्क्रीन',
      icon: <Split className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* 1. Indian Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* 2. Top Accessibility & Official MoHFW Metadata Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Gov Authority Info */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-400 tracking-wide">
              {lang === 'hi' ? 'भारत सरकार | स्वास्थ्य एवं परिवार कल्याण मंत्रालय' : 'GOVERNMENT OF INDIA | Ministry of Health & Family Welfare'}
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ABDM & eSanjeevani Integrated
            </span>
          </div>

          {/* Right: Live Clock & Accessibility Tools */}
          <div className="flex items-center gap-4">
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>{currentTime}</span>
            </div>

            {/* Font Size Adjuster */}
            <div className="flex items-center bg-slate-800 rounded px-1.5 py-0.5 border border-slate-700">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1 text-[10px] font-bold ${fontSize === 'normal' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Default Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1 text-xs font-bold ${fontSize === 'large' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Large Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-1 text-sm font-bold ${fontSize === 'xlarge' ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Extra Large Font Size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(prev => !prev)}
              className={`p-1 rounded flex items-center gap-1 text-[11px] ${
                highContrast ? 'bg-amber-400 text-black font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
              title="Toggle High Contrast"
            >
              <Contrast className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{highContrast ? 'Standard' : 'Contrast'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-1 text-slate-300 hover:bg-slate-800 rounded flex items-center gap-1 text-[11px]"
              title={soundEnabled ? 'Audio Alerts Enabled' : 'Audio Muted'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  lang === 'en' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  lang === 'hi' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Brand & Emblem Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and National Seal */}
        <div className="flex items-center gap-3.5">
          {/* Emblem Stamp */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-sky-950 flex items-center justify-center shadow-md border border-amber-500/30 text-amber-400 flex-shrink-0">
            <HeartPulse className="w-7 h-7 text-amber-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 font-sans flex items-center gap-1.5">
                <span className="text-sky-900">SUGASTHA</span>
                <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-800 font-bold rounded-md border border-sky-300">
                  सुगस्था
                </span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Activity className="w-2.5 h-2.5 mr-1 text-emerald-600 animate-pulse" />
                ABDM LIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {lang === 'hi'
                ? 'राष्ट्रीय एकीकृत स्वास्थ्य सेवा समन्वय एवं सरकारी अस्पताल डैशबोर्ड'
                : 'National Unified Healthcare Orchestration & Government Hospital Dashboard'}
            </p>
          </div>
        </div>

        {/* Live Fallback Active Indicator (If any cascade in progress) */}
        {activeFallback && (
          <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg text-rose-800 text-xs animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <div>
              <span className="font-bold">Auto-Fallback Active:</span> {activeFallback.secondsRemaining}s remaining for hospital response
            </div>
          </div>
        )}
      </div>

      {/* 4. Portal Navigation Tabs */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map(item => {
            const isActive = portal === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPortal(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs md:text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-sky-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-xs'
                }`}
              >
                {item.icon}
                <span>{lang === 'hi' ? item.labelHi : item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      item.badgeColor || 'bg-sky-600 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
