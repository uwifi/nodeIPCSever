"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
    oauthserver = require("express-oauth-server");
const ControllerAccount = require("./api/controllers/account_controller").ControllerAccount;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.oauth = new oauthserver({
    model: require('./api/models/oauth2.model')
});

app.post('/ubc/bag/account/token', app.oauth.token());

//-- authed
app.post('/ubc/bag/account/wallet', app.oauth.authenticate(), ControllerAccount.createAccountBagProject);
app.get("/ubc/bag/account/wallet/project", app.oauth.authenticate(), ControllerAccount.queryAccountBagProject);
app.get('/ubc/bag/account/wallet/:projectAddress', app.oauth.authenticate(), ControllerAccount.getAccountWalletOfProjectAddress);

app.post('/ubc/bag/account/wallet/item', app.oauth.authenticate(), ControllerAccount.createAccountBagItem);
app.get('/ubc/bag/account/wallet/item/:projectAddress', app.oauth.authenticate(), ControllerAccount.queryAccountBagItem);

app.post('/ubc/bag/account/wallet/currency', app.oauth.authenticate(), ControllerAccount.transferCurrency);

//-- authed end


//-- public
app.post('/ubc/bag/account/create', ControllerAccount.createUBCAccount);


//-- public end

var port = process.env.PORT || 10060;
app.listen(port);

console.log(`listen the port: ${port}`);
// for test
module.exports = app;