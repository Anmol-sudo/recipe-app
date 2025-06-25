// This is a server-side file.
'use server';

/**
 * @fileOverview AI flow for suggesting substitute ingredients.
 *
 * This file defines a Genkit flow that takes an ingredient as input and suggests
 * suitable substitutes using AI.
 *
 * @exports suggestSubstituteIngredient - The main function to call the flow.
 * @exports SuggestSubstituteIngredientInput - The input type for the function.
 * @exports SuggestSubstituteIngredientOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for suggesting a substitute ingredient.
 */
const SuggestSubstituteIngredientInputSchema = z.object({
  missingIngredient: z
    .string()
    .describe('The ingredient for which a substitute is needed.'),
  recipeName: z
    .string()
    .optional()
    .describe('The name of the recipe for context.'),
});

/**
 * Type for the input of the suggestSubstituteIngredient function.
 */
export type SuggestSubstituteIngredientInput = z.infer<
  typeof SuggestSubstituteIngredientInputSchema
>;

/**
 * Output schema for the suggested substitute ingredient.
 */
const SuggestSubstituteIngredientOutputSchema = z.object({
  substituteIngredient: z
    .string()
    .describe('A suggested substitute ingredient.'),
  reason: z
    .string()
    .describe('The reason why the suggested ingredient is a good substitute.'),
});

/**
 * Type for the output of the suggestSubstituteIngredient function.
 */
export type SuggestSubstituteIngredientOutput = z.infer<
  typeof SuggestSubstituteIngredientOutputSchema
>;

/**
 * Main function to suggest a substitute ingredient.
 * @param input - The input containing the missing ingredient.
 * @returns A promise resolving to the suggested substitute ingredient.
 */
export async function suggestSubstituteIngredient(
  input: SuggestSubstituteIngredientInput
): Promise<SuggestSubstituteIngredientOutput> {
  return suggestSubstituteIngredientFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSubstituteIngredientPrompt',
  input: {schema: SuggestSubstituteIngredientInputSchema},
  output: {schema: SuggestSubstituteIngredientOutputSchema},
  prompt: `You are a helpful AI assistant that suggests substitute ingredients for recipes.

  The user is missing "{{missingIngredient}}" from their recipe.

  {{#if recipeName}}The recipe is called "{{recipeName}}".{{/if}}

  Suggest a single substitute ingredient, and explain why it is a good substitute.  The substitute should be easily accessible at most grocery stores.
  Be concise.
  `,
});

const suggestSubstituteIngredientFlow = ai.defineFlow(
  {
    name: 'suggestSubstituteIngredientFlow',
    inputSchema: SuggestSubstituteIngredientInputSchema,
    outputSchema: SuggestSubstituteIngredientOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
