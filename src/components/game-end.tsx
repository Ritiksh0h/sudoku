import { motion } from "framer-motion";
import { Trophy, XCircle, Clock, BarChart2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface GameDialogProps {
  gameStatus: "won" | "lost" | "playing";
  time: number;
  difficulty: string;
  onNewGame: () => void;
}

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export default function GameEndDialog({
  gameStatus,
  time,
  difficulty,
  onNewGame,
}: GameDialogProps) {
  const handleNewGame = () => {
    onNewGame();
  };

  return (
    <Dialog open={gameStatus !== "playing"}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {gameStatus === "won" ? "Congratulations!" : "Game Over"}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-6"
        >
          <div className="flex justify-center mb-4">
            {gameStatus === "won" ? (
              <Trophy className="w-16 h-16 text-yellow-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <p className="text-lg mb-4">
            {gameStatus === "won"
              ? "You solved the puzzle!"
              : "You reached the maximum number of mistakes."}
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Time: {formatTime(time)}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BarChart2 className="w-5 h-5 text-green-500" />
              <span>Difficulty: {difficulty}</span>
            </div>
          </div>
        </motion.div>
        <DialogFooter>
          <Button
            onClick={handleNewGame}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
