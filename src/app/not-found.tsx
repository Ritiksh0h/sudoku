"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Dices } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4 text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Oops! It seems like you've stumbled upon a missing piece in our Sudoku
          puzzle. Don't worry, even the best players make a wrong move
          sometimes.
        </p>
      </motion.div>

      <div className="space-x-4">
        <Button asChild variant="default">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/play">
            <Dices className="mr-2 h-4 w-4" />
            New Game
          </Link>
        </Button>
      </div>
    </div>
  );
}
