export class StateController {
    constructor(initialValue) {
        this.currentValue = initialValue;
        this.previousValue = initialValue;
    }
    setValue(newValue) {
        this.previousValue = this.currentValue;
        this.currentValue = newValue;
    }
    hasChanged() {
        return this.currentValue !== this.previousValue;
    }
    getCurrentValue() {
        return this.currentValue;
    }
    getPreviousValue() {
        return this.previousValue;
    }
}
