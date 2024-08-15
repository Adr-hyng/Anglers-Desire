class Entry<T> {
    accumulatedWeight: number;
    object: T;

    constructor(object: T, accumulatedWeight: number) {
        this.object = object;
        this.accumulatedWeight = accumulatedWeight;
    }
}

class WeightedRandom<T> {
    private entries: Entry<T>[] = [];
    private accumulatedWeight = 0;

    public addEntry(value: T, weight: number): WeightedRandom<T> {
        this.accumulatedWeight += weight;
        this.entries.push(new Entry((!isNaN(value as number) ? Number(value) : value) as T, this.accumulatedWeight));
        return this;
    }

    public removeEntry(value: T): boolean {
        const index = this.entries.findIndex(entry => entry.object === value);
        if (index === -1) return false;
    
        const weightToRemove = index === 0
          ? this.entries[index].accumulatedWeight
          : this.entries[index].accumulatedWeight - this.entries[index - 1].accumulatedWeight;
    
        this.entries.splice(index, 1);
        this.accumulatedWeight -= weightToRemove;
    
        // Update the accumulated weights of the remaining entries
        for (let i = index; i < this.entries.length; i++) {
          this.entries[i].accumulatedWeight -= weightToRemove;
        }
    
        return true;
      }

    public addEntriesFromObject(entriesObject: { [key: string]: number }): WeightedRandom<T> {
        for (let key in entriesObject) {
            this.addEntry(key as unknown as T, entriesObject[key]);
        }
        return this;
    }

    public getRandom(): T | null {
        const r = Math.random() * this.accumulatedWeight;

        for (const entry of this.entries) {
            if (entry.accumulatedWeight >= r) {
                return entry.object;
            }
        }
        return null; // should only happen when there are no entries
    }
}

export { WeightedRandom };
