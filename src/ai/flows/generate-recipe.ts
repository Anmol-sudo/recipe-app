// src/ai/flows/generate-recipe.ts
'use server';
/**
 * @fileOverview A recipe generation AI agent.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients the user has available.'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions the user has, such as vegetarian, gluten-free, etc.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The creative and appealing name of the generated recipe.'),
  ingredientsList: z.string().describe('A complete list of ingredients required for the recipe, including precise quantities.'),
  instructions: z.string().describe('Detailed, step-by-step instructions for preparing the recipe. This should be comprehensive enough for a beginner to follow, including prep steps and cooking times.'),
  recipeImage: z.string().optional().describe('A data URI for an image of the recipe in base64 format.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema.omit({ recipeImage: true }) },
  prompt: `You are a world-class chef who specializes in creating delicious recipes from a limited set of ingredients. Your instructions are known for being clear, comprehensive, and easy for anyone to follow.

Given a list of ingredients and optional dietary restrictions, generate a detailed and delicious recipe.

Your response must be structured with the following:
1.  **Recipe Name**: A creative and appealing name for the dish.
2.  **Ingredients List**: A complete list of all ingredients needed, with precise measurements (e.g., "1 cup of flour", "2 tbsp of olive oil").
3.  **Instructions**: A thorough, step-by-step guide to preparing the dish. Break down each step clearly. Include details on preparation (like chopping vegetables), cooking techniques, temperatures, and estimated times for each stage. The goal is to make the recipe foolproof, even for a novice cook.

Ingredients provided by the user: {{{ingredients}}}
{{#if dietaryRestrictions}}
Dietary Restrictions to follow: {{{dietaryRestrictions}}}
{{/if}}
`,
  config: {
    maxOutputTokens: 4096,
  },
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async (input) => {
    const {output: textOutput} = await prompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate recipe text.');
    }

    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A high-resolution, professional food photograph of ${textOutput.recipeName}. The dish should look delicious and be presented beautifully on a plate, ready to eat.`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      return {
        ...textOutput,
        recipeImage: media?.url,
      };
    } catch (e) {
      console.error('Image generation failed, returning recipe without image.', e);
      return {
        ...textOutput,
        recipeImage: undefined,
      };
    }
  }
);
