// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Switch } from "@/components/ui/switch"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Settings } from "lucide-react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
//   DialogClose,
// } from "@/components/ui/dialog"

// export interface Settings {
//   displayTimer: boolean
//   limitHints: boolean
//   numberOfHints: number
//   highlightSameRowColumnBox: boolean
//   highlightSameNumber: boolean
//   highlightConflictingNumbers: boolean
//   maxMistakes: number
// }

// interface SettingsDialogProps {
//   settings: Settings
//   onSettingsChange: (newSettings: Settings) => void
// }

// export function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
//   const [localSettings, setLocalSettings] = useState<Settings>(settings)

//   const handleSettingChange = (setting: keyof Settings, value: boolean | number) => {
//     setLocalSettings((prev) => ({ ...prev, [setting]: value }))
//   }

//   const handleSave = () => {
//     onSettingsChange(localSettings)
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//           <Settings size={24} className="cursor-pointer" />
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <SettingItem
//             id="display-timer"
//             label="Display timer while playing"
//             checked={localSettings.displayTimer}
//             onChange={(checked) => handleSettingChange("displayTimer", checked)}
//           />
//           <SettingItem
//             id="limit-hints"
//             label="Limit the number of hints available"
//             checked={localSettings.limitHints}
//             onChange={(checked) => handleSettingChange("limitHints", checked)}
//           />
//           <div className="flex items-center justify-between">
//             <Label htmlFor="number-of-hints" className="flex-grow text-lg">
//               Number of available hints
//             </Label>
//             <Input
//               id="number-of-hints"
//               type="number"
//               value={localSettings.numberOfHints}
//               onChange={(e) => handleSettingChange("numberOfHints", parseInt(e.target.value, 10))}
//               className="w-16 text-right"
//             />
//           </div>
//           <SettingItem
//             id="highlight-same"
//             label="Highlight cells in same row/column/box"
//             checked={localSettings.highlightSameRowColumnBox}
//             onChange={(checked) => handleSettingChange("highlightSameRowColumnBox", checked)}
//           />
//           <SettingItem
//             id="highlight-same-number"
//             label="Highlight cells with the same number"
//             checked={localSettings.highlightSameNumber}
//             onChange={(checked) => handleSettingChange("highlightSameNumber", checked)}
//           />
//           <SettingItem
//             id="highlight-conflicting"
//             label="Highlight conflicting numbers"
//             checked={localSettings.highlightConflictingNumbers}
//             onChange={(checked) => handleSettingChange("highlightConflictingNumbers", checked)}
//           />
//           <div className="flex items-center justify-between">
//             <Label htmlFor="max-mistakes" className="flex-grow text-lg">
//               Maximum allowed mistakes
//             </Label>
//             <Input
//               id="max-mistakes"
//               type="number"
//               value={localSettings.maxMistakes}
//               onChange={(e) => handleSettingChange("maxMistakes", parseInt(e.target.value, 10))}
//               className="w-16 text-right"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <DialogClose asChild>
//             <Button size={"lg"} className="text-lg" variant="outline">Cancel</Button>
//           </DialogClose>
//           <DialogClose asChild>
//             <Button size={"lg"} className="text-lg" onClick={handleSave}>Save</Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

// interface SettingItemProps {
//   id: string
//   label: string
//   checked: boolean
//   onChange: (checked: boolean) => void
// }

// function SettingItem({ id, label, checked, onChange }: SettingItemProps) {
//   return (
//     <div className="flex items-center justify-between">
//       <Label htmlFor={id} className="flex-grow text-lg">
//         {label}
//       </Label>
//       <Switch id={id} checked={checked} onCheckedChange={onChange} />
//     </div>
//   )
// }

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Timer,
  Lightbulb,
  Grid3X3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Settings {
  displayTimer: boolean;
  limitHints: boolean;
  numberOfHints: number;
  highlightSameRowColumnBox: boolean;
  highlightSameNumber: boolean;
  highlightConflictingNumbers: boolean;
  maxMistakes: number;
}

interface SettingsDialogProps {
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

export function SettingsDialog({
  settings,
  onSettingsChange,
}: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  const handleSettingChange = (
    setting: keyof Settings,
    value: boolean | number
  ) => {
    setLocalSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <>
                <Settings className="cursor-pointer" size={24} />
                <span className="sr-only">Open settings</span>
              </>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Settings
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 py-4"
        >
          <SettingsGroup
            title="Game Display"
            icon={<Timer className="h-5 w-5" />}
          >
            <SettingItem
              id="display-timer"
              label="Display timer while playing"
              checked={localSettings.displayTimer}
              onChange={(checked) =>
                handleSettingChange("displayTimer", checked)
              }
            />
          </SettingsGroup>

          <Separator />

          <SettingsGroup title="Hints" icon={<Lightbulb className="h-5 w-5" />}>
            <SettingItem
              id="limit-hints"
              label="Limit the number of hints"
              checked={localSettings.limitHints}
              onChange={(checked) => handleSettingChange("limitHints", checked)}
            />
            <div className="flex items-center justify-between">
              <Label htmlFor="number-of-hints" className="flex-grow text-sm">
                Number of available hints
              </Label>
              <Input
                id="number-of-hints"
                type="number"
                value={localSettings.numberOfHints}
                onChange={(e) =>
                  handleSettingChange(
                    "numberOfHints",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-16 text-right"
                min={1}
                max={100}
              />
            </div>
          </SettingsGroup>

          <Separator />

          <SettingsGroup
            title="Highlighting"
            icon={<Grid3X3 className="h-5 w-5" />}
          >
            <SettingItem
              id="highlight-same"
              label="Highlight cells in same row/column/box"
              checked={localSettings.highlightSameRowColumnBox}
              onChange={(checked) =>
                handleSettingChange("highlightSameRowColumnBox", checked)
              }
            />
            <SettingItem
              id="highlight-same-number"
              label="Highlight cells with the same number"
              checked={localSettings.highlightSameNumber}
              onChange={(checked) =>
                handleSettingChange("highlightSameNumber", checked)
              }
            />
            <SettingItem
              id="highlight-conflicting"
              label="Highlight conflicting numbers"
              checked={localSettings.highlightConflictingNumbers}
              onChange={(checked) =>
                handleSettingChange("highlightConflictingNumbers", checked)
              }
            />
          </SettingsGroup>

          <Separator />

          <SettingsGroup
            title="Game Rules"
            icon={<AlertTriangle className="h-5 w-5" />}
          >
            <div className="flex items-center justify-between">
              <Label htmlFor="max-mistakes" className="flex-grow text-sm">
                Maximum allowed mistakes
              </Label>
              <Input
                id="max-mistakes"
                type="number"
                value={localSettings.maxMistakes}
                onChange={(e) =>
                  handleSettingChange(
                    "maxMistakes",
                    parseInt(e.target.value, 10)
                  )
                }
                className="w-16 text-right"
                min={1}
                max={10}
              />
            </div>
          </SettingsGroup>
        </motion.div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface SettingItemProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingItem({ id, label, checked, onChange }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between space-x-2">
      <Label htmlFor={id} className="flex-grow text-sm">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

interface SettingsGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SettingsGroup({ title, icon, children }: SettingsGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
