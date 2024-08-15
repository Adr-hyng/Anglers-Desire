import { WeightedRandom } from "./weighted_randomizer";
export class Random {
    static setSeed(value) {
        this.seed = value;
    }
    static randomInt(min, max) {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return min + Math.floor((max - min) * (this.seed / this.m));
    }
    static randomFloat(min, max) {
        this.seed = (this.a * this.seed + this.c) % this.m;
        return min + (max - min) * (this.seed / this.m);
    }
    static randomBool(probability) {
        return this.randomFloat(0, 1) < probability;
    }
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = this.randomInt(0, i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    static sample(array) {
        return array[this.randomInt(0, array.length)];
    }
    static permutation(array) {
        const result = [...array];
        this.shuffle(result);
        return result;
    }
    static subset(array, size) {
        const result = [];
        const indices = [];
        for (let i = 0; i < array.length; i++) {
            indices.push(i);
        }
        this.shuffle(indices);
        for (let i = 0; i < size; i++) {
            result.push(array[indices[i]]);
        }
        return result;
    }
    static weighted() {
        return new WeightedRandom();
    }
}
Random.m = Math.pow(2, 32);
Random.a = 1664525;
Random.c = 1013904223;
Random.seed = 0;
