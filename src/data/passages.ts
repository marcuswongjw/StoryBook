import { Passage } from '../types';

export const INITIAL_PASSAGES: Passage[] = [
  // --- SINGAPOREAN ADVENTURE & SAILING STORIES ---
  {
    id: 'sumatra-squall-changi',
    title: 'The Sumatra Squall at Changi',
    subtitle: 'Dinghy Regatta in the East Johor Strait',
    category: 'singapore',
    lexileLevel: '780L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'While racing off Changi Sailing Club toward Pulau Ubin, a sudden dark Sumatra squall rolls in from the horizon. Mikaela must hike hard, balance the boat, and execute a fast tack before the gust capsizes her dinghy.',
    coverGradient: 'from-cyan-950 via-teal-950 to-slate-900',
    accentColor: '#5BC0BE',
    sentences: [
      {
        id: 'sq-1',
        text: 'A fierce tropical squall suddenly swept across the water, turning the calm Johor Strait into frothing white waves.',
        vocabularyWords: [
          {
            word: 'squall',
            phonetic: '/skwɔːl/',
            syllableBreakdown: 'SKWAWL',
            partOfSpeech: 'noun',
            definition: 'A sudden, sharp increase in wind speed often bringing dark clouds and heavy rain.',
            tacticalAnalogy: 'A sudden burst of wild wind and tropical rain that hits like a freight train, knocking your sailboat sideways if you aren\'t ready!',
            sampleUsage: 'The sailors scrambled to trim their sails as the dark squall hit the bay.'
          }
        ],
        tacticalContext: 'Sudden Singapore weather shift requiring instant reaction.'
      },
      {
        id: 'sq-2',
        text: 'Mikaela leaned her entire body out over the windward gunwale to keep the small dinghy flat and fast.',
        vocabularyWords: [
          {
            word: 'gunwale',
            phonetic: '/ˈɡʌnəl/',
            syllableBreakdown: 'GUN-ull',
            partOfSpeech: 'noun',
            definition: 'The upper edge or top rail along the side of a boat.',
            tacticalAnalogy: 'The top rim of your sailboat that dips right into the splashing sea when the wind pushes the boat over!',
            sampleUsage: 'She gripped the tiller tightly while hiking out over the boat\'s gunwale.'
          }
        ],
        tacticalContext: 'Hiking technique to maintain boat speed and stability.'
      },
      {
        id: 'sq-3',
        text: 'If she lost her balance for even one second, the boat would capsize and plunge her into the warm tropical swell.',
        vocabularyWords: [
          {
            word: 'capsize',
            phonetic: '/kæpˈsaɪz/',
            syllableBreakdown: 'kap-SYZE',
            partOfSpeech: 'verb',
            definition: 'To overturn or flip upside down in the water.',
            tacticalAnalogy: 'When the wind wins the tug-of-war and flips your sailboat completely upside down in the water!',
            sampleUsage: 'Strong waves threatened to capsize the small fishing canoe.'
          }
        ]
      },
      {
        id: 'sq-4',
        text: 'Salt spray stung her eyes as she adjusted the mainsheet and checked the tension on the wire rigging.',
        vocabularyWords: [
          {
            word: 'rigging',
            phonetic: '/ˈrɪɡɪŋ/',
            syllableBreakdown: 'RIG-ing',
            partOfSpeech: 'noun',
            definition: 'The system of ropes, cables, and wires that support and control a ship\'s mast and sails.',
            tacticalAnalogy: 'The strong ropes and steel cables holding up the mast—just like the steel cables holding up a suspension bridge!',
            sampleUsage: 'Before setting sail, always inspect the rigging for worn lines.'
          }
        ]
      },
      {
        id: 'sq-5',
        text: '“Ready about!” she yelled to her crewmate, carving the bow through the wind in a crisp, sharp tack.',
        vocabularyWords: [
          {
            word: 'tack',
            phonetic: '/tæk/',
            syllableBreakdown: 'TAK',
            partOfSpeech: 'noun',
            definition: 'A sailing maneuver where the boat turns its bow through the wind so the sails switch sides.',
            tacticalAnalogy: 'Zig-zagging your boat diagonally into the wind—turning the nose across the breeze like changing directions on a skateboard!',
            sampleUsage: 'They made a quick tack to round the final racing buoy.'
          }
        ]
      },
      {
        id: 'sq-6',
        text: 'Her buoyant life vest kept her safe as the dinghy sliced through the chop, speeding toward the shelter of Changi Creek.',
        vocabularyWords: [
          {
            word: 'buoyant',
            phonetic: '/ˈbɔɪənt/',
            syllableBreakdown: 'BOY-uhnt',
            partOfSpeech: 'adjective',
            definition: 'Able to float easily on top of water or liquid.',
            tacticalAnalogy: 'Like a lightweight soccer ball that pops right back to the surface no matter how deep you push it underwater!',
            sampleUsage: 'Cork and foam are buoyant materials that float effortlessly.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'sq-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Regatta Decision',
        question: 'Why is hiking out hard over the gunwale much safer than easing the sail and letting the boat slow down in a Sumatra squall?',
        mentorContext: 'Dinghy hydrodynamics and rudder steerage in Changi waters.',
        probingQuestions: [
          'What happens to rudder control when a boat loses forward speed?',
          'How does a flat boat generate more lift through the water?'
        ],
        keyTacticalInsights: [
          'Forward speed provides water flow over the centerboard and rudder, giving the skipper steerage.',
          'Keeping the hull flat prevents the boat from slipping sideways or turtling.'
        ]
      },
      {
        id: 'sq-debrief-2',
        category: 'character_motive',
        categoryLabel: 'Communication Under Pressure',
        question: 'Why did Mikaela call out “Ready about!” before turning the boat, instead of turning in silence?',
        mentorContext: 'Crew coordination during high-speed maneuvers in tight waters.',
        probingQuestions: [
          'What could happen to her crewmate if the boom swings across without warning?',
          'How does clear communication build confidence in heavy wind?'
        ],
        keyTacticalInsights: [
          'Calling commands gives crew time to duck under the swinging boom and shift weight to the new windward side.',
          'Teamwork prevents accidental capsizes during mark roundings.'
        ]
      }
    ]
  },
  {
    id: 'southern-islands-night-race',
    title: 'The Southern Islands Night Race',
    subtitle: 'Keelboat Navigation Around St. John’s & Lazarus',
    category: 'singapore',
    lexileLevel: '800L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Racing past Lazarus Island and St. John’s Island under Singapore’s glowing Marina skyline. With strong tidal rip currents and giant cargo ships passing in the main channel, the crew must rely on sharp compass bearings and quick tactical moves.',
    coverGradient: 'from-slate-950 via-indigo-950 to-blue-950',
    accentColor: '#38bdf8',
    sentences: [
      {
        id: 'sin-1',
        text: 'The evening tide rushed between Lazarus Island and St. John’s, creating a swift and turbulent channel.',
        vocabularyWords: [
          {
            word: 'channel',
            phonetic: '/ˈtʃænəl/',
            syllableBreakdown: 'CHAN-uhl',
            partOfSpeech: 'noun',
            definition: 'A deep waterway between islands or sandbanks where boats can navigate safely.',
            tacticalAnalogy: 'A water highway running between two islands with strong rushing currents!',
            sampleUsage: 'The captain steered carefully through the narrow harbor channel.'
          }
        ]
      },
      {
        id: 'sin-2',
        text: 'Bioluminescent plankton created a glowing phosphorescent wake that shimmered behind their twin rudders.',
        vocabularyWords: [
          {
            word: 'phosphorescent',
            phonetic: '/ˌfɒsfəˈrɛsənt/',
            syllableBreakdown: 'fos-fuh-RES-uhnt',
            partOfSpeech: 'adjective',
            definition: 'Glowing softly with natural light in the dark without producing heat.',
            tacticalAnalogy: 'Like glowing blue fairy dust in the sea water every time your boat cuts through the dark night waves!',
            sampleUsage: 'The night ocean lit up with phosphorescent jellyfish.'
          }
        ]
      },
      {
        id: 'sin-3',
        text: 'The navigator watched the depth gauge closely to avoid running aground on a hidden coral shoal.',
        vocabularyWords: [
          {
            word: 'shoal',
            phonetic: '/ʃoʊl/',
            syllableBreakdown: 'SHOHL',
            partOfSpeech: 'noun',
            definition: 'A shallow sandbank, rock shelf, or coral reef that poses danger to boats.',
            tacticalAnalogy: 'An underwater coral speed bump waiting just beneath the surface to catch your boat\'s keel!',
            sampleUsage: 'Warning buoys marked the dangerous shallow shoal near the lighthouse.'
          }
        ]
      },
      {
        id: 'sin-4',
        text: 'Mika held a steady magnetic bearing toward the flashing green beacon guarding the Sisters’ Islands.',
        vocabularyWords: [
          {
            word: 'bearing',
            phonetic: '/ˈbɛərɪŋ/',
            syllableBreakdown: 'BAIR-ing',
            partOfSpeech: 'noun',
            definition: 'The direction or angle measured on a compass to guide navigation.',
            tacticalAnalogy: 'The exact compass degree or laser-focused heading you steer to reach your destination without getting lost!',
            sampleUsage: 'She took a compass bearing on the lighthouse to confirm their position.'
          }
        ]
      },
      {
        id: 'sin-5',
        text: 'A massive container ship rolled past in the fairway, throwing a rolling wake across their path.',
        vocabularyWords: [
          {
            word: 'wake',
            phonetic: '/weɪk/',
            syllableBreakdown: 'WAYK',
            partOfSpeech: 'noun',
            definition: 'The track of swirling waves left behind a moving boat or ship in the water.',
            tacticalAnalogy: 'The big trailing rolling waves created behind a speed boat or cargo ship as it barrels through the water!',
            sampleUsage: 'The small sailboat bobbed up and down in the ferry\'s wake.'
          }
        ]
      },
      {
        id: 'sin-6',
        text: 'Their clever stratagem of using the island’s lee shelter allowed them to slip into the lead just before the finish line.',
        vocabularyWords: [
          {
            word: 'stratagem',
            phonetic: '/ˈstrætədʒəm/',
            syllableBreakdown: 'STRAT-uh-jum',
            partOfSpeech: 'noun',
            definition: 'A clever plan or tactical trick used to outsmart opponents or solve a tough challenge.',
            tacticalAnalogy: 'A clever tactical chess move on the water that outsmarts the competition!',
            sampleUsage: 'Hiding behind the island was a brilliant stratagem to block the fierce headwind.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'sin-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Night Navigation',
        question: 'Why did the skipper choose to steer close to the island’s shelter rather than race straight down the wide open shipping channel?',
        mentorContext: 'Singapore Strait shipping regulations and wind shadows.',
        probingQuestions: [
          'What happens when a small boat encounters the massive wake of a container ship in the dark?',
          'How does island terrain shield boats from turbulent chop?'
        ],
        keyTacticalInsights: [
          'Staying clear of the main shipping fairway avoids collisions and dangerous vessel wakes.',
          'Using the island\'s calm lee water lets the boat maintain smoother boat speed.'
        ]
      },
      {
        id: 'sin-debrief-2',
        category: 'strategic_prediction',
        categoryLabel: 'Tidal Current Prediction',
        question: 'Knowing that the tide will reverse in thirty minutes near the Sisters’ Islands, what adjustment should the crew make for the return leg?',
        mentorContext: 'Tidal stream navigation in the Singapore Strait.',
        probingQuestions: [
          'If the current pushes against your bow, should you sail in deep water or near the shallows?',
          'How does counter-current flow along island shorelines?'
        ],
        keyTacticalInsights: [
          'When fighting an opposing tide, sailing closer to shore where friction slows the current preserves speed.',
          'Anticipating tidal shifts prevents getting swept downstream.'
        ]
      }
    ]
  },
  {
    id: 'dragon-boat-marina-bay',
    title: 'The Dragon Boat Sprint at Marina Bay',
    subtitle: 'Championship 500m Dash Under the City Skyline',
    category: 'singapore',
    lexileLevel: '790L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Twenty paddlers, one synchronized drumbeat, and five hundred meters of pure adrenaline under the Marina Bay Sands towers. Mikaela leads the pace stroke through swirling river eddies toward the finish line.',
    coverGradient: 'from-amber-950 via-red-950 to-slate-900',
    accentColor: '#fbbf24',
    sentences: [
      {
        id: 'db-1',
        text: 'The heavy wooden dragon boat surged through the water as twenty paddles struck the surface in flawless rhythm.',
        vocabularyWords: [
          {
            word: 'rhythm',
            phonetic: '/ˈrɪðəm/',
            syllableBreakdown: 'RITH-uhm',
            partOfSpeech: 'noun',
            definition: 'A strong, regular, repeated pattern of movement or sound.',
            tacticalAnalogy: 'The steady, synchronized beat of twenty paddlers moving together like a single powerful machine!',
            sampleUsage: 'The drummer kept a fast, steady rhythm for the racing team.'
          }
        ]
      },
      {
        id: 'db-2',
        text: 'Near the Helix Bridge, a swirling river eddy threatened to push their slender bow off course.',
        vocabularyWords: [
          {
            word: 'eddy',
            phonetic: '/ˈɛdi/',
            syllableBreakdown: 'ED-ee',
            partOfSpeech: 'noun',
            definition: 'A circular movement of water contrary to the main current, causing a small whirlpool.',
            tacticalAnalogy: 'A spinning loop of water where conflicting river flows curl back on themselves, trying to spin your boat!',
            sampleUsage: 'The paddlers braced their blades as they crossed the swirling eddy.'
          }
        ]
      },
      {
        id: 'db-3',
        text: 'The drummer pounded a rapid tempo to propel the heavy boat forward into the final sprint.',
        vocabularyWords: [
          {
            word: 'propel',
            phonetic: '/prəˈpɛl/',
            syllableBreakdown: 'pruh-PEL',
            partOfSpeech: 'verb',
            definition: 'To drive, push, or cause to move forward with force.',
            tacticalAnalogy: 'Using powerful paddle strokes or rocket thrust to launch your boat forward through the water!',
            sampleUsage: 'Strong leg drives propel the runner across the track.'
          }
        ]
      },
      {
        id: 'db-4',
        text: 'With tenacious energy, the crew dug deep into the churning water, refusing to yield an inch.',
        vocabularyWords: [
          {
            word: 'tenacious',
            phonetic: '/təˈneɪʃəs/',
            syllableBreakdown: 'tuh-NAY-shus',
            partOfSpeech: 'adjective',
            definition: 'Persistent, determined, and refusing to give up under tough conditions.',
            tacticalAnalogy: 'Unstoppable grit! Like an athlete who keeps sprinting with total determination all the way to the finish line.',
            sampleUsage: 'Her tenacious effort helped the team win the championship.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'db-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Teamwork & Hydrodynamics',
        question: 'Why is it better for twenty paddlers to strike at 90% power in perfect sync than at 100% power out of sync?',
        mentorContext: 'Dragon boat physics and hull resistance.',
        probingQuestions: [
          'What happens to the boat when paddles enter the water at different times?',
          'How does synchronized entry reduce hull drag?'
        ],
        keyTacticalInsights: [
          'Synchronized blades deliver peak collective acceleration while minimizing water drag and boat wobble.',
          'Mismatched timing causes the boat to check and lose glide between strokes.'
        ]
      }
    ]
  },
  {
    id: 'pulau-ubin-kayak-rescue',
    title: 'The Mangrove Kayak Rescue at Pulau Ubin',
    subtitle: 'Expedition Through Chek Jawa Coastal Estuaries',
    category: 'singapore',
    lexileLevel: '770L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Sea kayaking around the eastern tip of Pulau Ubin. When an outgoing spring tide threatens to trap a kayak on the Chek Jawa sand flats, Mikaela uses swift paddle maneuvers and tidal awareness to lead the team to safety.',
    coverGradient: 'from-emerald-950 via-teal-950 to-slate-900',
    accentColor: '#10b981',
    sentences: [
      {
        id: 'uk-1',
        text: 'The winding mangrove estuary was home to tangled roots, mudskippers, and rising tidal currents.',
        vocabularyWords: [
          {
            word: 'estuary',
            phonetic: '/ˈɛstʃuˌɛri/',
            syllableBreakdown: 'ES-choo-air-ee',
            partOfSpeech: 'noun',
            definition: 'The wide mouth of a river or tidal channel where fresh water meets the salty sea.',
            tacticalAnalogy: 'The magical mixing zone where river streams meet ocean tides among thick mangrove trees!',
            sampleUsage: 'They paddled their sea kayaks through the calm coastal estuary.'
          }
        ]
      },
      {
        id: 'uk-2',
        text: 'The rapid outgoing tide created a perilous drop in water level across the shallow sand flats.',
        vocabularyWords: [
          {
            word: 'perilous',
            phonetic: '/ˈpɛrələs/',
            syllableBreakdown: 'PAIR-uh-luhs',
            partOfSpeech: 'adjective',
            definition: 'Full of danger or risk.',
            tacticalAnalogy: 'High-risk and dangerous—like paddling over sharp submerged rocks where one mistake could leave you stranded!',
            sampleUsage: 'The explorers crossed the perilous rope bridge over the canyon.'
          }
        ]
      },
      {
        id: 'uk-3',
        text: 'Mikaela adjusted her rudder and used clean sweep strokes to navigate around the tangled root barrier.',
        vocabularyWords: [
          {
            word: 'navigate',
            phonetic: '/ˈnævɪˌɡeɪt/',
            syllableBreakdown: 'NAV-i-gayt',
            partOfSpeech: 'verb',
            definition: 'To plan, direct, and guide the course of a ship, vehicle, or path.',
            tacticalAnalogy: 'Steering your way through a tricky obstacle course on the water using maps and sharp reflexes!',
            sampleUsage: 'The skipper used nautical charts to navigate safely into the harbor.'
          }
        ]
      },
      {
        id: 'uk-4',
        text: 'With cool composure, she tossed a tow line and guided the stranded kayak back into the deep channel.',
        vocabularyWords: [
          {
            word: 'composure',
            phonetic: '/kəmˈpoʊʒər/',
            syllableBreakdown: 'kuhm-POH-zher',
            partOfSpeech: 'noun',
            definition: 'The state of being calm, focused, and in control of one\'s feelings during a challenge.',
            tacticalAnalogy: 'Staying totally calm and cool-headed when everyone else is starting to panic!',
            sampleUsage: 'The goalkeeper maintained her composure during the penalty shootout.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'uk-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tidal Risk Management',
        question: 'Why did Mikaela act immediately with a tow line instead of waiting for the tide to turn back in?',
        mentorContext: 'Chek Jawa spring tides and mudflat stranding risks.',
        probingQuestions: [
          'How many hours does it take for a low tide to rise again in Singapore?',
          'What dangers occur if a kayak gets stuck in soft mangrove mud under hot sun?'
        ],
        keyTacticalInsights: [
          'Tides take roughly six hours to return; waiting causes severe dehydration, sun exposure, and getting stuck in mud.',
          'Early intervention with a tow line prevents an emergency rescue situation.'
        ]
      }
    ]
  },

  // --- GLOBAL HIGH-STAKES ADVENTURE STORIES (TUNED FOR GRADE 6) ---
  {
    id: 'roaring-forties-jibe',
    title: 'The Roaring Forties Jibe',
    subtitle: 'Offshore Regatta Rounding Cape Horn',
    category: 'sailing',
    lexileLevel: '820L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'Skipper Elena battles strong squalls in the Southern Ocean. When a violent gust threatens to capsize their racing yacht, she must execute a fast, smooth jibe before the boat broaches against the swells.',
    coverGradient: 'from-blue-950 via-cyan-900 to-slate-900',
    accentColor: '#38bdf8',
    sentences: [
      {
        id: 'rf-1',
        text: 'A fierce Southern Ocean tempest unleashed howling thirty-knot gusts against the carbon-fiber hull.',
        vocabularyWords: [
          {
            word: 'tempest',
            phonetic: '/ˈtɛmpɪst/',
            syllableBreakdown: 'TEM-pist',
            partOfSpeech: 'noun',
            definition: 'A violent, windy storm with heavy waves or rain.',
            tacticalAnalogy: 'A monster ocean storm with giant roaring waves that test the strength of every sailor on deck!',
            sampleUsage: 'The ship sailed through the dark tempest with steady courage.'
          }
        ]
      },
      {
        id: 'rf-2',
        text: 'Cold saltwater crashed over the windward gunwale as Elena gripped the helm with total focus.',
        vocabularyWords: [
          {
            word: 'gunwale',
            phonetic: '/ˈɡʌnəl/',
            syllableBreakdown: 'GUN-ull',
            partOfSpeech: 'noun',
            definition: 'The upper edge or top rail of a boat\'s side.',
            tacticalAnalogy: 'The top rim of the boat that dips into the foaming ocean when you heel over hard!',
            sampleUsage: 'He leaned far over the gunwale to balance the boat.'
          }
        ]
      },
      {
        id: 'rf-3',
        text: 'A sudden drop on the barometer warned the crew that a second storm front was rapidly approaching.',
        vocabularyWords: [
          {
            word: 'barometer',
            phonetic: '/bəˈrɒmɪtər/',
            syllableBreakdown: 'buh-ROM-i-ter',
            partOfSpeech: 'noun',
            definition: 'An instrument measuring air pressure, used especially to forecast weather changes.',
            tacticalAnalogy: 'A weather warning gauge on your boat\'s instrument panel that tells you a big storm is coming before you can even see it!',
            sampleUsage: 'The captain checked the barometer and ordered the crew to reef the sails.'
          }
        ]
      },
      {
        id: 'rf-4',
        text: 'If the rudder slipped now, the yacht would broach and roll sideways into the trough of a massive wave.',
        vocabularyWords: [
          {
            word: 'broach',
            phonetic: '/broʊtʃ/',
            syllableBreakdown: 'BROACH',
            partOfSpeech: 'verb',
            definition: 'To accidentally turn sideways to the wind and waves, losing steering control.',
            tacticalAnalogy: 'When a big wave pushes the tail of the boat and spins you out of control sideways into the surf!',
            sampleUsage: 'The helmsman fought the wheel to prevent the yacht from broaching.'
          }
        ]
      },
      {
        id: 'rf-5',
        text: 'Elena held tight to the steel stanchion, timing her turn to surf down the face of a cresting wave.',
        vocabularyWords: [
          {
            word: 'stanchion',
            phonetic: '/ˈstænʃən/',
            syllableBreakdown: 'STAN-shun',
            partOfSpeech: 'noun',
            definition: 'An upright metal post or pillar providing support for safety lifelines.',
            tacticalAnalogy: 'The sturdy stainless steel posts along the edge of the deck you grab onto when the boat tilts!',
            sampleUsage: 'She grabbed the lifeline stanchion to steady her footing.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'rf-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Tactical Maneuver Analysis',
        question: 'Why did Elena wait to turn the boat until the exact moment they caught the crest of the wave?',
        mentorContext: 'Surfing waves and rudder control during high-speed jibes.',
        probingQuestions: [
          'What happens to rudder responsiveness when the boat surfs down a wave?',
          'Why is turning at the bottom (trough) of a wave more dangerous?'
        ],
        keyTacticalInsights: [
          'Surfing down a wave reduces apparent wind speed on the sails and makes turning much smoother and lighter.',
          'Jibing in the trough increases the risk of the bow burying into the next wall of water.'
        ]
      }
    ]
  },
  {
    id: 'karakoram-ice-ridge',
    title: 'The Karakoram Ice Ridge',
    subtitle: 'Alpine Expedition Crossing a Glacial Icefall',
    category: 'mountaineering',
    lexileLevel: '810L (Grade 6)',
    estimatedReadingTimeMinutes: 5,
    missionBrief: 'High in the snowy Karakoram mountains, a young rope team crosses an unstable glacier. Mikaela must navigate spiked crampons across a narrow ladder bridge spanning a deep ice crevasse.',
    coverGradient: 'from-slate-900 via-sky-950 to-blue-950',
    accentColor: '#6FFFE9',
    sentences: [
      {
        id: 'kr-1',
        text: 'A massive glacial serac loomed high above the team, sparkling like blue crystal in the thin mountain air.',
        vocabularyWords: [
          {
            word: 'serac',
            phonetic: '/səˈræk/',
            syllableBreakdown: 'suh-RAK',
            partOfSpeech: 'noun',
            definition: 'A large, towering block or column of glacial ice.',
            tacticalAnalogy: 'A giant tower of blue ice as tall as a building that can shift as the glacier creeps downward!',
            sampleUsage: 'The mountaineers moved quickly past the hanging serac.'
          }
        ]
      },
      {
        id: 'kr-2',
        text: 'Deep below their boots yawned a dark crevasse whose frozen blue walls seemed bottomless.',
        vocabularyWords: [
          {
            word: 'crevasse',
            phonetic: '/krəˈvæs/',
            syllableBreakdown: 'kri-VAS',
            partOfSpeech: 'noun',
            definition: 'A deep, narrow crack or opening in a glacier.',
            tacticalAnalogy: 'A giant canyon crack in the ice deep enough to swallow a bus whole!',
            sampleUsage: 'They bridged the wide crevasse using aluminum ladders.'
          }
        ]
      },
      {
        id: 'kr-3',
        text: 'Sharp steel crampons strapped to their boots gave the climbers vital grip on the sheer ice.',
        vocabularyWords: [
          {
            word: 'crampon',
            phonetic: '/ˈkræmpɒn/',
            syllableBreakdown: 'KRAM-pon',
            partOfSpeech: 'noun',
            definition: 'A spiked metal plate attached to a boot for walking or climbing on ice.',
            tacticalAnalogy: 'Spiked steel tiger claws strapped to your shoes that bite securely into hard, frozen ice!',
            sampleUsage: 'Always check that your crampons are tightly buckled before stepping on the glacier.'
          }
        ]
      },
      {
        id: 'kr-4',
        text: 'Maintaining perfect physical equilibrium was essential as the lightweight ladder flexed over the gap.',
        vocabularyWords: [
          {
            word: 'equilibrium',
            phonetic: '/ˌiːkwɪˈlɪbriəm/',
            syllableBreakdown: 'ee-kwi-LIB-ree-um',
            partOfSpeech: 'noun',
            definition: 'A state of physical balance and steady poise.',
            tacticalAnalogy: 'Rock-solid balance—like staying centered on a tightrope without tipping left or right!',
            sampleUsage: 'Gymnasts and sailors need great equilibrium to stay balanced.'
          }
        ]
      }
    ],
    debriefPrompts: [
      {
        id: 'kr-debrief-1',
        category: 'tactical_decision',
        categoryLabel: 'Alpine Team Tactics',
        question: 'Why do climbers tie into the same safety rope when crossing a crevasse ladder bridge?',
        mentorContext: 'The alpine safety link and belay arrest technique.',
        probingQuestions: [
          'What happens if the ladder slips off the ice ledge?',
          'How does keeping the rope snug save a falling climber?'
        ],
        keyTacticalInsights: [
          'The rope anchor catches any fall immediately before a climber drops into the crevasse.',
          'Shared safety creates trust and steady focus.'
        ]
      }
    ]
  }
];
