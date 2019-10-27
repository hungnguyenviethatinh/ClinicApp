const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
    const IsDevelopment = argv.mode === 'development';

    const Index = new HtmlWebPackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        chunks: ['react', 'material-ui', 'index']
    });

    const MiniCssExtract = new MiniCssExtractPlugin({
        filename: IsDevelopment ? 'static/css/[name].min.css' : 'static/css/[name].[contenthash].min.css',
    });

    const CleanWebpack = new CleanWebpackPlugin();

    const plugins = [
        CleanWebpack,
        MiniCssExtract,
        Index,
    ];

    const config = {
        devtool: IsDevelopment ? 'source-map' : '',
        entry: {
            index: './src/index.js',
        },
        output: {
            filename: IsDevelopment ? 'static/js/[name].bundle.js' : 'static/js/[name].[contenthash].bundle.js',
            path: IsDevelopment ? path.resolve(__dirname, 'build') : path.resolve(__dirname, 'dist'),
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.s(a|c)ss$/,
                    loader: [
                        IsDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: IsDevelopment,
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'static/images/',
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'static/fonts/',
                            }
                        }
                    ]
                },
            ]
        },
        plugins: plugins,
        optimization: {
            splitChunks: {
                cacheGroups: {
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                        name: 'react',
                        chunks: 'all',
                    },
                    materialui: {
                        test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
                        name: 'material-ui',
                        chunks: 'all',
                    },
                }
            }
        },

        devServer: {
            contentBase: 'build',
            compress: true,
            port: 9000,
        },
        watch: IsDevelopment,
        watchOptions: {
            ignored: ['node_modules', 'public', 'dist'],
        }
    };

    return config;
};