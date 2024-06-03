import * as fs from "fs";
import * as path from "path";

import Sound from "../models/soundModel";
import sequelize from "./sequelize";

// optional dependency for GPIO pins
let Gpio;
try {
  Gpio = require("onoff").gpio;
} catch (err) {}

// config file
const configFilePath = path.join(
  __dirname,
  "..",
  "data",
  "peripheralConfig.json"
);
const gpioConfig: {
  [key: string]: {
    [key: string]: number;
  };
} = fs.existsSync(configFilePath)
  ? JSON.parse(fs.readFileSync(configFilePath, "utf-8")).gpio
  : undefined;

const gpio: any = {
  buttons: {},
  leds: {},
};

if (Gpio && gpioConfig) {
  for (const [key, value] of Object.entries(gpioConfig.buttons)) {
    const fnName: string = key,
      gpioPin: number = value;

    if (gpioPin > -1) {
      gpio.buttons[fnName] = new Gpio(value, "in", "both");
      gpio.buttons[fnName].longPress = false;
      gpio.buttons[fnName].longPressTimer = undefined;
      /* gpio.buttons[fnName].doublePress = false;
      gpio.buttons[fnName].doublePressTimer = undefined; */
    }
  }

  for (const [key, value] of Object.entries(gpioConfig.leds)) {
    const ledName: string = key,
      gpioPin: number = value;

    if (gpioPin > -1) {
      gpio.leds[ledName] = new Gpio(value, "out");
    }
  }
}

// turn led indicator on
const setStatusLed = (status: number) => {
  if (gpio.leds.status_led) {
    gpio.leds.status_led.writeSync(status);
  }
};

const playRandomSound = async () => {
  try {
    const sound = await Sound.findOne({ order: sequelize.random() });
    if (!sound) {
      const error: any = new Error("No sound found");
      error.status = 404;
      throw error;
    }
    await sound.play();
  } catch (err) {
    console.log(err);
  }
};

export default {
  init: function () {
    try {
      const longPressTime = 3000,
        doublePressTime = 500;
      let spamInterval: ReturnType<typeof setInterval> | void; // span interval variable

      if (gpio.buttons.random_sound)
        gpio.buttons.random_sound.watch(async (err: Error, value: number) => {
          if (err) throw err;
          const isUp = value === 1;

          // led on down
          if (!spamInterval && !isUp) {
            setStatusLed(1);
          }
          //
          // if interval exists and key up, destroy interval and sound queue
          else if (spamInterval && isUp) {
            spamInterval = clearInterval(spamInterval); // clear spam interval
            // @ts-ignore comment
            await Sound.killAll();
            setStatusLed(0);
            return;
          }
          // on button up, if timeout did not trigger long press, play one random sound and turn off led
          else if (!gpio.buttons.random_sound.longPress && isUp) {
            await playRandomSound();
            setStatusLed(0);
            return;
          }
          // if button was held down for longPressTime
          else if (gpio.buttons.random_sound.longPress && isUp) {
            spamInterval = setInterval(playRandomSound, 500);
            return;
          }

          /* // setup double press
          console.log(gpio.buttons.random_sound.doublePress);
          gpio.buttons.random_sound.doublePress = true;
          clearTimeout(gpio.buttons.random_sound.doublePressTimer);
          gpio.buttons.random_sound.doublePressTimer = setTimeout(
            () => (gpio.buttons.random_sound.doublePress = false),
            doublePressTime
          ); */

          // setup long press
          gpio.buttons.random_sound.longPress = false;
          clearTimeout(gpio.buttons.random_sound.longPressTimer);
          gpio.buttons.random_sound.longPressTimer = setTimeout(
            () => (gpio.buttons.random_sound.longPress = true),
            longPressTime
          );
        });
    } catch (err) {
      console.log(err);
    }
  },
};
