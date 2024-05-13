import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
import Player from "play-sound";
const player = Player();

const dataFilePath = path.join(__dirname, "..", "public", "sounds.json");

export default class Sound {
  id: string;
  name: string;
  soundPath: string;
  imagePath: string;

  constructor(name: string, soundPath: string, imagePath: string, id?: string) {
    if (id) {
      this.id = id;
    } else {
      this.id = uuidv4();
    }
    this.name = name;
    this.soundPath = soundPath;
    this.imagePath = imagePath;
  }

  async play() {
    console.log(this.soundPath);
    const result = await player.play(this.soundPath);
    console.log(result);
  }

  add() {
    // create mutated array with old sound filtered out and new sound appended
    const data: { sounds: Object[] } = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    );
    data.sounds.push(this);

    fs.writeFileSync(dataFilePath, JSON.stringify(data), "utf-8");
  }

  update(name?: string, soundPath?: string, imagePath?: string) {
    // set name if exists
    if (name) this.name = name;

    // remove old file, if exists
    if (soundPath) {
      fs.rmSync(this.soundPath);
      this.soundPath = soundPath;
    }
    if (imagePath) {
      fs.rmSync(this.imagePath);
      this.imagePath = imagePath;
    }

    // create mutated array with old sound filtered out and new sound appended
    const data: { sounds: Object[] } = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    );
    data.sounds = [...data.sounds.filter((id) => id !== this.id), this];
    fs.writeFileSync(dataFilePath, JSON.stringify(data), "utf-8");
  }

  delete() {
    // remove old files
    fs.rmSync(this.soundPath);
    fs.rmSync(this.imagePath);

    // create mutated array with old sound filtered out and new sound appended
    const data: { sounds: Sound[] } = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    );
    data.sounds = [...data.sounds.filter((sound) => sound.id !== this.id)];
    fs.writeFileSync(dataFilePath, JSON.stringify(data), "utf-8");
  }

  static async find(id: string) {
    const data: { sounds: Sound[] } = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    );
    const sound = data.sounds.find((sound) => sound.id === id);
    if (sound)
      return new Sound(sound.name, sound.soundPath, sound.imagePath, sound.id);
    return;
  }

  static async findAll() {
    const data: { sounds: Sound[] } = JSON.parse(
      fs.readFileSync(dataFilePath, "utf-8")
    );

    return data.sounds;
  }
}
