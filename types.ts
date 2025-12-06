export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface VoiceOption {
  id: VoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female';
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: VoiceName.Puck, name: 'Puck', description: 'Soft and calm', gender: 'Male' },
  { id: VoiceName.Charon, name: 'Charon', description: 'Deep and authoritative', gender: 'Male' },
  { id: VoiceName.Kore, name: 'Kore', description: 'Clear and bright', gender: 'Female' },
  { id: VoiceName.Fenrir, name: 'Fenrir', description: 'Energetic and bold', gender: 'Male' },
  { id: VoiceName.Zephyr, name: 'Zephyr', description: 'Smooth and relaxed', gender: 'Female' },
];

export interface AudioState {
  isGenerating: boolean;
  isPlaying: boolean;
  audioBuffer: AudioBuffer | null;
  error: string | null;
}