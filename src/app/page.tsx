import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Brain, Trophy, Smartphone, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SudokuChallenge() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Welcome to Sudoku Challenge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Exercise your mind with the world&apos;s favorite number-placement
            puzzle!
          </p>
        </header>

        <main className="space-y-8">
          <section className="">
            <div className="flex justify-between gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                  Ready to Play?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Dive into a world of logical thinking and number mastery. Our
                  Sudoku game offers:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-6">
                  <li>
                    Multiple difficulty levels: Easy, Medium, Hard, and Expert
                  </li>
                  <li>Customizable settings for a personalized experience</li>
                  <li>Daily challenges to keep your skills sharp</li>
                  <li>Progress tracking and performance statistics</li>
                </ul>
                <Link
                  href={"/play"}
                  className={cn(
                    buttonVariants({ variant: "default", size: "lg" }),
                    "w-full sm:w-auto"
                  )}
                >
                  Play Sudoku Now!
                </Link>
              </div>
              <div className="hidden md:block">
                <Image
                  src="/sudoku.png"
                  alt="Sudoku puzzle example"
                  className="rounded-lg shadow-lg"
                  width={400}
                  height={300}
                />
              </div>
            </div>
          </section>

          <section className="">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              Game Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<Brain className="h-8 w-8 text-primary" />}
                title="Beginner Friendly"
                description="New to Sudoku? Start with our easy puzzles and helpful tutorials."
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8 text-primary" />}
                title="Challenge Yourself"
                description="Test your limits with our expert-level grids for seasoned players."
              />
              <FeatureCard
                icon={<Smartphone className="h-8 w-8 text-primary" />}
                title="Play Anywhere"
                description="Enjoy on desktop or mobile - your progress syncs across devices."
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
              How to Play Sudoku
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>
                The goal is to fill a 9×9 grid with numbers so that each column,
                row, and 3×3 section contain all digits from 1 to 9.
              </li>
              <li>
                Start with the given numbers and use logic to deduce where the
                missing numbers should be placed.
              </li>
              <li>
                Remember, no number can appear twice in the same row, column, or
                3×3 box.
              </li>
              <li>
                Use the process of elimination and look for patterns to solve
                the puzzle.
              </li>
              <li>
                Don&apos;t guess! Sudoku is a game of logic and reasoning.
              </li>
            </ol>
            <Button variant="outline" className="my-2" asChild>
              <Link href="/tutorial">
                <Info className="mr-2 h-5 w-5" /> Full Tutorial
              </Link>
            </Button>
          </section>

          <section className="">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              Why Play Sudoku?
            </h2>
            <p className="text-muted-foreground mb-4">
              Sudoku isn&apos;t just fun - it&apos;s a workout for your brain!
              Regular play can improve:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mb-6">
              <li>Concentration and focus</li>
              <li>Logical thinking skills</li>
              <li>Memory and cognitive function</li>
              <li>Stress relief and relaxation</li>
            </ul>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Join Sudoku Community
            </h2>
            <p className="text-muted-foreground mb-6">
              Connect with fellow puzzle enthusiasts, share strategies, and
              compete on our leaderboards!
            </p>
            <Button size="lg">
              <Link
                href={
                  "http://forum.enjoysudoku.com/ucp.php?mode=register&sid=52c22a7eee2909d87ab4c3f6ea5bba10"
                }
                target="_blank"
              >
                Sign Up Free
              </Link>
            </Button>
          </section>
        </main>

        <footer className="mt-16 text-center text-gray-500 dark:text-gray-400">
          <p>
            &copy; 2024{" "}
            <Link
              href={"https://ritikshah.vercel.app"}
              target="_blank"
              className={"hover:underline"}
            >
              Ritik Shah
            </Link>{" "}
            . All rights reserved. |{" "}
            <Link href="#privacy-policy" className="underline">
              Privacy Policy
            </Link>{" "}
            |{" "}
            <Link href="#terms" className="underline">
              Terms of Service
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
