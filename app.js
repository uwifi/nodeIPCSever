"use strict";

const express = require("express"),
      bodyParser = require("body-parser"),
      oauthserver = require("oauth2-server");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.oauth = oauthserver({
    model: require('./api/models/oauth2.model'),
    grants: ['password', 'refresh_token'],
    debug: true
});

app.all('/ubc/bag/account/token', app.oauth.grant());

