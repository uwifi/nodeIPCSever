"use strict";

const sequelize = require('../domain/ubc.prepare').sequelize;
const redis = require('../domain/ubc.prepare').redis;
const KEYS = require("./oauth2.model").KEYS;
const ChainEthereumModel = require("./chain.ether.model");
const TABLE_DEFINE = require("../domain/table.define");
const DomainAccount = TABLE_DEFINE.DomainAccount;
const DomainBagProject = TABLE_DEFINE.DomainBagProject;
const DomainAccountProject = TABLE_DEFINE.DomainAccountProject;

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

ModelAccount.createAccountBagProject = function createAccountBagProject(controllerLockKey, authedUser, accountProject, req, res) {
    redis.hsetAsync(controllerLockKey, authedUser.id, true).then((locked) => {
        console.log(`lock ${locked} the request ${req.url}`);
        sequelize.transaction((trans) => {
            return new Promise((resolve, reject) => {
                switch (accountProject.symbol) {
                    case 'eth':
                        resolve(ChainEthereumModel.createAccount(accountProject.password, authedUser.accountId));
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
                    DomainAccountProject.create({
                        projectAppellation: accountProjec.appellation,
                        projectSymbol: accountProject.symbol,
                        projectIcon: accountProject.icon,
                        status: 'locked',
                        accountAddress: walletAddress.result,
                        accountValue: 0
                    }, {
                        transaction: trans
                    });
                };
            }).then((projectInstance) => {
                res.status(200);
                res.json(projectInstance.toJSON());
            });
        }).then((trans) => {
            return trans.commit();
        }).then(() => {
            DomainBagProject.findOrCreate({
                where: {
                    publicType: accountProject.walletType,
                    projectAppellation: accountProject.appellation
                },
                defaults: {
                    publicType: accountProject.walletType,
                    projectAppellation: accountProject.appellation,
                    symbol: accountProject.symbol,
                    icon: accountProject.icon
                },
                transaction: trans
            })
        }).catch((error) => {
            res.status(500);
            res.json(error.message);
        })
    });
}