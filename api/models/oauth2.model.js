var model = module.exports,
    redis = require('redis');

var db = redis.createClient();

const KEYS = {
    token:"token:",
    client:"clients:",
    refreshToken:"refresh_token:",
    grantTypes:":grant_types",
    user:"users:"
};

model.getAccessToken = function (bearerToken, callback) {
    db.hgetall(`${KEYS.token}${bearerToken}`, function (err, token) {
        if (err) return callback(err);

        if (!token) return callback();

        return callback(null, {
            accessToken: token.accessToken,
            clientId: token.clientId,
            expires: token.expires ? new Date(token.expires) : null,
            userId: token.userId
        });
    });
};

model.getClient = function (clientId, clientSecret, callback) {
    let key = `${KEYS.client}${clientId}`;
    db.hgetall(key, function (err, client) {
        if (err) return callback(err);

        if (!client || client.clientSecret !== clientSecret) return callback();

        return callback(null, {
            clientId: client.clientId,
            clientSecret: client.clientSecret
        });
    });
};

model.getRefreshToken = function (bearerToken, callback) {
    db.hgetall(`${KEYS.refreshToken}${bearerToken}`, function (err, token) {
        if (err) return callback(err);

        if (!token) return callback();

        return callback(null, {
            refreshToken: token.accessToken,
            clientId: token.clientId,
            expires: token.expires ? new Date(token.expires) : null,
            userId: token.userId
        });
    });
};

model.grantTypeAllowed = function (clientId, grantType, callback) {
    db.sismember(`${KEYS.client}${clientId}${KEYS.grantTypes}`, grantType, callback);
};

model.saveAccessToken = function (accessToken, clientId, expires, user, callback) {
    db.hmset(`${KEYS.token}${accessToken}`, {
        accessToken: accessToken,
        clientId: clientId,
        expires: expires ? expires.toISOString() : null,
        userId: user.id
    }, callback);
};

model.saveRefreshToken = function (refreshToken, clientId, expires, user, callback) {
    db.hmset(`${KEYS.refreshToken}${refreshToken}`, {
        refreshToken: refreshToken,
        clientId: clientId,
        expires: expires ? expires.toISOString() : null,
        userId: user.id
    }, callback);
};

model.getUser = function (username, password, callback) {
    db.hgetall(`${KEYS.user}${username}`, function (err, user) {
        if (err) return callback(err);

        if (!user || password !== user.password) return callback();

        return callback(null, {
            id: username
        });
    });
};
model.saveToken = function(token, client, user) {
  var data = {
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id
  };

  return Promise.all([
      db.hmset(`${KEYS.TOKEN}${token.accessToken}`, data),
      db.hmset(`${KEYS.token}${token.refreshToken}`, data)
  ]).return(data);
};

model.KEYS = KEYS;
