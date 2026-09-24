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
  Settings,
  Building2,
  ExternalLink
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
    setCurrentHospitalId
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

  // Clean menu items with NO duplicate counters
  const menuItems: { id: 'OPD' | 'IPD' | 'DOCTORS' | 'TELECONSULT' | 'ANALYTICS'; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'OPD', label: 'OPD Queue & Triage', icon: <Users className="w-5 h-5" />, desc: 'Real-time patient intake & triage management' },
    { id: 'IPD', label: 'Bed & Ward Matrix', icon: <Bed className="w-5 h-5" />, desc: 'Live ward occupancy, ICU & oxygen resources' },
    { id: 'DOCTORS', label: 'Doctor Roster (AEBAS)', icon: <Stethoscope className="w-5 h-5" />, desc: 'Biometric shift status & OPD assignments' },
    { id: 'TELECONSULT', label: 'eSanjeevani Desk', icon: <Video className="w-5 h-5" />, desc: 'Rural tele-consultation video bridge' },
    { id: 'ANALYTICS', label: 'Hospital Analytics', icon: <BarChart className="w-5 h-5" />, desc: 'Patient influx, wait time & ABDM compliance' }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        {/* Indian Tricolor Ribbon */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-amber-500" />
          <div className="flex-1 bg-white border-y border-slate-200/50" />
          <div className="flex-1 bg-emerald-600" />
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src="/logo.png"
                alt="SUGASTHA Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  SUGASTHA
                  <span className="text-amber-600 font-extrabold text-sm hidden md:inline">सुगस्था</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Activity className="w-2.5 h-2.5 mr-1 text-emerald-600 animate-pulse" />
                  ABDM CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-tight">
                National Unified Healthcare Platform · MoHFW, Govt of India
              </p>
            </div>
          </div>

          {/* Center: Live Hospital Facility Switcher */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 hover:border-slate-300 transition-colors">
            <Building2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-none">Active Command Facility</span>
              <select
                value={currentHospitalId}
                onChange={(e) => setCurrentHospitalId(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer pr-1 py-0.5"
                aria-label="Select Hospital"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Fallback Alert Banner (when active) */}
          {activeFallback && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 px-3 py-1.5 rounded-xl text-rose-800 text-xs font-semibold animate-pulse shadow-sm">
              <div className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>Auto-Escalation: <strong>{activeFallback.secondsRemaining}s</strong></span>
            </div>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Alarm Toggle */}
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              title={soundEnabled ? 'Audio Alarms Active (Click to Mute)' : 'Audio Alarms Muted (Click to Enable)'}
              className={`p-2 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="hidden xl:inline text-[11px] font-semibold">Sound ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden xl:inline text-[11px]">Muted</span>
                </>
              )}
            </button>

            {/* Clock */}
            <div className="hidden sm:flex items-center gap-1.5 text-slate-600 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentTime}</span>
            </div>

            {/* User Profile Badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 text-white rounded-xl px-3 py-1.5 shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Hospital Admin</div>
                <div className="text-[10px] text-slate-400 leading-tight">CMO Desk</div>
              </div>
            </div>

            {/* Logout Quick Action Button */}
            <button
              onClick={logout}
              title="Secure Logout"
              className="hidden md:flex items-center gap-1.5 p-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Logout</span>
            </button>

            {/* Drawer Menu Button */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm focus:ring-2 focus:ring-slate-400"
              aria-label="Open navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Navigation & Settings Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-[slideInRight_0.2s_ease-out]">
            {/* Tricolor Ribbon in Drawer */}
            <div className="h-1 w-full flex flex-shrink-0">
              <div className="flex-1 bg-amber-500" />
              <div className="flex-1 bg-white border-y border-slate-200" />
              <div className="flex-1 bg-emerald-600" />
            </div>

            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/60 flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="SUGASTHA Logo"
                    className="h-10 w-auto object-contain"
                  />
                  <div>
                    <h2 className="font-black text-slate-900 text-base tracking-tight">SUGASTHA</h2>
                    <p className="text-[11px] text-amber-700 font-bold">सुगस्था स्वास्थ्य मंच</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Facility Selector */}
              <div className="lg:hidden mt-2 bg-white rounded-xl p-2.5 border border-slate-200 shadow-2xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Active Facility
                </label>
                <select
                  value={currentHospitalId}
                  onChange={(e) => setCurrentHospitalId(e.target.value)}
                  className="w-full bg-slate-50 text-xs font-bold text-slate-800 p-2 rounded-lg border border-slate-200 outline-none"
                >
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clean Section Navigation (NO DUPLICATE COUNT BADGES) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">
                  Command Sections
                </h3>
                <div className="space-y-1.5">
                  {menuItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                        activeTab === item.id
                          ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-950 font-bold shadow-2xs'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700 font-medium'
                      }`}
                    >
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        activeTab === item.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold leading-snug">{item.label}</p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${
                        activeTab === item.id ? 'text-emerald-600' : 'text-slate-300'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ABDM Ecosystem Status */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1">
                  ABDM Gateway Health
                </h3>
                <div className="space-y-1.5">
                  {[
                    { name: 'ABDM Health Gateway', status: 'Operational', latency: '24ms' },
                    { name: 'eSanjeevani Tele-Bridge', status: 'Active', latency: '41ms' },
                    { name: 'ABHA Registry & Locker', status: 'Synchronized', latency: '19ms' },
                    { name: 'AEBAS Biometric Server', status: 'Online', latency: '32ms' }
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs">
                      <span className="text-slate-700 font-medium">{s.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">{s.latency}</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-700">{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Display & Accessibility Settings */}
              <div>
                <button
                  onClick={() => setShowSettings(prev => !prev)}
                  className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 px-1"
                >
                  <span className="flex items-center gap-1.5"><Settings className="w-3.5 h-3.5" /> Display & Sound</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSettings ? 'rotate-90' : ''}`} />
                </button>
                {showSettings && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <span className="text-xs text-slate-700 font-medium">Font Scale</span>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 gap-0.5 shadow-2xs">
                        {(['normal', 'large', 'xlarge'] as const).map((s, i) => (
                          <button
                            key={s}
                            onClick={() => setFontSize(s)}
                            className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                              fontSize === s ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {i === 0 ? 'A-' : i === 1 ? 'A' : 'A+'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                      <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
                        <Contrast className="w-3.5 h-3.5 text-slate-400" /> High Contrast
                      </span>
                      <button
                        onClick={() => setHighContrast(prev => !prev)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${highContrast ? 'bg-emerald-600' : 'bg-slate-300'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${highContrast ? 'translate-x-5' : ''}`} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer: Logout & System Version */}
            <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-colors shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                Sign Out from Command Center
              </button>
              <div className="text-center text-[10px] text-slate-400 mt-2.5 font-medium">
                SUGASTHA v2.4 · NHA ABDM Certified Gateway
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
