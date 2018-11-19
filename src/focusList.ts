import { Option, some, none, fromNullable } from "fp-ts/lib/Option";

export class FocusList<A> {
  readonly _tag: "_FocusList" = "_FocusList";
  constructor(
    readonly _before: A[],
    readonly _current: A,
    readonly _after: A[]
  ) {}

  filter(pred: (a: A) => boolean): A[] {
    const newBefore = this._before.filter(pred);
    const newCurrent = pred(this._current) ? [this._current] : [];
    const newAfter = this._after.filter(pred);
    return newBefore.concat(newCurrent).concat(newAfter);
  }

  map<B>(func: (a: A) => B): FocusList<B> {
    return new FocusList(
      this._before.map(func),
      func(this._current),
      this._after.map(func)
    );
  }

  find(pred: (a: A) => boolean): Option<A> {
    return fromNullable(this.filter(pred)[0]);
  }

  findIndex(pred: (a: A) => boolean): number {
    return this.toArray().reduce((prev, current, key) => {
      if (prev > -1) {
        return prev;
      }
      return pred(current) ? key : prev;
    }, -1);
  }

  id(): FocusList<A> {
    return new FocusList(this._before, this._current, this._after);
  }

  isFirst(): boolean {
    return this._before.length === 0;
  }

  isLast(): boolean {
    return this._after.length === 0;
  }

  length(): number {
    return this.toArray().length;
  }

  index(): number {
    return this._before.length;
  }

  next(): FocusList<A> {
    return this.focusToIndex(this.index() + 1);
  }

  prev(): FocusList<A> {
    return this.focusToIndex(this.index() - 1);
  }

  toArray(): A[] {
    return this.filter(_ => true);
  }

  get(): A {
    return this._current;
  }

  mapCurrent(func: (a: A) => A): FocusList<A> {
    return new FocusList(this._before, func(this._current), this._after);
  }

  fold<B>(def: B, func: (b: B, a: A) => B): B {
    return this.toArray().reduce(func, def);
  }

  focusToIndex(index: number): FocusList<A> {
    if (index < 0 || index >= this.length()) {
      return this.id();
    }
    const array = this.toArray();
    const newBefore = array.slice(0, index);
    const newCurrent = array.slice(index)[0];
    const newAfter = array.slice(index + 1);
    return new FocusList(newBefore, newCurrent, newAfter);
  }

  focusWithFind(pred: (a: A) => boolean): FocusList<A> {
    return this.focusToIndex(this.findIndex(pred));
  }
}

export const fromArray = <A>(items: A[]): Option<FocusList<A>> => {
  if (items.length === 0) {
    return none;
  } else {
    const [first, ...rest] = items;
    return some(new FocusList([], first, rest));
  }
};

export const fromNonEmpty = <A>(item: A, items: A[] = []): FocusList<A> =>
  new FocusList([], item, items);
