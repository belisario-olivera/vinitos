'use client';

import { useState } from 'react';
import { Check, Copy, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ShareDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entryId: string;
  title: string;
};

export const ShareDialog = ({
  open,
  onOpenChange,
  entryId,
  title,
}: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/entry/${entryId}`
      : '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Share Entry
          </DialogTitle>
          <DialogDescription>
            Share your tasting notes for &quot;{title}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input value={shareUrl} readOnly className="font-mono text-sm" />
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
