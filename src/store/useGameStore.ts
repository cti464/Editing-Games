import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface GameState {
  coins: number;
  xp: number;
  level: number;
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: number;
  unlockedLevels: number[];
  stars: Record<number, number>; // levelId -> stars (1-3)
  achievements: string[];
  settings: { sfx: boolean; music: boolean; darkMode: boolean };
  playerName: string;
  profileImage: string;
  isSubscribed: boolean;
  
  // Actions
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  consumeEnergy: (amount: number) => boolean;
  completeLevel: (levelId: number, stars: number) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  updatePlayerName: (name: string) => void;
  updateProfileImage: (url: string) => void;
  completeSubscription: () => void;
  restoreEnergy: () => void;
  resetData: () => void;
}

const INITIAL_ENERGY = 50;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      xp: 0,
      level: 1,
      energy: INITIAL_ENERGY,
      maxEnergy: INITIAL_ENERGY,
      lastEnergyUpdate: Date.now(),
      unlockedLevels: [1], // Start with level 1 unlocked
      stars: {},
      achievements: [],
      settings: { sfx: true, music: true, darkMode: true },
      playerName: 'Anonymous Creator',
      profileImage: '',
      isSubscribed: false,

      resetData: () => set({
        coins: 0,
        xp: 0,
        level: 1,
        energy: INITIAL_ENERGY,
        maxEnergy: INITIAL_ENERGY,
        unlockedLevels: [1],
        stars: {},
        achievements: [],
        playerName: 'Anonymous Creator',
        profileImage: '',
        isSubscribed: false,
      }),

      completeSubscription: () => set({ isSubscribed: true }),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        // Simple leveling curve: Level = floor(sqrt(xp / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
        return { xp: newXp, level: newLevel };
      }),

      consumeEnergy: (amount) => {
        const state = get();
        if (state.energy >= amount) {
          set({ energy: state.energy - amount });
          return true;
        }
        return false;
      },

      completeLevel: (levelId, stars) => set((state) => {
        const currentStars = state.stars[levelId] || 0;
        const newStars = Math.max(currentStars, stars);
        
        const updates: Partial<GameState> = {
          stars: { ...state.stars, [levelId]: newStars },
        };
        
        // Unlock next level if not already unlocked
        if (!state.unlockedLevels.includes(levelId + 1) && levelId < 100 && stars > 0) {
          updates.unlockedLevels = [...state.unlockedLevels, levelId + 1];
        }
        
        return updates;
      }),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings }
      })),

      updatePlayerName: (name) => set({ playerName: name }),
      updateProfileImage: (url) => set({ profileImage: url }),

      restoreEnergy: () => set((state) => {
        const now = Date.now();
        const timeDiff = now - state.lastEnergyUpdate;
        // Restore 1 energy per minute
        const energyToRestore = Math.floor(timeDiff / 60000);
        
        if (energyToRestore > 0) {
          return {
            energy: Math.min(state.energy + energyToRestore, state.maxEnergy),
            lastEnergyUpdate: now,
          };
        }
        return {};
      }),
    }),
    {
      name: 'editing-master-storage',
    }
  )
);
