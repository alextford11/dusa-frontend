import path from "path";
import webpack, {Configuration} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import {TsconfigPathsPlugin} from "tsconfig-paths-webpack-plugin";
import dotenv from "dotenv";

const webpackConfig = (env): Configuration => {
    console.log({
        ...Object.entries(
            dotenv.config({path: env.production ? ".env.production" : ".env"}).parsed
        ).reduce((acc, curr) => ({...acc, [`${curr[0]}`]: JSON.stringify(curr[1])}), {})
    });
    return {
        entry: "./src/index.tsx",
        ...(env.production || !env.development ? {} : {devtool: "eval-source-map"}),
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
            plugins: [new TsconfigPathsPlugin()]
        },
        output: {
            path: path.join(__dirname, "/dist"),
            filename: "build.js"
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    options: {
                        transpileOnly: true
                    },
                    exclude: /dist/
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html"
            }),
            new ForkTsCheckerWebpackPlugin(),
            new ESLintPlugin({files: "./src/**/*.{ts,tsx,js,jsx}"}),
            new webpack.DefinePlugin({
                ...Object.entries(
                    dotenv.config({path: env.production ? ".env.production" : ".env"}).parsed
                ).reduce((acc, curr) => ({...acc, [`${curr[0]}`]: JSON.stringify(curr[1])}), {})
            })
        ]
    };
};

export default webpackConfig;
