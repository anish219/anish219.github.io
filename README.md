# Anish Ravichandran's website

This site uses [Eleventy](https://www.11ty.dev/). Pages, projects, news, and blog posts are Markdown files with frontmatter; layouts use Nunjucks.

## Preview locally

Use Node.js 22.12 or newer, then run:

```sh
npm install
npm run dev
```

Open <http://127.0.0.1:8765/>. Eleventy rebuilds when you save a file; refresh the browser to see the change. The preview server binds only to your computer. Stop it with Ctrl-C. Run `npm run build` to generate static files in the ignored `_site/` folder.

## Edit content

| What to edit | File or folder |
| --- | --- |
| About text and headline | `index.md` |
| Expanded CV | `cv.md` |
| Project notes and project list | `_projects/*.md` |
| News items | `_news/*.md` |
| Blog posts and series overview | `_posts/*.md` |
| Blog images and videos | `assets/blog/physical-ai/` |
| Name, photo, location, social links | `_data/site.json` |
| Shared page layout | `_includes/layouts/*.njk` |
| Styling | `styles.css` |

For a new project, copy a file in `_projects/`, update its metadata and body, and give it a unique `permalink` such as `/projects/new-project.html`. `order` controls its position on the homepage and `group` controls the year heading.

For a new blog post, copy `examples/post-template.md.txt` into `_posts/` with a `.md` extension. Edit its title, date, summary, permalink, and Markdown body. Use a descriptive permalink such as `/writing/what-i-learned.html` so the URL remains useful when shared on X. A post with the `posts` tag and `homepage_writing: false` has a direct page without its own homepage Writing entry.

## Physical AI series

The [series overview](_posts/physical-ai-series.md) is the single series entry in the homepage Writing section. The SO-101 project note lists the articles with `series: physical-ai` in `series_order`. Edit a post's `title`, `summary`, or `series_order` in frontmatter to update that list. Mermaid diagrams remain editable as fenced Markdown code and render on posts with `has_mermaid: true`. X embeds load from X when online and retain a direct link if the widget cannot load.

## Drafts and publication

The local `codex/markdown-site-draft` branch is the working area for unfinished posts. The public `master` branch should contain only approved posts and their media. The build includes every Markdown file in `_posts/`, so keep unfinished articles off the public branch. The repository is public: pushing a branch with drafts exposes their source and media through Git history even if a page is not linked from the homepage.

Prepare a clean publication branch from public `master`, copy over only approved files, review the generated pages and links, and then publish that clean branch. Never merge or push the local draft branch wholesale. Each page's `description` or `summary` becomes its link-preview description.
