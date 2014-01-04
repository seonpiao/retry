var Retry = require('../retry');

var assert = require("assert");

global.Retry = Retry;
global.assert = assert;

require('./cases');