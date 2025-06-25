"use client";

import type { Recipe } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, UtensilsCrossed, ListOrdered } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";
import Image from "next/image";

type RecipeDisplayProps = {
  recipe: Recipe;
};

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(recipe.recipeName);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(recipe.recipeName);
    } else {
      addFavorite(recipe);
    }
  };

  const formatList = (text: string) => {
    return text.split('\n').map((item, index) => item.trim()).filter(item => item.length > 0);
  };

  const ingredients = formatList(recipe.ingredientsList);
  const instructions = formatList(recipe.instructions);

  return (
    <Card className="w-full overflow-hidden">
      {recipe.recipeImage && (
        <div className="relative aspect-video w-full">
          <Image
            src={recipe.recipeImage}
            alt={`Image of ${recipe.recipeName}`}
            fill
            className="object-cover"
            data-ai-hint="food recipe"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{recipe.recipeName}</CardTitle>
            <CardDescription className="mt-2">A delicious recipe crafted just for you.</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart className={`h-6 w-6 transition-colors ${isFav ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-headline text-2xl flex items-center gap-2 mb-3">
            <UtensilsCrossed className="h-6 w-6 text-accent" />
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1 pl-2 text-foreground/90 bg-secondary/50 p-4 rounded-md">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-headline text-2xl flex items-center gap-2 mb-3">
            <ListOrdered className="h-6 w-6 text-accent" />
            Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-3 pl-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="pl-2 leading-relaxed">{instruction}</li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
