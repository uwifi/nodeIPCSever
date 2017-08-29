"use strict";

const express = require("express"),
    bodyParser = require("body-parser"),
      oauthserver = require("express-oauth-server");
const ControllerAccount = require("./api/controllers/account_controller").ControllerAccount;

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.oauth = new oauthserver({
    model: require('./api/models/oauth2.model')
});

app.post('/ubc/bag/account/token', app.oauth.token());

//-- authed

//-- authed end


//-- public
app.post('/ubc/bag/account/create', ControllerAccount.createUBCAccount);


//-- public end

var port = process.env.PORT || 10060;
app.listen(port);

console.log(`listen the port: ${port}`);
// for test
module.exports = app;
