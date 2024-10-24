"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Twitter,
  Facebook,
  Mail,
  QrCode,
  Instagram,
  Share2,
  Copy,
  Check,
  Smartphone,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface ShareSudokuDialogProps {
  shareCode: string;
}

export default function ShareSudokuDialog({
  shareCode,
}: ShareSudokuDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { toast } = useToast();

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const directPuzzleUrl = useMemo(
    () => `${baseUrl}/play?code=${encodeURIComponent(shareCode)}`,
    [baseUrl, shareCode]
  );

  const handleCopy = useCallback(
    async (
      text: string,
      setCopied: React.Dispatch<React.SetStateAction<boolean>>,
      toastTitle: string
    ) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast({
          title: toastTitle,
          description: `The ${toastTitle.toLowerCase()} has been copied to your clipboard.`,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Unable to copy. Please try again.",
          variant: "destructive",
        });
        console.error(error);
      }
    },
    [toast]
  );

  const handleCopyLink = useCallback(
    () => handleCopy(directPuzzleUrl, setCopiedLink, "Link copied"),
    [handleCopy, directPuzzleUrl]
  );
  const handleCopyCode = useCallback(
    () => handleCopy(shareCode, setCopiedCode, "Code copied"),
    [handleCopy, shareCode]
  );

  const generateQRCode = useCallback(async () => {
    try {
      const QRCode = (await import("qrcode")).default;
      const url = await QRCode.toDataURL(directPuzzleUrl);
      setQrCode(url);
    } catch (error) {
      toast({
        title: "QR Code generation failed",
        description: "Unable to generate QR code. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    }
  }, [directPuzzleUrl, toast]);

  const handleShare = useCallback(
    async (platform: string) => {
      const shareUrl = directPuzzleUrl;
      const plainMessage = `Check out this Sudoku puzzle! Play it directly here: ${shareUrl}`;

      const shareActions = {
        twitter: () =>
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              plainMessage
            )}`,
            "_blank"
          ),
        facebook: () =>
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`,
            "_blank"
          ),
        whatsapp: () =>
          window.open(
            `https://wa.me/?text=${encodeURIComponent(plainMessage)}`,
            "_blank"
          ),
        instagram: async () => {
          toast({
            title: "Share on Instagram",
            description:
              "Copy this message and share it on Instagram: " + plainMessage,
          });
          await navigator.clipboard.writeText(plainMessage);
        },
        email: () => {
          window.location.href = `mailto:?subject=${encodeURIComponent(
            "Check out this Sudoku puzzle!"
          )}&body=${encodeURIComponent(plainMessage)}`;
        },
        sms: () => {
          const smsUrl = navigator.userAgent.match(/iPhone/i)
            ? `sms:&body=${encodeURIComponent(plainMessage)}`
            : `sms:?body=${encodeURIComponent(plainMessage)}`;
          window.location.href = smsUrl;
        },
        default: async () => {
          if (navigator.share) {
            try {
              await navigator.share({
                title: "Sudoku Puzzle",
                text: plainMessage,
                url: shareUrl,
              });
            } catch (error) {
              console.error(error);
              handleCopyLink();
            }
          } else {
            handleCopyLink();
          }
        },
      };

      (
        shareActions[platform as keyof typeof shareActions] ||
        shareActions.default
      )();
    },
    [directPuzzleUrl, handleCopyLink, toast]
  );

  const renderCopyButton = useCallback(
    (onClick: () => void, copied: boolean) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onClick}>
              <AnimatePresence>
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-4 w-4 text-green-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="h-4 w-4" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{copied ? "Copied!" : "Copy"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    []
  );

  const renderShareContent = useCallback(
    (type: "code" | "link") => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
          <Input
            value={type === "code" ? shareCode : directPuzzleUrl}
            readOnly
            className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {renderCopyButton(
            type === "code" ? handleCopyCode : handleCopyLink,
            type === "code" ? copiedCode : copiedLink
          )}
        </div>
        <Button
          className="w-full"
          onClick={type === "code" ? handleCopyCode : handleCopyLink}
        >
          {(type === "code" ? copiedCode : copiedLink)
            ? "Copied!"
            : `Copy ${type === "code" ? "Code" : "Direct Puzzle Link"}`}
        </Button>
        <Button variant="outline" className="w-full" onClick={generateQRCode}>
          <QrCode className="mr-2 h-4 w-4" />
          Generate QR Code
        </Button>
        {qrCode && (
          <div className="mt-4">
            <Image
              height={200}
              width={200}
              src={qrCode}
              alt="QR Code"
              className="mx-auto"
            />
          </div>
        )}
      </motion.div>
    ),
    [
      shareCode,
      directPuzzleUrl,
      handleCopyCode,
      handleCopyLink,
      copiedCode,
      copiedLink,
      generateQRCode,
      qrCode,
      renderCopyButton,
    ]
  );

  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <>
                <Share2 className="cursor-pointer" size={24} />
                <span className="sr-only">Share Sudoku</span>
              </>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share Sudoku</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Share2 className="h-6 w-6" />
            Share Sudoku
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="link">Link</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-4">
            {renderShareContent("code")}
          </TabsContent>
          <TabsContent value="link" className="mt-4">
            {renderShareContent("link")}
          </TabsContent>
          <TabsContent value="social" className="mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {[
                {
                  name: "Twitter",
                  icon: Twitter,
                  color: "#1DA1F2",
                  hoverColor: "#1a8cd8",
                },
                {
                  name: "Facebook",
                  icon: Facebook,
                  color: "#4267B2",
                  hoverColor: "#365899",
                },
                {
                  name: "WhatsApp",
                  icon: () => (
                    <svg
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  ),
                  color: "#25D366",
                  hoverColor: "#128C7E",
                },
                {
                  name: "Instagram",
                  icon: Instagram,
                  color: "#E1306C",
                  hoverColor: "#C13584",
                  gradient:
                    "bg-gradient-to-r from-[#405DE6] via-[#833AB4] to-[#E1306C]",
                },
                { name: "Email", icon: Mail, variant: "outline" },
                { name: "SMS", icon: Smartphone, variant: "outline" },
              ].map((platform) => (
                <Button
                  key={platform.name}
                  className={`w-full ${platform.gradient || ""} ${
                    platform.variant === "outline"
                      ? ""
                      : `bg-[${platform.color}] hover:bg-[${platform.hoverColor}] text-white `
                  }`}
                  variant={
                    platform.variant as "outline" | "default" | undefined
                  }
                  onClick={() => handleShare(platform.name.toLowerCase())}
                >
                  <platform.icon className="mr-2 h-4 w-4" />
                  {platform.name}
                </Button>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
