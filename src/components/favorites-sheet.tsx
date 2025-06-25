"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bookmark, Trash2 } from "lucide-react";
import { useFavorites } from "@/hooks/use-favorites";

export function FavoritesSheet() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Bookmark className="mr-2 h-5 w-5" />
          Favorites ({favorites.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-headline text-2xl">Favorite Recipes</SheetTitle>
          <SheetDescription>
            Your saved recipes for quick access.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          {favorites.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {favorites.map((recipe) => (
                <AccordionItem value={recipe.recipeName} key={recipe.recipeName}>
                  <AccordionTrigger className="font-headline">{recipe.recipeName}</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-bold mb-2">Ingredients</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {recipe.ingredientsList.split('\n').map((item, i) => item.trim() && <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold mb-2">Instructions</h4>
                      <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                        {recipe.instructions.split('\n').map((item, i) => item.trim() && <li key={i}>{item}</li>)}
                      </ol>
                    </div>
                     <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => removeFavorite(recipe.recipeName)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bookmark className="h-12 w-12 mb-4" />
              <p className="font-semibold">No Favorites Yet</p>
              <p className="text-sm">Click the heart icon on a recipe to save it here.</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
