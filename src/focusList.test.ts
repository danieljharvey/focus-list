import { some, none } from "fp-ts/lib/Option";

import { fromArray, fromNonEmpty, FocusList } from "./focusList";

describe("Creating FocusLists", () => {
  it("Will not create an empty FocusList", () => {
    expect(fromArray([])).toEqual(none);
  });
  it("Creates a single item focusList", () => {
    expect(fromArray([1])).toEqual(some(new FocusList([], 1, [])));
  });
  it("Creates a multiple item list", () => {
    expect(fromArray([1, 2])).toEqual(some(new FocusList([], 1, [2])));
  });
  it("From single item", () => {
    expect(fromNonEmpty(100)).toEqual(new FocusList([], 100, []));
  });
  it("From multiple items", () => {
    expect(fromNonEmpty(100, [101, 102])).toEqual(
      new FocusList([], 100, [101, 102])
    );
  });
});

describe("Filters FocusList", () => {
  it("Removes everything", () => {
    const focus = new FocusList([], 1, []);
    expect(focus.filter(a => a > 20)).toHaveLength(0);
  });

  it("Keeps everything", () => {
    const focus = new FocusList([], 1, []);
    expect(focus.filter(a => a < 20)).toHaveLength(1);
  });
});

describe("Maps over FocusList", () => {
  it("Gets everything", () => {
    const focus = new FocusList([1, 2], 3, [4, 5]);
    expect(focus.map(a => a * 10)).toEqual(
      new FocusList([10, 20], 30, [40, 50])
    );
  });
});

describe("isFirst", () => {
  it("Knows it's first", () => {
    const focus = new FocusList([], 3, [4, 5]);
    expect(focus.isFirst()).toBeTruthy();
  });

  it("Knows it's not first", () => {
    const focus = new FocusList([1], 2, [3, 4]);
    expect(focus.isFirst()).toBeFalsy();
  });
});

describe("isLast", () => {
  it("Knows it's last", () => {
    const focus = new FocusList([], 3, []);
    expect(focus.isLast()).toBeTruthy();
  });

  it("Knows it's not last", () => {
    const focus = new FocusList([1], 2, [3, 4]);
    expect(focus.isLast()).toBeFalsy();
  });
});

describe("length", () => {
  it("Counts 1", () => {
    const focus = new FocusList([], 3, []);
    expect(focus.length()).toEqual(1);
  });
  it("Counts 3", () => {
    const focus = new FocusList([2], 3, [4]);
    expect(focus.length()).toEqual(3);
  });
});

describe("index", () => {
  it("Index is 0", () => {
    const focus = new FocusList([], 3, []);
    expect(focus.index()).toEqual(0);
  });
  it("Index is 2", () => {
    const focus = new FocusList([1, 2], 3, []);
    expect(focus.index()).toEqual(2);
  });
});

describe("next", () => {
  it("Returns the same when we're at the end", () => {
    const focus = new FocusList([1, 2], 3, []);
    expect(focus.next()).toEqual(focus);
  });

  it("Focuses on the next number when there is one", () => {
    const focus = new FocusList([], 3, [4]);
    expect(focus.next()).toEqual(new FocusList([3], 4, []));
  });

  it("Focuses on the next number with lots of numbers there is one", () => {
    const focus = new FocusList([1, 2, 3], 4, [5, 6, 7]);
    expect(focus.next()).toEqual(new FocusList([1, 2, 3, 4], 5, [6, 7]));
  });
});

describe("prev", () => {
  it("Returns the same when we're at the start", () => {
    const focus = new FocusList([], 3, []);
    expect(focus.prev()).toEqual(focus);
  });

  it("Focuses on the prev number when there is one", () => {
    const focus = new FocusList([2], 3, [4]);
    expect(focus.prev()).toEqual(new FocusList([], 2, [3, 4]));
  });

  it("Focuses on the prev number with lots of numbers there is one", () => {
    const focus = new FocusList([1, 2, 3], 4, [5, 6, 7]);
    expect(focus.prev()).toEqual(new FocusList([1, 2], 3, [4, 5, 6, 7]));
  });
});

describe("toArray", () => {
  it("Plops everything into an array", () => {
    const focus = new FocusList([1, 2], 3, []);
    expect(focus.toArray()).toEqual([1, 2, 3]);
  });
});

describe("get", () => {
  it("Returns the current value", () => {
    const focus = new FocusList([1, 2], 3, []);
    expect(focus.get()).toEqual(3);
  });
});

describe("mapCurrent", () => {
  it("Maps over only the current item", () => {
    const focus = new FocusList([1, 2], 3, []);
    expect(focus.mapCurrent(a => a + 10)).toEqual(
      new FocusList([1, 2], 13, [])
    );
  });
});

describe("fold", () => {
  it("Adds everything up", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.fold(10, (a, b) => a + b)).toEqual(70);
  });
  it("Reverses the list", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(
      focus.map(a => a + 1).fold<number[]>([], (a, b) => [b].concat(a))
    ).toEqual([31, 21, 11]);
  });
});

describe("focusToIndex", () => {
  it("Focuses on -1 returns same", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.focusToIndex(-1)).toEqual(new FocusList([10, 20], 30, []));
  });
  it("Focuses on 100 returns same", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.focusToIndex(100)).toEqual(new FocusList([10, 20], 30, []));
  });
  it("Focuses on 1 returns newly focused", () => {
    const focus = new FocusList([10, 20, 30], 40, [50, 60]);
    expect(focus.focusToIndex(1)).toEqual(
      new FocusList([10], 20, [30, 40, 50, 60])
    );
  });
});

describe("focusWithFind", () => {
  it("Failed find returns same", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.focusWithFind(a => a === 40)).toEqual(focus);
  });
  it("Focus to new item if find works", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.focusWithFind(a => a === 20)).toEqual(
      new FocusList([10], 20, [30])
    );
  });
});

describe("find", () => {
  it("Finds something, returns some<item>", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.find(a => a > 11)).toEqual(some(20));
  });
  it("Finds nothing", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.find(a => a > 1100)).toEqual(none);
  });
});

describe("findIndex", () => {
  it("Finds an index that is there", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.findIndex(a => a == 10)).toEqual(0);
  });
  it("Returns -1 for an index that is not there", () => {
    const focus = new FocusList([10, 20], 30, []);
    expect(focus.findIndex(a => a > 1000)).toEqual(-1);
  });
});
