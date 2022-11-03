function defaultCompare<T>(a: T, b: T) { return (+a) - (+b); }

// http://people.csail.mit.edu/rivest/pubs/FR75b.pdf
// procedure SELECT(X,L,R,K)
export function select<T>(array: T[], k: number, compare: (a: T, b: T) => number = defaultCompare) {
  k--; // SELECT finds the k+1-th smallest element, so shift down from 1-indexing to 0-indexing. 
  let L = 0;
  let R = array.length - 1;
  let top = 0;
  const stack: number[] = [];
  /*
    Use SELECT recursively on a sample of size S to get
    an estimate for the (K-L+1)-th smallest element into
    X[K], biased slightly so that the (K-L+1)-th element
    is expected to lie in the smaller set after partitioning.
    The arbitrary constants 600 and 0.5 were chosen to
    minimize execution time on the original test machine.
  */
  while (R - L > 600) {
    const N = R - L + 1;
    const I = k - L + 1;
    const Z = Math.log(N);
    const S = 0.5 * Math.exp(2 * Z / 3);
    const SD = 0.5 * Math.sqrt(Z * S * (N - S) / N) * Math.sign(I - N / 2);
    // simulate recursive call
    stack[top++] = L;
    stack[top++] = R;
    L = Math.max(L, (k - I * S / N + SD)|0);
    R = Math.min(R, (k + (N - I) * S / N + SD)|0);
  }
  for (;;) {
    while (R > L) {
      const T = array[k];
      // The following code partitions X[L:R] around T.
      let I = L;
      let J = R;

      // exchange(X[L],X[K])
      array[k] = array[L];
      array[L] = T;
      if (compare(array[R], T) > 0) {
        // if X[R] > T then exchange(X[R],X[L])
        [array[L], array[R]] = [array[R], array[L]];
      } 

      while (I < J) {
        // exchange(X[I],X[J])
        [array[I], array[J]] = [array[J], array[I]];
        do { I++; } while (compare(array[I], T) < 0);
        do { J--; } while (compare(array[J], T) > 0);
      }

      if (compare(array[L], T) === 0) {
        // if X[L] = T then exchange(X[L],X[J])
        [array[L], array[J]] = [array[J], array[L]]; 
      } else {
        J++; // else J := J+1; exchange(X[J],X[R])
        [array[R], array[J]] = [array[J], array[R]];
      }

      /*
        Now adjust L, R so they surround the subset
        containing the (K-L+1)-th smallest element.
      */
      if (J <= k) { L = J + 1; }
      if (k <= J) { R = J - 1; }
    }

    if (top === 0) { return array[k]; }
    // simulate recursive return
    R = stack[--top];
    L = stack[--top];
  }
}