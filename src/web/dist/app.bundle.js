/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "d025a18ddaa82385fbe6"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(Object.defineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(Object.defineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	 //require("!style!css!./src/web/assets/css/style.css");
	 //require("!style!css!./src/web/assets/css/ie.css");
	// require("./src/app/app.js");
	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);



/***/ },
/* 1 */
/***/ function(module, exports) {

	window.testData =  [
	{
	  "_type": "Ads",
	  "image": {
	    "cover": "http://file4.batdongsan.com.vn/crop/745x510/2015/04/10/raCcHWvA/20150410134022-9c8d.jpg",
	    "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2015/04/10/raCcHWvA/20150410134022-9c8d.jpg",
	    "images_small": [
	      "http://file4.batdongsan.com.vn/resize/80x60/2015/04/10/raCcHWvA/20150410134022-9c8d.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2015/04/10/raCcHWvA/20150410134026-4fa1.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2015/04/10/raCcHWvA/20150410134013-6bbf.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2015/04/10/raCcHWvA/20150410134007-e0a3.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2015/04/10/raCcHWvA/20150410133956-f528.jpg"
	    ],
	    "images": [
	      "http://file4.batdongsan.com.vn/resize/745x510/2015/04/10/raCcHWvA/20150410134022-9c8d.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2015/04/10/raCcHWvA/20150410134026-4fa1.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2015/04/10/raCcHWvA/20150410134013-6bbf.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2015/04/10/raCcHWvA/20150410134007-e0a3.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2015/04/10/raCcHWvA/20150410133956-f528.jpg"
	    ]
	  },
	  "adsID": "BÁN BIỆT THỰ DIỆN TÍCH 142M2 Ở HOÀNG MAI, HÀ NỘI",
	  "dangBoi": {
	    "userID": "matchiakhoa@icloud.com",
	    "email": "matchiakhoa@icloud.com",
	    "name": "mất chìa khóa",
	    "phone": "0983456780"
	  },
	  "ngayDangTin": "09-04-2016",
	  "gia": 10900,
	  "dienTich": 142,
	  "place": {
	    "geo": {
	      "lat": 20.9869785197508,
	      "lon": 105.85273479259001
	    },
	    "diaChi": "Đường Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội",
	    "diaChinh": {
	      "tinh": "Hà Nội",
	      "huyen": "Hoàng Mai",
	      "xa": "Đường Nguyễn Đức Cảnh"
	    },
	    "duAnFullName": null,
	    "diaChinhFullName": "Đường Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội"
	  },
	  "loaiTin": 0,
	  "loaiNhaDat": 4,
	  "ten_loaiTin": "Bán",
	  "ten_loaiNhaDat": "Biệt thự, liền kề",
	  "chiTiet": "Cần bán biệt thự sân vườn 4 tầng đã hoàn thiện. Khung cửa, cầu thang, sàn nhà làm bằng gỗ hương đẹp. Phòng tắm, vệ sinh hiện đại.Nhà gồm 4 phòng ngủ, 1 phòng thờ, 1 phòng giặt phơi, 1 phòng khách, 1 phòng ăn, 1 garage, 1 hầm rươu. Sân vườn trước và sau.Diện tích:142m2Giá: 10.9 tỷ Liên hệ: 0983456780.\r\n        \r\n            Tìm kiếm theo từ khóa: \r\n        \r\n                Bán biệt thự 142m2 Hoàng Mai Hoàng Mai\r\n            \r\n                , \r\n            \r\n                Bán biệt thự 142m2 Hoàng Mai\r\n            \r\n                , \r\n            \r\n                Bán biệt thự dự án 142m2 Hoàng Mai"
	}
	,

	{
	  "_type": "Ads",
	  "image": {
	    "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/03/30/20160330134616-2ece.jpg",
	    "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/03/30/20160330134616-2ece.jpg",
	    "images_small": [
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/30/20160330134616-2ece.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/30/20160330134647-5245.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/30/20160330134655-35e8.jpg"
	    ],
	    "images": [
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/30/20160330134616-2ece.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/30/20160330134647-5245.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/30/20160330134655-35e8.jpg"
	    ]
	  },
	  "adsID": "BÁN BIỆT THỰ, NHÀ PHỐ TẠI KĐT ECOPARK KHU VƯỜN TÙNG-VƯỜN MAI- AQUABAY GIÁ TỐT NHẤT, LH 0912.893.882",
	  "dangBoi": {
	    "userID": "loi.gpost@gmail.com",
	    "email": "loi.gpost@gmail.com",
	    "name": "nguyễn đức lợi",
	    "phone": "0974848998"
	  },
	  "ngayDangTin": "09-04-2016",
	  "gia": null,
	  "dienTich": null,
	  "place": {
	    "duAn": "Khu đô thị Ecopark",
	    "geo": {
	      "lat": 20.97170192976994,
	      "lon": 105.92677592834457
	    },
	    "diaChi": "Dự án Ecopark, Văn Giang, Hưng Yên",
	    "diaChinh": {
	      "tinh": "Hưng Yên",
	      "huyen": "Văn Giang"
	    },
	    "duAnFullName": "Khu đô thị Ecopark, Văn Giang, Hưng Yên",
	    "diaChinhFullName": "Dự án Ecopark, Văn Giang, Hưng Yên"
	  },
	  "loaiTin": 0,
	  "loaiNhaDat": 4,
	  "ten_loaiTin": "Bán",
	  "ten_loaiNhaDat": "Biệt thự, liền kề",
	  "chiTiet": "Bán biệt thự, nhà phố tại KĐT EcoPark, khu Vườn Tùng - Vườn Mai - Aquabay giá tốt nhất thị trường, LH: 0912 893 882.\r\r+ Biệt thự Vườn Tùng - Vườn Mai xây thô hoàn thiện mặt ngoài.\r1. Biệt thự song lập, diện tích cơ bản 162 m2, giá bán từ 41 tr/m2.\r2. Biệt thự đơn lập, diện tích cơ bản từ 324 m2, giá bán từ 35tr/m2.\rVà còn nhiều loại diện tích khác, căn góc, mặt lõi vườn hoa, VIP vị trí đẹp theo nhu cầu của khách hàng.\r\rLH: 0974 84 8998, để mua được giá tốt nhất.\rTư vấn nhiệt tình, trung thực.\r\r+ Biệt thự - nhà phố Aqua Bay EcoPark, biệt thự Mimosa, biệt thự Marina, nhà phố Thảo Nguyên, Thủy Nguyên.\r1. Biệt thự Mimosa & Marina diện tích 189m2 - 210m2 - 400m2 - 712m2.\r2. Nhà phố Thảo Nguyên, Thủy Nguyên diện tích: 90m2 - 100m2 - 110m2 - 180m2 - 200m2 - 250m2 - 300m2.\rVị trí đẹp, giá tốt nhất thị trường, thủ tục nhanh gọn.\rMọi thông tin chi tiết xin liên hệ:\rTel: 0912 893 882 - 0974 84 8998.\rTrân trọng!\r\n        \r\n            Tìm kiếm theo từ khóa: \r\n        \r\n                Bán biệt thự Ecopark Văn Giang\r\n            \r\n                , \r\n            \r\n                Bán biệt thự Ecopark\r\n            \r\n                , \r\n            \r\n                Bán biệt thự dự án Ecopark"
	},
	{
	  "_type": "Ads",
	  "image": {
	    "cover": "http://file4.batdongsan.com.vn/crop/745x510/2016/03/29/20160329100405-0146.jpg",
	    "cover_small": "http://file4.batdongsan.com.vn/crop/120x90/2016/03/29/20160329100405-0146.jpg",
	    "images_small": [
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/29/20160329100405-0146.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/29/20160329100411-ff4d.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/29/20160329100432-b663.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/29/20160329100502-d46e.jpg",
	      "http://file4.batdongsan.com.vn/resize/80x60/2016/03/29/20160329100539-1145.jpg"
	    ],
	    "images": [
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/29/20160329100405-0146.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/29/20160329100411-ff4d.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/29/20160329100432-b663.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/29/20160329100502-d46e.jpg",
	      "http://file4.batdongsan.com.vn/resize/745x510/2016/03/29/20160329100539-1145.jpg"
	    ]
	  },
	  "adsID": "BÁN CĂN HỘ GREEN STARS SUẤT NGOẠI GIAO GIÁ TỪ 24 TR/M2 - NHẬN NGAY NHÀ MỚI TƯ VẤN XEM NHÀ MIỄN PHÍ",
	  "dangBoi": {
	    "userID": "tranhhai123456@gmail.com",
	    "email": "tranhhai123456@gmail.com",
	    "name": "Lê Thị Mỹ Linh",
	    "phone": "0981023245"
	  },
	  "ngayDangTin": "09-04-2016",
	  "gia": 1444.8000000000002,
	  "dienTich": 60.2,
	  "place": {
	    "duAn": "Green Stars",
	    "geo": {
	      "lat": 21.05186800701654,
	      "lon": 105.78082561492954
	    },
	    "diaChi": "Dự án Green Stars, Đường Phạm Văn Đồng, Phường Cổ Nhuế 1, Bắc Từ Liêm, Hà Nội",
	    "diaChinh": {
	      "tinh": "Hà Nội",
	      "huyen": "Bắc Từ Liêm",
	      "xa": "Phường Cổ Nhuế 1",
	      "duong": "Đường Phạm Văn Đồng"
	    },
	    "duAnFullName": "Green Stars, Bắc Từ Liêm, Hà Nội",
	    "diaChinhFullName": "Dự án Green Stars, Đường Phạm Văn Đồng, Phường Cổ Nhuế 1, Bắc Từ Liêm, Hà Nội"
	  },
	  "soPhongNgu": 2,
	  "loaiTin": 0,
	  "loaiNhaDat": 1,
	  "ten_loaiTin": "Bán",
	  "ten_loaiNhaDat": "Căn hộ chung cư",
	  "chiTiet": "Dự án Green Stars nằm trong khu đô thị xanh, với hồ nước không gian thiên nhiên thoáng đãng, đáp ứng việc nghỉ ngơi tối ưu sau một ngày dài làm việc.Được đầu tư bởi tập đoàn Geleximco uy tín thương hiệu trên thị trường Hà Nội, cung cấp đến khách hàng một tiêu chuẩn sống đẳng cấp vượt trội mới. Đây là sự kết hợp hoàn chính giữa bất động sản nhà ở và dịch vụ khu đô thị tiện nghi cao cấp, không gian sống.Căn hộ tại Thành phố Giao lưu mang hơi thở cuộc sống mới thoải mái trong lành, cùng với sự hiện đại năng động. Đồng thời kiến tạo cho người dân với quy hoạch đồng bộ, nhà ở chất lượng, dịch vụ xứng tầm, môi trường trong lành an, an ninh đảm bảo.* Tiện ích: Trung tâm thương mại Vincom lớn nhất quận Bắc Từ Liêm tại tầng hầm dự án đưa vào sử dụng. Ngoài ra còn siêu thị Metro để cư dân mua sắm rau củ quả.Trường liên cấp: Trường mẫu giáo, tiểu học, cấp II Phạm Văn Đồng, cấp III.* Gần các trường đại học như đại học Ngoại Ngữ, ĐH Quốc Gia, Học Viện Báo Chí, Sư Phạm, gần bệnh viện E...* Diện tích phù hợp, tận dụng triệt để không gian sống:- 2 phòng ngủ: 60.2m2 - 66,8m2 (1 căn 60.2m2, 5 căn 66.8m2).- 3 phòng ngủ: Căn thường 102m2 (tặng 15 triệu), căn góc 102m2 (tặng 5 triệu).Tòa A3 ký hợp đồng trực tiếp chủ đầu tư!Các căn ngoại giao Bộ Công An giá từ 24,2 tr đến 27,5 tr/m2.Nhận nhà ngay!Giá từ: Từ 24tr - 28 triệu/m2.Dự án được Ngân hàng BIDV, Vietinbank, PV Bank, MB, VP Bank... Hỗ trợ tới 70% giá trị căn hộ, thủ tục đơn giản nhanh chóng.Để lựa chọn căn hộ đẹp và ưng ý nhất cũng như đi xem khu đô thị quý khách vui lòng gọi theo số: – 0989 62 93 62.1. Đóng 30% ký HĐMB. Trong vòng 5 đến 7 ngày khi đặt cọc mua căn hộ.2. Trước 10/03/2016 đóng 40%.3. Nhận bàn giao 25% + PBT.4. Bàn giao sổ thanh toán 5% còn lại.Quý khách có thể đóng đủ 95% để nhận nhà sớm hơn.Xem nhà ngay khi có yêu cầu!Hotline: 0989 62 93 62.\r\n        \r\n            Tìm kiếm theo từ khóa: \r\n        \r\n                Bán chung cư Tòa A3 Green Stars\r\n            \r\n                , \r\n            \r\n                Bán căn hộ Green Stars Bắc Từ Liêm\r\n            \r\n                , \r\n            \r\n                Bán căn hộ Green Stars\r\n            \r\n                , \r\n            \r\n                Bán chung cư Tòa A3 Green Stars\r\n            \r\n                , \r\n            \r\n                Bán căn hộ Green Stars Bắc Từ Liêm\r\n            \r\n                , \r\n            \r\n                Bán căn hộ Green Stars"
	},
	{
	  "title": "3 ĐIỀU KHÁCH HÀNG CẦN PHẢI LƯU TÂM KHI CHỌN MUA BIỆT THỰ VINHOMES RIVERSIDE LONG BIÊN",
	  "images_small": [
	    "http://file4.batdongsan.com.vn/resize/80x60/2016/04/02/20160402112917-e2aa.jpg",
	    "http://file4.batdongsan.com.vn/resize/80x60/2016/04/02/20160402112923-efb3.jpg",
	    "http://file4.batdongsan.com.vn/resize/80x60/2016/04/02/20160402112928-16a8.jpg",
	    "http://file4.batdongsan.com.vn/resize/80x60/2016/04/02/20160402112935-0433.jpg"
	  ],
	  "price_value": "Thỏa",
	  "price_unit": "thuận",
	  "dienTich": null,
	  "area_full": "Không xác định",
	  "loc": "Bán nhà biệt thự, liền kề tại Vinhomes Riverside - Quận Long Biên - Hà Nội",
	  "hdLat": 21.0464653799386,
	  "hdLong": 105.91568207740806,
	  "duAn": "Vinhomes Riverside",
	  "diaChi": "Dự án Vinhomes Riverside, Long Biên, Hà Nội",
	  "maSo": "9043877",
	  "loaiTinRao": "Bán nhà biệt thự, liền kề (nhà trong dự án quy hoạch)",
	  "ngayDangTin": "02-04-2016",
	  "ngayHetHan": "12-04-2016",
	  "soTang_full": "3\r\n                                    (tầng)",
	  "soPhongNgu_full": "4(phòng)",
	  "soPhongTam_full": "4",
	  "tenLienLac": "tungmanh",
	  "cust_phone": "0966002151",
	  "cust_mobile": "0966002151",
	  "cust_email": "tungmanhvinhomes@gmail.com",
	  "cust_dangBoi": "tungmanh",
	  "loaiTin": 0,
	  "loaiNhaDat": 4,
	  "ten_loaiTin": "Bán",
	  "ten_loaiNhaDat": "Bán biệt thự, liền kề",
	  "soPhongNgu": 4,
	  "soTang": 3,
	  "soPhongTam": 4,
	  "gia": null,
	  "place": {
	    "duAn": "Vinhomes Riverside",
	    "geo": {
	      "lat": 21.0464653799386,
	      "lon": 105.91568207740806
	    },
	    "diaChi": "Dự án Vinhomes Riverside, Long Biên, Hà Nội",
	    "diaChinh": {
	      "tinh": "Hà Nội",
	      "huyen": "Long Biên"
	    },
	    "duAnFullName": "Vinhomes Riverside, Long Biên, Hà Nội"
	  },
	  "_type": "Ads",
	  "cover": "http://file4.batdongsan.com.vn/crop/120x90/2016/04/02/20160402112917-e2aa.jpg"
	}
	]


	window.hot_ads_cat = [
	  {
	    name: "Biệt thự",
	    location: "Hồ Tây",
	    list: window.testData
	  },
	  {
	    name: "Chung cư",
	    location: "Thanh Xuân",
	    list: window.testData 
	  }
	];



/***/ },
/* 2 */
/***/ function(module, exports) {

	(function() {
	  'use strict';
	  window.initData = {};
	  var bds= angular.module('bds', ['ngCookies','ui.router','nemLogging','uiGmapgoogle-maps','ui.bootstrap'])
	  .run(['$rootScope', '$cookieStore', function($rootScope, $cookieStore){
	    $rootScope.globals = $cookieStore.get('globals') || {};
	  }]);
	  bds.config(function($stateProvider, $urlRouterProvider,$locationProvider){
	      // For any unmatched url, send to /route1
	      $locationProvider.html5Mode(true);
	      //$urlRouterProvider.otherwise("/web/list.html")
	      //alert('sss');
	      $stateProvider
	      .state('list', {
	        url: "/list.html",
	        templateUrl: '/web/list.html',
	        controller: "MainCtrl",
	        resolve: {
	          title: function(HouseService) {
	            //alert(HouseService);
	            return [{'a':'a'}];
	          }
	        },
	        data: {
	            bodyClass: "page-list"
	        } 
	      }).state('search', {
	        url: "/search.html",
	        templateUrl: "/web/search.html",
	        controller: "MainCtrl",
	        resolve: {
	          title: function(HouseService) {
	            var result = HouseService.getAllAds();
	            result.then(function(data){
	              window.initData = data.data;
	            }); 
	            return result;
	          }
	        },
	        data: {
	            bodyClass: "page-search",
	            //abc: title
	        } 
	        // ,
	        // controller: function($scope,sellingHouses){
	        //   $scope.sellingHouses = sellingHouses;
	        //   //alert(sellingHouses.length);
	        // }
	      }).state('home', {
	        url: "/index.html",
	        templateUrl: "/web/index_content.html",
	        controller: "MainCtrl",
	        resolve: {
	          title: function(HouseService) {
	            //alert(HouseService);
	            //return HouseService.getAllAds();
	            /*.then(function(data){
	              return data.data;
	            });*/
	            //return $http.get("http://www.dantri.com");
	            window.initData = [{a:'a'},{b:'b'}];
	          }
	        },
	        data: {
	            bodyClass: "page-home",
	            xyz: [{a:'b'}],
	            //abc: title
	        }
	        // ,
	        // controller: function($scope, adsList){
	        //   $scope.sellingHouses = adsList;
	        //   alert(adsList.length);
	        // }
	      })
	    });

	  })();

	  hello = function (){
	    alert('hello buddy! how are you today?');
	  }


/***/ },
/* 3 */
/***/ function(module, exports) {

	(function() {
		'use strict';
		var controllerId = 'MainCtrl';
		angular.module('bds').controller(controllerId,function ($rootScope,$http, $scope,$state,HouseService){
			var vm = this;
			init();
			//vm.initData = initData;
			vm.getAllAds = function(){
				HouseService.getAllAds().then(function(res){
					vm.sellingHouses = res.data;
					$scope.markers = [];
					for(var i = 0; i < res.data.length; i++) { 
			    		var ads = res.data[i];
			    		if(res.data[i].map)
			    			$scope.markers.push(res.data[i].map.marker);
					}
				});
			}
			
			$scope.$on('$viewContentLoaded', function(){
				//addCrudControls
				window.DesignCommon.adjustPage();
				if($state.current.data)
					$scope.bodyClass = $state.current.data.bodyClass
				// window.onresize = function() {
				//     window.DesignCommon.resizePage();
				// }
			});
			
			
			/*$scope.markers = [{
				id: 0,
				coords: {
					latitude: 10.762622,
					longitude: 106.660172
				},
				data: 'restaurant'
			}, {
				id: 1,
				coords: {
					latitude: 21.033333,
					longitude: 105.849998
				},
				data: 'house'
			}, {
				id: 2,
				coords: {
					latitude: 16.0439,
					longitude: 108.199
				},
				data: 'hotel'
			}];*/
			var _selected;
	  		$scope.selected = undefined;
	  		$scope.selected = undefined;
	  $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
	  		$scope.getLocation = function(val) {
	    return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
	      params: {
	        address: val,
	        sensor: false
	      }
	    }).then(function(response){
	      return response.data.results.map(function(item){
	        return item.formatted_address;
	      });
	    });
	  };
	$scope.ngModelOptionsSelected = function(value) {
	    if (arguments.length) {
	      _selected = value;
	    } else {
	      return _selected;
	    }
	  };

	  $scope.modelOptions = {
	    debounce: {
	      default: 500,
	      blur: 250
	    },
	    getterSetter: true
	  };
			vm.createHouse = function(desc,seller,email){
	        	vm.getLocation();
	        	return;
	        	HouseService.createHouse(desc,seller,email).then(function(res){
					//vm.sellingHouses = res.data;
					alert(res.data);
				});
				//alert("done");

			}
			vm.detailHouse = function(){
				alert('todo');

			}
			function init(){
				$scope.map = {center: {latitude: 16.0439, longitude: 108.199 }, zoom: 10 , control: {}};
				$scope.options = {scrollwheel: false,labelContent: 'gia'};
				$scope.markerCount = 3;
				$scope.markers = [];
				$scope.initData = window.initData;
				$scope.hot_ads_cat = window.hot_ads_cat;
				$scope.ads_list = window.testData;
				$scope.bodyClass= "page-home";
				for(var i = 0; i < $scope.ads_list.length; i++) { 
		    		var ads = $scope.ads_list[i];
		    		if(ads.place){
		    			if(ads.place.geo){
			    			ads.map={
			    				center: {
									latitude: 	ads.place.geo.lat,
									longitude: 	ads.place.geo.lon
								},
			    				marker: {
									id: i,
									coords: {
										latitude: 	ads.place.geo.lat,
										longitude: 	ads.place.geo.lon
									},
									options: {
										//labelContent : ads.gia,
										icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ ads.gia+ '|FF0000|000000'
									},
									data: 'test'
								},
								options:{
									scrollwheel: false
								},
								zoom: 14	
			    			}
			    			$scope.map.center = {latitude: ads.map.center.latitude, longitude: ads.map.center.longitude };
			    			$scope.markers.push(ads.map.marker);
			    					
						}
		    		}
				}

			}
			vm.getLocation = function () {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(vm.showPosition);
				} else {
					alert("Geolocation is not supported by this browser.");
				}
			}
			vm.showPosition =  function(position) {
				var lat = position.coords.latitude;
				var lng = position.coords.longitude;
				//$scope.map.center.latitude = lat;
				//$scope.map.center.longitude = lng;
				var marker = {
					id: $scope.markerCount,
					coords: {
						latitude: lat,
						longitude: lng
					},
					options: {
						labelContent : 'You are here'
					},
					data: 'restaurant'
				}
				$scope.markers.push(marker);
				$scope.markerCount = $scope.markerCount + 1;
				$scope.$digest();
			}

		});

		// /* @ngInject */
		// function MainCtrl() {
			
		// }
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	(function () {
	  'use strict';
	  angular
	  .module('bds')
	  .factory('HouseService', HouseService);
	  /* @ngInject */
	  function HouseService($http, $q, $rootScope) {
	    var urlPath = '/api/ads/getAllAds';
	    var service = {};
	    service.getAllAds = getAllAds;
	    service.createHouse = createHouse;
	    return service;

	    function getAllAds(){
	      console.log("Get all Ads");
	      	//return $http.get(urlPath);
	        var deferred = $q.defer()
	        deferred.resolve({data: window.testData});
	        return deferred.promise;
	      }
	      function createHouse(desc,email,seller){
	        return $http.post(urlPath + 'create'); 
	      }
	    }

	  })();


/***/ },
/* 5 */
/***/ function(module, exports) {

	var app = angular.module('AngularGoogleMap', ['uiGmapgoogle-maps']);

	app.factory('MarkerCreatorService', function () {

	    var markerId = 0;

	    function create(latitude, longitude) {
	        var marker = {
	            options: {
	                animation: 1,
	                labelAnchor: "28 -5",
	                labelClass: 'markerlabel'    
	            },
	            latitude: latitude,
	            longitude: longitude,
	            id: ++markerId          
	        };
	        return marker;        
	    }

	    function invokeSuccessCallback(successCallback, marker) {
	        if (typeof successCallback === 'function') {
	            successCallback(marker);
	        }
	    }

	    function createByCoords(latitude, longitude, successCallback) {
	        var marker = create(latitude, longitude);
	        invokeSuccessCallback(successCallback, marker);
	    }

	    function createByAddress(address, successCallback) {
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode({'address' : address}, function (results, status) {
	            if (status === google.maps.GeocoderStatus.OK) {
	                var firstAddress = results[0];
	                var latitude = firstAddress.geometry.location.lat();
	                var longitude = firstAddress.geometry.location.lng();
	                var marker = create(latitude, longitude);
	                invokeSuccessCallback(successCallback, marker);
	            } else {
	                alert("Unknown address: " + address);
	            }
	        });
	    }

	    function createByCurrentLocation(successCallback) {
	        if (navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition(function (position) {
	                var marker = create(position.coords.latitude, position.coords.longitude);
	                invokeSuccessCallback(successCallback, marker);
	            });
	        } else {
	            alert('Unable to locate current position');
	        }
	    }

	    return {
	        createByCoords: createByCoords,
	        createByAddress: createByAddress,
	        createByCurrentLocation: createByCurrentLocation
	    };

	});

	app.controller('MapCtrl', ['MarkerCreatorService', '$scope', function (MarkerCreatorService, $scope) {

	        MarkerCreatorService.createByCoords(40.454018, -3.509205, function (marker) {
	            marker.options.labelContent = 'Autentia';
	            $scope.autentiaMarker = marker;
	        });
	        
	        $scope.address = '';

	        $scope.map = {
	            center: {
	                latitude: $scope.autentiaMarker.latitude,
	                longitude: $scope.autentiaMarker.longitude
	            },
	            zoom: 12,
	            markers: [{
	        id: 0,
	        coords: {
	            latitude: 37.7749295,
	            longitude: -122.4194155
	        },
	        data: 'restaurant'
	    }, {
	        id: 1,
	        coords: {
	            latitude: 37.79,
	            longitude: -122.42
	        },
	        data: 'house'
	    }, {
	        id: 2,
	        coords: {
	            latitude: 37.77,
	            longitude: -122.41
	        },
	        data: 'hotel'
	    }],
	            control: {},
	            options: {
	                scrollwheel: false
	            }
	        };

	        $scope.map.markers.push($scope.autentiaMarker);

	        $scope.addCurrentLocation = function () {
	            MarkerCreatorService.createByCurrentLocation(function (marker) {
	                marker.options.labelContent = 'You´re here';
	                $scope.map.markers.push(marker);
	                refresh(marker);
	            });
	        };
	        
	        $scope.addAddress = function() {
	            var address = $scope.address;
	            if (address !== '') {
	                MarkerCreatorService.createByAddress(address, function(marker) {
	                    $scope.map.markers.push(marker);
	                    refresh(marker);
	                });
	            }
	        };

	        function refresh(marker) {
	            $scope.map.control.refresh({latitude: marker.latitude,
	                longitude: marker.longitude});
	        }

	    }]);



/***/ }
/******/ ]);