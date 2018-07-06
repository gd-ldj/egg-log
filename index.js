'use strict';
const fmt = require('util').format;
// const EventEmitter = require('events').EventEmitter;

/**
 * Initialize a `Loggeer` with the given log `level` defaulting
 * to __DEBUG__ and `stream` defaulting to _stdout_.
 *
 * @param {Number} level
 * @param {Object} stream
 * @api public
 */

const Log = exports = module.exports = function Log(level, stream) {
  if (typeof level === 'string') {
    level = exports[level.toUpperCase()];
    this.level = isFinite(level) ? level : this.DEBUG;
    this.stream = stream || process.stdout;
  }
  if (this.stream.readable) this.read();
};

/**
 * System is unusable.
 *
 * @type Number
 */

exports.EMERGENCY = 0;

/**
 * Action must be taken immediately.
 *
 * @type Number
 */

exports.ALERT = 1;

/**
 * Critical condition.
 *
 * @type Number
 */

exports.CRITICAL = 2;

/**
 * Error condition.
 *
 * @type Number
 */

exports.ERROR = 3;

/**
 * Warning condition.
 *
 * @type Number
 */

exports.WARNING = 4;

/**
 * Normal but significant condition.
 *
 * @type Number
 */

exports.NOTICE = 5;

/**
 * Purely informational message.
 *
 * @type Number
 */

exports.INFO = 6;

/**
 * Application debug messages.
 *
 * @type Number
 */

exports.DEBUG = 7;

/**
 * prototype.
 */

Log.prototype = {

  /**
   * Start emitting "line" events.
   *
   * @api public
   */

  read: () => {
    let buf = '';
    const self = this;
    const stream = this.stream;

    stream.setEncoding('utf8');
    stream.on('data', function(chunk) {
      buf += chunk;
      if (buf[buf.length - 1] !== '\n') return;
      buf.split('\n').forEach(line => {
        if (!line.length) return null;
        try {
          const captures = line.match(/^\[([^\]]+)\] (\w+) (.*)/);
          const obj = {
            date: new Date(captures[1]),
            level: exports[captures[2]],
            levelString: captures[2],
            msg: captures[3],
          };
          self.emit('line', obj);
        } catch (err) {
          // Ignore
        }
        return null;
      });
      buf = '';
    });

    stream.on('end', function() {
      self.emit('end');
    });
  },

  /**
   * Log output message.
   *
   * @param  {String} levelStr
   * @param  {Array} args
   * @api private
   */

  log: (levelStr, args) => {
    if (exports[levelStr] <= this.level) {
      const msg = fmt.apply(null, args);
      this.stream.write(
        '[' + new Date() + ']'
        + ' ' + levelStr
        + ' ' + msg
        + '\n'
      );
    }
  },

  /**
   * Log emergency `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  emergency: msg => {
    this.log('EMERGENCY', ...msg);
  },

  /**
   * Log alert `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  alert: msg => {
    this.log('ALERT', ...msg);
  },

  /**
   * Log critical `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  critical: msg => {
    this.log('CRITICAL', ...msg);
  },

  /**
   * Log error `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  error: msg => {
    this.log('ERROR', ...msg);
  },

  /**
   * Log warning `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  warning: msg => {
    this.log('WARNING', ...msg);
  },

  /**
   * Log notice `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  notice: msg => {
    this.log('NOTICE', ...msg);
  },

  /**
   * Log info `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  info: msg => {
    this.log('INFO', ...msg);
  },

  /**
   * Log debug `msg`.
   *
   * @param  {String} msg
   * @api public
   */

  debug: msg => {
    this.log('DEBUG', ...msg);
  },
};

/**
 * Inherit from `EventEmitter`.
 */

// Log.prototype.__proto__ = EventEmitter.prototype;
