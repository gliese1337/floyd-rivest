
function defaultCompare<T>(a: T, b: T) { return (+a) - (+b); }

// http://people.csail.mit.edu/rivest/pubs/FR75b.pdf
// procedure SELECT(X,L,R,K)
function select_internal<T>(X: T[], L: number, R: number, K: number, compare: (a: T, b: T) => number) {
  while (R > L) {

    /*
      Use SELECT recursively on a sample of size S to get
      an estimate for the (K-L+1)-th smallest element into
      X[K], biased slightly so that the (K-L+1)-th element
      is expected to lie in the smaller set after partitioning.
      The arbitrary constants 600 and 0.5 were chosen to
      minimize execution time on the original test machine.
    */
    if (R - L > 600) {
      const N = R - L + 1;
      const I = K - L + 1;
      const Z = Math.log(N);
      const S = 0.5 * Math.exp(2 * Z / 3);
      const SD = 0.5 * Math.sqrt(Z * S * (N - S) / N) * Math.sign(I - N / 2);
      const LL = Math.max(L, (K - I * S / N + SD)|0);
      const RR = Math.min(R, (K + (N - I) * S / N + SD)|0);
      select_internal(X, LL, RR, K, compare);
    }

    const T = X[K];
    /*
      The following code partitions X[L:R] around T.
    */
    let I = L;
    let J = R;

    // exchange(X[L],X[K])
    X[K] = X[L];
    X[L] = T;
    if (compare(X[R], T) > 0) {
      // if X[R] > T then exchange(X[R],X[L])
      [X[L], X[R]] = [X[R], X[L]];
    } 

    while (I < J) {
      // exchange(X[I],X[J])
      [X[I], X[J]] = [X[J], X[I]];
      do { I++; } while (compare(X[I], T) < 0);
      do { J--; } while (compare(X[J], T) > 0);
    }

    if (compare(X[L], T) === 0) {
      // if X[L] = T then exchange(X[L],X[J])
      [X[L], X[J]] = [X[J], X[L]]; 
    } else {
      J++; // else J := J+1; exchange(X[J],X[R])
      [X[R], X[J]] = [X[J], X[R]];
    }

    /*
      Now adjust L, R so they surround the subset
      containing the (K-L+1)-th smallest element.
    */
    if (J <= K) { L = J + 1; }
    if (K <= J) { R = J - 1; }
  }

  return X[K];
}

export function select<T>(X: T[], K: number, compare: (a: T, b: T) => number = defaultCompare) {
  return select_internal(X, 0, X.length-1, K-1, compare);
}