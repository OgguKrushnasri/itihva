import { NPCData, CollectibleItem, Mission, Badge, Artifact, GameProgress, PlayerCustomization } from '../types';

export const INITIAL_PLAYER_CUSTOMIZATION: PlayerCustomization = {
  name: 'Aarav',
  outfit: 'adventurer_kurta',
  outfitColor: '#e06d10', // Saffron Ochre
  accentColor: '#1e3a8a', // Royal Indigo
  hairStyle: 'tied_topknot',
  turbanColor: '#d97706',
  skinTone: '#9a6b49', // Warm wheatish Indian skin tone
};

export const INITIAL_GAME_PROGRESS: GameProgress = {
  currentMissionIndex: 0,
  completedMissions: [],
  inventory: [],
  badges: [],
  unlockedArtifacts: ['terracotta_pot'],
  rangoliScore: 0,
  potteryScore: 0,
  wasteCollectedCount: 0,
  pillarsAligned: [false, false, false],
  templeDoorUnlocked: false,
  stepwellChestOpened: false,
  finalArtifactFound: false,
};

export const NPCS: NPCData[] = [
  {
    id: 'farmer_ramu',
    name: 'Farmer Ramu',
    role: 'Traditional Agriculturist',
    zone: 'village',
    position: [-22, 0, 18],
    rotation: Math.PI / 4,
    skinTone: '#8d5b38',
    clothingColor: '#fef08a', // Light yellow kurta
    clothingSecondary: '#b45309', // Ochre dhoti
    hairColor: '#18181b',
    hairStyle: 'turban',
    outfit: 'farmer',
    dialogueState: {
      default: [
        "Namaste, young traveler! Welcome to Bharatpur village.",
        "Here we cultivate indigenous millets like Ragi and Jowar. Our ancestors used natural neem extracts and crop rotation to keep the soil alive for millennia.",
        "Potter Madhav near the village well was looking for fine river clay. If you help him, he might guide you toward the ancient temple!"
      ],
      after_clay: [
        "Ah! You brought clay to Madhav? Splendid work! Traditional pottery keeps our village sustainable and plastic-free."
      ]
    },
    educationalFact: {
      title: "Vedic & Traditional Agriculture",
      description: "Ancient Indian agriculture (Krishi-Shastra) pioneered organic composting (Vrikshayurveda), multi-cropping, and drought-resistant millets (Shree Anna), celebrated worldwide for nutrient density.",
      category: "Agriculture"
    }
  },
  {
    id: 'potter_madhav',
    name: 'Potter Madhav',
    role: 'Master Terracotta Artisan',
    zone: 'village',
    position: [-10, 0, 24],
    rotation: -Math.PI / 3,
    skinTone: '#946342',
    clothingColor: '#78350f', // Clay brown
    clothingSecondary: '#d97706',
    hairColor: '#27272a',
    hairStyle: 'short',
    outfit: 'potter',
    dialogueState: {
      default: [
        "Greetings! I am shaping water pots (Matkas) and earthen lamps (Diyas).",
        "Earthen pottery is magical—its microporous clay allows evaporative cooling, keeping drinking water refreshing naturally without electricity!",
        "Could you collect 3 lumps of fine alluvial clay for me from around the well and riverbank? I will teach you the secret of ancient ceramics."
      ],
      has_clay: [
        "You found 3 lumps of pure riverbed clay! Wonderful!",
        "Here, take this consecrated Terracotta Vessel and my seal of craft. Now seek Elder Shanti beneath the great Banyan Tree!"
      ],
      completed: [
        "Thank you! Feel free to practice on my pottery wheel anytime to test your craftsmanship."
      ]
    },
    educationalFact: {
      title: "Harappan & Terracotta Heritage",
      description: "Indian terracotta pottery dates back over 5,000 years to the Indus Valley Civilization. Earthen vessels provide natural alkaline mineralization and chemical-free thermal regulation.",
      category: "Handicraft"
    }
  },
  {
    id: 'elder_shanti',
    name: 'Elder Shanti',
    role: 'Village Panchayat Elder',
    zone: 'village',
    position: [-4, 0, 8],
    rotation: 0,
    skinTone: '#a17252',
    clothingColor: '#ffffff', // White khadi saree with maroon border
    clothingSecondary: '#991b1b',
    hairColor: '#e4e4e7', // Silver grey
    hairStyle: 'elder_hair',
    outfit: 'saree',
    dialogueState: {
      default: [
        "Ayushman Bhava, child. You sit beneath the sacred Banyan tree (Vatavriksha).",
        "For centuries, Indian villages practiced democratic consensus under this sacred shade. We resolve disputes with harmony (Dharma) and respect for all living beings.",
        "Take this Sacred Copper Temple Seal. The grand Mandapa of the Mahamandapa Temple awaits you to the east. Speak to Pandit Devendra!"
      ],
      after_blessing: [
        "Walk the path of righteousness. Remember, the true treasure of Bharat lies not in gold, but in timeless wisdom."
      ]
    },
    educationalFact: {
      title: "The Banyan Tree & Panchayat Democracy",
      description: "The Banyan tree (Ficus benghalensis) symbolizes eternal life and shelter. In ancient India, Sabha and Samiti gathered beneath its branches for community governance and philosophical debates.",
      category: "Tradition"
    }
  },
  {
    id: 'weaver_lakshmi',
    name: 'Weaver Lakshmi',
    role: 'Handloom & Textile Artist',
    zone: 'village',
    position: [-18, 0, 6],
    rotation: Math.PI / 2,
    skinTone: '#9c6a46',
    clothingColor: '#059669', // Emerald green handloom
    clothingSecondary: '#f59e0b',
    hairColor: '#18181b',
    hairStyle: 'long_braid',
    outfit: 'saree',
    dialogueState: {
      default: [
        "Namaskaram! Notice the intricate motifs on this handloom weave?",
        "Indian textiles like Chanderi, Kanjeevaram, and Khadi use natural dyes from turmeric, indigo, and madder roots.",
        "Every geometric motif represents cosmic order and nature's harmony. Even the Rangoli art in the courtyard follows this sacred symmetry!"
      ]
    },
    educationalFact: {
      title: "Ancient Indian Textiles & Natural Dyes",
      description: "India was the textile capital of the ancient world. The Romans traded gold for Indian fine Muslin and Calico. Indigo dyeing and block printing techniques originated along the Indus and Ganges.",
      category: "Handicraft"
    }
  },
  {
    id: 'temple_guide_devendra',
    name: 'Pandit Devendra',
    role: 'Temple Custodian & Scholar',
    zone: 'temple',
    position: [24, 0, 10],
    rotation: -Math.PI / 2,
    skinTone: '#8c5936',
    clothingColor: '#ea580c', // Saffron dhoti
    clothingSecondary: '#fbbf24', // Gold border angavastram
    hairColor: '#27272a',
    hairStyle: 'bun',
    outfit: 'priest',
    dialogueState: {
      default: [
        "Om Shanti! Welcome to the Mahamandapa of the Sun Temple.",
        "This temple's architectural geometry follows the Vastu Purusha Mandala—aligning stone pillars with solstices and celestial alignments.",
        "To open the inner sanctum (Garbhagriha), you must examine the 3 Sacred Pillars: The Dharma Wheel, The Lotus of Purity, and The Eternal Knot. Interact with each pillar to align its resonance!"
      ],
      pillars_aligned: [
        "The ancient stone lock has shifted! The hidden sanctum door is now unlocked. Enter and retrieve the Brass Key of the Rashtrakutas!"
      ],
      completed: [
        "You possess the wisdom of the stones. Now proceed northeast into the sacred Narmada Forest to meet Forest Guide Aranya."
      ]
    },
    educationalFact: {
      title: "Temple Architecture & Vastu Shastra",
      description: "Indian temple architecture (Nagara in North, Dravida in South, Vesara in Deccan) integrates advanced seismic stone interlocking without mortar, acoustic rock chambers, and cosmic geometric ratios.",
      category: "Architecture"
    }
  },
  {
    id: 'forest_guide_aranya',
    name: 'Aranya',
    role: 'Sacred Forest Ranger',
    zone: 'forest',
    position: [28, 0, -22],
    rotation: Math.PI * 0.8,
    skinTone: '#835433',
    clothingColor: '#15803d', // Forest green
    clothingSecondary: '#ca8a04',
    hairColor: '#1c1917',
    hairStyle: 'short',
    outfit: 'ranger',
    dialogueState: {
      default: [
        "Welcome to the Sacred Grove (Devarakadu). Our ancestors preserved entire forests as sanctuaries where no axe could strike.",
        "Careless travelers left discarded waste near the river and waterfall banks. It threatens the spotted deer and golden mahseer fish!",
        "Please collect 5 pieces of waste along the river and waterfall trail, and plant 2 native Neem/Peepal saplings in the soil plots."
      ],
      cleared: [
        "The river flows crystal clear again, and the sacred saplings take root! Thank you for upholding nature stewardship (Prakriti Raksha).",
        "Take this Ancient Water Divining Stone. It will guide you down the architectural Stepwell (Baoli) hidden behind the waterfall!"
      ]
    },
    educationalFact: {
      title: "Sacred Groves & Ancient Ecology",
      description: "India's traditional Sacred Groves (Deorais/Kavus) are indigenous biodiversity reserves preserved for over 2,000 years, protecting endangered medicinal flora and critical groundwater aquifers.",
      category: "Nature"
    }
  }
];

export const COLLECTIBLES: CollectibleItem[] = [
  // Clay lumps in village
  {
    id: 'clay_1',
    name: 'Fine Alluvial Clay',
    type: 'clay',
    position: [-8, 0.4, 28],
    zone: 'village',
    description: 'Silky, mineral-rich riverbed clay ideal for shaping terracotta pottery.',
    educationalNote: 'Traditional potters age river clay in moist subterranean pits to enhance plasticity.',
    collected: false,
    color: '#9a3412'
  },
  {
    id: 'clay_2',
    name: 'Fine Alluvial Clay',
    type: 'clay',
    position: [-16, 0.4, 32],
    zone: 'village',
    description: 'Porous terracotta clay harvested from the seasonal irrigation canal.',
    educationalNote: 'Terracotta (baked earth) is completely biodegradable and naturally non-toxic.',
    collected: false,
    color: '#9a3412'
  },
  {
    id: 'clay_3',
    name: 'Fine Alluvial Clay',
    type: 'clay',
    position: [-26, 0.4, 22],
    zone: 'village',
    description: 'Dark reddish clay packed with iron oxide minerals.',
    educationalNote: 'Iron oxides give traditional Indian clay pottery its signature warm terracotta hue when fired.',
    collected: false,
    color: '#9a3412'
  },

  // Environmental Waste in Forest
  {
    id: 'waste_1',
    name: 'Discarded Plastic Wrapper',
    type: 'waste',
    position: [18, 0.3, -16],
    zone: 'forest',
    description: 'Non-biodegradable debris threatening river wildlife.',
    educationalNote: 'Clean rivers preserve India\'s endangered Gangetic dolphins and aquatic ecosystems.',
    collected: false,
    color: '#ef4444'
  },
  {
    id: 'waste_2',
    name: 'Rusted Iron Can',
    type: 'waste',
    position: [34, 0.3, -30],
    zone: 'forest',
    description: 'Industrial waste discarded near the waterfall pool.',
    educationalNote: 'Water stewardship (Jal Shakti) has been a cornerstone of Indian civilization since Harappan reservoir engineering.',
    collected: false,
    color: '#f97316'
  },
  {
    id: 'waste_3',
    name: 'Discarded Polybag',
    type: 'waste',
    position: [10, 0.3, -28],
    zone: 'forest',
    description: 'Plastic litter blocking a natural spring feeder.',
    educationalNote: 'Replacing single-use plastic with biodegradable banana leaves (Pattal) was standard practice across India.',
    collected: false,
    color: '#e11d48'
  },
  {
    id: 'waste_4',
    name: 'Discarded Container',
    type: 'waste',
    position: [42, 0.3, -18],
    zone: 'forest',
    description: 'Debris left near the sacred Peepal tree shrine.',
    educationalNote: 'Peepal trees release oxygen around the clock and are revered in Buddhist and Vedic traditions.',
    collected: false,
    color: '#ef4444'
  },
  {
    id: 'waste_5',
    name: 'Discarded Bottle',
    type: 'waste',
    position: [25, 0.3, -38],
    zone: 'forest',
    description: 'Plastic bottle polluting the waterfall basin.',
    educationalNote: 'Ancient water bodies were protected by community-managed Devasthanam councils.',
    collected: false,
    color: '#f43f5e'
  },

  // Saplings
  {
    id: 'sapling_1',
    name: 'Medicinal Neem Sapling',
    type: 'sapling',
    position: [22, 0.4, -20],
    zone: 'forest',
    description: 'Azadirachta indica (Neem), renowned as the village pharmacy of India.',
    educationalNote: 'Neem leaves are natural antibacterial agents, pesticides, and air purifiers.',
    collected: false,
    color: '#22c55e'
  },
  {
    id: 'sapling_2',
    name: 'Sacred Tulsi & Peepal Sprout',
    type: 'sapling',
    position: [38, 0.4, -26],
    zone: 'forest',
    description: 'Sacred flora known for high environmental resilience and medicinal vitality.',
    educationalNote: 'Tulsi (Holy Basil) purifies indoor air and strengthens human immunity.',
    collected: false,
    color: '#10b981'
  },

  // Key & Secrets
  {
    id: 'temple_brass_key',
    name: 'Brass Key of the Rashtrakutas',
    type: 'key',
    position: [38, 1.2, 16],
    zone: 'temple',
    description: 'An intricately carved brass key bearing the emblem of the Solar Chariot.',
    educationalNote: 'Medieval Indian metallurgy produced corrosion-resistant brass, bell-metal, and Wootz steel.',
    collected: false,
    color: '#fbbf24'
  }
];

export const MISSIONS: Mission[] = [
  {
    id: 'mission_village_potter',
    title: '1. The Artisan’s Earth',
    zone: 'village',
    brief: 'Help Potter Madhav gather 3 lumps of fine river clay in Bharatpur village.',
    description: 'Explore the village paths around the water well and fields to collect 3 alluvial clay lumps. Deliver them to Potter Madhav to learn about sustainable terracotta heritage.',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_potter_apprentice',
    rewardItem: 'Terracotta Cooling Vessel',
    nextMissionId: 'mission_temple_sanctum',
    hint: 'Look for gleaming reddish-brown clay piles near the village well and canal paths.',
    targetPosition: [-10, 0, 24]
  },
  {
    id: 'mission_temple_sanctum',
    title: '2. Whispers of the Mahamandapa',
    zone: 'temple',
    brief: 'Seek Pandit Devendra at the Sun Temple and align the 3 Sacred Stone Pillars.',
    description: 'Walk east to the grand carved temple. Talk to Pandit Devendra and interact with the three sacred pillars (Dharma, Satya, Ahimsa) to unlock the secret sanctum chamber.',
    targetCount: 3,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_temple_scholar',
    rewardItem: 'Brass Key of the Rashtrakutas',
    nextMissionId: 'mission_forest_conservation',
    hint: 'Step up the temple stairs and press [E] near the 3 glowing carved stone pillars.',
    targetPosition: [24, 0, 10]
  },
  {
    id: 'mission_forest_conservation',
    title: '3. Sacred Grove Restoration',
    zone: 'forest',
    brief: 'Clean the riverbanks (5 waste items) and plant 2 sacred saplings with Ranger Aranya.',
    description: 'Travel north-east along the river trail. Clean up discarded litter near the stream and plant native medicinal saplings to restore the sacred waterfall grove.',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_nature_guardian',
    rewardItem: 'Water Divining Talisman',
    nextMissionId: 'mission_stepwell_treasure',
    hint: 'Follow the rushing river sounds into the lush forest and look for bright red litter items.',
    targetPosition: [28, 0, -22]
  },
  {
    id: 'mission_stepwell_treasure',
    title: '4. The Stepwell (Baoli) Mystery',
    zone: 'stepwell',
    brief: 'Explore the subterranean stepwell and unlock the ancient Heritage Vault Chest.',
    description: 'Descend the geometric subterranean steps of the ancient Baoli. Use the Brass Key found in the temple to unlock the stone chest and recover the Royal Heritage Seal.',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_stepwell_master',
    rewardItem: 'Royal Ashokan Seal Fragment',
    nextMissionId: 'mission_cultural_rangoli',
    hint: 'Look for the stone archway behind the waterfall leading down into the subterranean Baoli.',
    targetPosition: [-16, 0, -32]
  },
  {
    id: 'mission_cultural_rangoli',
    title: '5. The Sacred Mandala (Rangoli Activity)',
    zone: 'village',
    brief: 'Complete the traditional geometric Rangoli design in the village courtyard.',
    description: 'Return to the village courtyard near Elder Shanti and participate in the sacred art of Kolam/Rangoli using natural colored powders to welcome prosperity and harmony.',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_rangoli_artist',
    rewardItem: 'Master Artisan Garland',
    nextMissionId: 'mission_grand_discovery',
    hint: 'Approach the colorful sacred courtyard platform in the village center to begin the Rangoli activity.',
    targetPosition: [-4, 0, 8]
  },
  {
    id: 'mission_grand_discovery',
    title: '6. The Surya Chakra Awakening',
    zone: 'temple',
    brief: 'Assemble the ancient artifacts at the Sun Temple altar to unveil the Grand Heritage Discovery!',
    description: 'Carry all collected seals and cultural badges to the grand central altar of the Sun Temple. Witness the awakening of the Golden Konark Surya Chakra and complete your journey.',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    rewardBadge: 'badge_itihva_champion',
    rewardItem: 'Golden Surya Chakra of Konark',
    hint: 'Head to the high sanctum altar inside the Sun Temple courtyard.',
    targetPosition: [36, 0, 14]
  }
];

export const BADGES: Badge[] = [
  {
    id: 'badge_potter_apprentice',
    name: 'Mitti ka Mitra',
    title: 'Friend of the Earth',
    description: 'Mastered the sustainable science of Vedic terracotta ceramics and village craftsmanship.',
    icon: '🏺',
    category: 'Artisan'
  },
  {
    id: 'badge_temple_scholar',
    name: 'Vastu Vidwan',
    title: 'Scholar of Sacred Architecture',
    description: 'Decoded the astronomical alignments and interlocking stone secrets of ancient Indian temples.',
    icon: '🛕',
    category: 'Heritage'
  },
  {
    id: 'badge_nature_guardian',
    name: 'Prakriti Rakshak',
    title: 'Guardian of Sacred Groves',
    description: 'Restored the pristine flow of sacred streams and planted indigenous medicinal flora.',
    icon: '🌿',
    category: 'Ecology'
  },
  {
    id: 'badge_stepwell_master',
    name: 'Baoli Explorer',
    title: 'Master of Subterranean Water Architecture',
    description: 'Unraveled the geometric stepwell riddles built by ancient Indian civil engineers.',
    icon: '🗝️',
    category: 'Explorer'
  },
  {
    id: 'badge_rangoli_artist',
    name: 'Kala Ratna',
    title: 'Gem of Traditional Arts',
    description: 'Created a harmonious 8-fold symmetrical Rangoli using eco-friendly natural pigments.',
    icon: '🎨',
    category: 'Artisan'
  },
  {
    id: 'badge_village_guest',
    name: 'Ghar ka Mehmaan',
    title: 'Guest of the Heritage Home',
    description: 'Visited the authentic village home, opened the traditional doorway, and learned about eco-friendly rural living.',
    icon: '🏡',
    category: 'Village'
  },
  {
    id: 'badge_culinary_heritage',
    name: 'Rasoi Kala Vidwan',
    title: 'Scholar of Indian Kitchen Traditions',
    description: 'Examined time-tested utensils: pure brass Thali dinnerware, mud Chulha stoves, and granite Sil-Batta spice grinders.',
    icon: '🥘',
    category: 'Village'
  },
  {
    id: 'badge_well_guardian',
    name: 'Jal Mitra',
    title: 'Guardian of Village Wells',
    description: 'Drew clean cool groundwater using the traditional wooden pulley and rope mechanism.',
    icon: '🪣',
    category: 'Ecology'
  },
  {
    id: 'badge_heritage_blessing',
    name: 'Surya Ashirwad',
    title: 'Deity Blessing of Radiance',
    description: 'Offered prayers and pranam at the inner sanctum to the sacred Surya Dev deity idol.',
    icon: '☀️',
    category: 'Heritage'
  },
  {
    id: 'badge_itihva_champion',
    name: 'Itihva Maha-Yatri',
    title: 'Grand Heritage Discoverer',
    description: 'Completed the full exploration of Bharat’s timeless civilization, architecture, and living heritage.',
    icon: '🏆',
    category: 'Champion'
  }
];

export const ARTIFACTS: Artifact[] = [
  {
    id: 'ashoka_pillar',
    name: 'Lion Capital of Ashoka',
    hindiName: 'अशोक स्तम्भ',
    era: 'c. 250 BCE (Maurya Empire)',
    location: 'Sarnath, Uttar Pradesh',
    description: 'Carved from a single block of polished Chunar sandstone, featuring four Asiatic lions standing back to back symbolizing courage, power, and universal peace.',
    significance: 'The Ashoka Chakra with 24 spokes at the base represents the eternal Wheel of Dharma and is the centerpiece of the Indian National Flag.',
    unlocked: true,
    modelType: 'ashoka_pillar'
  },
  {
    id: 'sun_temple_wheel',
    name: 'Konark Sun Wheel (Surya Chakra)',
    hindiName: 'कोणार्क सूर्य चक्र',
    era: 'c. 1250 CE (Eastern Ganga Dynasty)',
    location: 'Konark, Odisha',
    description: 'Massive intricately carved stone wheel with 8 major spokes and 8 minor spokes that functions as an accurate sundial, measuring time to the exact minute.',
    significance: 'Exemplifies the pinnacle of Kalinga architectural mastery, astronomy, and stone masonry.',
    unlocked: false,
    modelType: 'sun_temple_wheel'
  },
  {
    id: 'terracotta_pot',
    name: 'Harappan Terracotta Vessel',
    hindiName: 'सिंधु-घटी मृदभांड',
    era: 'c. 2600 BCE (Indus Valley Civilization)',
    location: 'Lothal / Harappa',
    description: 'Fine wheel-turned red earthenware decorated with geometric intersecting circles, peepal leaf motifs, and natural slip glazes.',
    significance: 'Highlights the world\'s oldest continuous ceramic traditions and sustainable water storage systems.',
    unlocked: true,
    modelType: 'terracotta_pot'
  },
  {
    id: 'stepwell_arch',
    name: 'Rani ki Vav Stepwell Model',
    hindiName: 'रानी की वाव',
    era: 'c. 1063 CE (Solanki Dynasty)',
    location: 'Patan, Gujarat',
    description: 'A subterranean inverted temple honoring water sanctity with seven levels of stairs and over 500 principal sculptures.',
    significance: 'Recognized as a UNESCO World Heritage Site, showcasing advanced hydraulic water conservation.',
    unlocked: false,
    modelType: 'stepwell_arch'
  }
];
