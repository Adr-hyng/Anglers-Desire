import { Vector3 } from "@minecraft/server";

class CatmullRomSpline {
    private controlPoints: Vector3[];

    constructor(controlPoints: Vector3[]) {
        this.controlPoints = controlPoints;
    }

    /**
     * Computes the Catmull-Rom spline coefficients for a given parameter t.
     * 
     * @param t - The interpolation parameter, typically between 0 and 1.
     * @returns An array of coefficients [a, b, c, d] for the spline calculation.
     */
    private computeCoefficients(t: number): [number, number, number, number] {
        const tt = t * t;
        const ttt = tt * t;

        const a = -ttt + 2 * tt - t;
        const b = 3 * ttt - 5 * tt + 2;
        const c = -3 * ttt + 4 * tt + t;
        const d = ttt - tt;

        return [a, b, c, d];
    }

    /**
     * Performs the Catmull-Rom spline interpolation for a single coordinate.
     * 
     * @param p0 - The first control point.
     * @param p1 - The second control point.
     * @param p2 - The third control point.
     * @param p3 - The fourth control point.
     * @param cofs - The precomputed coefficients from computeCoefficients.
     * @returns The interpolated coordinate value.
     */
    private interpolate(p0: number, p1: number, p2: number, p3: number, cofs: [number, number, number, number]): number {
        const [a, b, c, d] = cofs;

        // Factor of 0.5 is part of the Catmull-Rom spline formula
        return 0.5 * (p0 * a + p1 * b + p2 * c + p3 * d);
    }

    /**
     * Computes a point on the Catmull-Rom spline for the given parameter t.
     * 
     * @param t - The interpolation parameter, where t = 0 corresponds to the start of the spline and t = 1 to the end.
     * @returns The interpolated point as a Vector3 object.
     */
    public interpolatePoint(t: number): Vector3 {
        const i = Math.floor(t);
        const localT = t - i;

        // Ensure control points wrap around or duplicate edge points to prevent out-of-bounds access
        const p1 = this.controlPoints[i];
        const p0 = this.controlPoints[i - 1] || p1;
        const p2 = this.controlPoints[i + 1] || p1;
        const p3 = this.controlPoints[i + 2] || p2;

        // Compute the coefficients only once for efficiency
        const cofs = this.computeCoefficients(localT);

        // Interpolate each coordinate separately
        const x = this.interpolate(p0.x, p1.x, p2.x, p3.x, cofs);
        const y = this.interpolate(p0.y, p1.y, p2.y, p3.y, cofs);
        const z = this.interpolate(p0.z, p1.z, p2.z, p3.z, cofs);

        // Return the interpolated point
        return {x, y, z} as Vector3;
    }
}

export { CatmullRomSpline };
