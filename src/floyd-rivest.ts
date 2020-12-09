function select_rec<T>(array: T[], k: number, compare: (a: T, b: T) => 1 | 0 | -1, left: number, right: number) {
  const stack: [number, number][] = [];
  let top = 0;
  let ret = false;
  for (;;) {
    while (right > left) {

      // Use select recursively to sample a smaller set of size s.
      // The arbitrary constants 600 and 0.5 are used in the original
      // version to minimize execution time
      if (!ret && right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      
        // Simulate a recursive call
        stack[top++] = [left, right];
        [left, right] = [newLeft, newRight];
        continue;
      }

      ret = false;

      // partition the elements between left and right around t
      const t = array[k];
      let i = left;
      let j = right;

      // swap array[left] and array[k]
      [array[left], array[k]] = [t, array[left]];
      if (compare(array[right], t) > 0) {
        // swap array[right] and array[left]
        [array[left], array[right]] = [array[right], array[left]];
      } 

      while (i < j) {
        // swap array[i] and array[j]
        [array[i], array[j]] = [array[j], array[i]];
        do i++;
        while (compare(array[i], t) < 0);
        do j--;
        while (compare(array[j], t) > 0);
      }

      if (compare(array[left], t) === 0) {
        // swap array[left] and array[j]
        [array[left], array[j]] = [array[j], array[left]]; 
      } else {
        j++; // swap array[right] and array[j]
        [array[right], array[j]] = [array[j], array[right]];
      }

      // adjust left and right towards the boundaries of the subset
      // containing the (k - left + 1)th smallest element
      if (j <= k) left = j + 1;
      if (k <= j) right = j - 1;
    }

    if (stack.length === 0) return array[k];
    [left, right] = stack[--top];
    ret = true;
  }
}

function defaultCompare<T>(a: T, b: T) {
  return a < b ? -1 : a > b ? 1 : 0;
}

export function select<T>(array: T[], k: number, compare: (a: T, b: T) => 1 | 0 | -1 = defaultCompare) {
  return select_rec(array,k, compare, 0, array.length - 1);
}