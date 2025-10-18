'use client';

import { useEffect, useState } from 'react';
import { getSpeech } from '@/app/actions';

type AudioPlayerProps = {
  text: string;
  onPlaybackEnd: () => void;
  isPlaying: boolean;
};

export default function AudioPlayer({ text, onPlaybackEnd, isPlaying }: AudioPlayerProps) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  useEffect(() => {
    if (text && isPlaying) {
      const generateSpeech = async () => {
        const res = await getSpeech(text);
        if (res.success && res.data) {
          setAudioSrc(res.data.audio);
        } else {
          console.error('Failed to generate speech:', res.error);
          onPlaybackEnd();
        }
      };
      generateSpeech();
    } else {
      setAudioSrc(null);
    }
  }, [text, isPlaying, onPlaybackEnd]);

  if (!audioSrc || !isPlaying) return null;

  return (
    <audio
      src={audioSrc}
      autoPlay
      onEnded={onPlaybackEnd}
      onCanPlayThrough={() => {
        // Audio is ready to play
      }}
      onError={(e) => {
        console.error('Audio playback error', e);
        onPlaybackEnd();
      }}
      hidden
    />
  );
}
