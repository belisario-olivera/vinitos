import Link from 'next/link';
import { Wine, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateProps = {
  title?: string;
  description?: string;
  showAction?: boolean;
};

export const EmptyState = ({
  title = 'No wines found',
  description = 'Start building your wine journal by logging your first bottle.',
  showAction = true,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <Wine className="h-8 w-8 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {showAction && (
        <Button render={<Link href="/log" />}>
          <Plus className="mr-1 h-4 w-4" />
          Log Your First Bottle
        </Button>
      )}
    </div>
  );
};
