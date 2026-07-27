import { useState, useEffect } from 'react';
import { SongTrack } from '../types';
import { soundFx } from '../utils/audio';

const MUSIC_STORAGE_KEY = 'portfolio_bg_songs_v1';

export const DEFAULT_SONGS: SongTrack[] = [
  {
    id: 'song-default-1',
    title: 'Odnogo Ambient Synth',
    artist: 'Maruti Portfolio',
    url: '/song.webm',
    isDefault: true,
    genre: 'Cyberpunk Ambient',
    duration: '3:45'
  },
  {
    id: 'song-default-2',
    title: 'Cybernetic Horizon',
    artist: 'DeepMind Audio',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    isDefault: false,
    genre: 'Synthwave',
    duration: '2:18'
  },
  {
    id: 'song-default-3',
    title: 'Data Stream Odyssey',
    artist: 'Pulse Synthesizer',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    isDefault: false,
    genre: 'Lo-Fi Chill',
    duration: '3:02'
  }
];

export function useBackgroundMusic() {
  const [tracks, setTracks] = useState<SongTrack[]>(() => {
    try {
      const stored = localStorage.getItem(MUSIC_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Failed to load songs from localStorage:', err);
    }
    return DEFAULT_SONGS;
  });

  const [activeTrackId, setActiveTrackId] = useState<string>(() => {
    const defaultTrack = tracks.find((t) => t.isDefault) || tracks[0] || DEFAULT_SONGS[0];
    return defaultTrack.id;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(tracks));
    } catch (err) {
      console.warn('Failed to save songs to localStorage:', err);
    }
  }, [tracks]);

  // Keep soundFx track in sync with active track
  const activeTrack = tracks.find((t) => t.id === activeTrackId) || tracks.find((t) => t.isDefault) || tracks[0] || DEFAULT_SONGS[0];

  useEffect(() => {
    if (activeTrack && activeTrack.url) {
      soundFx.setTrackUrl(activeTrack.url, false);
    }
  }, [activeTrackId, activeTrack?.url]);

  // Add new song track
  const addTrack = (newTrack: Omit<SongTrack, 'id'>) => {
    const id = `song-${Date.now()}`;
    let trackList = [...tracks];

    // If new track is set as default, unset others
    if (newTrack.isDefault) {
      trackList = trackList.map((t) => ({ ...t, isDefault: false }));
    }

    const createdTrack: SongTrack = { ...newTrack, id };
    const updated = [createdTrack, ...trackList];
    setTracks(updated);

    if (newTrack.isDefault) {
      setActiveTrackId(id);
      soundFx.setTrackUrl(createdTrack.url, soundFx.isSoundtrackActive());
    }

    return createdTrack;
  };

  // Update song track
  const updateTrack = (updatedTrack: SongTrack) => {
    setTracks((prev) => {
      let list = prev.map((t) => (t.id === updatedTrack.id ? updatedTrack : t));
      if (updatedTrack.isDefault) {
        list = list.map((t) => (t.id === updatedTrack.id ? t : { ...t, isDefault: false }));
      }
      return list;
    });

    if (updatedTrack.id === activeTrackId) {
      soundFx.setTrackUrl(updatedTrack.url, soundFx.isSoundtrackActive());
    }
  };

  // Delete song track
  const deleteTrack = (id: string) => {
    setTracks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      // Ensure at least one track is marked default if deleted was default
      if (filtered.length > 0 && !filtered.some((t) => t.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });

    if (activeTrackId === id) {
      const remaining = tracks.filter((t) => t.id !== id);
      if (remaining.length > 0) {
        const nextTrack = remaining.find((t) => t.isDefault) || remaining[0];
        setActiveTrackId(nextTrack.id);
        soundFx.setTrackUrl(nextTrack.url, soundFx.isSoundtrackActive());
      }
    }
  };

  // Set track as default
  const setDefaultTrack = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => ({
        ...t,
        isDefault: t.id === id
      }))
    );

    const targetTrack = tracks.find((t) => t.id === id);
    if (targetTrack) {
      setActiveTrackId(id);
      soundFx.setTrackUrl(targetTrack.url, soundFx.isSoundtrackActive());
    }
  };

  // Select & Play specific track
  const playTrack = (id: string) => {
    const target = tracks.find((t) => t.id === id);
    if (target) {
      setActiveTrackId(id);
      soundFx.setTrackUrl(target.url, true);
    }
  };

  // Reset tracks to defaults
  const resetMusicToDefaults = () => {
    setTracks(DEFAULT_SONGS);
    setActiveTrackId(DEFAULT_SONGS[0].id);
    soundFx.setTrackUrl(DEFAULT_SONGS[0].url, soundFx.isSoundtrackActive());
    try {
      localStorage.removeItem(MUSIC_STORAGE_KEY);
    } catch (err) {
      console.warn(err);
    }
  };

  return {
    tracks,
    activeTrack,
    activeTrackId,
    addTrack,
    updateTrack,
    deleteTrack,
    setDefaultTrack,
    playTrack,
    resetMusicToDefaults
  };
}
