"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-center">
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className="text-center">
            We encountered an unexpected error. Don't worry, it's not your
            fault!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Error details: {error.message || "Unknown error"}
          </p>
          <div className="space-y-2">
            <Button onClick={reset} className="w-full">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="link" className="w-full">
            <a href="mailto:support@yoursudokuapp.com">
              <MessageCircle className="mr-2 h-4 w-4" />
              Report this issue
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
