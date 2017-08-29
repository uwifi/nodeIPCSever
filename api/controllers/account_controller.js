"use strict";

const ModelAccount = require("../models/account.model");


var ControllerAccount = module.exports;

ControllerAccount.createUBCAccount = function createUBCAccount(req, res){
    let account = req.body;
    checkoutAccount(account).then((accountIsOk)=>{
        account.username = account.account;
        return ModelAccount.createUBCAccount(account, req, res);
    }).catch((error)=>{
        res.status(500);
        res.json(error);
    });
};

function checkoutAccount(account){
    return new Promise((resolve, reject)=>{
        let isOk = account.name && account.name.indexOf("@") > 0;
        if(!isOk){
            throw {
                code : 10001,
                message: "账号格式错误"
            };
        }
        isOk = isOk && account.password && ( account.password.length < 6 || account.password.length > 200);
        if(!isOk){
            throw {
                code : 10002,
                message: "密码不符合要求"
            };
        }
        return isOk;
    });
}


module.exports.ControllerAccount = ControllerAccount;
