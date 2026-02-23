import { LinkedList } from "./linked-list";

export class HashMap {
  constructor(loadFactor = 0.75, capacity = 16) {
    this.loadFactor = loadFactor;
    this.capacity = capacity;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
  }

  hash(key) {
    let hashCode = 0;
    const primeNumber = 31;

    for (let i = 0; i < key.length; i++) {
      hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % this.capacity;
    }

    return hashCode;
  }

  set(key, value) {
    const index = this.hash(key);

    if (this.buckets[index] === null) {
      this.buckets[index] = new LinkedList();
    }

    const bucket = this.buckets[index];
    let current = bucket.head;

    while (current) {
      if (current.value.key === key) {
        current.value.value = value;
        return;
      }
      current = current.next;
    }

    if ((this.size + 1) / this.capacity > this.loadFactor) {
      this.resize();
      return this.set(key, value);
    }

    bucket.append({ key, value });
    this.size++;
  }

  resize() {
    const oldEntries = this.entries();
    this.capacity *= 2;
    this.size = 0;
    this.buckets = new Array(this.capacity).fill(null);

    oldEntries.forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  get(key) {
    if (!key) return null;

    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket) return null;

    let current = bucket.head;
    while (current) {
      if (current.value.key === key) {
        return current.value.value;
      }
      current = current.next;
    }
    return null;
  }

  has(key) {
    if (typeof key !== "string") return false;
    if (!key) return false;

    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket) return false;

    let current = bucket.head;
    while (current) {
      if (current.value.key === key) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  remove(key) {
    if (!key) return false;

    const index = this.hash(key);
    const bucket = this.buckets[index];

    if (!bucket || !bucket.head) return false;

    let current = bucket.head;
    let previous = null;

    while (current) {
      if (current.value.key === key) {
        if (previous === null) {
          bucket.head = current.next;
        } else {
          previous.next = current.next;
        }
        this.size--;
        return true;
      }
      previous = current;
      current = current.next;
    }
    return false;
  }

  length() {
    return this.size;
  }

  clear() {
    for (let i = 0; i < this.buckets.length; i++) {
      this.buckets[i] = null;
    }
    this.size = 0;
  }

  keys() {
    let allKeys = [];

    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];

      if (bucket) {
        let current = bucket.head;

        while (current) {
          allKeys.push(current.value.key);
          current = current.next;
        }
      }
    }
    return allKeys;
  }

  values() {
    let allValues = [];

    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];

      if (bucket) {
        let current = bucket.head;

        while (current) {
          allValues.push(current.value.value);
          current = current.next;
        }
      }
    }
    return allValues;
  }

  entries() {
    let allEntries = [];

    for (let i = 0; i < this.buckets.length; i++) {
      const bucket = this.buckets[i];

      if (bucket) {
        let current = bucket.head;

        while (current) {
          allEntries.push([current.value.key, current.value.value]);
          current = current.next;
        }
      }
    }
    return allEntries;
  }
}
