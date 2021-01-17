import { Vec, lifecycle } from '@/utils';

export class Entity {
    public velocity = new Vec(0, 0);
    public size = new Vec(0, 0);

    public position = new Vec(0, 0);
}

let entities = new Set<Entity>();

export function add(e: Entity) {
    entities.add(e);
}

export function remove(e: Entity) {
    entities.delete(e);
}

function collide(aPos: Vec, aSize: Vec, bPos: Vec, bSize: Vec) {
    let x = bPos.x + bSize.x;
}

lifecycle.hook('init', 'physics', app => {
    app.ticker.add(dT => {
        for (let a of entities) {
            let mX = new Vec(a.position.x + a.velocity.y, a.position.y);
            let mY = new Vec(mX.x, mX.y + a.velocity.y);
            for (let b of entities) {
                if (a == b) continue;

                collide(mX, a.size, b.position, b.size);
                collide(mY, a.size, b.position, b.size);
            }
        }
    });
});
