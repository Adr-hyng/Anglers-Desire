class KDNode {
    constructor(point) {
        this.left = null;
        this.right = null;
        this.point = point;
    }
}
class KDTree {
    constructor() {
        this.root = null;
        this.k = 3;
    }
    distanceSquared(p1, p2) {
        return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2;
    }
    insert(point) {
        const insertRec = (node, point, depth) => {
            if (node === null) {
                return new KDNode(point);
            }
            const axis = depth % this.k;
            if (point[axis] < node.point[axis]) {
                node.left = insertRec(node.left, point, depth + 1);
            }
            else {
                node.right = insertRec(node.right, point, depth + 1);
            }
            return node;
        };
        this.root = insertRec(this.root, point, 0);
    }
    nearest(point, maxDist) {
        let bestNode = null;
        let bestDist = maxDist ** 2;
        const nearestRec = (node, point, depth) => {
            if (node === null)
                return;
            const dist = this.distanceSquared(node.point, point);
            if (dist < bestDist) {
                bestDist = dist;
                bestNode = node;
            }
            const axis = depth % this.k;
            const diff = point[axis] - node.point[axis];
            const closeBranch = diff < 0 ? node.left : node.right;
            const awayBranch = diff < 0 ? node.right : node.left;
            nearestRec(closeBranch, point, depth + 1);
            if (diff ** 2 < bestDist) {
                nearestRec(awayBranch, point, depth + 1);
            }
        };
        nearestRec(this.root, point, 0);
        return bestNode;
    }
    delete(point) {
        const deleteRec = (node, point, depth) => {
            if (node === null)
                return null;
            const axis = depth % this.k;
            if (node.point.x === point.x && node.point.y === point.y && node.point.z === point.z) {
                if (node.right !== null) {
                    const minNode = this.findMin(node.right, axis, depth + 1);
                    node.point = minNode.point;
                    node.right = deleteRec(node.right, minNode.point, depth + 1);
                }
                else if (node.left !== null) {
                    return node.left;
                }
                else {
                    return null;
                }
            }
            else {
                if (point[axis] < node.point[axis]) {
                    node.left = deleteRec(node.left, point, depth + 1);
                }
                else {
                    node.right = deleteRec(node.right, point, depth + 1);
                }
            }
            return node;
        };
        this.root = deleteRec(this.root, point, 0);
    }
    findMin(node, axis, depth) {
        if (node === null)
            return null;
        const currentAxis = depth % this.k;
        if (currentAxis === axis) {
            if (node.left === null)
                return node;
            return this.findMin(node.left, axis, depth + 1);
        }
        return this.minNode(node, axis, depth);
    }
    minNode(node, axis, depth) {
        if (node === null)
            return null;
        let best = node;
        const currentAxis = depth % this.k;
        if (node.left !== null) {
            const leftBest = this.minNode(node.left, axis, depth + 1);
            if (leftBest !== null && leftBest.point[axis] < best.point[axis]) {
                best = leftBest;
            }
        }
        if (node.right !== null && node.right.point[axis] < best.point[axis]) {
            const rightBest = this.minNode(node.right, axis, depth + 1);
            if (rightBest !== null) {
                best = rightBest;
            }
        }
        return best;
    }
}
export class VectorContainer {
    constructor(distance) {
        this.distance = distance;
        this.kdTree = new KDTree();
    }
    addOrUpdateVector(newVector) {
        const nearestNode = this.kdTree.nearest(newVector, this.distance);
        if (nearestNode !== null) {
            nearestNode.point = newVector;
        }
        else {
            this.kdTree.insert(newVector);
        }
    }
    getNearestVector(vector, maxDist) {
        const nearestNode = this.kdTree.nearest(vector, maxDist);
        return nearestNode ? nearestNode.point : null;
    }
    deleteVector(vector) {
        this.kdTree.delete(vector);
    }
    getVectors() {
        const vectors = [];
        const traverse = (node) => {
            if (node === null)
                return;
            vectors.push(node.point);
            traverse(node.left);
            traverse(node.right);
        };
        traverse(this.kdTree.root);
        return vectors;
    }
}
