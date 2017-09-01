"use strict";

const ModelAccount = require("../models/account.model");
const redis = require('../domain/ubc.prepare').redis;
const KEYS = require("../models/oauth2.model").KEYS;


var ControllerAccount = module.exports;


ControllerAccount.createUBCAccount = function createUBCAccount(req, res) {
    let account = req.body;
    checkoutAccount(account).then((accountIsOk) => {
        return ModelAccount.createUBCAccount(account, req, res);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
};

function checkoutAccount(account) {
    return new Promise((resolve, reject) => {
        let isOk = account.account && account.account.indexOf("@") > 0;
        if (!isOk) {
            reject({
                code: 10001,
                message: "账号格式错误"
            });
        }
        isOk = isOk && account.password && (account.password.length > 6 || account.password.length < 200);
        if (!isOk) {
            reject({
                code: 10002,
                message: "密码不符合要求"
            });
        }
        resolve(isOk);
    });
}


const controllerLockKey = `${KEYS.controller}post/ubc/bag/account/wallet`;
ControllerAccount.createAccountBagProject = function createAccountBagProject(req, res) {
    let accountProject = req.body;
    let authUser = JSON.parse(res.locals.oauth.token.user);
    console.log(`hset ${controllerLockKey}  ${authUser.id} `);
    return redis.hgetAsync(controllerLockKey, authUser.id).then((locked) => {
        if (locked) {
            res.status(500);
            res.json({
                cold: 10002,
                message: "正在请求创建钱包"
            });
        } else {
            ModelAccount.createAccountBagProject(controllerLockKey, authUser, accountProject, req, res);
        }
    }).catch((error) => {
        res.status(500);
        res.json(error);
    })
}

module.exports.ControllerAccount = ControllerAccount;