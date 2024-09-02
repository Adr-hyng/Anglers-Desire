export default class CuboidRegion {
    static FromCenterLocation(location, cuboidRadius, isVerticallyFlat) {
        cuboidRadius = Math.round(cuboidRadius);
        const corner1 = {
            x: location.x - cuboidRadius,
            y: (!isVerticallyFlat ? (location.y - cuboidRadius) : location.y),
            z: location.z - cuboidRadius,
        };
        const corner2 = {
            x: location.x + cuboidRadius,
            y: (!isVerticallyFlat ? (location.y + cuboidRadius) : location.y),
            z: location.z + cuboidRadius,
        };
        return new CuboidRegion(corner1, corner2, cuboidRadius, isVerticallyFlat);
    }
    static GetAdjacentPositions(centerLocation, cuboidRadius) {
        const positions = [];
        const directions = [
            { x: 0, y: 1, z: 0 },
            { x: 0, y: -1, z: 0 },
            { x: 1, y: 0, z: 0 },
            { x: -1, y: 0, z: 0 },
            { x: 0, y: 0, z: 1 },
            { x: 0, y: 0, z: -1 }
        ];
        for (const direction of directions) {
            positions.push({
                x: centerLocation.x + direction.x * cuboidRadius,
                y: centerLocation.y + direction.y * cuboidRadius,
                z: centerLocation.z + direction.z * cuboidRadius,
            });
        }
        return positions;
    }
    static GetPositionsAlongOuterEdgeOfCube(centerLocation, cuboidRadius) {
        const existingPositionsHashMap = {};
        const positions = [];
        for (let x = -cuboidRadius; x == -cuboidRadius; x++) {
            for (let y = -cuboidRadius; y <= cuboidRadius; y++) {
                for (let z = -cuboidRadius; z <= cuboidRadius; z++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        for (let x = cuboidRadius; x == cuboidRadius; x++) {
            for (let y = -cuboidRadius; y <= cuboidRadius; y++) {
                for (let z = -cuboidRadius; z <= cuboidRadius; z++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        for (let y = cuboidRadius; y == cuboidRadius; y++) {
            for (let x = -cuboidRadius; x <= cuboidRadius; x++) {
                for (let z = -cuboidRadius; z <= cuboidRadius; z++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        for (let y = -cuboidRadius; y == -cuboidRadius; y++) {
            for (let x = -cuboidRadius; x <= cuboidRadius; x++) {
                for (let z = -cuboidRadius; z <= cuboidRadius; z++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        for (let z = cuboidRadius; z == cuboidRadius; z++) {
            for (let x = -cuboidRadius; x <= cuboidRadius; x++) {
                for (let y = -cuboidRadius; y <= cuboidRadius; y++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        for (let z = -cuboidRadius; z == -cuboidRadius; z++) {
            for (let x = -cuboidRadius; x <= cuboidRadius; x++) {
                for (let y = -cuboidRadius; y <= cuboidRadius; y++) {
                    const hash = `${x},${y},${z}`;
                    if (!(hash in existingPositionsHashMap)) {
                        positions.push({
                            x: centerLocation.x + x,
                            y: centerLocation.y + y,
                            z: centerLocation.z + z,
                        });
                        existingPositionsHashMap[hash] = true;
                    }
                }
            }
        }
        return positions;
    }
    constructor(corner1, corner2, cuboidRadius, isVerticallyFlat) {
        this.Corner1 = corner1;
        this.Corner2 = corner2;
        this.CuboidRadius = cuboidRadius;
        this.IsVerticallyFlat = isVerticallyFlat;
    }
    GetAllLocationsInRegion() {
        const locations = [];
        const top = {
            x: Math.min(this.Corner1.x, this.Corner2.x),
            y: Math.min(this.Corner1.y, this.Corner2.y),
            z: Math.min(this.Corner1.z, this.Corner2.z),
        };
        const bottom = {
            x: Math.max(this.Corner1.x, this.Corner2.x),
            y: Math.max(this.Corner1.y, this.Corner2.y),
            z: Math.max(this.Corner1.z, this.Corner2.z),
        };
        for (let x = top.x; x <= bottom.x; x++) {
            for (let y = top.y; y <= bottom.y; y++) {
                for (let z = top.z; z <= bottom.z; z++) {
                    locations.push({ x: x, y: y, z: z });
                }
            }
        }
        return locations;
    }
}
