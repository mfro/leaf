export class Vec {
    constructor(
        readonly x: number,
        readonly y: number,
    ) { }

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    get dir() {
        return Math.atan2(this.y, this.x);
    }


    static neg(a: Vec) {
        return Vec.polar(-a.len, a.dir);
    }

    static norm(a: Vec) {
        return Vec.polar(1, a.dir);
    }

    static add(a: Vec, b: Vec) {
        return new Vec(a.x + b.x, a.y + b.y);
    }

    static dot(a: Vec, b: Vec) {
        return a.x * b.x + a.y * b.y;
    }

    static project(a: Vec, onto: Vec) {
      return Vec.polar(Vec.dot(a, onto) / onto.len, onto.dir);
    }

    static delta(a: Vec, b: Vec) {
        let dot = Vec.dot(a, b);
        let abs = Math.acos(dot / a.len / b.len);
        if (a.y * b.x > a.x * b.y)
            return -abs;
        return abs;
    }

    static scale(vec: Vec, len: number) {
        return Vec.polar(vec.len * len, vec.dir);
    }

    static polar(len: number, dir: number) {
        return new Vec(
            Math.cos(dir) * len,
            Math.sin(dir) * len
        );
    }
}
