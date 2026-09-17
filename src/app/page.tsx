import { allConcepts } from "content-collections";

import { CodeBlock } from "@/components/app/code-block";
import { ConceptCard } from "@/components/app/concept-card";
import { ProseLink } from "@/components/app/prose-link";
import { RepoCard } from "@/components/app/repo-card";
import { groupBySection } from "@/lib/sections";
import { GITHUB_REPO, SITE_DESCRIPTION } from "@/lib/site";

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
        who likes computers and beautiful things. I also created a skill
        based on these guides:
      </p>
      <CodeBlock
        hideHeader
        tabs={[
          {
            label: "Terminal",
            language: "bash",
            code: `npx skills add ${GITHUB_REPO}`,
          },
        ]}
      />
      <p className="mt-3 text-sm text-muted-foreground">
        Also, if you want to contribute, here&apos;s the repo:
      </p>
      <RepoCard />
      <div className="mt-8 flex flex-col gap-12">
        {sections.map(({ section, concepts }) => (
          <section key={section}>
            <h2 className="text-sm font-medium">{section}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {concepts.map((concept) => (
                <ConceptCard
                  key={concept.slug}
                  slug={concept.slug}
                  title={concept.title}
                  description={
                    allConcepts.find((c) => c.slug === concept.slug)
                      ?.description
                  }
                  section={section}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
