import React, { useEffect, useState } from 'react';
import { Passage, ReadingStumble, SessionTelemetry, TutorSettings } from './types';
import { loadPassages, loadSettings, saveSettings } from './services/storage';
import { soundEngine } from './services/soundEffects';
import { Header } from './components/Header';
import { PassageSelector } from './components/PassageSelector';
import { ReadingRoom } from './components/ReadingRoom';
import { TacticalDebrief } from './components/TacticalDebrief';
import { ParentDashboard } from './components/ParentDashboard';
import { CustomPassageModal } from './components/CustomPassageModal';

type AppFlowState = 'catalog' | 'reading' | 'debrief';

const isParentExperience = () => window.location.hostname === 'storylog.marcusw.xyz';

export const App: React.FC = () => {
  const parentExperience = isParentExperience();
  const [flowState, setFlowState] = useState<AppFlowState>('catalog');
  const [passages, setPassages] = useState<Passage[]>([]);
  const [currentPassage, setCurrentPassage] = useState<Passage | null>(null);
  const [settings, setSettings] = useState<TutorSettings>(loadSettings());
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [readingSessionData, setReadingSessionData] = useState<{
    stumbles: ReadingStumble[];
    durationSeconds: number;
    totalWords: number;
  } | null>(null);

  useEffect(() => {
    if (parentExperience) return;

    setPassages(loadPassages());
    if (settings.ambientSound !== 'none') {
      soundEngine.startAmbient(settings.ambientSound, settings.ambientVolume);
    }

    return () => soundEngine.stopAmbient();
  }, [parentExperience]);

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
    totalWords: number,
  ) => {
    setReadingSessionData({ stumbles, durationSeconds, totalWords });
    setFlowState('debrief');
  };

  const handleFinishDebrief = (_session: SessionTelemetry) => {
    setFlowState('catalog');
    setCurrentPassage(null);
    setSessionStartTime(null);
    setReadingSessionData(null);
  };

  const handlePassageCreated = (newPassage: Passage) => {
    setPassages((previous) => [newPassage, ...previous]);
    handleSelectPassage(newPassage);
  };

  if (parentExperience) {
    return (
      <div className="min-h-screen bg-compass-dark text-slate-100 font-sans selection:bg-brass-500 selection:text-compass-dark">
        <ParentDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-compass-dark text-slate-100 flex flex-col font-sans selection:bg-compass-teal selection:text-compass-dark">
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        sessionStartTime={sessionStartTime}
        onOpenCustomPassage={() => setIsCustomModalOpen(true)}
      />

      <main className="flex-1 pb-16">
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
      </main>

      <CustomPassageModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onPassageCreated={handlePassageCreated}
      />
    </div>
  );
};

export default App;
