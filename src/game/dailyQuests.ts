import { DailyQuest, DailyQuestState, DailyQuestObjective, ZoneType } from '../types';

/**
 * Master Pool of Rotating Daily Exploration Quests
 * Rotates daily based on date hash to provide fresh exploration challenges.
 */
export const DAILY_QUEST_POOL: Omit<DailyQuest, 'dateKey' | 'completed'>[] = [
  {
    id: 'quest_sacred_trinity_pilgrimage',
    title: 'Sacred Trinity Pilgrimage',
    subtitle: 'Journey across the three ancient realms of Bharatpur in a single day.',
    theme: 'Heritage Exploration',
    lore: 'Ancient pilgrims traversed sacred geography connecting community elders, temple mandapas, and forest groves in reverence of nature and wisdom.',
    icon: '🕉️',
    difficulty: 'Easy',
    rewardXp: 250,
    rewardTitle: 'Vedic Wayfarer Seal',
    rewardBadgeId: 'badge_daily_pilgrim',
    objectives: [
      {
        id: 'visit_banyan_shrine',
        text: 'Pay respects at the Great Sacred Banyan Tree in Bharatpur Village',
        targetZone: 'village',
        targetPosition: [-4, 0, 8],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'banyan_tree'
      },
      {
        id: 'visit_sun_temple_altar',
        text: 'Reach the high sanctum of the Mahamandapa Sun Temple',
        targetZone: 'temple',
        targetPosition: [32, 0, 12],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'temple_altar'
      },
      {
        id: 'visit_narmada_waterfall',
        text: 'Drink from the misty waterfall banks in the Sacred Narmada Forest',
        targetZone: 'forest',
        targetPosition: [28, 0, -32],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'forest_waterfall'
      }
    ]
  },
  {
    id: 'quest_hydraulic_baoli_survey',
    title: 'Hydraulic Architecture Survey',
    subtitle: 'Inspect the underground engineering of the ancient Subterranean Baoli.',
    theme: 'Engineering & Hydrology',
    lore: 'Stepwells (Vavs/Baolis) were subterranean marvels combining passive microclimate cooling, groundwater recharge, and carved pavilions.',
    icon: '🏛️',
    difficulty: 'Medium',
    rewardXp: 300,
    rewardTitle: 'Jal-Sthapati Surveyor Seal',
    rewardBadgeId: 'badge_daily_hydrologist',
    objectives: [
      {
        id: 'descend_stepwell_steps',
        text: 'Descend to the deep water reservoir of the Stepwell (Baoli)',
        targetZone: 'stepwell',
        targetPosition: [-16, 0, -32],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'stepwell_pool'
      },
      {
        id: 'inspect_village_well',
        text: 'Examine the community pulley well in the Village Square',
        targetZone: 'village',
        targetPosition: [-14, 0, 22],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'village_well'
      },
      {
        id: 'cross_narmada_bridge',
        text: 'Cross the wooden arch bridge over the forest river',
        targetZone: 'forest',
        targetPosition: [21, 0, -14],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'river_bridge'
      }
    ]
  },
  {
    id: 'quest_panchayat_wisdom_trail',
    title: 'Panchayat & Artisan Dialogue',
    subtitle: 'Converse with the custodians of traditional knowledge.',
    theme: 'Culture & Oral Traditions',
    lore: 'Oral history in ancient Bharat preserved astronomy, textile geometry, and sustainable soil stewardship across generations.',
    icon: '📜',
    difficulty: 'Easy',
    rewardXp: 275,
    rewardTitle: 'Shastri Disciple Seal',
    rewardBadgeId: 'badge_daily_scholar',
    objectives: [
      {
        id: 'talk_farmer_ramu',
        text: 'Learn about millet crop rotation from Farmer Ramu',
        targetZone: 'village',
        targetPosition: [-22, 0, 18],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'interact_npc',
        targetId: 'farmer_ramu'
      },
      {
        id: 'talk_weaver_lakshmi',
        text: 'Discuss sacred geometry and natural dye weaves with Weaver Lakshmi',
        targetZone: 'village',
        targetPosition: [-18, 0, 6],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'interact_npc',
        targetId: 'weaver_lakshmi'
      },
      {
        id: 'talk_priest_devendra',
        text: 'Inquire about Vastu Shastra stone interlocking with Pandit Devendra',
        targetZone: 'temple',
        targetPosition: [24, 0, 10],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'interact_npc',
        targetId: 'temple_guide_devendra'
      }
    ]
  },
  {
    id: 'quest_vastu_solar_resonance',
    title: 'Solar Meridian Resonance',
    subtitle: 'Attune the sacred temple bells and align with the cosmic solar axis.',
    theme: 'Astronomy & Acoustics',
    lore: 'Konark and Modhera Sun temples were calculated so dawn rays illuminated the inner garbhagriha during equinoxes, accompanied by tuned bronze bells.',
    icon: '🔔',
    difficulty: 'Medium',
    rewardXp: 320,
    rewardTitle: 'Surya Archana Seal',
    rewardBadgeId: 'badge_daily_astronomer',
    objectives: [
      {
        id: 'ring_temple_bell',
        text: 'Ring the sacred bronze Ghanta bell at the Sun Temple entrance',
        targetZone: 'temple',
        targetPosition: [18, 0, 10],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'ring_bell',
        targetId: 'temple_bell'
      },
      {
        id: 'inspect_sun_wheel',
        text: 'Stand before the 24-spoked Cosmic Sun Wheel at the high altar',
        targetZone: 'temple',
        targetPosition: [32, 0, 12],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'grand_altar'
      },
      {
        id: 'visit_temple_carvings',
        text: 'Examine the carved stone pillars in the Mahamandapa hall',
        targetZone: 'temple',
        targetPosition: [26, 0, 14],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'temple_pillars'
      }
    ]
  },
  {
    id: 'quest_sacred_ecology_ranger',
    title: 'Sacred Grove Conservation Patrol',
    subtitle: 'Scout the lush biodiversity and ancient Peepal shrine along the Narmada.',
    theme: 'Environmental Stewardship',
    lore: 'Devarakadus (Sacred Groves) are virgin forest tracts protected for centuries by indigenous communities as bio-reserves for medicinal herbs and fresh aquifers.',
    icon: '🌿',
    difficulty: 'Medium',
    rewardXp: 350,
    rewardTitle: 'Van-Riksha Guardian Seal',
    rewardBadgeId: 'badge_daily_ecologist',
    objectives: [
      {
        id: 'consult_ranger_aranya',
        text: 'Meet Forest Guide Aranya under the canopy near the riverbank',
        targetZone: 'forest',
        targetPosition: [28, 0, -22],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'interact_npc',
        targetId: 'forest_guide_aranya'
      },
      {
        id: 'visit_peepal_shrine',
        text: 'Visit the sacred Peepal tree grove in the deep forest',
        targetZone: 'forest',
        targetPosition: [40, 0, -20],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'peepal_shrine'
      },
      {
        id: 'inspect_river_spring',
        text: 'Inspect the pristine Narmada river feeder stream',
        targetZone: 'forest',
        targetPosition: [16, 0, -26],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'river_feeder'
      }
    ]
  },
  {
    id: 'quest_artisan_master_circuit',
    title: 'The Master Artisan Circuit',
    subtitle: 'Honor the living craft traditions of Bharatpur village.',
    theme: 'Traditional Arts',
    lore: 'From the potter’s wheel to symmetrical threshold Rangoli, everyday village crafts embodied cosmic geometry and thermodynamic science.',
    icon: '🎨',
    difficulty: 'Easy',
    rewardXp: 280,
    rewardTitle: 'Kala-Shilpi Seal',
    rewardBadgeId: 'badge_daily_artisan',
    objectives: [
      {
        id: 'visit_pottery_workshop',
        text: 'Visit Potter Madhav’s terracotta workshop by the clay pits',
        targetZone: 'village',
        targetPosition: [-10, 0, 24],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'potter_workshop'
      },
      {
        id: 'visit_rangoli_courtyard',
        text: 'Inspect the sacred geometric Kolam/Rangoli courtyard in the village center',
        targetZone: 'village',
        targetPosition: [-4, 0, 8],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'rangoli_station'
      },
      {
        id: 'visit_millet_granary',
        text: 'Visit the traditional clay-plastered granary near the farming fields',
        targetZone: 'village',
        targetPosition: [-28, 0, 12],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'village_granary'
      }
    ]
  },
  {
    id: 'quest_subterranean_lore_hunter',
    title: 'Subterranean Heritage Riddle',
    subtitle: 'Uncover secrets connecting the subterranean Baoli with the sacred temple.',
    theme: 'Architectural Mysteries',
    lore: 'Secret stone conduits and subterranean passages connected temple drainage tanks (Kalyani) with stepwell aquifers to manage seasonal monsoon runoffs.',
    icon: '🗝️',
    difficulty: 'Master',
    rewardXp: 400,
    rewardTitle: 'Gupta-Vidya Master Seal',
    rewardBadgeId: 'badge_daily_master',
    objectives: [
      {
        id: 'stepwell_subterranean_base',
        text: 'Reach the lowest tier of the subterranean Baoli steps',
        targetZone: 'stepwell',
        targetPosition: [-16, 0, -32],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'stepwell_base'
      },
      {
        id: 'temple_secret_sanctum',
        text: 'Explore the inner Garbhagriha corridor of the Sun Temple',
        targetZone: 'temple',
        targetPosition: [36, 0, 16],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'inner_sanctum'
      },
      {
        id: 'banyan_sabha_stone',
        text: 'Inspect the Panchayat consensus stone platform beneath the Banyan tree',
        targetZone: 'village',
        targetPosition: [-4, 0, 8],
        requiredCount: 1,
        currentCount: 0,
        completed: false,
        type: 'reach_location',
        targetId: 'sabha_platform'
      }
    ]
  }
];

/**
 * Get Today's Date String in YYYY-MM-DD format (local timezone)
 */
export function getTodayDateKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Deterministic hash of string to positive integer
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate or retrieve today's deterministic daily quest
 */
export function getDailyQuestForDate(dateKey: string = getTodayDateKey()): DailyQuest {
  const hash = hashString(dateKey);
  const questIndex = hash % DAILY_QUEST_POOL.length;
  const template = DAILY_QUEST_POOL[questIndex];

  // Deep copy objectives
  const objectives: DailyQuestObjective[] = template.objectives.map(obj => ({
    ...obj,
    currentCount: 0,
    completed: false
  }));

  return {
    ...template,
    id: `${template.id}_${dateKey}`,
    dateKey,
    objectives,
    completed: false
  };
}

const DAILY_STORAGE_KEY = 'itihva_daily_quest_v1';

/**
 * Load persisted Daily Quest state from LocalStorage
 */
export function loadDailyQuestState(): DailyQuestState {
  const todayKey = getTodayDateKey();
  const defaultQuest = getDailyQuestForDate(todayKey);

  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (!raw) {
      return {
        todayQuest: defaultQuest,
        completedDates: [],
        currentStreak: 0
      };
    }

    const parsed: DailyQuestState = JSON.parse(raw);

    // If today's quest matches saved date
    if (parsed.todayQuest && parsed.todayQuest.dateKey === todayKey) {
      return parsed;
    }

    // New Day detected! Calculate streak
    let streak = parsed.currentStreak || 0;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    if (parsed.lastCompletedDate !== yesterdayKey && parsed.lastCompletedDate !== todayKey) {
      // Streak broken
      streak = 0;
    }

    const newQuest = getDailyQuestForDate(todayKey);
    const newState: DailyQuestState = {
      todayQuest: newQuest,
      completedDates: parsed.completedDates || [],
      currentStreak: streak,
      lastCompletedDate: parsed.lastCompletedDate
    };

    saveDailyQuestState(newState);
    return newState;
  } catch (err) {
    console.error('Failed to load daily quest state:', err);
    return {
      todayQuest: defaultQuest,
      completedDates: [],
      currentStreak: 0
    };
  }
}

/**
 * Persist Daily Quest state to LocalStorage
 */
export function saveDailyQuestState(state: DailyQuestState): void {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save daily quest state:', err);
  }
}

/**
 * Format countdown to next midnight local time
 */
export function getTimeUntilMidnight(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
}

/**
 * Update daily quest progress when an action or movement occurs
 */
export function updateDailyQuestProgress(
  state: DailyQuestState,
  type: string,
  targetId?: string,
  targetPos?: [number, number, number]
): {
  updatedState: DailyQuestState;
  newlyCompletedObjective: boolean;
  newlyCompletedQuest: boolean;
} {
  const quest = { ...state.todayQuest };
  if (quest.completed) {
    return { updatedState: state, newlyCompletedObjective: false, newlyCompletedQuest: false };
  }

  let newlyCompletedObjective = false;
  let anyChange = false;

  const updatedObjectives = quest.objectives.map(obj => {
    if (obj.completed) return obj;

    let matched = false;

    if (obj.type === type) {
      if (type === 'reach_location') {
        if (targetId && obj.targetId === targetId) {
          matched = true;
        } else if (targetPos && obj.targetPosition) {
          const dx = targetPos[0] - obj.targetPosition[0];
          const dz = targetPos[2] - obj.targetPosition[2];
          const dist = Math.sqrt(dx * dx + dz * dz);
          if (dist < 4.8) {
            matched = true;
          }
        }
      } else if (type === 'interact_npc') {
        if (targetId && obj.targetId === targetId) {
          matched = true;
        }
      } else if (type === 'ring_bell') {
        matched = true;
      } else if (type === 'collect_item') {
        matched = true;
      }
    }

    if (matched) {
      const nextCount = obj.currentCount + 1;
      const isCompleted = nextCount >= obj.requiredCount;
      if (isCompleted && !obj.completed) {
        newlyCompletedObjective = true;
      }
      anyChange = true;
      return {
        ...obj,
        currentCount: nextCount,
        completed: isCompleted
      };
    }

    return obj;
  });

  if (!anyChange) {
    return { updatedState: state, newlyCompletedObjective: false, newlyCompletedQuest: false };
  }

  const allCompleted = updatedObjectives.every(o => o.completed);
  const newlyCompletedQuest = allCompleted && !quest.completed;

  const updatedState: DailyQuestState = {
    ...state,
    todayQuest: {
      ...quest,
      objectives: updatedObjectives,
      completed: allCompleted
    }
  };

  saveDailyQuestState(updatedState);
  return { updatedState, newlyCompletedObjective, newlyCompletedQuest };
}

/**
 * Claim reward for completing today's daily quest
 */
export function claimDailyQuestReward(state: DailyQuestState): DailyQuestState {
  const todayKey = getTodayDateKey();
  const alreadyCompletedToday = state.completedDates.includes(todayKey);

  const updatedStreak = alreadyCompletedToday
    ? state.currentStreak
    : (state.currentStreak || 0) + 1;

  const completedDates = Array.from(new Set([...state.completedDates, todayKey]));

  const updatedState: DailyQuestState = {
    ...state,
    todayQuest: {
      ...state.todayQuest,
      completed: true
    },
    completedDates,
    currentStreak: updatedStreak,
    lastCompletedDate: todayKey
  };

  saveDailyQuestState(updatedState);
  return updatedState;
}

