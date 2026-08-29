import React, { useState } from 'react';
import { Passage, AdventureCategory } from '../types';
import { Compass, Ship, Mountain, Waves, Snowflake, Sparkles, Clock, Target, Play } from 'lucide-react';

interface PassageSelectorProps {
  passages: Passage[];
  onSelectPassage: (passage: Passage) => void;
  onOpenCustomPassage: () => void;
}

export const PassageSelector: React.FC<PassageSelectorProps> = ({
  passages,
  onSelectPassage,
  onOpenCustomPassage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AdventureCategory | 'all'>('all');

  const categories: Array<{ id: AdventureCategory | 'all'; label: string; icon: any }> = [
    { id: 'all', label: 'All Expeditions', icon: Compass },
    { id: 'sailing', label: 'Offshore Sailing', icon: Ship },
    { id: 'mountaineering', label: 'Alpine Peaks', icon: Mountain },
    { id: 'oceanic', label: 'Wild Whitewater', icon: Waves },
    { id: 'polar', label: 'Polar Survival', icon: Snowflake },
  ];

  const filteredPassages = passages.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  const getCategoryBadgeColor = (cat: AdventureCategory) => {
    switch (cat) {
      case 'sailing':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
      case 'mountaineering':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'oceanic':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
      case 'polar':
        return 'bg-sky-950/80 text-sky-300 border-sky-500/30';
      default:
        return 'bg-purple-950/80 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-4 sm:px-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-compass-navy via-slate-900 to-compass-dark border border-compass-teal/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-compass-teal/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-compass-teal/20 border border-compass-teal/40 text-compass-glow text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            Mikaela’s Tactical Reading Command
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans leading-tight">
            Read Aloud. Master High-Stakes Vocab. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-compass-teal via-cyan-300 to-brass-300">
              Debrief Like a Co-Skipper.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Choose an expedition passage below. Read aloud while the voice tutor listens. If you stumble on a tricky nautical term or advanced phrase, we’ll unpack it in real-world context and re-read smoothly. No worksheets—ever.
          </p>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-compass-dark/70 border border-compass-slate/40 rounded-xl p-3">
              <div className="text-xs text-slate-400">Target Session</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-brass-400" />
                20 Minutes
              </div>
            </div>
            <div className="bg-compass-dark/70 border border-compass-slate/40 rounded-xl p-3">
              <div className="text-xs text-slate-400">Lexile Range</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Target className="w-4 h-4 text-compass-teal" />
                880L – 960L
              </div>
            </div>
            <div className="bg-compass-dark/70 border border-compass-slate/40 rounded-xl p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">End Assessment</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Tactical Debrief
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-compass-slate/40 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-compass-teal text-compass-dark shadow-lg shadow-compass-teal/20 scale-105'
                    : 'bg-compass-navy/70 text-slate-300 hover:bg-compass-slate/40 border border-compass-slate/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenCustomPassage}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-compass-slate/30 hover:bg-compass-slate/50 text-slate-200 border border-compass-slate/50 text-xs sm:text-sm font-medium transition-all"
        >
          <Sparkles className="w-4 h-4 text-brass-400" />
          <span>Create Custom Passage</span>
        </button>
      </div>

      {/* Passages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPassages.map((passage) => {
          const allVocab = passage.sentences.flatMap((s) => s.vocabularyWords);

          return (
            <div
              key={passage.id}
              className="group relative overflow-hidden rounded-2xl bg-compass-navy/80 border border-compass-slate/50 hover:border-compass-teal/60 transition-all duration-300 hover:shadow-2xl hover:shadow-compass-teal/10 flex flex-col justify-between"
            >
              {/* Header Gradient */}
              <div
                className={`h-3 bg-gradient-to-r ${passage.coverGradient} border-b border-compass-slate/40`}
              />

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getCategoryBadgeColor(
                        passage.category
                      )}`}
                    >
                      {passage.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brass-400" />
                      ~{passage.estimatedReadingTimeMinutes} mins
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-compass-glow transition-colors font-sans">
                    {passage.title}
                  </h3>
                  <p className="text-xs text-compass-teal/90 font-medium mb-3">
                    {passage.subtitle}
                  </p>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {passage.missionBrief}
                  </p>
                </div>

                {/* Vocabulary Tags Preview */}
                <div className="space-y-2 pt-2 border-t border-compass-slate/30">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Key Tactical Vocabulary ({allVocab.length})</span>
                    <span className="font-mono text-slate-500">{passage.lexileLevel}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {allVocab.slice(0, 5).map((v, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-compass-dark/90 text-compass-glow border border-compass-teal/30 text-xs font-mono"
                      >
                        {v.word}
                      </span>
                    ))}
                    {allVocab.length > 5 && (
                      <span className="px-2 py-0.5 rounded-md bg-compass-dark/60 text-slate-400 text-xs font-mono">
                        +{allVocab.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectPassage(passage)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-compass-teal to-ocean-500 hover:from-compass-glow hover:to-ocean-400 text-compass-dark font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-compass-teal/20 transition-all duration-200 group-hover:scale-[1.02]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Take the Helm & Read Aloud</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
