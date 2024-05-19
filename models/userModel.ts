import { Model, DataTypes } from "sequelize";
import sequelizeInstance from "../util/sequelize";
const config = {
  tableName: "User",
  sequelize: sequelizeInstance,
};

class User extends Model {
  id?: number;
  username!: string;
  password!: string;
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  config
);

export default User;
