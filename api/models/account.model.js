"use strict";

const sequelize = require('../domain/ubc.prepare').sequelize;
const redis = require('../domain/ubc.prepare').redis;
const KEYS = require("./oauth2.model").KEYS;
const ChainEthereumModel = require("./chain.ether.model");
const TABLE_DEFINE = require("../domain/table.define");
const DomainAccount = TABLE_DEFINE.DomainAccount;
const DomainBagProject = TABLE_DEFINE.DomainBagProject;
const DomainAccountProject = TABLE_DEFINE.DomainAccountProject;
const DomainAccountItem = TABLE_DEFINE.DomainAccountItem;

var ModelAccount = module.exports;


ModelAccount.createUBCAccount = function createUBCAccount(account, req, res) {
    return sequelize.transaction().then((trans) => {
        return DomainAccount.create(account, { transaction: trans }).then((accountInstance) => {
            let aj = accountInstance.toJSON();
            account.accountId = aj.id;
            return redis.hmsetAsync(`${KEYS.user}${account.account}`, account);
        }).then(() => {
            res.status(200);
            res.json({
                account: account,
                url: "waiting"
            });
        }).then(() => {
            trans.commit();
        }).catch((error) => {
            res.status(500);
            res.json(error);
        });
    });
};

ModelAccount.createAccountBagProject = function createAccountBagProject(authedUser, accountProject, req, res) {
    let pj;
    return sequelize.transaction((trans) => {
        return new Promise((resolve, reject) => {
            switch (accountProject.symbol) {
                case 'eth':
                    resolve(ChainEthereumModel.createAccount(accountProject.password, authedUser.accountId));
                    break;
                default:
                    reject({
                        code: 10004,
                        message: "unkown symbol"
                    });
            };
        }).then((walletResult) => {
            if (walletResult.error) {
                throw {
                    code: 10003,
                    message: "没有创建成功",
                    error
                }
            } else {
                return DomainAccountProject.create({
                    projectAppellation: accountProject.appellation,
                    projectSymbol: accountProject.symbol,
                    projectIcon: accountProject.icon,
                    status: 'locked',
                    accountAddress: walletResult.result,
                    accountValue: 0
                }, {
                    transaction: trans
                });
            };
        }).then((projectInstance) => {
            pj = projectInstance.toJSON();
            return pj;
        });
    });
};

ModelAccount.queryAccountBagProject = function queryAccountBagProject(authUser, req, res) {
    return DomainAccountProject.findAll({
        where: {
            accountId: authUser.accountId,
            account: authUser.id
        }
    }).then((instanceArray) => {
        return instanceArray.map((ele) => ele.toJSON());
    });
}

ModelAccount.createAccountBagItem = function createAccountBagItem(authUser, accountItem, req, res) {
    let ij;
    let item = Object.assign({}, accountItem);
    item.account = authUser.id;
    item.accountId = authUser.accountId
    return DomainAccountItem.create(item).then((itemInstance) => {
        return itemInstance.toJSON();
    });
};
ModelAccount.queryAccountBagItem = function queryAccountBagItem(authUser, req, res) {
    let projectAddress = req.params.projectAddress;
    return DomainAccountItem.findAll({
        where: {
            accountId: authUser.accountId,
            projectAddress: projectAddress
        }
    }).then((instanceArray) => {
        return instanceArray.map(ele => ele.toJSON);
    })
};