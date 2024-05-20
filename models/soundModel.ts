import { Model, DataTypes } from "sequelize";
import { ChildProcess } from "child_process";
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

  play!: () => Promise<number | void>;
  killAll!: () => void;

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

const queue: { [key: number]: ChildProcess } = {};

Sound.prototype.play = async function (): Promise<number | void> {
  try {
    let pid: number | undefined;
    const process: ChildProcess = player.play(this.soundPath, (err) => {
      if (err) console.log(err);
      if (pid && queue[pid]) delete queue[pid];
    });

    pid = process.pid;
    if (pid) queue[pid] = process;

    return pid;
  } catch (err) {
    console.log(err);
  }
};

// @ts-ignore comment
Sound.killAll = function () {
  try {
    Object.entries(queue).forEach(([key, value]) => {
      const pid: number = parseInt(key),
        process: ChildProcess = value;

      process.kill();
      delete queue[pid];
    });
  } catch (err) {
    console.log(err);
  }
};

export default Sound;
