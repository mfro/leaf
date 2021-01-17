import './main.css';
import './index.html';
import * as pixi from 'pixi.js';
import * as input from '@/input';

import { lifecycle, size } from '@/utils';

import './game/leaf';
import './game/wind';
import './game/wall';
import { load_mountain, load_moon, load_sewers, load_title } from './game/world';

let app: pixi.Application;

function init() {
  app = new pixi.Application({
    width: size.x,
    height: size.y,
    backgroundColor: 0xFFFFFF,
  });

  document.body.appendChild(app.view);

  lifecycle.emit('init', app);
  load_title();
}

pixi.loader.load(init);

input.onKeyDown(input.ENTER, () => {
  load_mountain();
});

input.onKeyDown(input.ESC, () => {
  load_title();
});

input.onKeyDown(input.N1, () => {
  load_mountain();
});

input.onKeyDown(input.N2, () => {
  load_moon()
});

input.onKeyDown(input.N3, () => {
  load_sewers();
});

window.onresize = function () {
  location.reload();
};
