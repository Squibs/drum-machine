import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `Squibs`,
    description: `A drum machine I created while going through the projects and lessons at freeCodeCamp.`,
    author: `@SquibsVids`,
    siteUrl: `https://https://squibs.github.io/drum-machine`,
  },
  plugins: [
    {
      // used to point to where pages folder is for gatsby
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: `src/structures/pages`,
      },
    },
    `gatsby-plugin-image`, // produces images in multiple sizes
    {
      // sourcing data into your Gatsby application from your local filesystem
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/media/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `sounds`,
        path: `${__dirname}/src/media/sounds`,
      },
    },
    `gatsby-plugin-sharp`, // image processing functions from the sharp image processing library
    `gatsby-transformer-sharp`, // creates image-sharp nodes from image types supported by the sharp image processing library
    {
      // gatsby manifest generation
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `squibs-gatsby-starter`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/media/images/favicon.png`,
      },
    },
    `gatsby-plugin-styled-components`, // styled-components
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Righteous`],
      },
    },
  ],
};

export default config;
