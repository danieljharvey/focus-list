# focus-list

```typescript
import { fromArray, fromNonEmpty, FocusList } from "./focusList";

interface Person {
  name: string;
  age: number;
}

const focusList: FocusList<Person> = fromNonEmpty(
  {
    name: "Bruce",
    age: 100
  },
  [{ name: "Horse", age: 20 }]
);

console.log(focusList.toArray());
// [{name: "Bruce", age: 100}, {name: "Horse", age: 20}]

const maybeFocusList = fromArray([]);
console.log(maybeFocusList);
// == none

const filteredFocusList = focusList.filter(person => person.age > 30);
console.log(filteredFocusList);
// [{name: "Horse", age: 20}]

const mappedFocusList = focusList.map(person => ({ ...person, age: 69 }));
console.log(mappedFocusList.toArray());
// [{name: "Bruce", age: 69}, {name: "Horse", age: 69}]

const notFound = focusList.find(person => person.age === 101);
console.log(notFound);
// none

const found = focusList.find(person => person.age === 100);
console.log(found);
/* some({
  "name": "Bruce",
  "age": 100
}) */

const foundIndex = focusList.findIndex(person => person.name === "Horse");
console.log(foundIndex);
// 1

const notFoundIndex = focusList.findIndex(person => person.name === "William");
console.log(notFoundIndex);
// -1

const sameThing = focusList.id();
console.log(sameThing.toArray());
// [{name: "Bruce", age: 100}, {name: "Horse", age: 20}]

const isFirst = focusList.isFirst();
console.log(isFirst);
// true

const isLast = focusList.isLast();
console.log(isLast);
// false

const length = focusList.length();
console.log(length);
// 2

const index = focusList.index();
console.log(index);
// 0

const newIndex = focusList.next().index();
console.log(newIndex);
// 1

const newerIndex = focusList
  .next()
  .prev()
  .index();
console.log(newerIndex);
// 0
```
