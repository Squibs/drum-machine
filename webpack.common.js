const path = require('path');
const HtmlWebpackTemplate = require('html-webpack-template');

// webpack plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackInlineManifestPlugin = require('webpack-inline-manifest-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

// postcss plugins
const autoprefixer = require('autoprefixer');
const precss = require('precss');

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/index.jsx'),
  },

  output: {
    filename: 'js/[name].[hash].js',
    chunkFilename: 'js/chunks/[id]-[name].[chunkhash].js', // code splitting (https://webpack.js.org/guides/code-splitting/)
    path: path.resolve(__dirname, './dist'),
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  /* =================================================================
   * !!!!!!!!! REMEMBER package.json -> sideEffects property !!!!!!!!!
   * ================================================================= */
  module: {
    rules: [

      { // repository babel is moving everything to (https://github.com/babel/babel)
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }, // transpiles .js files (https://github.com/babel/babel-loader)
      }, // setting NODE_ENV=development: use '&' (probably not needed in Webpack 4) (https://stackoverflow.com/a/33755445)

      {
        test: /\.s?css$/i,
        use: [
          {
            loader: 'css-loader', // interprets '@import' and 'url()' like 'import/require()' and will resolve them.
            options: {
              minimize: true,
            },
          },
          {
            loader: 'postcss-loader', // adds vendor prefixes; plugins (https://github.com/postcss/postcss)
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer(),
                precss(),
              ],
            },
          },
          { loader: 'sass-loader' }, // compiles Sass to CSS; uses node-sass (https://github.com/sass/node-sass)
        ],
      },

      {
        test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        include: /webfonts/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'webfonts/[name].[ext]',
              limit: 10000,
              fallback: 'file-loader',
            },
          },
        ],
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: /webfonts/i,
        use: [
          {
            loader: 'url-loader', // if the image is small enough: turns image into `base64` encoded URL
            options: {
              name: 'img/[name].[ext]',
              limit: 10 * 1024,
              fallback: 'file-loader', // use in development; emit required object as file and return its public URL
            },
          },
          { loader: 'img-loader' }, // minimizes images with imagemin (https://github.com/imagemin/imagemin)
        ],
      },

    ],
  },

  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({ // list of options (https://github.com/jantimon/html-webpack-plugin#options)
      inject: false,
      template: HtmlWebpackTemplate, // better default template for HtmlWebpackPlugin (https://github.com/jaketrent/html-webpack-template)
      title: 'Drum Machine',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
      ],
      bodyHtmlSnippet: '<div class="container"></div>',
      inlineManifestWebpackName: 'webpackManifest',
    }),
    new WebpackInlineManifestPlugin(), // using a fork of inline-manifest-webpack-plugin for webpack 4 (https://github.com/szrenwei/inline-manifest-webpack-plugin/issues/10)
    new FaviconsWebpackPlugin({ // generates favicons (https://github.com/jantimon/favicons-webpack-plugin)
      logo: './assets/images/favicon.svg',
      prefix: 'favicons/',
      emitStats: false,
      statsFilename: 'iconstats-[hash].json',
      persistentCache: true,
      inject: true,
      backgrond: '#fff',
      title: 'Drum Machine',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }),
    new ProgressBarPlugin(),
  ],
};
