import { HashMap } from "./hashMap";

describe("HashMap hash()", () => {
  test("should return the same hash for the same key", () => {
    const map = new HashMap();
    const hash1 = map.hash("apple");
    const hash2 = map.hash("apple");
    expect(hash1).toBe(hash2);
  });

  test("should return a value within the capacity range", () => {
    const capacity = 16;
    const map = new HashMap(0.75, capacity);
    const hash = map.hash("verylongstringthatmightoverflow");

    expect(hash).toBeGreaterThanOrEqual(0);
    expect(hash).toBeLessThan(capacity);
  });
});

describe("HashMap set()", () => {
  test("should store a key value pair", () => {
    const map = new HashMap();
    map.set("apple", "red");
    expect(map.get("apple")).toBe("red");
  });

  test("should overwrite value if key already exists", () => {
    const map = new HashMap();
    map.set("color", "blue");
    map.set("color", "red"); // same key different value

    expect(map.get("color")).toBe("red");
  });

  test("should handle collisions via separate chaining", () => {
    // force a collision by using a tiny capacity
    const map = new HashMap(0.75, 2);

    map.set("key1", "first");
    map.set("key2", "second"); // likely to collide in a map of size 2

    expect(map.get("key1")).toBe("first");
    expect(map.get("key2")).toBe("second");
  });
});

describe("HashMap get()", () => {
  test("should return the correct value for an existing key", () => {
    const map = new HashMap();
    map.set("ice cream", "vanilla");

    expect(map.get("ice cream")).toBe("vanilla");
  });

  test("should return null if the key does not exist", () => {
    const map = new HashMap();
    map.set("ice cream", "vanilla");

    expect(map.get("chocolate")).toBeNull();
  });

  test("should find the correct value even during a collision", () => {
    // force a collision by using a tiny capacity
    const map = new HashMap(0.75, 2);

    // in a map of size 2, many keys will end up in the same bucket
    map.set("keyA", "alpha");
    map.set("keyB", "beta");

    expect(map.get("keyA")).toBe("alpha");
    expect(map.get("keyB")).toBe("beta");
  });
});

describe("HashMap has()", () => {
  test("should return true if a key exists in the map", () => {
    const map = new HashMap();
    map.set("pet", "cat");
    expect(map.has("pet")).toBe(true);
  });

  test("should return false if a key does not exist", () => {
    const map = new HashMap();
    map.set("pet", "cat");
    expect(map.has("dog")).toBe(false);
  });

  test("should return true for a key that is part of a collision", () => {
    const map = new HashMap(0.75, 1);
    map.set("key1", "value1");
    map.set("key2", "value2");

    expect(map.has("key2")).toBe(true);
  });

  test("should return false for null or undefined keys", () => {
    const map = new HashMap();
    expect(map.has(null)).toBe(false);
    expect(map.has(undefined)).toBe(false);
  });
});

describe("HashMap remove()", () => {
  test("should delete a key and return true", () => {
    const map = new HashMap();
    map.set("ghost", "boo");

    expect(map.remove("ghost")).toBe(true);
    expect(map.get("ghost")).toBeNull();
  });

  test("should handle removing the head of a collision list", () => {
    const map = new HashMap(0.75, 1);
    map.set("first", 1);
    map.set("second", 2);

    map.remove("first");
    expect(map.get("first")).toBeNull();
    expect(map.get("second")).toBe(2);
  });
});

describe("Hashmap length()", () => {
  test("should return the number of stored keys in the hash map", () => {
    const map = new HashMap();
    map.set("key1", "value1");
    map.set("key2", "value2");

    expect(map.length()).toBe(2);
  });
});

describe("Hashmap clear()", () => {
  test("should remove all entires in the hash map", () => {
    const map = new HashMap();
    map.set("key1", "value1");
    map.set("key2", "value2");

    map.clear();

    expect(map.length()).toBe(0);
    expect(map.get("key1")).toBeNull();
    expect(map.has("key2")).toBe(false);
  });
});

describe("Hashmap keys()", () => {
  test("should return an array containing all the keys inside the hash map", () => {
    const map = new HashMap();
    map.set("key1", "value1");
    map.set("key2", "value2");

    const result = map.keys();

    expect(result).toContain("key1");
    expect(result).toContain("key2");
  });
});

describe("Hashmap values()", () => {
  test("should return an array containing all the values inside the hash map", () => {
    const map = new HashMap();
    map.set("key1", "value1");
    map.set("key2", "value2");

    const result = map.values();

    expect(result).toContain("value1");
    expect(result).toContain("value2");
  });
});

describe("Hashmap entries()", () => {
  test("should return an array containing all entries", () => {
    const map = new HashMap();
    map.set("key1", "value1");
    map.set("key2", "value2");

    const result = map.entries();

    expect(result).toEqual(
      expect.arrayContaining([
        ["key1", "value1"],
        ["key2", "value2"],
      ]),
    );
  });
});

describe("HashMap Full Functionality & Growth", () => {
  let hashMap;

  beforeEach(() => {
    hashMap = new HashMap(0.75, 16);
    const data = [
      ["apple", "red"], ["banana", "yellow"], ["carrot", "orange"],
      ["dog", "brown"], ["elephant", "gray"], ["frog", "green"],
      ["grape", "purple"], ["hat", "black"], ["ice cream", "white"],
      ["jacket", "blue"], ["kite", "pink"], ["lion", "golden"]
    ];
    data.forEach(([key, value]) => hashMap.set(key, value));
  });

  describe("Growth Logic", () => {
    test("overwriting nodes should not increase length or capacity", () => {
      hashMap.set('apple', 'dark red');
      hashMap.set('banana', 'bright yellow');

      expect(hashMap.length()).toBe(12);
      expect(hashMap.capacity).toBe(16);
      expect(hashMap.get('apple')).toBe('dark red');
    });

    test("adding item beyond load factor doubles capacity and preserves data", () => {
      // 13th item triggers resize (13/16 = 0.8125 > 0.75)
      hashMap.set('moon', 'silver');

      expect(hashMap.length()).toBe(13);
      expect(hashMap.capacity).toBe(32); 
      
      // verify data is still reachable after rehashing
      expect(hashMap.get('apple')).toBe('red'); 
      expect(hashMap.get('lion')).toBe('golden');
      expect(hashMap.get('moon')).toBe('silver');
    });
  });

  describe("Auxiliary Methods after Expansion", () => {
    beforeEach(() => {
      hashMap.set('moon', 'silver'); 
    });

    test("has(key) returns correct boolean", () => {
      expect(hashMap.has('apple')).toBe(true);
      expect(hashMap.has('zebra')).toBe(false);
    });

    test("remove(key) deletes entry and updates length", () => {
      const initialLength = hashMap.length();
      const removed = hashMap.remove('apple');
      
      expect(removed).toBe(true);
      expect(hashMap.has('apple')).toBe(false);
      expect(hashMap.length()).toBe(initialLength - 1);
    });

    test("keys(), values(), and entries() return complete data", () => {
      const keys = hashMap.keys();
      const values = hashMap.values();
      const entries = hashMap.entries();

      expect(keys).toContain('moon');
      expect(values).toContain('silver');
      expect(entries).toEqual(expect.arrayContaining([['moon', 'silver']]));
      expect(keys.length).toBe(13);
    });

    test("clear() empties the map", () => {
      hashMap.clear();
      expect(hashMap.length()).toBe(0);
      expect(hashMap.keys()).toEqual([]);
      expect(hashMap.get('lion')).toBe(null);
    });
  });
});