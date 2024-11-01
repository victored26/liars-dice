function _factorial(n) {
    // Calculates n!
    return n == 0 ? 1 : n*_factorial(n-1);
}

function _nChoosek(n,k) {
    // Calculates n choose k
    return _factorial(n) / (_factorial(k) * _factorial(n-k));
}

function _binMassProb(total, n, p) {
    // The probability of exactly n successes out of total events, P(X = n) 
    // where X ~ Bin(total,p)
    return _nChoosek(total, n)*(p**n)*(1-p)**(total-n);
}

function _binCumProb(total, n, p) {
    // The probability of at least n successes out of total events, P(X >= n) 
    // where X ~ Bin(total,p)
    let sum = 0;
    for (let successes = n; successes < total + 1; successes++) {
        sum += _binMassProb(total, successes, p);
    }
    return sum;
}

function binCondCumProb(total, n, k, p) {
    // the probability of at least n P(X >= n) successes assuming k successes,
    // P(X >= n | X >= k) = P(X => n) / P(X >= k), where X ~ Bin(total,p)
    return _binCumProb(total, n, p) / _binCumProb(total, k, p);
}
