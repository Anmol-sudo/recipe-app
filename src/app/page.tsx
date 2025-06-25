"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/types";
import { generateRecipeAction } from "@/app/actions";
import { Header } from "@/components/header";
import { RecipeForm } from "@/components/recipe-form";
import { RecipeDisplay } from "@/components/recipe-display";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, CookingPot, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { GenerateRecipeInput } from "@/ai/flows/generate-recipe";

export default function Home() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateRecipe = async (input: GenerateRecipeInput) => {
    setIsLoading(true);
    setRecipe(null);
    const result = await generateRecipeAction(input);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
    } else {
      setRecipe(result.data);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4 lg:col-span-3">
            <RecipeForm
              onSubmit={handleGenerateRecipe}
              isLoading={isLoading}
            />
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            {isLoading && <LoadingState />}
            {!isLoading && recipe && (
              <div className="animate-in fade-in duration-500">
                <RecipeDisplay recipe={recipe} />
              </div>
            )}
            {!isLoading && !recipe && <WelcomeState />}
          </div>
        </div>
      </main>
    </div>
  );
}

function WelcomeState() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
      <CardHeader>
        <div className="mx-auto bg-primary/10 text-primary p-4 rounded-full mb-4">
          <ChefHat className="h-12 w-12" />
        </div>
        <CardTitle className="font-headline text-3xl">Welcome to RecipeWise</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground max-w-md mx-auto">
          Tell us what ingredients you have, and our AI chef will whip up a delicious recipe for you. Let's get cooking!
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 h-full">
      <CardHeader>
        <div className="mx-auto text-primary p-4 rounded-full mb-4">
          <LoaderCircle className="h-12 w-12 animate-spin" />
        </div>
        <CardTitle className="font-headline text-3xl">Generating Your Recipe...</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground max-w-md mx-auto">
          Our AI chef is thinking... This might take a moment.
        </p>
      </CardContent>
    </Card>
  );
}
