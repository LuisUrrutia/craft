import { allConcepts } from "content-collections";
import Link from "next/link";

import { ProseLink } from "@/components/app/prose-link";
import { ConceptThumbnail } from "@/components/thumbnails";
import { isConceptAvailable } from "@/lib/concepts";
import { groupBySection } from "@/lib/sections";
import { SITE_DESCRIPTION } from "@/lib/site";

export default function IndexPage() {
  const sections = groupBySection(
    allConcepts.map(({ title, slug, section, order }) => ({
      title,
      slug,
      section,
      order,
    }))
  );

  return (
    <article>
      <h1 className="text-base font-medium">Index</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {SITE_DESCRIPTION} These essays are short and simple, meant as a
        collection of useful ideas and tricks rather than an exhaustive
        resource.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        This project is brought to you by{" "}
        <ProseLink href="https://gustavofior.com">Gustavo</ProseLink>, a guy
        who likes computers and beautiful things. If you want to contribute,
        you can do so in the{" "}
        <ProseLink href="https://github.com/gustavo-fior/craft">
          GitHub repo
        </ProseLink>
        .
      </p>
      <div className="mt-8 flex flex-col gap-12">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="text-sm font-medium">{section}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => {
                const full = allConcepts.find((c) => c.slug === concept.slug);
                const available = isConceptAvailable(concept.slug);
                const content = (
                  <>
                    <div className="flex h-36 items-center justify-center">
                      <ConceptThumbnail slug={concept.slug} section={section} />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="truncate text-[13px] font-medium text-foreground">
                          {concept.title}
                        </h3>
                        {!available && (
                          <span className="shrink-0 rounded-full border border-dashed border-sky-300 bg-sky-500/10 px-1.5 py-px text-[10px] leading-4 font-medium text-sky-600 dark:border-sky-900 dark:bg-sky-400/10 dark:text-sky-400">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {full?.description}
                      </p>
                    </div>
                  </>
                );

                const cardClassName =
                  "group overflow-hidden rounded-2xl bg-card shadow-(--custom-shadow) hover:bg-muted/5 dark:hover:bg-card/80";

                return available ? (
                  <Link
                    key={concept.slug}
                    href={`/${concept.slug}`}
                    className={cardClassName}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={concept.slug}
                    aria-disabled="true"
                    title="Coming soon"
                    className={`${cardClassName} cursor-not-allowed select-none`}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
