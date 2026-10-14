import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export default function (eleventyConfig) {
  eleventyConfig.addGlobalData("currentYear", new Date().getFullYear());
  eleventyConfig.addGlobalData("stylesVersion", createHash("sha256").update(readFileSync("styles.css")).digest("hex").slice(0, 8));
  eleventyConfig.addPassthroughCopy("styles.css");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({ "scripts/generated/mermaid.js": "assets/mermaid.js" });
  eleventyConfig.amendLibrary("md", (markdown) => {
    const defaultFence = markdown.renderer.rules.fence;
    markdown.renderer.rules.fence = (tokens, index, options, environment, self) => {
      const token = tokens[index];
      if (token.info.trim() === "mermaid") {
        return `<pre class="mermaid">${markdown.utils.escapeHtml(token.content)}</pre>`;
      }
      return defaultFence(tokens, index, options, environment, self);
    };
  });
  eleventyConfig.ignores.add(".local-preview/**");
  eleventyConfig.ignores.add("README.md");

  const byOrder = (items) => items.sort((a, b) => a.data.order - b.data.order);

  eleventyConfig.addCollection("projects", (api) =>
    byOrder(api.getFilteredByTag("projects")),
  );
  eleventyConfig.addCollection("news", (api) =>
    byOrder(api.getFilteredByTag("news")),
  );
  eleventyConfig.addCollection("writing", (api) =>
    api.getFilteredByTag("posts").filter((post) => post.data.homepage_writing !== false).sort((a, b) =>
      b.date - a.date || (a.data.series_order ?? 0) - (b.data.series_order ?? 0),
    ),
  );
  eleventyConfig.addCollection("physicalAiSeries", (api) =>
    api.getFilteredByTag("posts")
      .filter((post) => post.data.series === "physical-ai")
      .sort((a, b) => a.data.series_order - b.data.series_order),
  );
  eleventyConfig.addCollection("projectGroups", (api) => {
    const groups = [];
    for (const project of byOrder(api.getFilteredByTag("projects"))) {
      let group = groups.at(-1);
      if (!group || group.label !== project.data.group) {
        group = { label: project.data.group, projects: [] };
        groups.push(group);
      }
      group.projects.push(project);
    }
    return groups;
  });

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
