(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lime-js"), require("bluebird"), require("lime-transport-websocket"));
	else if(typeof define === 'function' && define.amd)
		define(["Lime", "Promise", "WebSocketTransport"], factory);
	else if(typeof exports === 'object')
		exports["MessagingHub"] = factory(require("lime-js"), require("bluebird"), require("lime-transport-websocket"));
	else
		root["MessagingHub"] = factory(root["Lime"], root["Promise"], root["WebSocketTransport"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Client = __webpack_require__(1);
	
	Object.defineProperty(exports, 'Client', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Client).default;
	  }
	});
	
	var _ClientBuilder = __webpack_require__(5);
	
	Object.defineProperty(exports, 'ClientBuilder', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_ClientBuilder).default;
	  }
	});
	
	var _Application = __webpack_require__(3);
	
	Object.defineProperty(exports, 'Application', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_Application).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _limeJs = __webpack_require__(2);
	
	var _limeJs2 = _interopRequireDefault(_limeJs);
	
	var _Application = __webpack_require__(3);
	
	var _Application2 = _interopRequireDefault(_Application);
	
	var _bluebird = __webpack_require__(4);
	
	var _bluebird2 = _interopRequireDefault(_bluebird);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var identity = function identity(x) {
	    return x;
	};
	
	var Client = function () {
	    // Client :: String -> Transport? -> Client
	    function Client(uri, transportFactory, application) {
	        _classCallCheck(this, Client);
	
	        var defaultApplication = new _Application2.default();
	
	        this._application = _extends({}, defaultApplication, application);
	
	        this._messageReceivers = [];
	        this._notificationReceivers = [];
	        this._commandResolves = {};
	        this.sessionPromise = new _bluebird2.default(function () {});
	
	        this._listening = false;
	        this._closing = false;
	        this._uri = uri;
	
	        this._transportFactory = typeof transportFactory === 'function' ? transportFactory : function () {
	            return transportFactory;
	        };
	        this._transport = this._transportFactory();
	
	        this._initializeClientChannel();
	    }
	
	    // connectWithGuest :: String -> Promise Session
	
	
	    _createClass(Client, [{
	        key: 'connectWithGuest',
	        value: function connectWithGuest(identifier) {
	            if (!identifier) throw new Error('The identifier is required');
	            this._application.identifier = identifier;
	            this._application.authentication = new _limeJs2.default.GuestAuthentication();
	            return this.connect();
	        }
	
	        // connectWithPassword :: String -> String -> Promise Session
	
	    }, {
	        key: 'connectWithPassword',
	        value: function connectWithPassword(identifier, password, presence) {
	            if (!identifier) throw new Error('The identifier is required');
	            if (!password) throw new Error('The password is required');
	            this._application.identifier = identifier;
	            this._application.authentication = new _limeJs2.default.PlainAuthentication();
	            this._application.authentication.password = password;
	            if (presence) this._application.presence = presence;
	            return this.connect();
	        }
	
	        // connectWithKey :: String -> String -> Promise Session
	
	    }, {
	        key: 'connectWithKey',
	        value: function connectWithKey(identifier, key, presence) {
	            if (!identifier) throw new Error('The identifier is required');
	            if (!key) throw new Error('The key is required');
	            this._application.identifier = identifier;
	            this._application.authentication = new _limeJs2.default.KeyAuthentication();
	            this._application.authentication.key = key;
	            if (presence) this._application.presence = presence;
	            return this.connect();
	        }
	    }, {
	        key: 'connect',
	        value: function connect() {
	            var _this = this;
	
	            this._closing = false;
	            return this._transport.open(this.uri).then(function () {
	                return _this._clientChannel.establishSession(_this._application.compression, _this._application.encryption, _this._application.identifier + '@' + _this._application.domain, _this._application.authentication, _this._application.instance);
	            }).then(function (session) {
	                return _this._sendPresenceCommand().then(function () {
	                    return session;
	                });
	            }).then(function (session) {
	                return _this._sendReceiptsCommand().then(function () {
	                    return session;
	                });
	            }).then(function (session) {
	                _this.listening = true;
	                return session;
	            });
	        }
	    }, {
	        key: '_initializeClientChannel',
	        value: function _initializeClientChannel() {
	            var _this2 = this;
	
	            this._transport.onClose = function () {
	                _this2.listening = false;
	                // try to reconnect in 1 second
	                setTimeout(function () {
	                    if (!_this2._closing) {
	                        _this2._transport = _this2._transportFactory();
	                        _this2._initializeClientChannel();
	                        _this2.connect();
	                    }
	                }, 1000);
	            };
	
	            this._clientChannel = new _limeJs2.default.ClientChannel(this._transport, true, false);
	            this._clientChannel.onMessage = function (message) {
	                var shouldNotify = message.id && (!message.to || _this2._clientChannel.localNode.substring(0, message.to.length) === message.to);
	
	                if (shouldNotify) {
	                    _this2.sendNotification({ id: message.id, to: message.from, event: _limeJs2.default.NotificationEvent.RECEIVED });
	                }
	
	                _this2._loop(0, shouldNotify, message);
	            };
	            this._clientChannel.onNotification = function (notification) {
	                return _this2._notificationReceivers.forEach(function (receiver) {
	                    return receiver.predicate(notification) && receiver.callback(notification);
	                });
	            };
	            this._clientChannel.onCommand = function (c) {
	                return (_this2._commandResolves[c.id] || identity)(c);
	            };
	
	            this.sessionPromise = new _bluebird2.default(function (resolve, reject) {
	                _this2._clientChannel.onSessionFinished = resolve;
	                _this2._clientChannel.onSessionFailed = reject;
	            });
	        }
	    }, {
	        key: '_loop',
	        value: function _loop(i, shouldNotify, message) {
	            var _this3 = this;
	
	            try {
	                if (i < this._messageReceivers.length) {
	                    if (this._messageReceivers[i].predicate(message)) {
	                        return _bluebird2.default.resolve(this._messageReceivers[i].callback(message)).then(function (result) {
	                            return new _bluebird2.default(function (resolve, reject) {
	                                if (result === false) {
	                                    reject();
	                                }
	                                resolve();
	                            });
	                        }).then(function () {
	                            return _this3._loop(i + 1, shouldNotify, message);
	                        });
	                    } else {
	                        this._loop(i + 1, shouldNotify, message);
	                    }
	                } else {
	                    this._notify(shouldNotify, message, null);
	                }
	            } catch (e) {
	                this._notify(shouldNotify, message, e);
	            }
	        }
	    }, {
	        key: '_notify',
	        value: function _notify(shouldNotify, message, e) {
	            if (shouldNotify && e) {
	                this.sendNotification({
	                    id: message.id,
	                    to: message.from,
	                    event: _limeJs2.default.NotificationEvent.FAILED,
	                    reason: {
	                        code: 101,
	                        description: e.message
	                    }
	                });
	            }
	
	            if (shouldNotify && this._application.notifyConsumed) {
	                this.sendNotification({ id: message.id, to: message.from, event: _limeJs2.default.NotificationEvent.CONSUMED });
	            }
	        }
	    }, {
	        key: '_sendPresenceCommand',
	        value: function _sendPresenceCommand() {
	            if (this._application.authentication instanceof _limeJs2.default.GuestAuthentication) {
	                return _bluebird2.default.resolve();
	            }
	            return this.sendCommand({
	                id: _limeJs2.default.Guid(),
	                method: _limeJs2.default.CommandMethod.SET,
	                uri: '/presence',
	                type: 'application/vnd.lime.presence+json',
	                resource: this._application.presence
	            });
	        }
	    }, {
	        key: '_sendReceiptsCommand',
	        value: function _sendReceiptsCommand() {
	            if (this._application.authentication instanceof _limeJs2.default.GuestAuthentication) {
	                return _bluebird2.default.resolve();
	            }
	            return this.sendCommand({
	                id: _limeJs2.default.Guid(),
	                method: _limeJs2.default.CommandMethod.SET,
	                uri: '/receipt',
	                type: 'application/vnd.lime.receipt+json',
	                resource: {
	                    events: ['failed', 'accepted', 'dispatched', 'received', 'consumed']
	                }
	            });
	        }
	
	        // close :: Promise ()
	
	    }, {
	        key: 'close',
	        value: function close() {
	            this._closing = true;
	
	            if (this._clientChannel.state === _limeJs2.default.SessionState.ESTABLISHED) {
	                return this._clientChannel.sendFinishingSession();
	            }
	
	            return _bluebird2.default.resolve(this.sessionPromise.then(function (s) {
	                return s;
	            }).catch(function (s) {
	                return _bluebird2.default.resolve(s);
	            }));
	        }
	
	        // sendMessage :: Message -> ()
	
	    }, {
	        key: 'sendMessage',
	        value: function sendMessage(message) {
	            this._clientChannel.sendMessage(message);
	        }
	
	        // sendNotification :: Notification -> ()
	
	    }, {
	        key: 'sendNotification',
	        value: function sendNotification(notification) {
	            this._clientChannel.sendNotification(notification);
	        }
	
	        // sendCommand :: Command -> Number -> Promise Command
	
	    }, {
	        key: 'sendCommand',
	        value: function sendCommand(command) {
	            var _this4 = this;
	
	            var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
	
	            this._clientChannel.sendCommand(command);
	
	            return _bluebird2.default.race([new _bluebird2.default(function (resolve, reject) {
	                _this4._commandResolves[command.id] = function (c) {
	                    if (!c.status) return;
	
	                    if (c.status === _limeJs2.default.CommandStatus.SUCCESS) {
	                        resolve(c);
	                    } else {
	                        reject(c);
	                    }
	
	                    delete _this4._commandResolves[command.id];
	                };
	            }), new _bluebird2.default(function (resolve, reject) {
	                setTimeout(function () {
	                    if (!_this4._commandResolves[command.id]) return;
	
	                    delete _this4._commandResolves[command.id];
	                    command.status = 'failure';
	                    reject(command);
	                }, timeout);
	            })]);
	        }
	
	        // addMessageReceiver :: String -> (Message -> ()) -> Function
	
	    }, {
	        key: 'addMessageReceiver',
	        value: function addMessageReceiver(predicate, callback) {
	            var _this5 = this;
	
	            if (typeof predicate !== 'function') {
	                if (predicate === true || !predicate) {
	                    predicate = function predicate() {
	                        return true;
	                    };
	                } else {
	                    var value = predicate;
	                    predicate = function predicate(message) {
	                        return message.type === value;
	                    };
	                }
	            }
	            this._messageReceivers.push({ predicate: predicate, callback: callback });
	            return function () {
	                return _this5._messageReceivers = _this5._messageReceivers.filter(function (r) {
	                    return r.predicate !== predicate && r.callback !== callback;
	                });
	            };
	        }
	    }, {
	        key: 'clearMessageReceivers',
	        value: function clearMessageReceivers() {
	            this._messageReceivers = [];
	        }
	
	        // addNotificationReceiver :: String -> (Notification -> ()) -> Function
	
	    }, {
	        key: 'addNotificationReceiver',
	        value: function addNotificationReceiver(predicate, callback) {
	            var _this6 = this;
	
	            if (typeof predicate !== 'function') {
	                if (predicate === true || !predicate) {
	                    predicate = function predicate() {
	                        return true;
	                    };
	                } else {
	                    var value = predicate;
	                    predicate = function predicate(notification) {
	                        return notification.event === value;
	                    };
	                }
	            }
	            this._notificationReceivers.push({ predicate: predicate, callback: callback });
	            return function () {
	                return _this6._notificationReceivers = _this6._notificationReceivers.filter(function (r) {
	                    return r.predicate !== predicate && r.callback !== callback;
	                });
	            };
	        }
	    }, {
	        key: 'clearNotificationReceivers',
	        value: function clearNotificationReceivers() {
	            this._notificationReceivers = [];
	        }
	    }, {
	        key: 'listening',
	        get: function get() {
	            return this._listening;
	        },
	        set: function set(listening) {
	            this._listening = listening;
	            if (this.onListeningChanged) {
	                this.onListeningChanged(listening, this);
	            }
	        }
	    }, {
	        key: 'uri',
	        get: function get() {
	            return this._uri;
	        }
	    }]);
	
	    return Client;
	}();
	
	exports.default = Client;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _limeJs = __webpack_require__(2);
	
	var _limeJs2 = _interopRequireDefault(_limeJs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* istanbul ignore next */
	var Application = function Application() {
	    _classCallCheck(this, Application);
	
	    // Default values
	    this.identifier = _limeJs2.default.Guid();
	    this.compression = _limeJs2.default.SessionCompression.NONE;
	    this.encryption = _limeJs2.default.SessionEncryption.NONE;
	    this.instance = 'default';
	    this.domain = 'msging.net';
	    this.scheme = 'wss';
	    this.hostName = 'ws.msging.net';
	    this.port = 443;
	    this.presence = {
	        status: 'available',
	        routingRule: 'identity'
	    };
	    this.notifyConsumed = true;
	    this.authentication = new _limeJs2.default.GuestAuthentication();
	};
	
	exports.default = Application;
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _limeJs = __webpack_require__(2);
	
	var _limeJs2 = _interopRequireDefault(_limeJs);
	
	var _Client = __webpack_require__(1);
	
	var _Client2 = _interopRequireDefault(_Client);
	
	var _Application = __webpack_require__(3);
	
	var _Application2 = _interopRequireDefault(_Application);
	
	var _limeTransportWebsocket = __webpack_require__(6);
	
	var _limeTransportWebsocket2 = _interopRequireDefault(_limeTransportWebsocket);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/* istanbul ignore next */
	var ClientBuilder = function () {
	    function ClientBuilder() {
	        _classCallCheck(this, ClientBuilder);
	
	        this._application = new _Application2.default();
	    }
	
	    _createClass(ClientBuilder, [{
	        key: 'withApplication',
	        value: function withApplication(application) {
	            this._application = application;
	            return this;
	        }
	    }, {
	        key: 'withIdentifier',
	        value: function withIdentifier(identifier) {
	            this._application.identifier = identifier;
	            return this;
	        }
	    }, {
	        key: 'withInstance',
	        value: function withInstance(instance) {
	            this._application.instance = instance;
	            return this;
	        }
	
	        // withDomain :: String -> ClientBuilder
	
	    }, {
	        key: 'withDomain',
	        value: function withDomain(domain) {
	            this._application.domain = domain;
	            return this;
	        }
	
	        // withScheme :: String -> ClientBuilder
	
	    }, {
	        key: 'withScheme',
	        value: function withScheme(scheme) {
	            this._application.scheme = scheme;
	            return this;
	        }
	
	        // withHostName :: String -> ClientBuilder
	
	    }, {
	        key: 'withHostName',
	        value: function withHostName(hostName) {
	            this._application.hostName = hostName;
	            return this;
	        }
	    }, {
	        key: 'withPort',
	        value: function withPort(port) {
	            this._application.port = port;
	            return this;
	        }
	    }, {
	        key: 'withAccessKey',
	        value: function withAccessKey(accessKey) {
	            this._application.authentication = new _limeJs2.default.KeyAuthentication();
	            this._application.authentication.key = accessKey;
	            return this;
	        }
	    }, {
	        key: 'withPassword',
	        value: function withPassword(password) {
	            this._application.authentication = new _limeJs2.default.PlainAuthentication();
	            this._application.authentication.password = password;
	            return this;
	        }
	    }, {
	        key: 'withToken',
	        value: function withToken(token) {
	            this._application.authentication = new _limeJs2.default.ExternalAuthentication();
	            this._application.authentication.token = token;
	            return this;
	        }
	    }, {
	        key: 'withIssuer',
	        value: function withIssuer(issuer) {
	            if (!this._application.authentication) {
	                this._application.authentication = new _limeJs2.default.ExternalAuthentication();
	            }
	            this._application.authentication.issuer = issuer;
	            return this;
	        }
	
	        // withCompression :: Lime.SessionCompression.NONE -> ClientBuilder
	
	    }, {
	        key: 'withCompression',
	        value: function withCompression(compression) {
	            this._application.compression = compression;
	            return this;
	        }
	
	        // withEncryption :: Lime.SessionEncryption.NONE -> ClientBuilder
	
	    }, {
	        key: 'withEncryption',
	        value: function withEncryption(encryption) {
	            this._application.encryption = encryption;
	            return this;
	        }
	    }, {
	        key: 'withRoutingRule',
	        value: function withRoutingRule(routingRule) {
	            this._application.presence.routingRule = routingRule;
	            return this;
	        }
	    }, {
	        key: 'withEcho',
	        value: function withEcho(echo) {
	            this._application.presence.echo = echo;
	            return this;
	        }
	    }, {
	        key: 'withPriority',
	        value: function withPriority(priority) {
	            this._application.presence.priority = priority;
	            return this;
	        }
	    }, {
	        key: 'withNotifyConsumed',
	        value: function withNotifyConsumed(notifyConsumed) {
	            this._application.notifyConsumed = notifyConsumed;
	            return this;
	        }
	    }, {
	        key: 'withTransportFactory',
	        value: function withTransportFactory(transportFactory) {
	            this._transportFactory = transportFactory;
	            return this;
	        }
	    }, {
	        key: 'build',
	        value: function build() {
	            var uri = this._application.scheme + '://' + this._application.hostName + ':' + this._application.port;
	            if (!this._transportFactory) this._transportFactory = function () {
	                return new _limeTransportWebsocket2.default();
	            };
	            return new _Client2.default(uri, this._transportFactory, this._application);
	        }
	    }]);
	
	    return ClientBuilder;
	}();
	
	exports.default = ClientBuilder;
	module.exports = exports['default'];

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ })
/******/ ])
});
;
//# sourceMappingURL=messaginghub-client.js.map