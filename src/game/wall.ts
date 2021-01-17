import * as pixi from 'pixi.js';
import { lifecycle, Vec, size } from '@/utils';

import * as leaf from './leaf';
import * as camera from './camera';
import * as world from './world';

import * as physics from './physics';
import { Entity } from './physics';

class Wall extends Entity {
    constructor(pos: Vec, size: Vec) {
        super();
        this.position = pos;
        this.size = size;
    }
}

export function addWall(pos: Vec, size: Vec) {
    physics.addStatic(new Wall(pos, size));
}
