"use strict";

const sequelize = require('../domain/ubc.prepare').sequelize;
const redis = require('../domain/ubc.prepare').redis;
const KEYS = require("./oauth2.model").KEYS;
const TABLE_DEFINE = require("../domain/table.define");
const DomainAccount = TABLE_DEFINE.DomainAccount;
const DomainBagProject = TABLE_DEFINE.DomainBagProject;

var ModelProject = module.exports;