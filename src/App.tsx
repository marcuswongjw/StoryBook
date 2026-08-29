import React, { useState, useEffect } from 'react';
import { Passage, SessionTelemetry, ReadingStumble, TutorSettings } from './types';
import { loadPassages, loadSessions, loadSettings, saveSettings } from './services/storage';
import { soundEngine } from './services/soundEffects';
import { Header } from './components/Header';
import { PassageSelector } from './components/PassageSelector';
import { ReadingRoom } from './components/ReadingRoom';
import { TacticalDebrief } from './components/TacticalDebrief';
import { ParentDashboard } from './components/ParentDashboard';
import { CustomPassageModal } from './components/CustomPassageModal';

type AppFlowState = 'catalog' | 'reading' | 'debrief';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reader' | 'parent'>('reader');
  const [flowState, setFlowState] = useState<AppFlowState>('catalog');
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [sessions, setSessions] = useState<SessionTelemetry[]>([]);
  const [settings, setSettings] = useState<TutorSettings>(loadSettings());
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Completed reading session state passed to debrief
  const [readingSessionData, setReadingSessionData] = useState<{
    stumbles: ReadingStumble[];
    durationSeconds: number;
    totalWords: number;
  } | null>(null);

  useEffect(() => {
    setPassages(loadPassages());
    setSessions(loadSessions());

    // Start ambient background on initial interaction if enabled
    if (settings.ambientSound !== 'none') {
      soundEngine.startAmbient(settings.ambientSound, settings.ambientVolume);
    }

    return () => {
      soundEngine.stopAmbient();
    };
  }, []);

  const handleUpdateSettings = (newSettings: TutorSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleSelectPassage = (passage: Passage) => {
    setCurrentPassage(passage);
    setFlowState('reading');
    setSessionStartTime(Date.now());
    soundEngine.playSuccessChime();
  };

  const handleExitReading = () => {
    setFlowState('catalog');
    setCurrentPassage(null);
    setSessionStartTime(null);
    setReadingSessionData(null);
  };

  const handleCompletePassage = (
    stumbles: ReadingStumble[],
    durationSeconds: number,
    totalWords: number
  ) => {
    setReadingSessionData({ stumbles, durationSeconds, totalWords });
    setFlowState('debrief');
  };

  const handleFinishDebrief = (session: SessionTelemetry) => {
    setSessions((prev) => [session, ...prev.filter((s) => s.sessionId !== session.sessionId)]);
    setActiveTab('parent');
    setFlowState('catalog');
    setCurrentPassage(null);
    setSessionStartTime(null);
    setReadingSessionData(null);
  };

  const handlePassageCreated = (newPassage: Passage) => {
    setPassages((prev) => [newPassage, ...prev]);
    handleSelectPassage(newPassage);
  };

  return (
    <div className="min-h-screen bg-compass-dark text-slate-100 flex flex-col font-sans selection:bg-compass-teal selection:text-compass-dark">
      {/* Universal Tactical Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'parent') {
            setSessions(loadSessions());
          }
        }}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        sessionStartTime={sessionStartTime}
        onOpenCustomPassage={() => setIsCustomModalOpen(true)}
      />

      {/* Main View Port */}
      <main className="flex-1 pb-16">
        {activeTab === 'parent' ? (
          <ParentDashboard
            sessions={sessions}
            onBackToReader={() => setActiveTab('reader')}
          />
        ) : (
          <>
            {flowState === 'catalog' && (
              <PassageSelector
                passages={passages}
                onSelectPassage={handleSelectPassage}
                onOpenCustomPassage={() => setIsCustomModalOpen(true)}
              />
            )}

            {flowState === 'reading' && currentPassage && (
              <ReadingRoom
                passage={currentPassage}
                settings={settings}
                onCompletePassage={handleCompletePassage}
                onExit={handleExitReading}
              />
            )}

            {flowState === 'debrief' && currentPassage && readingSessionData && (
              <TacticalDebrief
                passage={currentPassage}
                stumbles={readingSessionData.stumbles}
                durationSeconds={readingSessionData.durationSeconds}
                totalWords={readingSessionData.totalWords}
                settings={settings}
                onFinishDebrief={handleFinishDebrief}
              />
            )}
          </>
        )}
      </main>

      {/* Custom Passage Modal */}
      <CustomPassageModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onPassageCreated={handlePassageCreated}
      />
    </div>
  );
};

export default App;
