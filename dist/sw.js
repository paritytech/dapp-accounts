var serviceWorkerOption = {
  "assets": [
    "/a1bbd14f85531b56ba42.worker.js",
    "/assets/unknown-64x64.47a5c5b596657fb9d49aa88680303bfd.png",
    "/fonts/icons674f50d287a8c48dc19ba404d20fe713.eot",
    "/assets/flags.9c74e172f87984c48ddf5c8108cabe67.png",
    "/fonts/iconsaf7ae505a9eed503f8b8e6982036873e.woff2",
    "/fonts/iconsfee66e712a8a08eef5805a46892932ad.woff",
    "/fonts/iconsb06871f281fee6b241d60582ae9369b9.ttf",
    "/assets/icons.912ec66d7572ff821749319396470bde.svg",
    "/assets/unknown.09a220f1d36a6be4532929ed35e598f0.svg",
    "/assets/ethereum-black-64x64.fa56d82ce69918427cc96d896805da82.png",
    "/assets/parity-logo-black-no-text.71cc5be1abfa5c065bab48e7d91084c7.svg",
    "/bundle.js"
  ]
};
        
        /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
















var _swToolbox = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"sw-toolbox\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));var _swToolbox2 = _interopRequireDefault(_swToolbox);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

/**
                                                                                                                                                                                           * Cache the SOLC files : if not available, make a network request
                                                                                                                                                                                           */
_swToolbox2.default.router.any(/rawgit.com\/ethereum\/solc-bin(.+)list\.json$/, _swToolbox2.default.networkFirst); // Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.
// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.
_swToolbox2.default.router.any(/rawgit.com\/ethereum\/solc-bin(.+)soljson(.+)\.js$/, _swToolbox2.default.cacheFirst);self.addEventListener('install', function (event) {event.waitUntil(self.skipWaiting());});self.addEventListener('activate', function (event) {event.waitUntil(self.clients.claim());});;var _temp = function () {if (typeof __REACT_HOT_LOADER__ === 'undefined') {return;}}();;

/***/ })
/******/ ]);
//# sourceMappingURL=sw.js.map