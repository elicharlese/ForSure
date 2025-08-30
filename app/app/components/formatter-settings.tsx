'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { FormatterOptions } from '../services/code-formatter'

interface FormatterSettingsProps {
  isOpen: boolean
  onClose: () => void
  options: FormatterOptions
  onSave: (options: FormatterOptions) => void
}

export function FormatterSettings({
  isOpen,
  onClose,
  options,
  onSave,
}: FormatterSettingsProps) {
  const [formatterOptions, setFormatterOptions] = useState<FormatterOptions>({
    ...options,
  })

  const handleSave = () => {
    onSave(formatterOptions)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Code Formatter Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="tabSize">Tab Size</Label>
            <Select
              value={formatterOptions.tabSize.toString()}
              onValueChange={value =>
                setFormatterOptions({
                  ...formatterOptions,
                  tabSize: Number.parseInt(value),
                })
              }
            >
              <SelectTrigger id="tabSize">
                <SelectValue placeholder="Select tab size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="insertSpaces">Use Spaces</Label>
            <Switch
              id="insertSpaces"
              checked={formatterOptions.insertSpaces}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  insertSpaces: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="singleQuotes">Single Quotes</Label>
            <Switch
              id="singleQuotes"
              checked={formatterOptions.singleQuotes}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  singleQuotes: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="trailingComma">Trailing Commas</Label>
            <Switch
              id="trailingComma"
              checked={formatterOptions.trailingComma}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  trailingComma: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="semicolons">Semicolons</Label>
            <Switch
              id="semicolons"
              checked={formatterOptions.semicolons}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  semicolons: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="bracketSpacing">Bracket Spacing</Label>
            <Switch
              id="bracketSpacing"
              checked={formatterOptions.bracketSpacing}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  bracketSpacing: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="jsxBracketSameLine">JSX Brackets Same Line</Label>
            <Switch
              id="jsxBracketSameLine"
              checked={formatterOptions.jsxBracketSameLine}
              onCheckedChange={checked =>
                setFormatterOptions({
                  ...formatterOptions,
                  jsxBracketSameLine: checked,
                })
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="arrowParens">Arrow Function Parentheses</Label>
            <Select
              value={formatterOptions.arrowParens}
              onValueChange={value =>
                setFormatterOptions({
                  ...formatterOptions,
                  arrowParens: value as 'avoid' | 'always',
                })
              }
            >
              <SelectTrigger id="arrowParens">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="avoid">Avoid when possible</SelectItem>
                <SelectItem value="always">Always include</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
