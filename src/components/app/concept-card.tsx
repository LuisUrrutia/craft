import Link from "next/link";

import { ConceptThumbnail } from "@/components/thumbnails";
import { isConceptAvailable } from "@/lib/concepts";
import type { Section } from "@/lib/sections";

const CARD =
  "group block overflow-hidden rounded-2xl bg-card shadow-(--custom-shadow) hover:bg-muted/5 dark:hover:bg-card/80";

export function ConceptCard({
  slug,
  title,
  description,
  section,
}: {
  slug: string;
  title: string;
  description?: string;
  section: Section;
}) {
  const available = isConceptAvailable(slug);
  const content = (
    <>
      <div className="flex h-36 items-center justify-center">
        <ConceptThumbnail slug={slug} section={section} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate text-[13px] font-medium text-foreground">
            {title}
          </h3>
          {!available && (
            <span className="shrink-0 rounded-full border border-dashed border-sky-300 bg-sky-500/10 px-1.5 py-px text-[10px] leading-4 font-medium text-sky-600 dark:border-sky-900 dark:bg-sky-400/10 dark:text-sky-400">
              Soon
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>
    </>
  );

  return available ? (
    <Link href={`/${slug}`} className={CARD}>
      {content}
    </Link>
  ) : (
    <div
      aria-disabled="true"
      title="Coming soon"
      className={`${CARD} opacity-60 cursor-not-allowed select-none`}
    >
      {content}
    </div>
  );
}
