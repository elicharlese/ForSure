'use client'

import type React from 'react'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check, Share2 } from 'lucide-react'
import type { SavedProject } from '../hooks/use-saved-projects'

interface ShareProjectDialogProps {
  project: SavedProject
  onShare: (settings: {
    allowCopy: boolean
    allowComments: boolean
    expiresAt?: string
    maxViews?: number
    sharePassword?: string
  }) => string
  onUnshare: () => void
  trigger?: React.ReactNode
}

export function ShareProjectDialog({
  project,
  onShare,
  onUnshare,
  trigger,
}: ShareProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [allowCopy, setAllowCopy] = useState(true)
  const [allowComments, setAllowComments] = useState(true)
  const [useExpiration, setUseExpiration] = useState(false)
  const [expirationType, setExpirationType] = useState<'time' | 'views'>('time')
  const [expirationTime, setExpirationTime] = useState('7')
  const [maxViews, setMaxViews] = useState('10')
  const [usePassword, setUsePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const isShared = project.shareSettings?.isShared

  const handleShare = () => {
    let expiresAt: string | undefined
    if (useExpiration && expirationType === 'time') {
      const days = Number.parseInt(expirationTime, 10) || 7
      expiresAt = new Date(
        Date.now() + days * 24 * 60 * 60 * 1000
      ).toISOString()
    }

    let viewLimit: number | undefined
    if (useExpiration && expirationType === 'views') {
      viewLimit = Number.parseInt(maxViews, 10) || 10
    }

    const shareId = onShare({
      allowCopy,
      allowComments,
      expiresAt,
      maxViews: viewLimit,
      sharePassword: usePassword ? password : undefined,
    })

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${baseUrl}/shared/${shareId}`
    setShareUrl(url)
  }

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleUnshare = () => {
    onUnshare()
    setShareUrl(null)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            {isShared
              ? 'Your project is currently shared. You can update sharing settings or unshare it.'
              : 'Share your project with others by generating a link.'}
          </DialogDescription>
        </DialogHeader>

        {shareUrl ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly className="flex-1" />
                <Button size="icon" variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Anyone with this link can view your project
                {usePassword ? ' (password protected)' : ''}.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="share-settings">Share Settings</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShareUrl(null)}
                >
                  Edit Settings
                </Button>
              </div>
              <div className="rounded-md border p-3 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Allow copying</span>
                  <span>{allowCopy ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allow comments</span>
                  <span>{allowComments ? 'Yes' : 'No'}</span>
                </div>
                {useExpiration && (
                  <div className="flex justify-between">
                    <span>Expires</span>
                    <span>
                      {expirationType === 'time'
                        ? `After ${expirationTime} days`
                        : `After ${maxViews} views`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Password protected</span>
                  <span>{usePassword ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="copy">Allow copying</Label>
                <p className="text-xs text-muted-foreground">
                  Let viewers copy your project structure
                </p>
              </div>
              <Switch
                id="copy"
                checked={allowCopy}
                onCheckedChange={setAllowCopy}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comments">Allow comments</Label>
                <p className="text-xs text-muted-foreground">
                  Let viewers leave comments on your project
                </p>
              </div>
              <Switch
                id="comments"
                checked={allowComments}
                onCheckedChange={setAllowComments}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiration">Set expiration</Label>
                <p className="text-xs text-muted-foreground">
                  Limit how long the share link is valid
                </p>
              </div>
              <Switch
                id="expiration"
                checked={useExpiration}
                onCheckedChange={setUseExpiration}
              />
            </div>

            {useExpiration && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="expiration-type">Expiration type</Label>
                    <Select
                      value={expirationType}
                      onValueChange={value =>
                        setExpirationType(value as 'time' | 'views')
                      }
                    >
                      <SelectTrigger id="expiration-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="time">Time-based</SelectItem>
                        <SelectItem value="views">View-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {expirationType === 'time' ? (
                    <div>
                      <Label htmlFor="expiration-time">Days</Label>
                      <Select
                        value={expirationTime}
                        onValueChange={setExpirationTime}
                      >
                        <SelectTrigger id="expiration-time">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="max-views">Max views</Label>
                      <Select value={maxViews} onValueChange={setMaxViews}>
                        <SelectTrigger id="max-views">
                          <SelectValue placeholder="Select views" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 view</SelectItem>
                          <SelectItem value="5">5 views</SelectItem>
                          <SelectItem value="10">10 views</SelectItem>
                          <SelectItem value="25">25 views</SelectItem>
                          <SelectItem value="50">50 views</SelectItem>
                          <SelectItem value="100">100 views</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="password">Password protection</Label>
                <p className="text-xs text-muted-foreground">
                  Require a password to view your project
                </p>
              </div>
              <Switch
                id="password"
                checked={usePassword}
                onCheckedChange={setUsePassword}
              />
            </div>

            {usePassword && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="password-input">Password</Label>
                <Input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter a password"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {isShared && (
            <Button variant="destructive" onClick={handleUnshare}>
              Unshare Project
            </Button>
          )}

          {!shareUrl && (
            <Button onClick={handleShare} className="mt-2 sm:mt-0">
              {isShared ? 'Update Share Settings' : 'Generate Share Link'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
