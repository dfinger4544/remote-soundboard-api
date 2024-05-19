import { Model, DataTypes } from "sequelize";
import sequelizeInstance from "../util/sequelize";
const config = {
  tableName: "Sound",
  sequelize: sequelizeInstance,
};
import Player from "play-sound";
const player = Player();

class Sound extends Model {
  id?: number;
  name!: string;
  imagePath!: string;
  soundPath!: string;

  play!: () => Promise<boolean>;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Sound.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soundPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  config
);

Sound.prototype.play = async function (): Promise<boolean> {
  return new Promise((resolve, reject) => {
    player.play(this.soundPath, function (err: Error) {
      if (err) return reject(false);
      return resolve(true);
    });
  });
};

export default Sound;
