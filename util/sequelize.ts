import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize";

const dataFolder = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

const dbConfig = {
  database: "sqlite_db",
  dialect: "sqlite" as "sqlite",
  storage: path.join(dataFolder, "app.db"),
  host: "127.0.0.1",
  logging: false,
};

export default new Sequelize(dbConfig);
