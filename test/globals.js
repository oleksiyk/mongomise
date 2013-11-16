"use strict";

global.mongomise = (process && process.env && process.env.MONGOMISE_COV)
    ? require('../lib-cov')
    : require('../lib');


global.sinon = require("sinon");
global.chai = require("chai");

global.assert = global.chai.assert;
global.should = global.chai.should();

// https://github.com/domenic/mocha-as-promised
require("mocha-as-promised")();

// https://github.com/domenic/chai-as-promised
var chaiAsPromised = require("chai-as-promised");
global.chai.use(chaiAsPromised);

// https://github.com/domenic/sinon-chai
var sinonChai = require("sinon-chai");
global.chai.use(sinonChai);

