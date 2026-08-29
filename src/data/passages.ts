import { Passage } from '../types';

export const INITIAL_PASSAGES: Passage[] = [
  {
    id: 'roaring-forties-jibe',
    title: 'The Roaring Forties Jibe',
    subtitle: 'High-Stakes Offshore Regatta Rounding Cape Horn',
    category: 'sailing',
    lexileLevel: '920L (Grade 6-7)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Skipper Elena battles thirty-five-knot squalls in the Southern Ocean. When a violent gust threatens to capsize their forty-foot racing yacht, she must execute a perilous jibe before the boat broaches against the unforgiving swell.',
    coverGradient: 'from-blue-950 via-cyan-900 to-slate-900',
    accentColor: '#38bdf8',
    sentences: [
      {
        id: 'rf-1',
        text: 'The tempestuous Southern Ocean unleashed forty-knot squalls that hammered against the carbon-fiber hull.',
        vocabularyWords: [
          {
            word: 'tempestuous',
            phonetic: '/tɛmˈpɛstʃuəs/',
            syllableBreakdown: 'tem-PES-choo-us',
            partOfSpeech: 'adjective',
            definition: 'Characterized by wild, violent, and turbulent storms or emotions.',
            tacticalAnalogy: 'Think of sea conditions so ferocious that roaring white foam tears across the deck, forcing your knuckles white on the steering helm!',
            etymologyAnchor: 'From Latin "tempestas" (storm / violent weather).',
            sampleUsage: 'The crew battled tempestuous waves that rose like dark stone walls.'
          }
        ],
        tacticalContext: 'Setting the wind and sea conditions before the tactical maneuver.',
        complexSyntaxNote: 'Subordinate clause modifying the severe storm conditions.'
      },
      {
        id: 'rf-2',
        text: 'Freezing saltwater crashed relentlessly over the windward gunwale as Elena gripped the helm with white-knuckled focus.',
        vocabularyWords: [
          {
            word: 'gunwale',
            phonetic: '/ˈɡʌnəl/',
            syllableBreakdown: 'GUN-ull',
            partOfSpeech: 'noun',
            definition: 'The upper edge or outer rim of a vessel\'s side.',
            tacticalAnalogy: 'When you are hiking hard in a dinghy or keelboat, the gunwale is the top rail dipping right into the frothing green water!',
            etymologyAnchor: 'Historically the platform where ship cannons (guns) were mounted (gun-wale).',
            sampleUsage: 'She hiked out over the leeward gunwale to balance the boat.'
          }
        ],
        tacticalContext: 'Extreme boat heel requiring precise helm balance.'
      },
      {
        id: 'rf-3',
        text: 'A sudden barometric plunge signaled an incoming front with blinding rain and shifting gale-force winds.',
        vocabularyWords: [
          {
            word: 'barometric',
            phonetic: '/ˌbærəˈmɛtrɪk/',
            syllableBreakdown: 'bair-uh-MET-rik',
            partOfSpeech: 'adjective',
            definition: 'Relating to atmospheric pressure as measured by a barometer, predicting rapid weather changes.',
            tacticalAnalogy: 'Like an early warning alarm on your tactical navigation instruments telling you a fierce storm front is about to pounce.',
            etymologyAnchor: 'Greek "baros" (weight / pressure) + "metron" (measure).',
            sampleUsage: 'A rapid barometric drop warned the navigators to reef the mainsail immediately.'
          }
        ],
        tacticalContext: 'Environmental risk indicator forcing an immediate command decision.'
      },
      {
        id: 'rf-4',
        text: 'If the rudder stalled now, the yacht would broach violently, flipping sideways into the trough of a massive wave.',
        vocabularyWords: [
          {
            word: 'broach',
            phonetic: '/broʊtʃ/',
            syllableBreakdown: 'BROACH',
            partOfSpeech: 'verb',
            definition: 'To veer unintentionally into the wind and heel dangerously, losing steering control.',
            tacticalAnalogy: 'When a huge wave lifts the stern and the boat spins out of control sideways, burying the sails into the water!',
            sampleUsage: 'The helmsman fought the wheel to prevent the yacht from broaching in the heavy surf.'
          }
        ],
        tacticalContext: 'High-stakes nautical hazard with potential boat roll.'
      },
      {
        id: 'rf-5',
        text: '“Stand by the running backstays!” shouted Elena, clinging to the polished steel stanchion to steady her footing.',
        vocabularyWords: [
          {
            word: 'stanchion',
            phonetic: '/ˈstænʃən/',
            syllableBreakdown: 'STAN-shun',
            partOfSpeech: 'noun',
            definition: 'An upright bar, pillar, or post providing structural support or safety railing on a ship.',
            tacticalAnalogy: 'The strong stainless steel posts along the edge of the yacht deck that hold the lifeline wires you grab when the deck tilts 30 degrees.',
            sampleUsage: 'He grabbed the lifeline stanchion just as a swell washed over the bow.'
          }
        ]
      },
      {
        id: 'rf-6',
        text: 'The churning maelstrom beneath their keel threatened to swallow the small carbon craft whole.',
        vocabularyWords: [
          {
            word: 'maelstrom',
            phonetic: '/ˈmeɪlstrɒm/',
            syllableBreakdown: 'MAYL-struhm',
            partOfSpeech: 'noun',
            definition: 'A powerful, swirling whirlpool or a chaotic state of violent turbulence.',
            tacticalAnalogy: 'A dizzying vortex where conflicting ocean currents collide with howling winds, pulling everything toward its center.',
            etymologyAnchor: 'Dutch "malen" (to grind/whirl) + "stroom" (stream).',
            sampleUsage: 'They steered clear of the churning maelstrom at the narrow reef opening.'
          }
        ]
      },
      {
        id: 'rf-7',
        text: 'With indomitable courage, Elena spun the wheel, timing the jibe perfectly to surf down the face of a sixty-foot cresting giant.',
        vocabularyWords: [
          {
            word: 'indomitable',
            phonetic: '/ɪnˈdɒmɪtəbəl/',
            syllableBreakdown: 'in-DOM-i-tuh-buhl',
            partOfSpeech: 'adjective',
            definition: 'Impossible to subdue, defeat, or discourage; invincible spirit.',
            tacticalAnalogy: 'The unbreakable mental toughness of a champion athlete who refuses to panic when the odds are stacked against them.',
            etymologyAnchor: 'Latin "in-" (not) + "domitare" (to tame).',
            sampleUsage: 'Her indomitable spirit carried the crew through the freezing night.'
          }
        ],
        tacticalContext: 'Decisive tactical victory through precision and composure.'
      }
    ],
    debriefPrompts: [
      {
        id: 'rf-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Decision Analysis',
        question: 'Why did Elena commit to executing a high-speed jibe in 40-knot winds instead of simply dropping the sails and waiting out the storm?',
        mentorContext: 'Offshore racing tactics in the Southern Ocean where staying on the wave face prevents dangerous beam-sea rolls.',
        probingQuestions: [
          'What happens to a heavy racing yacht if it loses forward momentum in giant cresting swells?',
          'How does boat speed generate rudder control when surfing down steep waves?'
        ],
        keyTacticalInsights: [
          'Maintaining boat speed creates steerage to prevent broaching sideways into wave troughs.',
          'Running with the storm preserves hull stability better than taking beam seas.'
        ]
      },
      {
        id: 'rf-debrief-2',
        category: 'character_motive',
        categoryLabel: 'Skipper Psychology Under Pressure',
        question: 'When Elena felt the sudden barometric plunge, what mental calculation allowed her to give decisive orders rather than freeze in panic?',
        mentorContext: 'The mindset of an elite athlete handling sensory overload and high risk.',
        probingQuestions: [
          'How does trusting your instruments (like the barometer) overcome fear of the dark?',
          'What role does clear communication with crew play during a crisis?'
        ],
        keyTacticalInsights: [
          'Pre-planning for emergency contingencies turns fear into muscle memory and direct action.',
          'Decisive vocal commands keep the crew coordinated and confident.'
        ]
      },
      {
        id: 'rf-debrief-3',
        category: 'strategic_prediction',
        categoryLabel: 'Strategic Navigation Prediction',
        question: 'Now that they survived the jibe, what is the single biggest tactical danger Elena faces over the next two hours as night falls over Cape Horn?',
        mentorContext: 'Southern ocean night navigation with trailing squalls and cold fronts.',
        probingQuestions: [
          'How will fatigue affect the crew\'s reaction time on watch?',
          'What hidden obstacles exist near the continental shelf and rocky headlands?'
        ],
        keyTacticalInsights: [
          'Fatigue impairs decision-making; they must manage watch rotations.',
          'Reefed sails and radar watch are required to avoid unseen growler icebergs.'
        ]
      }
    ]
  },
  {
    id: 'night-reef-navigation',
    title: 'The Night Reef Navigation',
    subtitle: 'Blind Shoal Passage in the South Pacific',
    category: 'sailing',
    lexileLevel: '890L (Grade 6-7)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Navigating through a treacherous volcanic archipelago in total darkness. With GPS satellite failure, the crew must rely on bioluminescent wake, compass bearings, and tactical dead-reckoning to slip past jagged coral shoals.',
    coverGradient: 'from-slate-950 via-teal-950 to-indigo-950',
    accentColor: '#5BC0BE',
    sentences: [
      {
        id: 'nr-1',
        text: 'The remote archipelago consisted of dozens of jagged volcanic islets guarded by razor-sharp barrier reefs.',
        vocabularyWords: [
          {
            word: 'archipelago',
            phonetic: '/ˌɑːrkəˈpɛləɡoʊ/',
            syllableBreakdown: 'ar-kuh-PEL-uh-go',
            partOfSpeech: 'noun',
            definition: 'A large group or chain of islands clustered together in an expanse of water.',
            tacticalAnalogy: 'Picture a maze of island stepping-stones across the ocean with narrow winding channels between them!',
            sampleUsage: 'They sailed cautiously through the Galapagos archipelago.'
          }
        ],
        tacticalContext: 'Geography of the obstacle-dense sailing area.'
      },
      {
        id: 'nr-2',
        text: 'In the eerie halflight between sunset and moonrise, the horizon dissolved into an impenetrable curtain of ink.',
        vocabularyWords: [
          {
            word: 'halflight',
            phonetic: '/ˈhæfˌlaɪt/',
            syllableBreakdown: 'HALF-lyte',
            partOfSpeech: 'noun',
            definition: 'Dim, subdued light, such as during twilight, dusk, or early dawn.',
            tacticalAnalogy: 'That tricky twilight moment when the sky is neither bright nor pitch black, and wave shadows fool your eyes.',
            sampleUsage: 'The lookout squinted through the halflight to spot distant channel markers.'
          }
        ]
      },
      {
        id: 'nr-3',
        text: 'A glowing phosphorescent wake streamed behind their twin hulls, illuminating submerged coral heads mere inches below.',
        vocabularyWords: [
          {
            word: 'phosphorescent',
            phonetic: '/ˌfɒsfəˈrɛsənt/',
            syllableBreakdown: 'fos-fuh-RES-uhnt',
            partOfSpeech: 'adjective',
            definition: 'Emitting light without heat; glowing naturally with bioluminescence in the dark.',
            tacticalAnalogy: 'Like magical neon-blue glitter glowing in the water every time your boat cuts through the ocean at night!',
            sampleUsage: 'Dolphins left streaks of phosphorescent green as they leaped across the bow.'
          }
        ]
      },
      {
        id: 'nr-4',
        text: 'The depth sounder beeped frantically as the keel glided over a shallow underwater shoal.',
        vocabularyWords: [
          {
            word: 'shoal',
            phonetic: '/ʃoʊl/',
            syllableBreakdown: 'SHOHL',
            partOfSpeech: 'noun',
            definition: 'A shallow sandbank, gravel bar, or submerged sand ridge in a body of water that poses danger to ships.',
            tacticalAnalogy: 'An underwater hill or sandbar waiting just below the surface to scrape the bottom of your keel if you steer off-course!',
            sampleUsage: 'The captain trimmed the sails to steer around the uncharted sand shoal.'
          }
        ]
      },
      {
        id: 'nr-5',
        text: 'With modern satellite instruments offline, their survival depended entirely on accurate dead-reckoning and tactical discipline.',
        vocabularyWords: [
          {
            word: 'dead-reckoning',
            phonetic: '/ˌdɛd ˈrɛkənɪŋ/',
            syllableBreakdown: 'DED-rek-un-ing',
            partOfSpeech: 'noun',
            definition: 'The process of calculating current position based on a previously known point, compass heading, and estimated speed.',
            tacticalAnalogy: 'Navigating blindfolded using only your stopwatch, compass heading, and boat speed to calculate exactly where you are on the chart!',
            sampleUsage: 'When the GPS died, their dead-reckoning calculations guided them safely into the harbor.'
          }
        ]
      },
      {
        id: 'nr-6',
        text: 'Mika devised a bold stratagem to use the sound of crashing surf on the windward reef as an acoustic navigational guide.',
        vocabularyWords: [
          {
            word: 'stratagem',
            phonetic: '/ˈstrætədʒəm/',
            syllableBreakdown: 'STRAT-uh-jum',
            partOfSpeech: 'noun',
            definition: 'A clever plan, scheme, or tactical trick designed to outwit a challenge or gain an advantage.',
            tacticalAnalogy: 'A clever chess move on the water—using the environment to solve a problem when standard equipment fails!',
            sampleUsage: 'Her stratagem of hugging the cliff line gave them shelter from the headwinds.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'nr-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Navigation Analysis',
        question: 'Why is using acoustic clues—like the roar of breaking waves on the reef—both a brilliant stratagem and an extreme risk?',
        mentorContext: 'Navigating by sound in restricted waters without visual aids.',
        probingQuestions: [
          'What happens if the wind direction shifts and changes how sound carries over the water?',
          'How close to the breakers do you have to be to hear them clearly?'
        ],
        keyTacticalInsights: [
          'Sound gives immediate proximity feedback, but wind direction and swell resonance can distort distance perception.',
          'Margin for error is slim: hearing the surf means you are only seconds away from danger.'
        ]
      },
      {
        id: 'nr-debrief-2',
        category: 'character_motive',
        categoryLabel: 'Crew Composure & Communication',
        question: 'How did the crew maintain calm when both GPS and chartplotters went completely offline inside the archipelago?',
        mentorContext: 'Crisis leadership and standard operating procedures on racing vessels.',
        probingQuestions: [
          'Why does reverting to fundamental skills (paper charts, compass, stopwatch) restore confidence?',
          'How does dividing roles (lookout, timer, helmsman) prevent panic?'
        ],
        keyTacticalInsights: [
          'Action and structured roles displace anxiety.',
          'Deep mastery of foundational navigation rules gives sailors self-reliance.'
        ]
      }
    ]
  },
  {
    id: 'serac-crossing-karakoram',
    title: 'The Serac Crossing at 18,000 Feet',
    subtitle: 'Alpine Expedition on the Godwin-Austen Glacier',
    category: 'mountaineering',
    lexileLevel: '940L (Grade 7)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'High in the Karakoram range, a mountaineering rope team must traverse a collapsing icefall. Towering seracs hang overhead like guillotine blades while a bottomless crevasse yawns below their aluminum ladder bridge.',
    coverGradient: 'from-slate-900 via-sky-950 to-blue-950',
    accentColor: '#6FFFE9',
    sentences: [
      {
        id: 'sc-1',
        text: 'The towering glacial serac loomed three hundred feet overhead, groaning ominously in the freezing mountain air.',
        vocabularyWords: [
          {
            word: 'serac',
            phonetic: '/səˈræk/',
            syllableBreakdown: 'suh-RAK',
            partOfSpeech: 'noun',
            definition: 'A massive, unstable block or column of glacial ice formed by intersecting crevasses.',
            tacticalAnalogy: 'A skyscraper made of fragile blue ice that can topple over at any moment without warning as the glacier creeps downward!',
            sampleUsage: 'The climbers moved swiftly beneath the precarious hanging serac.'
          }
        ]
      },
      {
        id: 'sc-2',
        text: 'Below their trembling boots yawned a bottomless crevasse whose icy blue walls vanished into sheer darkness.',
        vocabularyWords: [
          {
            word: 'crevasse',
            phonetic: '/krəˈvæs/',
            syllableBreakdown: 'kri-VAS',
            partOfSpeech: 'noun',
            definition: 'A deep, narrow opening or fracture in a glacier or ice sheet.',
            tacticalAnalogy: 'A gigantic canyon crack in the ice shelf deep enough to swallow a five-story building whole!',
            sampleUsage: 'The expedition carefully probed snow bridges to avoid falling into a hidden crevasse.'
          }
        ]
      },
      {
        id: 'sc-3',
        text: 'To reach the safety of the upper snowfield, they had to cross a precipitous ridge lashed by howling sixty-mile-per-hour gusts.',
        vocabularyWords: [
          {
            word: 'precipitous',
            phonetic: '/prɪˈsɪpɪtəs/',
            syllableBreakdown: 'pri-SIP-i-tuhs',
            partOfSpeech: 'adjective',
            definition: 'Dangerously high, steep, or abrupt.',
            tacticalAnalogy: 'A knife-edge mountain ledge where one slip drops straight down thousands of feet on both sides!',
            sampleUsage: 'They scrambled up the precipitous rock face with total concentration.'
          }
        ]
      },
      {
        id: 'sc-4',
        text: 'Sharpened steel crampons bit securely into the crusty blue ice, granting the lead climber vital traction.',
        vocabularyWords: [
          {
            word: 'crampon',
            phonetic: '/ˈkræmpɒn/',
            syllableBreakdown: 'KRAM-pon',
            partOfSpeech: 'noun',
            definition: 'A metal plate with spiked points fixed to a boot for walking and climbing on ice or hard snow.',
            tacticalAnalogy: 'Steel spiked claws strapped to the soles of your boots that bite into sheer ice like mountain tiger claws!',
            sampleUsage: 'She kicked her front crampons firmly into the frozen waterfall.'
          }
        ]
      },
      {
        id: 'sc-5',
        text: 'Maintaining physical and mental equilibrium was critical as the lightweight ladder flexed over the abyss.',
        vocabularyWords: [
          {
            word: 'equilibrium',
            phonetic: '/ˌiːkwɪˈlɪbriəm/',
            syllableBreakdown: 'ee-kwi-LIB-ree-um',
            partOfSpeech: 'noun',
            definition: 'A state of physical balance, stability, or emotional poise under pressure.',
            tacticalAnalogy: 'Perfect balance in body and mind—like staying centered on a narrow surfboard or tightrope while the wind tries to knock you sideways.',
            sampleUsage: 'Gymnasts and sailors rely on razor-sharp equilibrium to maintain poise during motion.'
          }
        ]
      },
      {
        id: 'sc-6',
        text: 'The audacious decision to make a predawn sprint allowed the team to cross before solar heat triggered massive avalanches.',
        vocabularyWords: [
          {
            word: 'audacious',
            phonetic: '/ɔːˈdeɪʃəs/',
            syllableBreakdown: 'aw-DAY-shus',
            partOfSpeech: 'adjective',
            definition: 'Showing a willingness to take bold, surprisingly fearless risks.',
            tacticalAnalogy: 'A daring, high-stakes move that catches everyone off guard because it requires fearless conviction!',
            sampleUsage: 'The team pulled off an audacious ascent of the unclimbed north face.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'sc-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Alpine Risk & Timing Strategy',
        question: 'Why do elite mountaineering teams choose to cross dangerous seracs and glaciers at 3:00 AM in freezing darkness rather than in comfortable daylight?',
        mentorContext: 'Glaciology, thermal expansion, and avalanche mitigation.',
        probingQuestions: [
          'What happens to ice bridges and serac structures when the morning sun warms them?',
          'How does sub-zero night temperature act like biological glue for unstable ice?'
        ],
        keyTacticalInsights: [
          'Sub-zero nighttime temperatures freeze meltwater, locking unstable seracs and snow bridges in place.',
          'Sunlight triggers thermal expansion and melting, vastly increasing rockfall and avalanche danger.'
        ]
      },
      {
        id: 'sc-debrief-2',
        category: 'character_motive',
        categoryLabel: 'Team Psychology & The Rope Link',
        question: 'When climbers are tied together on a single rope across a crevasse, how does the psychology of accountability change how each person steps?',
        mentorContext: 'The alpine rope team pact where one person\'s mistake puts the entire team on the line.',
        probingQuestions: [
          'How does knowing your partner holds your life in their belay stance change your focus?',
          'Why is trust and rhythmic breathing so contagious in high-altitude teams?'
        ],
        keyTacticalInsights: [
          'The rope creates shared destiny; every step is calculated not just for self, but for teammates.',
          'Clear verbal calls ("Rope tight!", "Moving!") build unstoppable collective composure.'
        ]
      }
    ]
  },
  {
    id: 'lava-falls-whitewater',
    title: 'The Lava Falls Cataract',
    subtitle: 'High-Volume Class-V Rapid on the Colorado River',
    category: 'oceanic',
    lexileLevel: '910L (Grade 6-7)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Staring down the most notorious whitewater rapid in North America. Thirty-seven feet of vertical river drop through volcanic boulders, violent recirculating holes, and chaotic whirlpools that test Mikaela\'s tactical river-reading skills.',
    coverGradient: 'from-amber-950 via-red-950 to-stone-900',
    accentColor: '#fbbf24',
    sentences: [
      {
        id: 'lf-1',
        text: 'The deafening roar of the cataract echoed against three-billion-year-old canyon walls, shaking the riverbed beneath their raft.',
        vocabularyWords: [
          {
            word: 'cataract',
            phonetic: '/ˈkætərækt/',
            syllableBreakdown: 'KAT-uh-rakt',
            partOfSpeech: 'noun',
            definition: 'A large, powerful, and turbulent waterfall or deluge of rushing water.',
            tacticalAnalogy: 'A massive wall of rushing white water and vertical drops that turns a river into a roaring, thundering avalanche of liquid energy!',
            sampleUsage: 'The roar of the cataract could be heard miles upstream.'
          }
        ]
      },
      {
        id: 'lf-2',
        text: 'At the river\'s center lurked a monstrous hydraulic hole capable of trapping an eighteen-foot expedition boat in its recirculating backwash.',
        vocabularyWords: [
          {
            word: 'hydraulic',
            phonetic: '/haɪˈdrɔːlɪk/',
            syllableBreakdown: 'hy-DRAW-lik',
            partOfSpeech: 'noun',
            definition: 'A powerful river feature formed where water pours over an obstacle and creates a reverse upstream recirculating wave.',
            tacticalAnalogy: 'A river\'s washing machine! Water drops over a ledge and rushes backward, creating a boiling trap that holds boats tight if you lose forward drive.',
            sampleUsage: 'The guide pulled hard on the left oar to punch through the foaming hydraulic.'
          }
        ]
      },
      {
        id: 'lf-3',
        text: 'It was imperative that the bow paddlers maintain maximum forward momentum to punch through the boiling wave crest.',
        vocabularyWords: [
          {
            word: 'imperative',
            phonetic: '/ɪmˈpɛrətɪv/',
            syllableBreakdown: 'im-PAIR-uh-tiv',
            partOfSpeech: 'adjective',
            definition: 'Of vital importance; absolutely crucial and non-negotiable.',
            tacticalAnalogy: 'A mission-critical action you must execute without hesitation—like setting the mainsheet during a sudden knockdown!',
            sampleUsage: 'It is imperative that all crew wear their life vests before launching.'
          }
        ]
      },
      {
        id: 'lf-4',
        text: 'Swirling eddies spun near the volcanic ledge, threatening to pull their stern into an unpredictable vortex.',
        vocabularyWords: [
          {
            word: 'vortex',
            phonetic: '/ˈvɔːrtɛks/',
            syllableBreakdown: 'VOR-teks',
            partOfSpeech: 'noun',
            definition: 'A spinning mass of water or air that pulls objects toward its swirling center; a whirlpool.',
            tacticalAnalogy: 'A spinning whirlpool drain in the river where conflicting currents spin like a top, sucking down whatever passes by.',
            sampleUsage: 'The kayak spun three times in the vortex before escaping into the main flow.'
          }
        ]
      },
      {
        id: 'lf-5',
        text: 'With tenacious grit and synchronized strokes, the crew burst into the calm tailwaters, victorious against the river\'s fury.',
        vocabularyWords: [
          {
            word: 'tenacious',
            phonetic: '/təˈneɪʃəs/',
            syllableBreakdown: 'tuh-NAY-shus',
            partOfSpeech: 'adjective',
            definition: 'Holding fast; persistent, stubborn, and refusing to surrender under pressure.',
            tacticalAnalogy: 'Like an athlete who refuses to let go of the championship trophy, digging in with every ounce of muscle until the finish line is crossed!',
            sampleUsage: 'Her tenacious defense stopped the opposing team in the final seconds.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'lf-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'River Reading & Hydraulic Dynamics',
        question: 'Why did the guide instruct paddlers to accelerate directly toward the biggest foaming hydraulic wave instead of trying to steer around it into calmer-looking water?',
        mentorContext: 'River hydrodynamics and angle of attack.',
        probingQuestions: [
          'What happens if you hit a hydraulic sideways with zero forward momentum?',
          'Why does speed create stability in heavy whitewater?'
        ],
        keyTacticalInsights: [
          'Hitting a hole perpendicular with speed pierces the backward recirculating foam, whereas trying to skirt around it risks getting flipped sideways (t-boned).',
          'Calm-looking water in a rapid often disguises shallow undercut rocks or siphon traps.'
        ]
      },
      {
        id: 'lf-debrief-2',
        category: 'strategic_prediction',
        categoryLabel: 'Equipment Inspection & Downstream Readiness',
        question: 'The moment you exit a Class-V rapid, why is doing an instant gear check and bail check more critical than celebrating?',
        mentorContext: 'Expedition safety protocols in remote wilderness canyons.',
        probingQuestions: [
          'What happens if another rapid is around the next canyon bend and the boat is full of thousands of pounds of water?',
          'Why does waterlogged weight destroy boat maneuverability?'
        ],
        keyTacticalInsights: [
          'A water-filled raft acts like a barge and cannot turn; bailing water restores quick agility before the next drop.',
          'Confirming no gear was ripped loose keeps survival food and medical kits intact.'
        ]
      }
    ]
  }
];
