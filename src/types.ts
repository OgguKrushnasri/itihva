export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type ZoneType = 'village' | 'temple' | 'forest' | 'stepwell';

export interface NPCData {
  id: string;
  name: string;
  role: string;
  zone: ZoneType;
  position: [number, number, number];
  rotation: number;
  skinTone: string;
  clothingColor: string;
  clothingSecondary: string;
  hairColor: string;
  hairStyle: 'turban' | 'bun' | 'short' | 'long_braid' | 'elder_hair' | 'curls';
  outfit: 'kurta_dhoti' | 'saree' | 'potter' | 'priest' | 'ranger' | 'child' | 'farmer';
  dialogueState: Record<string, string[]>;
  educationalFact: {
    title: string;
    description: string;
    category: 'Architecture' | 'Handicraft' | 'Agriculture' | 'Nature' | 'Tradition';
  };
}

export interface CollectibleItem {
  id: string;
  name: string;
  type: 'crop' | 'clay' | 'waste' | 'key' | 'scroll' | 'sapling' | 'artifact_part' | 'spice';
  position: [number, number, number];
  zone: ZoneType;
  description: string;
  educationalNote: string;
  collected: boolean;
  color: string;
}

export interface Mission {
  id: string;
  title: string;
  zone: ZoneType;
  brief: string;
  description: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  rewardBadge: string;
  rewardItem?: string;
  nextMissionId?: string;
  hint: string;
  targetPosition?: [number, number, number];
}

export interface Badge {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
  category: 'Village' | 'Heritage' | 'Ecology' | 'Explorer' | 'Artisan' | 'Champion';
}

export interface Artifact {
  id: string;
  name: string;
  hindiName: string;
  era: string;
  location: string;
  description: string;
  significance: string;
  unlocked: boolean;
  modelType: 'ashoka_pillar' | 'sun_temple_wheel' | 'nataraja' | 'terracotta_pot' | 'stepwell_arch' | 'golden_seal';
}

export interface GameProgress {
  currentMissionIndex: number;
  completedMissions: string[];
  inventory: string[];
  badges: string[];
  unlockedArtifacts: string[];
  rangoliScore: number;
  potteryScore: number;
  wasteCollectedCount: number;
  pillarsAligned: boolean[];
  templeDoorUnlocked: boolean;
  stepwellChestOpened: boolean;
  finalArtifactFound: boolean;
}

export interface DailyQuestObjective {
  id: string;
  text: string;
  targetZone: ZoneType;
  targetPosition?: [number, number, number];
  requiredCount: number;
  currentCount: number;
  completed: boolean;
  type: 'visit_zone' | 'interact_npc' | 'collect_item' | 'ring_bell' | 'reach_location' | 'complete_minigame';
  targetId?: string;
}

export interface DailyQuest {
  id: string;
  dateKey: string;
  title: string;
  subtitle: string;
  theme: string;
  lore: string;
  icon: string;
  difficulty: 'Easy' | 'Medium' | 'Master';
  objectives: DailyQuestObjective[];
  completed: boolean;
  rewardXp: number;
  rewardTitle: string;
  rewardBadgeId?: string;
}

export interface DailyQuestState {
  todayQuest: DailyQuest;
  completedDates: string[];
  currentStreak: number;
  lastCompletedDate?: string;
}

export interface PlayerCustomization {
  name: string;
  outfit: 'adventurer_kurta' | 'royal_angavastram' | 'traditional_saree' | 'explorer_vest';
  outfitColor: string;
  accentColor: string;
  hairStyle: 'tied_topknot' | 'short_parted' | 'long_braid' | 'turban';
  turbanColor: string;
  skinTone: string;
}
