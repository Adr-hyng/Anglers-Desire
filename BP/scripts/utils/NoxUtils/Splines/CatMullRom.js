class CatmullRomSpline {
    constructor(controlPoints) {
        this.controlPoints = controlPoints;
    }
    computeCoefficients(t) {
        const tt = t * t;
        const ttt = tt * t;
        const a = -ttt + 2 * tt - t;
        const b = 3 * ttt - 5 * tt + 2;
        const c = -3 * ttt + 4 * tt + t;
        const d = ttt - tt;
        return [a, b, c, d];
    }
    interpolate(p0, p1, p2, p3, cofs) {
        const [a, b, c, d] = cofs;
        return 0.5 * (p0 * a + p1 * b + p2 * c + p3 * d);
    }
    interpolatePoint(t) {
        const i = Math.floor(t);
        const localT = t - i;
        const p1 = this.controlPoints[i];
        const p0 = this.controlPoints[i - 1] || p1;
        const p2 = this.controlPoints[i + 1] || p1;
        const p3 = this.controlPoints[i + 2] || p2;
        const cofs = this.computeCoefficients(localT);
        const x = this.interpolate(p0.x, p1.x, p2.x, p3.x, cofs);
        const y = this.interpolate(p0.y, p1.y, p2.y, p3.y, cofs);
        const z = this.interpolate(p0.z, p1.z, p2.z, p3.z, cofs);
        return { x, y, z };
    }
}
export { CatmullRomSpline };
