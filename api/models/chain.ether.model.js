"use strict";

const net = require("net");

const ETH_IPC = "/Volumes/blockdata/ethereum/prod/geth.ipc";

var ChainEthereumModel = module.exports;


ChainEthereumModel.createAccount = function createAccount(password, accountId) {
    return new Promise((resolve, reject) => {
        let client = net.connect(ETH_IPC, () => {
            client.write(JSON.stringify({
                "jsonrpc": "2.0",
                "method": "personal_newAccount",
                "params": [password],
                "id": accountId
            }));
        });
        let dataString = '';
        client.on("data", (data) => {
            dataString += data.toString();
            client.end();
        });
        client.on("end", () => {
            let result = JSON.parse(dataString);
            if (result.error) {
                reject(new Error(result.error));
            } else {
                resolve(result);
            }
        });
        return client;
    });
};