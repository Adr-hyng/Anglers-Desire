export class StateController {
  private currentValue: boolean;
  private previousValue: boolean;

  constructor(initialValue: boolean) {
    this.currentValue = initialValue;
    this.previousValue = initialValue;
  }

  setValue(newValue: boolean): void {
    this.previousValue = this.currentValue;
    this.currentValue = newValue;
  }

  hasChanged(): boolean {
    return this.currentValue !== this.previousValue;
  }

  getCurrentValue(): boolean {
    return this.currentValue;
  }

  getPreviousValue(): boolean {
    return this.previousValue;
  }
}