import { Skeleton } from '@/components/ui/skeleton';

const EntryLoading = () => {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-32" />
      <div className="space-y-4 rounded-lg border p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

export default EntryLoading;
