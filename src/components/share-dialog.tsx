import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Twitter,
  Facebook,
  Mail,
  QrCode,
  Link,
  Instagram,
  Share2,
} from "lucide-react";

interface ShareSudokuDialogProps {
  shareCode: string;
}

export default function ShareSudokuDialog({
  shareCode,
}: ShareSudokuDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    let url = "";
    const message = `Check out this Sudoku puzzle! ${shareCode}`;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          message
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareCode
        )}`;
        break;
      case "whatsapp":
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case "instagram":
        // Instagram doesn't have a direct share URL, so we'll copy the message to clipboard
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      case "email":
        url = `mailto:?subject=Check%20out%20this%20Sudoku%20puzzle!&body=${encodeURIComponent(
          shareCode
        )}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Share2 className="cursor-pointer" size={24} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex justify-between items-center">
            Share Sudoku
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
            <Input
              value={shareCode}
              readOnly
              className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="w-full" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8]"
            onClick={() => handleShare("twitter")}
          >
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
          <Button
            className="w-full bg-[#4267B2] hover:bg-[#365899]"
            onClick={() => handleShare("facebook")}
          >
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </Button>
          <Button
            className="w-full bg-[#25D366] hover:bg-[#128C7E]"
            onClick={() => handleShare("whatsapp")}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Share on WhatsApp
          </Button>
          <Button
            className="w-full bg-gradient-to-r from-[#405DE6] via-[#5851DB] via-[#833AB4] via-[#C13584] via-[#E1306C] via-[#FD1D1D] to-[#F56040] hover:opacity-90"
            onClick={() => handleShare("instagram")}
          >
            <Instagram className="mr-2 h-4 w-4" />
            Share on Instagram
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleShare("email")}
          >
            <Mail className="mr-2 h-4 w-4" />
            Share by Email
          </Button>
          <Button variant="outline" className="w-full">
            <QrCode className="mr-2 h-4 w-4" />
            Share QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
