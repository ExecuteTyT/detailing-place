import { cn } from "@/lib/utils";

interface WorkExamplesSkeletonProps {
  className?: string;
}

export default function WorkExamplesSkeleton({ className }: WorkExamplesSkeletonProps) {
  return (
    <section className={cn("section-padding", className)}>
      <div className="container-main">
        <div className="h-8 w-48 mx-auto bg-bg-card rounded animate-pulse mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[80%] md:w-[45%] lg:w-[33%]"
            >
              <div className="card overflow-hidden">
                <div className="aspect-video bg-bg-hover animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-24 bg-bg-hover rounded animate-pulse" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 bg-bg-hover rounded-full animate-pulse" />
                    <div className="h-5 w-20 bg-bg-hover rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
