import React, { useState } from 'react';
import { Passage, AdventureCategory, SentenceData, VocabularyWord, DebriefPrompt } from '../types';
import { Sparkles, X } from 'lucide-react';
import { saveCustomPassage } from '../services/storage';

interface CustomPassageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPassageCreated: (passage: Passage) => void;
}

export const CustomPassageModal: React.FC<CustomPassageModalProps> = ({
  isOpen,
  onClose,
  onPassageCreated,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle] = useState('');
  const [category, setCategory] = useState<AdventureCategory>('sailing');
  const [lexileLevel] = useState('900L (Grade 6-7)');
  const [missionBrief, setMissionBrief] = useState('');
  const [rawStoryText, setRawStoryText] = useState('');
  const [customVocabInput, setCustomVocabInput] = useState('keel, starboard, spinnaker');
  const [debriefQ1, setDebriefQ1] = useState('Why did the skipper make this tactical choice under pressure?');
  const [debriefQ2, setDebriefQ2] = useState('How would you predict the wind shift will change their strategy next?');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawStoryText.trim()) return;

    const rawSentences = rawStoryText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);

    const vocabList = customVocabInput
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);

    const sentences: SentenceData[] = rawSentences.map((text, idx) => {
      const matchedVocab: VocabularyWord[] = [];
      vocabList.forEach((word) => {
        if (text.toLowerCase().includes(word.toLowerCase())) {
          matchedVocab.push({
            word: word,
            phonetic: '',
            syllableBreakdown: word.toUpperCase(),
            partOfSpeech: 'key term',
            definition: `Key tactical vocabulary for ${word}.`,
            tacticalAnalogy: `Real-world tactical application of ${word} during the mission.`,
            sampleUsage: text,
          });
        }
      });

      return {
        id: `custom-s-${idx + 1}`,
        text,
        vocabularyWords: matchedVocab,
        tacticalContext: `Tactical sentence ${idx + 1}`,
      };
    });

    const debriefPrompts: DebriefPrompt[] = [
      {
        id: 'cust-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Decision Analysis',
        question: debriefQ1,
        mentorContext: 'Evaluating the immediate choices under high pressure.',
        probingQuestions: ['What risks did they take?', 'What other options were available?'],
        keyTacticalInsights: ['Decisive action under uncertainty is essential for survival.'],
      },
      {
        id: 'cust-debrief-2',
        category: 'strategic_prediction',
        categoryLabel: 'Strategic Prediction',
        question: debriefQ2,
        mentorContext: 'Looking ahead to subsequent hazards.',
        probingQuestions: ['What environmental indicators matter most?', 'How does momentum affect the outcome?'],
        keyTacticalInsights: ['Planning two moves ahead prevents getting caught off guard.'],
      },
    ];

    const newPassage: Passage = {
      id: `custom-${Date.now()}`,
      title,
      subtitle: subtitle || 'Custom Adventure Expedition',
      category,
      lexileLevel,
      estimatedReadingTimeMinutes: Math.max(3, Math.round(sentences.length * 0.7)),
      missionBrief: missionBrief || `High stakes ${category} expedition created for Mikaela.`,
      coverGradient: 'from-slate-900 via-indigo-950 to-slate-950',
      accentColor: '#5BC0BE',
      sentences,
      debriefPrompts,
      isCustom: true,
    };

    saveCustomPassage(newPassage);
    onPassageCreated(newPassage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-compass-navy border border-compass-teal/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8">
        <div className="flex items-center justify-between border-b border-compass-slate/40 pb-4">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-compass-teal" />
            <h3 className="text-xl font-bold text-white font-sans">
              Create Custom Adventure Passage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Story Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., The Solent Match Race"
                className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-3 text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AdventureCategory)}
                className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-3 text-sm text-white focus:outline-none"
              >
                <option value="sailing">Sailing & Ocean Racing</option>
                <option value="mountaineering">Alpine & Extreme Climbing</option>
                <option value="oceanic">Whitewater & Big Surf</option>
                <option value="polar">Polar & Wilderness Survival</option>
                <option value="custom">General High-Stakes Adventure</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Mission Brief / Short Hook
            </label>
            <input
              type="text"
              value={missionBrief}
              onChange={(e) => setMissionBrief(e.target.value)}
              placeholder="Elena and her crew face a sudden tidal rip..."
              className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-3 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Passage Text (Sentences separated by periods) *
            </label>
            <textarea
              required
              rows={4}
              value={rawStoryText}
              onChange={(e) => setRawStoryText(e.target.value)}
              placeholder="Paste or type 4-8 sentences of exciting story text..."
              className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-3 text-sm text-white focus:outline-none font-serif leading-relaxed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Key Vocabulary to Track (comma-separated)
            </label>
            <input
              type="text"
              value={customVocabInput}
              onChange={(e) => setCustomVocabInput(e.target.value)}
              placeholder="stanchion, gunwale, archipelago, tempestuous"
              className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-3 text-sm text-white focus:outline-none font-mono"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-compass-slate/30">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Custom Tactical Debrief Questions (No Multiple Choice)
            </div>
            <input
              type="text"
              value={debriefQ1}
              onChange={(e) => setDebriefQ1(e.target.value)}
              placeholder="Debrief Question 1..."
              className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              value={debriefQ2}
              onChange={(e) => setDebriefQ2(e.target.value)}
              placeholder="Debrief Question 2..."
              className="w-full bg-compass-dark border border-compass-slate/50 focus:border-compass-teal rounded-xl p-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-compass-slate/40">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-compass-dark text-slate-300 text-sm font-semibold hover:bg-compass-slate/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-compass-teal to-ocean-500 text-compass-dark text-sm font-extrabold shadow-lg shadow-compass-teal/20"
            >
              Save & Add to Story Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
