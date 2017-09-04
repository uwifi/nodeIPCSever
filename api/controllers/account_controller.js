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
var createAccountMap = new Map();
ControllerAccount.createAccountBagProject = function createAccountBagProject(req, res) {
    let accountProject = req.body;
    let authUser = res.locals.oauth.token.user;
    if (controllerLockKey in createAccountMap) {
        res.status(500);
        res.json({
            cold: 10002,
            message: "正在请求创建钱包"
        });
        return null;
    } else {
        createAccountMap.set(controllerLockKey, true);
        return ModelAccount.createAccountBagProject(authUser, accountProject, req, res).then((pj) => {
            console.log(pj);
            res.status(200);
            res.json(pj);
            createAccountMap.delete(controllerLockKey);
        }).catch((error) => {
            if (error.code != 10002) {
                createAccountMap.delete(controllerLockKey);
            };
            res.status(500);
            res.json(error);
            console.log(JSON.stringify(error.code));
        });
    };
};

ControllerAccount.queryAccountBagProject = function queryAccountBagProject(req, res) {
    let authUser = res.locals.oauth.token.user;
    return ModelAccount.queryAccountBagProject(authUser, req, res).then((projectJsonList) => {
        console.log(projectJsonList);
        res.status(200);
        res.json({
            data: projectJsonList
        });
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
};

ControllerAccount.getAccountWalletOfProjectAddress = function getAccountWalletOfProjectAddress(req, res) {
    let authUser = res.locals.oauth.token.user;
    // TODO 需要从redis里返回 数据信息
    return ModelAccount.getProjectBydId(authUser, req, res).then((projectJson) => {
        res.status(200);
        console.log(projectJson);
        res.json(projectJson);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
}

ControllerAccount.createAccountBagItem = function createAccountBagItem(req, res) {
    let accountItem = req.body;
    let authUser = res.locals.oauth.token.user;
    return ModelAccount.createAccountBagItem(authUser, accountItem, req, res).then((ij) => {
        console.log(ij);
        res.status(200);
        res.json(ij);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });
};
ControllerAccount.queryAccountBagItem = function queryAccountBagItem(req, res) {
    let authUser = res.locals.oauth.token.user;
    return ModelAccount.queryAccountBagItem(authUser, req, res).then((itemJsonList) => {
        console.log(itemJsonList);
        res.status(200);
        res.json({
            data: itemJsonList
        });
    }).catch((error) => {
        res.status(500);
        res.json(error);
    });

};

ControllerAccount.transferCurrency = function transferCurrency(req, res) {
    let authUser = res.locals.oauth.token.user;
    return ModelAccount.transferCurrency(authUser, req, res).then((transferResult) => {
        console.log(transferResult);
        res.status(200);
        res.json(transferResult);
    }).catch((error) => {
        res.status(500);
        res.json(error);
    })
}


module.exports.ControllerAccount = ControllerAccount;