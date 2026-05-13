import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@liked_spaces';

export default function useLikedSpaces() {
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setLikedIds(JSON.parse(stored));
    }).catch(() => {});
  }, []);

  const toggleLike = (id) => {
    const next = likedIds.includes(id)
      ? likedIds.filter((i) => i !== id)
      : [...likedIds, id];
    setLikedIds(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  };

  const isLiked = (id) => likedIds.includes(id);

  return { likedIds, toggleLike, isLiked };
}
