# Gatsby Boilerplate

A personal starting point for my Gatsby based projects. This starter / boilerplate is using `Gatsby`, `Typescript`, `Redux Toolkit`, and my general-use `linting` rules [[Squibs-Scripts](https://github.com/Squibs/squibs-scripts)].

## Folder Structure

[[Gatsby Folder Structure](https://www.gatsbyjs.com/docs/reference/gatsby-project-structure/)]

```
/
|-- /.cache
|-- /public
|-- /src
  |-- /images
  |-- /store
  |-- /structures
    |-- /components
    |-- /containers
    |-- /hooks
    |-- /layouts
    |-- /pages
    |-- /templates
  |-- /vistas
    |-- /design
    |-- /styles
    |-- /theme
|-- /static
|-- gatsby-browser.tsx
|-- gatsby-config.ts
|-- gatsby-node.ts
|-- gatsby-ssr.tsx
```

I figured I would try to figure out my own folder structure for something that makes sense to me. All of this will probably change after I do a few projects with this boilerplate and figure out more of what works for me.

I've grouped all non-style components together in a folder called `structures`. This is things like `components`, `containers`, `pages`, and `templates`, ect. Because I'm using [styled-components](https://styled-components.com/), my components will also have the styles alongside the component in the same file.

Since I'm using `styled-components` I wanted to group a lot of the global-type-styled-components into their own folder. I couldn't really decide on a folder name so I stuck with `vistas`. This will house:

- `design` which contains the enums that define the overall, "style variables," if you will.
- `styles` which is global css/styled styles
- `theme` which mostly translates the files in `design` into a globally accessible theme variable for css/styled
