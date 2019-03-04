# floyd-rivest
A typescript implementation of the Floyd-Rivest selection algorithm.

This module exports a single function, `select<T>(array: T[], k: number, compare?: (a: T, b: T) => 1 | 0 | -1) => T` implementing the [Floyd-Rivest selection algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm). `select` returns the k-smallest element of the input array, and mutates the array to ensure that all items at indices < k are less than or equal to array[k] and all items at indices > k are greater than or equal to array[k]. Elements are not sorted within each partition.

Usage
=====

```
const { select } = require('floyd-rivest');
const array = [1,6,2,3,9,4,7,2,7,0,5];
const e = select(array, 3); // e = 2, the third-smallest element of the array
const ksmallest = array.slice(0,3); // ksmallest contains [0, 1, 2], not necessarily in that order
```
