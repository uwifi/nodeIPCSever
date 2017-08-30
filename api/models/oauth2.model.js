var model = module.exports;
var bluebird = require('bluebird');
var redisdb = require('redis');
var db = redisdb.createClient();
bluebird.promisifyAll(redisdb.RedisClient.prototype);
bluebird.promisifyAll(redisdb.Multi.prototype);

const KEYS = {
    token: "token:",
    client: "clients:",
    refreshToken: "refresh_token:",
    grantTypes: ":grant_types",
    user: "users:"
};

model.getAccessToken = function(bearerToken) {
    return db.hgetallAsync(`${KEYS.token}${bearerToken}`).then((token) => {
        if (!token) {
            return;
        };
        return {
            accessToken: token.accessToken,
            clientId: token.clientId,
            expires: token.accessTokenExpiresOn,
            userId: token.userId
        };
    });
};

model.getClient = function(clientId, clientSecret) {
    let key = `${KEYS.client}${clientId}`;
    return db.hgetallAsync(key).then((client) => {
        if (!client || client.clientSecret !== clientSecret) return;
        return {
            clientId: client.clientId,
            clientSecret: client.clientSecret,
            grants: ["password", "refresh_token"]
        };
    });
};

model.getRefreshToken = function(bearerToken) {
    return db.hgetallAsync(`${KEYS.refreshToken}${bearerToken}`).then((token) => {
        if (!token) return;
        return {
            clientId: token.clientId,
            expires: token.refreshTokenExpiresOn,
            refreshToken: token.accessToken,
            userId: token.userId
        };
    });
};


model.getUser = function(username, password) {
    let key = `${KEYS.user}${username}`;
    console.log(key);
    return db.hgetallAsync(key).then((user) => {
        if (!user || password !== user.password) {
            return;
        }
        return {
            id: username
        };
    });
};

/**
 * Save token.
 */

model.saveToken = function(token, client, user) {
    var data = {
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        client,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        user
    };

    return Promise.all([
        db.hmsetAsync(`${KEYS.token}${token.accessToken}`, data),
        db.hmsetAsync(`${KEYS.token}${token.refreshToken}`, data)
    ]).then(() => {
        return data;
    });
};

model.KEYS = KEYS;