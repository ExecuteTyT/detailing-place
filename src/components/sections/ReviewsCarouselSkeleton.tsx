import { cn } from "@/lib/utils";

interface ReviewsCarouselSkeletonProps {
  className?: string;
}

export default function ReviewsCarouselSkeleton({ className }: ReviewsCarouselSkeletonProps) {
  return (
    <section className={cn("section-padding gradient-section", className)}>
      <div className="container-main">
        <div className="h-8 w-52 mx-auto bg-bg-card rounded animate-pulse mb-8" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-full md:w-[48%]">
              <div className="card p-5 space-y-3">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className="h-4 w-4 bg-bg-hover rounded animate-pulse"
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-bg-hover rounded animate-pulse" />
                  <div className="h-3 w-4/5 bg-bg-hover rounded animate-pulse" />
                </div>
                <div className="pt-3 border-t border-border space-y-1">
                  <div className="h-4 w-24 bg-bg-hover rounded animate-pulse" />
                  <div className="h-3 w-16 bg-bg-hover rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
