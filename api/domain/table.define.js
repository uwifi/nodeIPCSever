const Sequelize = require('./ubc.prepare').Sequelize;
const sequelize = require('./ubc.prepare').sequelize;
const redis = require('./ubc.prepare').redis;

const KEYS = require("../models/oauth2.model").KEYS;

var DomainAccount = sequelize.define("t_account", {
    account: {
        type: Sequelize.STRING,
        unique: true
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
        type: Sequelize.STRING,
        field: "account_type"
    }
});
var DomainBagProject = sequelize.define("t_bag_project", {
    projectAppellation: {
        type: Sequelize.STRING,
        field: "appellation"
    },
    symbol: {
        type: Sequelize.STRING
    },
    icon: {
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
    decimals: {
        type: Sequelize.INTEGER
    },
    publicType: {
        type: Sequelize.STRING,
        field: "public_type"
    },
    checkUrl: {
        type: Sequelize.STRING,
        field: "check_url"
    }
});
var DomainBagItem = sequelize.define("t_bag_item", {
    itemAppellation: {
        type: Sequelize.STRING,
        field: "appellation"
    },
    symbol: {
        type: Sequelize.STRING
    },
    icon: {
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
    address: {
        type: Sequelize.STRING
    },
    bagProject: {
        type: Sequelize.STRING,
        field: "bag_project"
    },
    projectAppellation: {
        type: Sequelize.STRING,
        field: "project_appellation"
    }
});
var DomainAccountProject = sequelize.define("t_account_bag_project", {
    projectAppellation: {
        type: Sequelize.STRING,
        field: "appellation"
    },
    projectSymbol: {
        type: Sequelize.STRING,
        field: "project_symbol"
    },
    projectIcon: {
        type: Sequelize.STRING,
        field: "project_icon"
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
    accountAddress: {
        type: Sequelize.STRING,
        field: "account_address"
    },
    accountValue: {
        type: Sequelize.DOUBLE,
        field: "account_value"
    }
});

var DomainAccountItem = sequelize.define("t_account_bag_item", {
    itemAppellation: {
        type: Sequelize.STRING,
        field: "appellation"
    },
    itemSymbol: {
        type: Sequelize.STRING,
        field: "item_symbol"
    },
    itemIcon: {
        type: Sequelize.STRING,
        field: "item_icon"
    },
    itemAddress: {
        type: Sequelize.STRING,
        field: "item_address"
    },
    publicType: {
        type: Sequelize.INTEGER,
        field: "public_type"
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
    accountAddress: {
        type: Sequelize.STRING,
        field: "account_address"
    },
    accountValue: {
        type: Sequelize.DOUBLE,
        field: "account_value"
    }
});

var DomainAccountItemKeyStore = sequelize.define("t_account_keystore", {
    itemAppellation: {
        type: Sequelize.STRING,
        field: "appellation"
    },
    itemSymbol: {
        type: Sequelize.STRING,
        field: "item_symbol"
    },
    itemIcon: {
        type: Sequelize.STRING,
        field: "item_icon"
    },
    itemAddress: {
        type: Sequelize.STRING,
        field: "item_address"
    },
    publicType: {
        type: Sequelize.STRING,
        field: "public_type"
    },
    typeInChain: {
        type: Sequelize.STRING,
        field: "type_in_chain"
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
    accountAddress: {
        type: Sequelize.STRING,
        field: "account_address"
    },
    keyStore: {
        type: Sequelize.JSON,
        field: "key_store"
    }
});
//各种交易表，根据需要添加


sequelize.sync({ force: false }).then(() => {
    DomainAccount.findOne().then((accountInstance) => {
        if (accountInstance == undefined) {
            return DomainAccount.create({
                account: "amdin",
                appellation: "admin",
                password: "admin#20170829#ubc",
                accountType: "admin"
            });
        } else {
            return accountInstance;
        }
    }).then((accountInstance) => {
        let account = accountInstance.toJSON();
        account.username = account.account;
        console.log('==================================PARAMETER=====================================');
        console.log(account);
        console.log('==================================   END   =====================================');
        return redis.hmsetAsync(`${KEYS.user}${account.account}`, account);
    });
});


var model = module.exports;
model.DomainAccount = DomainAccount;