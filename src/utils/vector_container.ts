import { Vector3 } from "@minecraft/server";

/**
 * Represents a node in a k-d tree.
 */
class KDNode {
  public point: Vector3;
  public left: KDNode | null = null;
  public right: KDNode | null = null;

  constructor(point: Vector3) {
    this.point = point;
  }
}

/**
 * Represents a k-d tree for 3-dimensional space.
 */
class KDTree {
  public root: KDNode | null = null;
  private k: number = 3;

  /**
   * Calculates the squared Euclidean distance between two points.
   * @param {Vector3} p1 - The first point.
   * @param {Vector3} p2 - The second point.
   * @returns {number} - The squared distance between the two points.
   */
  private distanceSquared(p1: Vector3, p2: Vector3): number {
    return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 + (p1.z - p2.z) ** 2;
  }

  /**
   * Inserts a point into the k-d tree.
   * @param {Vector3} point - The point to insert.
   */
  public insert(point: Vector3): void {
    const insertRec = (node: KDNode | null, point: Vector3, depth: number): KDNode => {
      if (node === null) {
        return new KDNode(point);
      }

      const axis = depth % this.k;
      if (point[axis] < node.point[axis]) {
        node.left = insertRec(node.left, point, depth + 1);
      } else {
        node.right = insertRec(node.right, point, depth + 1);
      }
      return node;
    };

    this.root = insertRec(this.root, point, 0);
  }

  /**
   * Finds the nearest neighbor to the given point within a certain distance.
   * @param {Vector3} point - The point to find the nearest neighbor for.
   * @param {number} maxDist - The maximum distance to consider.
   * @returns {KDNode | null} - The nearest neighbor node, or null if none is found within the distance.
   */
  public nearest(point: Vector3, maxDist: number): KDNode | null {
    let bestNode: KDNode | null = null;
    let bestDist = maxDist ** 2;

    const nearestRec = (node: KDNode | null, point: Vector3, depth: number): void => {
      if (node === null) return;

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

  /**
   * Deletes a point from the k-d tree.
   * @param {Vector3} point - The point to delete.
   */
  public delete(point: Vector3): void {
    const deleteRec = (node: KDNode | null, point: Vector3, depth: number): KDNode | null => {
      if (node === null) return null;

      const axis = depth % this.k;
      if (node.point.x === point.x && node.point.y === point.y && node.point.z === point.z) {
        if (node.right !== null) {
          const minNode = this.findMin(node.right, axis, depth + 1);
          node.point = minNode.point;
          node.right = deleteRec(node.right, minNode.point, depth + 1);
        } else if (node.left !== null) {
          return node.left;
        } else {
          return null;
        }
      } else {
        if (point[axis] < node.point[axis]) {
          node.left = deleteRec(node.left, point, depth + 1);
        } else {
          node.right = deleteRec(node.right, point, depth + 1);
        }
      }
      return node;
    };

    this.root = deleteRec(this.root, point, 0);
  }

  /**
   * Finds the minimum node in the k-d tree along a given dimension.
   * @param {KDNode | null} node - The starting node.
   * @param {number} axis - The dimension to find the minimum node in.
   * @param {number} depth - The depth of the current node.
   * @returns {KDNode} - The minimum node.
   */
  private findMin(node: KDNode | null, axis: number, depth: number): KDNode {
    if (node === null) return null as any;

    const currentAxis = depth % this.k;
    if (currentAxis === axis) {
      if (node.left === null) return node;
      return this.findMin(node.left, axis, depth + 1);
    }

    return this.minNode(node, axis, depth);
  }

  /**
   * Finds the minimum node in the subtree rooted at a given node.
   * @param {KDNode | null} node - The starting node.
   * @param {number} axis - The dimension to find the minimum node in.
   * @param {number} depth - The depth of the current node.
   * @returns {KDNode} - The minimum node.
   */
  private minNode(node: KDNode | null, axis: number, depth: number): KDNode {
    if (node === null) return null as any;

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

/**
 * Represents a container to store vectors and manage their addition based on distance rules using a k-d tree.
 */
export class VectorContainer {
  private kdTree: KDTree;
  public distance: number;

  constructor(distance: number) {
    this.distance = distance;
    this.kdTree = new KDTree();
  }

  /**
   * Adds a new vector to the container or updates an existing one based on distance rules.
   * @param {Vector3} newVector - The new vector to add.
   * @returns {void}
   */
  public set(newVector: Vector3): void {
    const nearestNode = this.kdTree.nearest(newVector, this.distance);

    if (nearestNode !== null) {
      nearestNode.point = newVector; // Update the existing vector
    } else {
      this.kdTree.insert(newVector); // Add the new vector
    }
  }

  /**
   * Fetches the nearest vector to the given vector within the specified distance.
   * @param {Vector3} vector - The vector to find the nearest vector for.
   * @param {number} maxDist - The maximum distance to consider.
   * @returns {Vector3 | null} - The nearest vector, or null if none is found within the distance.
   */
  public getNearby(vector: Vector3, maxDist: number): Vector3 | null {
    const nearestNode = this.kdTree.nearest(vector, maxDist);
    return nearestNode ? nearestNode.point : null;
  }

  /**
   * Deletes a vector from the container.
   * @param {Vector3} vector - The vector to delete.
   * @returns {void}
   */
  public deleteVector(vector: Vector3): void {
    this.kdTree.delete(vector);
  }

  /**
   * Returns all vectors stored in the container. (This requires traversing the k-d tree, which isn't implemented here)
   * @returns {Vector3[]} - The list of vectors.
   */
  public getVectors(): Vector3[] {
    // Implementing traversal to get all vectors from the k-d tree
    const vectors: Vector3[] = [];
    const traverse = (node: KDNode | null): void => {
      if (node === null) return;
      vectors.push(node.point);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.kdTree.root);
    return vectors;
  }
  /**
   * Clears the vector container
   */
  public clear() {
    this.kdTree.root = null;
  }
}