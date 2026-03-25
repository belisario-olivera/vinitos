import { Skeleton } from '@/components/ui/skeleton';

const JournalLoading = () => {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-40" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
      <Skeleton className="mb-6 h-10 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-lg" />
        ))}
      </div>
    </div>
  );
};

export default JournalLoading;
