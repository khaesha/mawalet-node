const _ = require("lodash");

const config = require("./config.json");
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || "development";
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

global.gConfig = finalConfig;

// log global.config
// console.log(
//   `global.gConfig: ${JSON.stringify(
//     global.gConfig,
//     undefined,
//     global.gConfig.json_indentation
//   )}`
// );

// const env = process.env.NODE_ENV || "development";

// switch (env) {
//   case "test":
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/mawalet-test";
//     break;
//   case 'staging':
//   case 'production':
//     break;
//   default:
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = "mongodb://localhost:27017/mawalet-dev";
//     break;
// }
