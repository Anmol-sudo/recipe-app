"use server";

import { generateRecipe, type GenerateRecipeInput } from "@/ai/flows/generate-recipe";
import type { Recipe } from "@/lib/types";

export async function generateRecipeAction(input: GenerateRecipeInput): Promise<{
  data: Recipe | null;
  error: string | null;
}> {
  try {
    // Basic validation
    if (!input.ingredients || input.ingredients.trim().length < 3) {
      return { data: null, error: "Please enter at least one ingredient." };
    }

    const data = await generateRecipe(input);
    
    // Basic response validation
    if (!data.recipeName || !data.ingredientsList || !data.instructions) {
       return { data: null, error: "The generated recipe was incomplete. Please try again with more specific ingredients." };
    }

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Failed to generate recipe. Our chef might be busy. Please try again." };
  }
}
