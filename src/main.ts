import './main.css';
import './index.html';
import * as pixi from 'pixi.js';

import { lifecycle, size } from '@/utils';

import './game/leaf';
import './game/wind';
import './game/wall';

let app: pixi.Application;

function init() {
  app = new pixi.Application({
    width: size.x,
    height: size.y,
    backgroundColor: 0xFFFFFF,
  });

  document.body.appendChild(app.view);

  lifecycle.emit('init', app);
}

pixi.loader.load(init);
