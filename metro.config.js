// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude backend directory from Metro bundler
config.resolver.blockList = [
  /app\/wine-recognition-backend\/.*/,
  /Pair\/app\/wine-recognition-backend\/.*/,
];

// Watch only the frontend directories
config.watchFolders = [path.resolve(__dirname)];

module.exports = config;
