"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/lib/types';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'recipewise-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Could not load favorites from localStorage", error);
    }
  }, []);

  const saveFavorites = (newFavorites: Recipe[]) => {
    try {
      setFavorites(newFavorites);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error("Could not save favorites to localStorage", error);
    }
  };

  const addFavorite = useCallback((recipe: Recipe) => {
    const newFavorites = [...favorites, recipe];
    saveFavorites(newFavorites);
    toast({
      title: "Saved to Favorites!",
      description: `"${recipe.recipeName}" has been added to your favorites.`,
    });
  }, [favorites, toast]);

  const removeFavorite = useCallback((recipeName: string) => {
    const newFavorites = favorites.filter(fav => fav.recipeName !== recipeName);
    saveFavorites(newFavorites);
    toast({
      title: "Removed from Favorites",
      description: `"${recipeName}" has been removed.`,
    });
  }, [favorites, toast]);

  const isFavorite = useCallback((recipeName: string) => {
    return favorites.some(fav => fav.recipeName === recipeName);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
