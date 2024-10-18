import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export interface Settings {
  displayTimer: boolean
  limitHints: boolean
  numberOfHints: number
  highlightSameRowColumnBox: boolean
  highlightSameNumber: boolean
  highlightConflictingNumbers: boolean
  maxMistakes: number
}

interface SettingsDialogProps {
  settings: Settings
  onSettingsChange: (newSettings: Settings) => void
}

export function SettingsDialog({ settings, onSettingsChange }: SettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings)

  const handleSettingChange = (setting: keyof Settings, value: boolean | number) => {
    setLocalSettings((prev) => ({ ...prev, [setting]: value }))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
          <Settings size={24} className="cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <SettingItem
            id="display-timer"
            label="Display timer while playing"
            checked={localSettings.displayTimer}
            onChange={(checked) => handleSettingChange("displayTimer", checked)}
          />
          <SettingItem
            id="limit-hints"
            label="Limit the number of hints available"
            checked={localSettings.limitHints}
            onChange={(checked) => handleSettingChange("limitHints", checked)}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="number-of-hints" className="flex-grow text-lg">
              Number of available hints
            </Label>
            <Input
              id="number-of-hints"
              type="number"
              value={localSettings.numberOfHints}
              onChange={(e) => handleSettingChange("numberOfHints", parseInt(e.target.value, 10))}
              className="w-16 text-right"
            />
          </div>
          <SettingItem
            id="highlight-same"
            label="Highlight cells in same row/column/box"
            checked={localSettings.highlightSameRowColumnBox}
            onChange={(checked) => handleSettingChange("highlightSameRowColumnBox", checked)}
          />
          <SettingItem
            id="highlight-same-number"
            label="Highlight cells with the same number"
            checked={localSettings.highlightSameNumber}
            onChange={(checked) => handleSettingChange("highlightSameNumber", checked)}
          />
          <SettingItem
            id="highlight-conflicting"
            label="Highlight conflicting numbers"
            checked={localSettings.highlightConflictingNumbers}
            onChange={(checked) => handleSettingChange("highlightConflictingNumbers", checked)}
          />
          <div className="flex items-center justify-between">
            <Label htmlFor="max-mistakes" className="flex-grow text-lg">
              Maximum allowed mistakes
            </Label>
            <Input
              id="max-mistakes"
              type="number"
              value={localSettings.maxMistakes}
              onChange={(e) => handleSettingChange("maxMistakes", parseInt(e.target.value, 10))}
              className="w-16 text-right"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button size={"lg"} className="text-lg" variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size={"lg"} className="text-lg" onClick={handleSave}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SettingItemProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function SettingItem({ id, label, checked, onChange }: SettingItemProps) {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor={id} className="flex-grow text-lg">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}