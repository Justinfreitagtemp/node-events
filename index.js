'use strict';

function addEventListener(emitter, event, callback, context, type) {
  if (emitter[type] === null) {
    emitter[type] = {};
  }
  var typeEvent = emitter[type][event];
  if (typeEvent == undefined) {
    emitter[type][event] = typeEvent = [];
  }

  typeEvent[typeEvent.length] = [callback, context];
}

function removeEventListener(listeners, callback, context) {
  if (listeners && listeners.length) {
    var newListeners = [];
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      if (listener[0] !== callback) {
        newListeners[newListeners.length] = listener;
      } else if (context && context !== listener[1]) {
        newListeners[newListeners.length] = listener;
      }
    }
    return newListeners;
  }
  return null;
}

function emitEvent(listeners, a1, a2) {
  var listener;

  if (listeners.length === 1) {
    listener = listeners[0];
    listener[0].call(listener[1], a1, a2);
    return;
  }

  var length = listeners.length;
  while (--length) {
    listener = listeners[length];
    listener[0].call(listener[1], a1, a2);
  }
}

function EventEmitter() {
  this.onListeners = null;
  this.onceListeners = null;
}

['on', 'once'].forEach(function (type) {
  EventEmitter.prototype[type] = function (event, callback, context) {
    addEventListener(this, event, callback, context, type + 'Listeners');
    return this;
  }
});

EventEmitter.prototype.emit = function (event, a1, a2) {
  var listeners;
  var fired = false;

  if (this.onListeners) {
    listeners = this.onListeners[event];
    if (listeners) {
      emitEvent(listeners, a1, a2);
      fired = true;
    }
  }

  if (this.onceListeners) {
    listeners = this.onceListeners[event];
    if (listeners) {
      this.onceListeners[event] = null;
      emitEvent(listeners, a1, a2);
      fired = true;
    }
  }

  return fired;
}

EventEmitter.prototype.listeners = function (event) {
  var onListeners = this.onListeners[event];
  var onceListeners = this.onceListeners[event];
  if (onListeners) {
    if (onceListeners) {
      return Array.concat(onListeners, onceListeners);
    }
    return onListeners;
  }
  if (onceListeners) {
    return onceListeners;
  }
};

EventEmitter.prototype.removeListener = function (event, callback, context) {
  if (this.onListeners) {
    this.onListeners[event] = removeEventListener(
      this.onListeners[event], callback, context
    );
  }

  if (this.onceListeners) {
    this.onceListeners[event] = removeEventListener(
      this.onceListeners[event], callback, context
    );
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function (event) {
  if (event) {
    if (this.onListeners) {
      this.onListeners[event] = null;
    }
    if (this.onceListeners) {
      this.onceListeners[event] = null;
    }
    return;
  }

  this.onListeners = this.onceListeners = null;

  return this;
};

EventEmitter.prototype.addListener = EventEmitter.prototype.on;

EventEmitter.prototype.setMaxListeners = function () {
  return this;
};

EventEmitter.EventEmitter = EventEmitter;
EventEmitter.EventEmitter3 = EventEmitter;

module.exports = EventEmitter;

