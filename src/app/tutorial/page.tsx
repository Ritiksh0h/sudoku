import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Grid3X3, Lightbulb, Target, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SudokuTutorial() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 ">
      <div className="container mx-auto px-4 py-12 space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Sudoku: Full Tutorial</h1>
          <p className="text-xl text-muted-foreground">
            Master the art of Sudoku with our comprehensive guide
          </p>
        </header>

        <Button asChild variant="outline" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <main className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold">What is Sudoku?</h2>
            <p className="text-muted-foreground">
              Sudoku is a logic-based number-placement puzzle. The objective is
              to fill a 9×9 grid with digits so that each column, row, and 3×3
              sub-grid contains all digits from 1 to 9 without repetition.
            </p>
            <Image
              src="/sudoku.png"
              alt="Example of a Sudoku grid"
              width={400}
              height={400}
              className="mx-auto rounded-lg shadow-lg"
            />
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Basic Rules
            </h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Each row must contain the numbers 1-9, without repetitions
              </li>
              <li>
                Each column must contain the numbers 1-9, without repetitions
              </li>
              <li>
                Each of the nine 3×3 sub-boxes must contain the numbers 1-9,
                without repetitions
              </li>
              <li>
                The sum of every single row, column and 3×3 box is always 45
              </li>
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
              How to Play
            </h2>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="md:grid w-full grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="techniques">Techniques</TabsTrigger>
                <TabsTrigger value="strategies">Strategies</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="basics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>1. Start with the given numbers on the grid.</p>
                    <p>
                      2. Look for rows, columns, or 3×3 boxes with several
                      numbers filled in.
                    </p>
                    <p>
                      3. Try to fill in the missing numbers based on what&apos;s
                      already in each row, column, and box.
                    </p>
                    <p>
                      4. Use the process of elimination to figure out where a
                      number can or can&apos;t go.
                    </p>
                    <p>
                      5. Keep track of possible numbers for each empty cell.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="techniques" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Solving Techniques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">Scanning</h3>
                    <p>
                      Scan rows, columns, and 3×3 boxes to identify where a
                      specific number can be placed.
                    </p>
                    <h3 className="text-lg font-semibold">Marking Up</h3>
                    <p>
                      Note possible numbers for empty cells to help identify
                      patterns and eliminate options.
                    </p>
                    <h3 className="text-lg font-semibold">Elimination</h3>
                    <p>
                      Eliminate numbers from cells based on what&apos;s already
                      present in related rows, columns, and boxes.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="strategies" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Winning Strategies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">Singles</h3>
                    <p>Look for cells with only one possible number.</p>
                    <h3 className="text-lg font-semibold">Hidden Singles</h3>
                    <p>
                      Find numbers that can only go in one cell within a row,
                      column, or box.
                    </p>
                    <h3 className="text-lg font-semibold">Pairs and Triples</h3>
                    <p>
                      Identify cells that share the same two or three possible
                      numbers to eliminate those numbers from other cells.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="advanced" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Techniques</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="text-lg font-semibold">X-Wing</h3>
                    <p>
                      Look for a pattern where a candidate appears only twice in
                      two different rows and columns, forming a rectangle.
                    </p>
                    <h3 className="text-lg font-semibold">Swordfish</h3>
                    <p>
                      Similar to X-Wing, but with three rows and columns instead
                      of two.
                    </p>
                    <h3 className="text-lg font-semibold">XY-Wing</h3>
                    <p>
                      A more complex pattern involving three cells that share
                      candidates in a specific way.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Tips for Success
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Start Simple
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Begin with easier puzzles and gradually increase difficulty
                    as you improve.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3X3 className="h-5 w-5 text-blue-500" />
                    Use Pencil Marks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Note possible numbers for each cell to help visualize
                    patterns and possibilities.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-500" />
                    Focus on One Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Concentrate on one section of the grid at a time to avoid
                    feeling overwhelmed.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="text-center space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Ready to Test Your Skills?
            </h2>
            <p className="text-muted-foreground">
              Now that you&apos;ve learned the basics, it&apos;s time to put
              your knowledge into practice!
            </p>
            <Button asChild size="lg">
              <Link href="/play">
                <Trophy className="mr-2 h-5 w-5" /> Play Sudoku Now
              </Link>
            </Button>
          </section>
        </main>

        <footer className="text-center text-gray-500 dark:text-gray-400 mt-12">
          <p>
            © 2024{" "}
            <Link
              href="https://ritikshah.vercel.app"
              target="_blank"
              className="hover:underline"
            >
              Ritik Shah
            </Link>
            . All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
