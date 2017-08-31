"use strict";

const ModelAccount = require("../models/account.model");


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

ControllerAccount.createAccountBagItem = function createAccountBagItem(req, res) {
    console.log(req);
    let accountItem =
}


module.exports.ControllerAccount = ControllerAccount;