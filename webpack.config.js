const path = require("path");

module.exports = {
  mode: 'development',
  entry: {
    app: './src/App.tsx',
  },
  output: {
    filename: (pathData) => {
      return pathData.chunk.name === 'extension' ? '[name].js' : 'bundle.js';
    },
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    vscode: 'commonjs vscode', // vscodeモジュールはcommonjs形式で外部依存とする
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
