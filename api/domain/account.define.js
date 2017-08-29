const Sequelize = require('./ubc.prepare').Sequelize;
const sequelize = require('./ubc.prepare').sequelize;
const redis = require('./ubc.prepare').redis;
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + "+0000");
    // e.g., UTC offset. Use any offset that you would like.
});

const KEYS = require("../models/oauth2.model").KEYS;

var DomainAccount = sequelize.define("t_account", {
    
});
