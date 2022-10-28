const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { paths } = baseWebpackConfig.externals;

const postCssLoader = {
    loader: 'postcss-loader',
    options: { 
        sourceMap: true
    }
};

module.exports = merge(baseWebpackConfig, {
    mode: 'production',

    output: {
        publicPath: ''
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /node_modules/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },

    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            url: false,
                        }
                    },
                    postCssLoader,
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            esModule: false,
                        }
                    },
                    postCssLoader
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: `${paths.assets}styles/[name].css`,
        })
    ],
});
