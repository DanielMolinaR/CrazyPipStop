// The four game modes (Training, Amateur, Advanced, Pro) and the audio
// assets they reference. Pure data — no runtime dependency on React or
// React Navigation, so it's directly importable from any screen.
//
// HomeScreen renders the list as a picker; on selection it deep-clones
// the chosen template (see `cloneGameMode` in ./gameLogic) and forwards
// it through navigation params to start a fresh session.

import type { GameMode } from '../types';

// Countdown audio cues — the trailing seconds of each track have
// "3, 2, 1, GO!" baked in, so the CountDown component's 5.2-second
// lead-in aligns the audio "GO!" with the visible timer hitting 0.
const track15N = require('../assets/music/countdowns/PIT_15.wav');
const track15CT = require('../assets/music/countdowns/PIT_15_CT.wav');
const track20N = require('../assets/music/countdowns/PIT_20.wav');
const track20CT = require('../assets/music/countdowns/PIT_20_CT.wav');
const track25N = require('../assets/music/countdowns/PIT_25.wav');
const track25CT = require('../assets/music/countdowns/PIT_25_CT.wav');
const track30N = require('../assets/music/countdowns/PIT_30.wav');
const track30B = require('../assets/music/countdowns/PIT_30_B.wav');
const track30CT = require('../assets/music/countdowns/PIT_30_CT.wav');
const track40N = require('../assets/music/countdowns/PIT_40.wav');
const track40CT = require('../assets/music/countdowns/PIT_40_CT.wav');

// Outcome stings — played on the Final screen.
const ovation = require('../assets/music/victory/OVATION.mp3');
const victoryPro = require('../assets/music/victory/FINAL_PRO.mp3');
const brokenCar = require('../assets/music/defeat/BROKEN_CAR.mp3');
const defeat = require('../assets/music/defeat/DEFEAT.wav');

const trainingMode: GameMode = {
  name: 'TRAINING',
  secondsCounter: 40,
  audios: [track40N, track40CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 6,
  hasPenalization: false,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 0,
  penalizedAudios: [],
};

const amateurMode: GameMode = {
  name: 'AMATEUR',
  secondsCounter: 30,
  audios: [track30N, track30B, track30CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 4,
  hasPenalization: true,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 5,
  penalizedAudios: [track25N, track25CT],
};

const advancedMode: GameMode = {
  name: 'ADVANCED',
  secondsCounter: 25,
  audios: [track25N, track25CT],
  victoryAudios: [ovation],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 4,
  hasPenalization: true,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 5,
  penalizedAudios: [track20N, track20CT],
};

const proMode: GameMode = {
  name: 'PRO',
  secondsCounter: 15,
  audios: [track15N, track15CT],
  victoryAudios: [victoryPro],
  defeatAudios: [defeat, brokenCar],
  victoryPoints: 0,
  losingPoints: 0,
  maxVictoryPoints: 5,
  maxLosePoints: 3,
  hasPenalization: false,
  isPenalized: false,
  isPenalizationUsed: false,
  penalizationTime: 0,
  penalizedAudios: [],
};

export const gameModes: readonly GameMode[] = [
  trainingMode,
  amateurMode,
  advancedMode,
  proMode,
];
