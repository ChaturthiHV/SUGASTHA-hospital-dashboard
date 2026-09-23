import React, { useState, useEffect } from 'react';
import { useHealthcare } from '../../context/HealthcareContext';
import {
  Menu,
  X,
  Activity,
  Clock,
  ShieldCheck,
  LogOut,
  Bed,
  Users,
  Stethoscope,
  Video,
  BarChart,
  ChevronRight,
  Volume2,
  VolumeX,
  Contrast,
  Settings
} from 'lucide-react';

export const GovHeader: React.FC = () => {
  const {
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    soundEnabled,
    setSoundEnabled,
    activeFallback,
    logout,
    activeTab,
    setActiveTab,
    hospitals,
    currentHospitalId,
    appointments
  } = useHealthcare();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const activeHospital = hospitals.find(h => h.id === currentHospitalId) || hospitals[0];
  const pendingCount = appointments.filter(a => a.status === 'PENDING_ACCEPTANCE').length;

  const menuItems: { id: 'OPD' | 'IPD' | 'DOCTORS' | 'TELECONSULT' | 'ANALYTICS'; label: string; icon: React.ReactNode; desc: string; badge?: number }[] = [
    { id: 'OPD', label: 'OPD Queue', icon: <Users className="w-5 h-5" />, desc: 'Incoming patients & triage', badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'IPD', label: 'Bed Management', icon: <Bed className="w-5 h-5" />, desc: 'Ward, ICU & O₂ beds' },
    { id: 'DOCTORS', label: 'Doctor Roster', icon: <Stethoscope className="w-5 h-5" />, desc: 'On-duty staff & availability' },
    { id: 'TELECONSULT', label: 'Telemedicine Desk', icon: <Video className="w-5 h-5" />, desc: 'eSanjeevani remote consults' },
    { id: 'ANALYTICS', label: 'Analytics', icon: <BarChart className="w-5 h-5" />, desc: 'Load, wait time & reports' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        {/* Indian Tricolor Ribbon */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-white border-y border-slate-200" />
          <div className="flex-1 bg-green-700" />
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          {/* Logo: Govt Emblem + SUGASTHA */}
          <div className="flex items-center gap-3">
            <img
              src="/gov_emblem.png"
              alt="Government of India Emblem"
              className="h-11 w-auto object-contain flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-sky-900">SUGASTHA</h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <Activity className="w-2.5 h-2.5 mr-1 text-emerald-600 animate-pulse" />
                  ABDM LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-tight">
                Ministry of Health & Family Welfare · Hospital Command Center
              </p>
            </div>
          </div>

          {/* Center: Fallback Alert */}
          {activeFallback && (
            <div className="hidden md:flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-lg text-rose-800 text-xs animate-pulse">
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span className="font-bold">Auto-Fallback:</span>
              <span>{activeFallback.secondsRemaining}s</span>
            </div>
          )}

          {/* Right: Clock + Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-500 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 text-white transition-colors shadow-sm"
              aria-label="Open menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-[slideInRight_0.25s_ease-out]">

            {/* Indian Tricolor Ribbon in Drawer */}
            <div className="h-1 w-full flex flex-shrink-0">
              <div className="flex-1 bg-orange-500" />
              <div className="flex-1 bg-white border-y border-slate-200" />
              <div className="flex-1 bg-green-700" />
            </div>

            {/* Drawer Header */}
            <div className="bg-white p-5 border-b border-slate-200 flex-shrink-0 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/gov_emblem.png"
                    alt="National Emblem"
                    className="h-12 w-auto object-contain flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-sky-950 text-lg tracking-tight">SUGASTHA</h2>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-700">सुगस्था स्वास्थ्य मंच</p>
                    <p className="text-[10px] text-slate-500 leading-tight">National Unified Healthcare Platform</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hospital Info */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Facility</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    ABDM Connected
                  </span>
                </div>
                <p className="text-slate-900 font-bold text-sm">{activeHospital?.name}</p>
                <p className="text-slate-500 text-xs">{activeHospital?.type}</p>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">Navigation</h3>
                <div className="space-y-1">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id); setMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? 'bg-sky-50 border border-sky-200 text-sky-900'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        activeTab === item.id ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm ${activeTab === item.id ? 'text-sky-900' : 'text-slate-800'}`}>{item.label}</p>
                          {item.badge && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">{item.badge}</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${activeTab === item.id ? 'text-sky-500' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>



              {/* System Status */}
              <div className="px-4 pb-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">System Status</h3>
                <div className="space-y-1.5">
                  {['ABDM Gateway', 'eSanjeevani', 'ABHA Health Locker', 'NHA Server'].map(s => (
                    <div key={s} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg px-3 py-2">
                      <span className="text-xs text-slate-600">{s}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600">Online</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings (collapsible) */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => setShowSettings(prev => !prev)}
                  className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1"
                >
                  <span className="flex items-center gap-1.5"><Settings className="w-3 h-3" /> Display Settings</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
                </button>
                {showSettings && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                      <span className="text-sm text-slate-700 font-medium">Font Size</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5 shadow-sm">
                        {(['normal', 'large', 'xlarge'] as const).map((s, i) => (
                          <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                              fontSize === s ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {i === 0 ? 'A-' : i === 1 ? 'A' : 'A+'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                      <span className="text-sm text-slate-700 font-medium flex items-center gap-2"><Contrast className="w-4 h-4 text-slate-400" /> Contrast</span>
                      <button onClick={() => setHighContrast(prev => !prev)} className={`relative w-11 h-6 rounded-full transition-colors ${highContrast ? 'bg-sky-600' : 'bg-slate-300'}`}>
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${highContrast ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5">
                      <span className="text-sm text-slate-700 font-medium flex items-center gap-2">
                        {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />} Audio
                      </span>
                      <button onClick={() => setSoundEnabled(prev => !prev)} className={`relative w-11 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${soundEnabled ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer: Logout */}
            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Secure Logout
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Ministry of Health & Family Welfare · NHA ABDM
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
};
