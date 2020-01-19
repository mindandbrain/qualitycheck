"use strict";

const { src, dest, series, parallel } = require("gulp");

const templates = require("./templates.js");
const enums = require("./enums.js");
const annotate = require("./annotate.js");
const bundle = require("./bundle.js");

exports.templates = templates;
exports.enums = enums;
exports.annotate = annotate;
exports.bundle = bundle;
exports.default = series(parallel(enums, templates), annotate, bundle);