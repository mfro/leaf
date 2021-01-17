import * as pixi from 'pixi.js';

import { Vec, lifecycle } from '@/utils';
import { Container } from 'pixi.js';

import * as camera from './camera';
import * as world from './world';

export class Entity {
    public velocity = new Vec(0, 0);
    public size = new Vec(0, 0);

    public position = new Vec(0, 0);

    public debug = new Container();

    onCollision(other: Entity, man: Manifold) { }
}

export interface Manifold {
    distance: Vec;
    normal: Vec;
    depth: number;
}

let entities = new Set<Entity>();
let statics = new Set<Entity>();

export function addEntity(e: Entity) {
    entities.add(e);

    camera.container.addChild(e.debug);

    // let g = new pixi.Graphics();
    // g.beginFill(0xFF0000, 1);
    // g.drawRect(0, 0, e.size.x, e.size.y);
    // g.endFill();
    // e.debug.addChild(g);
}

export function addStatic(e: Entity) {
    statics.add(e);

    camera.container.addChild(e.debug);

    // let g = new pixi.Graphics();
    // g.beginFill(0xFF0000, 1);
    // g.drawRect(0, 0, e.size.x, e.size.y);
    // g.endFill();
    // e.debug.addChild(g);

    e.debug.x = e.position.x;
    e.debug.y = e.position.y;
}

export function remove(e: Entity) {
    statics.delete(e);
    entities.delete(e);
}

lifecycle.hook('reset', 'physics', () => {
    statics.clear();
    entities.clear();
});


function collide(aPos: Vec, aSize: Vec, bPos: Vec, bSize: Vec) {
    let normal;
    let depth;

    let distance = Vec.add(bPos, Vec.add(Vec.neg(aPos), Vec.scale(Vec.add(bSize, Vec.neg(aSize)), 0.5)));
    let aExtents = Vec.scale(aSize, 0.5);
    let bExtents = Vec.scale(bSize, 0.5);

    let overlap = Vec.add(Vec.neg(new Vec(Math.abs(distance.x), Math.abs(distance.y))), Vec.add(aExtents, bExtents));

    if (overlap.x < 0 || overlap.y < 0)
        return null;

    if (overlap.x < overlap.y) {
        depth = overlap.x;
        normal = new Vec(-Math.sign(distance.x), 0);
    } else {
        depth = overlap.y;
        normal = new Vec(0, -Math.sign(distance.y));
    }

    return { distance, normal, depth };
}

lifecycle.hook('init', 'physics', app => {
    let delay = 0;

    app.ticker.add(dT => {
        if (delay > dT) {
            delay -= dT;
        } else {
            delay = 1;

            for (let a of entities) {
                let pos = Vec.add(a.position, a.velocity);

                for (let b of statics) {
                    let man = collide(pos, a.size, b.position, b.size);
                    if (man === null) continue;

                    let dot = Vec.dot(a.velocity, man.normal);
                    if (dot > 0) continue;

                    a.onCollision(b, man);
                    b.onCollision(a, man);
                }

                a.position = pos;
                a.debug.x = pos.x;
                a.debug.y = pos.y;
            }
        }
    });
});
