// Shared types for the CrazyPipStop app.
//
// `GameMode` is the single source of truth for everything that flows through
// navigation — both the static configuration of a difficulty (timer length,
// audio assets, win/lose thresholds) and the per-session mutable game state
// (current score, penalization status). The whole object is passed
// immutably between screens via React Navigation's params.

// `require('./asset.wav')` returns a number in React Native's asset registry.
export type AudioAsset = number;

export interface GameMode {
  // Identity
  name: string;

  // Round configuration
  secondsCounter: number;
  audios: AudioAsset[];
  victoryAudios: AudioAsset[];
  defeatAudios: AudioAsset[];

  // Win/lose thresholds
  maxVictoryPoints: number;
  maxLosePoints: number;

  // Mutable session state (carried through navigation immutably)
  victoryPoints: number;
  losingPoints: number;

  // Penalization (always defined; values are no-ops when hasPenalization is false)
  hasPenalization: boolean;
  isPenalized: boolean;
  isPenalizationUsed: boolean;
  penalizationTime: number;
  penalizedAudios: AudioAsset[];
}

// Parameter list for the React Navigation native stack. Used to type
// `useNavigation`, `useRoute`, and `NativeStackScreenProps` throughout
// the screens.
export type RootStackParamList = {
  Home: undefined;
  Game: { gameMode: GameMode };
  Resolve: { gameMode: GameMode };
  Final: { userHasWon: boolean; gameMode: GameMode };
};
