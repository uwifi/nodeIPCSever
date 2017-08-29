const Sequelize = require('./ubc.prepare').Sequelize;
const sequelize = require('./ubc.prepare').sequelize;
const redis = require('./ubc.prepare').redis;

const KEYS = require("../models/oauth2.model").KEYS;

var DomainAccount = sequelize.define("t_account", {
    account: {
        type: Sequelize.STRING
    },
    appellation: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.INTEGER
    },
    avatar: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: "created_at"
    },
    updatedAt: {
        type: Sequelize.DATE,
        field: "updated_at"
    },
    status: {
        type: Sequelize.STRING
    },
    accountType: {
        type: Sequelize.INTEGER,
        field: "account_type"
    }
});


sequelize.sync({force: false}).then(function(){
    DomainAccount.findOne().then(function(p){
        parameter = p.toJSON();
        console.log('==================================PARAMETER=====================================');
        console.log(p.toJSON());
        console.log('==================================   END   =====================================');
    });
});



module.exports.DomainAccount = DomainAccount;
