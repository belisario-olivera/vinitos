import { Eye, EyeOff, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { WinePrivacy } from '@/types/wine';

type PrivacyBadgeProps = {
  privacy: WinePrivacy;
};

const CONFIG = {
  private: { icon: EyeOff, label: 'Private', variant: 'secondary' as const },
  shared: { icon: Eye, label: 'Shared', variant: 'outline' as const },
  public: { icon: Globe, label: 'Public', variant: 'default' as const },
} as const;

export const PrivacyBadge = ({ privacy }: PrivacyBadgeProps) => {
  const { icon: Icon, label, variant } = CONFIG[privacy];

  return (
    <Badge variant={variant} className="gap-1 text-xs">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};
