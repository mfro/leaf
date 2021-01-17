import * as pixi from 'pixi.js';

import EventEmitter from 'eventemitter3';

import title from '@/assets/title.png';
import moon from '@/assets/bg-moon.png';
import sewers from '@/assets/bg-sewers.png';
import mountain from '@/assets/bg-mountain.png';

import titleMusic from '@/assets/leef_wourld_opus_1.wav';
import moonMusic from '@/assets/spooky.wav';
import sewerMusic from '@/assets/leefwourldopus3.wav';
import mountainMusic from '@/assets/leef_wourld_opus_1.wav';

import { Vec, size, lifecycle } from '@/utils';

import * as leaf from './leaf';
import { addWind } from './wind';
import { addWall } from './wall';

import * as camera from './camera';
import { background } from './camera';

pixi.loader.add(title);
pixi.loader.add(moon);
pixi.loader.add(sewers);
pixi.loader.add(mountain);

let audio = document.createElement('audio');
audio.loop = true;
audio.autoplay = true;

window.addEventListener('load', () => {
  document.body.appendChild(audio);
});

let current: string;
function music(src: string) {
  if (current == src)
    return;

  audio.src = src;
  current = src;
}

export function load_title() {
  lifecycle.emit('reset');

  background(title, 10 * (size.y / 1080));
  music(titleMusic);

  let g = new pixi.Text('Switch worlds with number keys. Best experienced in full screen (F11)');
  camera.container.addChild(g);
  g.anchor.x = 0.5;
  g.anchor.y = 0.5;
  g.x = size.x / 2;
  g.y = size.y * 0.92;
}

export function load_moon() {
  lifecycle.emit('reset');
  lifecycle.emit('start');

  background(moon);
  music(moonMusic);

  addWall(new Vec(size.x * 0.38, size.y * .83), new Vec(size.x * .24, 100));
}

export function load_sewers() {
  lifecycle.emit('reset');
  lifecycle.emit('start');

  background(sewers);
  music(sewerMusic);

  addWall(new Vec(0, size.y + 50), new Vec(0, 0));

  addWind(new Vec(size.x - 400, size.y - 250), new Vec(100, 250), new Vec(0, 5), false);
}

export function load_mountain() {
  lifecycle.emit('reset');
  lifecycle.emit('start');

  background(mountain);
  music(mountainMusic);

  addWall(new Vec(0, size.y - 50), new Vec(size.x, 100));

  addWall(new Vec(size.x - 10, 0), new Vec(100, size.y));

  addWind(new Vec(0, 500), new Vec(500, size.y - 500), new Vec(0, -1));
  addWind(new Vec(0, 0), new Vec(500, 500), new Vec(1, -1));
  addWind(new Vec(500, 0), new Vec(size.x - 1000, 500), new Vec(1, 0));
}

let app: pixi.Application;
let releases: any = [];

lifecycle.hook('init', 'world', a => app = a);

lifecycle.hook('reset', 'world', () => {
  for (let release of releases)
    release();
});

export function tick(fn: (dt: number) => void) {
  function call(dt: number) {
    fn(dt);
  }

  app.ticker.add(call);
  releases.push(() => {
    app.ticker.remove(call);
  });

  return () => {
    app.ticker.remove(call);
  };
}
