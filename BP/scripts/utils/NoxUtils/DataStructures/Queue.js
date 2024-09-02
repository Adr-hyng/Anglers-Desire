export class Queue {
    constructor() {
        this.Elements = {};
        this.Head = 0;
        this.Tail = 0;
    }
    Enqueue(element) {
        this.Elements[this.Tail] = element;
        this.Tail++;
    }
    EnqueueList(listOfElements) {
        for (const element of listOfElements) {
            this.Elements[this.Tail] = element;
            this.Tail++;
        }
    }
    Dequeue() {
        const item = this.Elements[this.Head];
        delete this.Elements[this.Head];
        this.Head++;
        return item;
    }
    DequeueChunk(size) {
        const elements = [];
        for (let i = 0; i < size; i++) {
            if (this.IsEmpty) {
                return elements;
            }
            elements.push(this.Dequeue());
        }
        return elements;
    }
    Peek() {
        return this.Elements[this.Head];
    }
    get Length() {
        return this.Tail - this.Head;
    }
    get IsEmpty() {
        return this.Length === 0;
    }
}
