import React, { useState, useEffect } from 'react';
import { Compass, VolumeX, ShieldCheck, BookOpen, Clock, Settings, Sparkles, Waves, Mountain, Snowflake } from 'lucide-react';
import { TutorSettings } from '../types';
import { soundEngine } from '../services/soundEffects';

interface HeaderProps {
  activeTab: 'reader' | 'parent';
  setActiveTab: (tab: 'reader' | 'parent') => void;
  settings: TutorSettings;
  onUpdateSettings: (settings: TutorSettings) => void;
  sessionStartTime: number | null;
  onOpenCustomPassage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onUpdateSettings,
  sessionStartTime,
  onOpenCustomPassage,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    if (!sessionStartTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const targetSeconds = settings.sessionTargetMinutes * 60;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / targetSeconds) * 100));

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleAmbientSound = () => {
    const cycle: TutorSettings['ambientSound'][] = ['ocean', 'mountain', 'polar', 'none'];
    const nextIdx = (cycle.indexOf(settings.ambientSound) + 1) % cycle.length;
    const nextSound = cycle[nextIdx];
    onUpdateSettings({ ...settings, ambientSound: nextSound });
    soundEngine.startAmbient(nextSound, settings.ambientVolume);
  };

  return (
    <header className="bg-compass-navy/90 backdrop-blur-md border-b border-compass-slate/40 sticky top-0 z-40 px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-compass-teal to-ocean-600 flex items-center justify-center shadow-lg shadow-compass-teal/20 text-compass-dark">
            <Compass className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                Story<span className="text-compass-teal">Book</span>
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-compass-slate/50 text-compass-glow border border-compass-teal/30">
                Tactical Reader
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans hidden sm:block">
              Mikaela’s High-Stakes Voice Fluency Coach
            </p>
          </div>
        </div>

        {/* 20-Min Session Clock & Progress */}
        {sessionStartTime && (
          <div className="hidden md:flex items-center gap-3 bg-compass-dark/60 px-4 py-1.5 rounded-full border border-compass-slate/50 shadow-inner">
            <Clock className="w-4 h-4 text-brass-400" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between text-xs text-slate-300 font-mono gap-3">
                <span>{formatTime(elapsedSeconds)}</span>
                <span className="text-slate-500">/ {settings.sessionTargetMinutes}:00</span>
              </div>
              <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-compass-teal to-brass-400 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ambient Soundscape Controller */}
          <button
            onClick={toggleAmbientSound}
            title={`Ambient Sound: ${settings.ambientSound}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-compass-dark/70 hover:bg-compass-slate/40 text-slate-300 text-xs border border-compass-slate/40 transition-all"
          >
            {settings.ambientSound === 'ocean' && <Waves className="w-4 h-4 text-cyan-400" />}
            {settings.ambientSound === 'mountain' && <Mountain className="w-4 h-4 text-emerald-400" />}
            {settings.ambientSound === 'polar' && <Snowflake className="w-4 h-4 text-sky-300" />}
            {settings.ambientSound === 'none' && <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden lg:inline capitalize font-mono text-[11px]">
              {settings.ambientSound === 'none' ? 'Mute Ambiance' : `${settings.ambientSound} Ambiance`}
            </span>
          </button>

          {/* New Custom Passage */}
          <button
            onClick={onOpenCustomPassage}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-compass-teal/15 hover:bg-compass-teal/25 text-compass-glow border border-compass-teal/40 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Custom Story</span>
          </button>

          {/* Mode Switch: Reading Deck vs Parent Hub */}
          <div className="flex items-center bg-compass-dark p-1 rounded-xl border border-compass-slate/50">
            <button
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reader'
                  ? 'bg-compass-teal text-compass-dark shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reader Deck</span>
            </button>
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'parent'
                  ? 'bg-brass-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Parent Log</span>
            </button>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-lg bg-compass-dark/70 hover:bg-compass-slate/40 text-slate-400 hover:text-slate-200 border border-compass-slate/40 transition-all"
            title="Tutor Voice & Pacing Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-compass-navy border border-compass-teal/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-compass-slate/40 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-compass-teal" />
                Tactical Tutor Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Voice Speed */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Mentor Speech Speed</span>
                <span className="font-mono text-compass-teal">{settings.voiceSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={settings.voiceSpeed}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, voiceSpeed: parseFloat(e.target.value) })
                }
                className="w-full accent-compass-teal"
              />
            </div>

            {/* Hesitation Watchdog */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Hesitation Intervention Timer</span>
                <span className="font-mono text-brass-400">
                  {settings.hesitationThresholdSeconds}s
                </span>
              </div>
              <input
                type="range"
                min="2.5"
                max="6.0"
                step="0.5"
                value={settings.hesitationThresholdSeconds}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    hesitationThresholdSeconds: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-brass-400"
              />
              <p className="text-[11px] text-slate-400">
                Pauses the session to unpack meaning if Mikaela pauses on challenging vocab for this long.
              </p>
            </div>

            {/* Target Session Length */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Evening Session Target</span>
                <span className="font-mono text-compass-glow">
                  {settings.sessionTargetMinutes} mins
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={settings.sessionTargetMinutes}
                onChange={(e) =>
                  onUpdateSettings({
                    ...settings,
                    sessionTargetMinutes: parseInt(e.target.value, 10),
                  })
                }
                className="w-full accent-compass-glow"
              />
            </div>

            {/* Ambient Audio Level */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Expedition Ambiance Volume</span>
                <span className="font-mono text-cyan-300">
                  {Math.round(settings.ambientVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={settings.ambientVolume}
                onChange={(e) => {
                  const vol = parseFloat(e.target.value);
                  onUpdateSettings({ ...settings, ambientVolume: vol });
                  soundEngine.setAmbientVolume(vol);
                }}
                className="w-full accent-cyan-400"
              />
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-compass-teal text-compass-dark font-bold rounded-xl hover:bg-compass-glow transition-all"
            >
              Save & Return to Mission
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
