const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const withSass = require('@zeit/next-sass');
const withLess = require('@zeit/next-less');

const root = process.cwd();
if (fs.existsSync(path.join(root, '.env'))) {
  dotenv.config();
}

const sassConfig = withSass({
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[hash:base64:5]'
  },
  sassLoaderOptions: {
    implementation: require('sass'),
    sassOptions: {
      fiber: require('fibers')
    }
  }
});

const lessConfig = withLess({
  lessLoaderOptions: {
    javascriptEnabled: true,
    modifyVars: {} // make your antd custom effective
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/;
      const origExternals = [...config.externals];
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback();
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback);
          } else {
            callback();
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals)
      ];

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader'
      });
    }
    return config;
  }
});

module.exports = {
  webpack(config, options) {
    // externals react and react-dom
    if (!options.isServer) {
      config.externals = {
        react: 'React',
        'react-dom': 'ReactDOM',
        moment: 'moment',
        antd: 'antd'
      };
    }
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias['@'] = path.resolve(__dirname);
    const temp = lessConfig.webpack(config, options);
    return sassConfig.webpack(temp, options);
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  basePath: process.env.BASE_URL || ''
};
