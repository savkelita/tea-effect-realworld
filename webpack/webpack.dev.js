const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

// Api HOST, PORT, URL
const apiHost = process.env.APIHOST || 'localhost'
const apiUrl = `https://${apiHost}`
// const apiPort = process.env.APIPORT || 8080
// const apiUrl = `https://${apiHost}:${apiPort}`

console.log('\x1b[34b', 'Using API on: ', apiUrl)

module.exports = {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    server: 'https',
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/': {
        target: apiUrl,
        secure: false,
        changeOrigin: true,
      },
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.basename': JSON.stringify('/'),
    }),
  ],
}
