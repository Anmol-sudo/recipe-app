import { FavoritesSheet } from './favorites-sheet';
import { ChefHat } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
              RecipeWise
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <FavoritesSheet />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
