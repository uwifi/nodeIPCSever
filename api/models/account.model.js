"use strict";

const sequelize = require('../domain/ubc.prepare').sequelize;
const redis = require('../domain/ubc.prepare').redis;
const KEYS = require("./oauth2.model").KEYS;
const DomainAccount = require("../domain/table.define").DoaminAccount;

var ModelAccount = module.exports;


ModelAccount.createUBCAccount = function createUBCAccount(account, req, res){
    return sequelize.transaction().then((trans)=>{
        return DomainAccount.create(account, {transaction:trans}).then((accountInstance)=>{
            return redis.hmsetAsync(`${KEYS.user}${account.username}`, account);
        }).then(()=>{
            res.status(200);
            res.json({
                account:account,
                url:"waiting"
            });
        }).then(()=>{
            trans.commit();
        }).catch((error)=>{
            res.status(500);
            res.json(error);
        });
    });
};



