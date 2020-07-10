const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
	configureWebpack: {
		plugins: [
			new CopyWebpackPlugin([
            {
              from: 'node_modules/cesium/Build/Cesium/Workers',
              to: 'cesium/Workers'
            }
          ]),
          new CopyWebpackPlugin([
            {
              from: 'node_modules/cesium/Build/Cesium/ThirdParty',
              to: 'cesium/ThirdParty'
            }
          ]),
          new CopyWebpackPlugin([
            { from: 'node_modules/cesium/Build/Cesium/Assets', to: 'cesium/Assets' }
          ]),
          new CopyWebpackPlugin([
            {
              from: 'node_modules/cesium/Build/Cesium/Widgets',
              to: 'cesium/Widgets'
            }
          ]),
          new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('./cesium')
          })
		],
		optimization: {
			minimize: process.env.NODE_ENV === "production" ? true : false
		}
	}
};
//原文地址:https://github.com/itoic/cesiumVueClean/