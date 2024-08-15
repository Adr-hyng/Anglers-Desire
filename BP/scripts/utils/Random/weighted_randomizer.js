class Entry {
    constructor(object, accumulatedWeight) {
        this.object = object;
        this.accumulatedWeight = accumulatedWeight;
    }
}
class WeightedRandom {
    constructor() {
        this.entries = [];
        this.accumulatedWeight = 0;
    }
    addEntry(value, weight) {
        this.accumulatedWeight += weight;
        this.entries.push(new Entry((!isNaN(value) ? Number(value) : value), this.accumulatedWeight));
        return this;
    }
    removeEntry(value) {
        const index = this.entries.findIndex(entry => entry.object === value);
        if (index === -1)
            return false;
        const weightToRemove = index === 0
            ? this.entries[index].accumulatedWeight
            : this.entries[index].accumulatedWeight - this.entries[index - 1].accumulatedWeight;
        this.entries.splice(index, 1);
        this.accumulatedWeight -= weightToRemove;
        for (let i = index; i < this.entries.length; i++) {
            this.entries[i].accumulatedWeight -= weightToRemove;
        }
        return true;
    }
    addEntriesFromObject(entriesObject) {
        for (let key in entriesObject) {
            this.addEntry(key, entriesObject[key]);
        }
        return this;
    }
    getRandom() {
        const r = Math.random() * this.accumulatedWeight;
        for (const entry of this.entries) {
            if (entry.accumulatedWeight >= r) {
                return entry.object;
            }
        }
        return null;
    }
}
export { WeightedRandom };
