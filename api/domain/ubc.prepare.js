var Sequelize = require('sequelize');

var sequelize = new Sequelize('ubcbag', 'ubcbag', 'ubcbag', {
    host:"localhost",
    logging: true,
    define: {
        freezeTableName: true,
        underscored: true

    },
    dialect:'postgres'
});

var bluebird = require('bluebird');
var redisdb = require('redis');
var redis = redisdb.createClient();
bluebird.promisifyAll(redisdb.RedisClient.prototype);
bluebird.promisifyAll(redisdb.Multi.prototype);

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
exports.redis = redis;
