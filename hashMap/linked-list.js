export class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  prepend(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.length++;
  }

  getSize() {
    return this.length;
  }

  getHead() {
    if (!this.head) return null;
    return this.head.value;
  }

  getTail() {
    if (!this.tail) return null;
    return this.tail.value;
  }

  at(index) {
    if (index < 0 || index >= this.length) return null;

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current.value;
  }

  shift() {
    if (!this.head) return null;

    const removedValue = this.head.value;
    this.head = this.head.next;
    this.length--;

    if (this.length === 0) {
      this.tail = null;
    }
    return removedValue;
  }

  contains(value) {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  findIndex(value) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) return index;

      current = current.next;
      index++;
    }
    return -1;
  }

  toString() {
    if (!this.head) return "";

    let current = this.head;
    let result = "";

    while (current) {
      result += `( ${current.value} ) -> `;

      current = current.next;
    }
    return result + "null";
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
