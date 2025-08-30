'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Download,
  Eye,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  File,
} from 'lucide-react'
import { FileService } from '../services/file-service'
import type { FileAttachment } from '../services/file-service'

interface FileAttachmentProps {
  attachment: FileAttachment
  compact?: boolean
}

export function FileAttachmentComponent({
  attachment,
  compact = false,
}: FileAttachmentProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getFileIcon = () => {
    if (!attachment.mimeType) return <File className="h-4 w-4" />

    if (attachment.mimeType.startsWith('image/'))
      return <ImageIcon className="h-4 w-4" />
    if (attachment.mimeType.startsWith('video/'))
      return <Video className="h-4 w-4" />
    if (attachment.mimeType.startsWith('audio/'))
      return <Music className="h-4 w-4" />
    if (attachment.mimeType.includes('pdf'))
      return <FileText className="h-4 w-4" />
    if (
      attachment.mimeType.includes('zip') ||
      attachment.mimeType.includes('rar')
    )
      return <Archive className="h-4 w-4" />

    return <File className="h-4 w-4" />
  }

  const handleDownload = () => {
    if (attachment.data) {
      // Create download link for base64 data
      const link = document.createElement('a')
      link.href = attachment.data
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (attachment.url) {
      // Open URL in new tab
      window.open(attachment.url, '_blank')
    }
  }

  const canPreview = FileService.canPreview(attachment.mimeType)
  const isImage = FileService.isImageFile(attachment.mimeType)

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-background/50 rounded border text-xs">
        {getFileIcon()}
        <span className="truncate flex-1">{attachment.name}</span>
        {attachment.size && (
          <Badge variant="outline" className="text-xs">
            {FileService.formatFileSize(attachment.size)}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border">
        <div className="flex-shrink-0">
          {isImage &&
          (attachment.thumbnail || attachment.data) &&
          !imageError ? (
            <img
              src={attachment.thumbnail || attachment.data}
              alt={attachment.name}
              className="w-12 h-12 object-cover rounded"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
              {getFileIcon()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{attachment.name}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {attachment.size && (
              <span>{FileService.formatFileSize(attachment.size)}</span>
            )}
            {attachment.mimeType && (
              <Badge variant="outline" className="text-xs">
                {attachment.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <TooltipProvider>
            {canPreview && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Preview</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getFileIcon()}
              {attachment.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {isImage && (attachment.data || attachment.url) ? (
              <img
                src={attachment.data || attachment.url}
                alt={attachment.name}
                className="max-w-full h-auto mx-auto"
                onError={() => setImageError(true)}
              />
            ) : attachment.mimeType?.startsWith('text/') && attachment.data ? (
              <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded">
                {atob(attachment.data.split(',')[1] || '')}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                {getFileIcon()}
                <h3 className="mt-4 font-medium">Preview not available</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  This file type cannot be previewed. You can download it to
                  view the contents.
                </p>
                <Button onClick={handleDownload} className="mt-4">
                  <Download className="h-4 w-4 mr-2" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
