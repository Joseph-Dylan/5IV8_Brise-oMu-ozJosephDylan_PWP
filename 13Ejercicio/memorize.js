/**
 * @param {Function} fn
 * @return {Function}
 */

function memoize(fn) {
    const cache = {}
    return function (a,b) {
        const key = `${a},${b}`
        if(cache[key]){
            return cache[key];
        }
        const resultado = fn(a,b);
        cache[key] = resultado;
        return resultado;
    }
}

const sumar = (a,b) => a + b;

const momerizedllamar = memoize(sumar);

console.log(momerizedllamar(2,1))

/** 
 * let callCount = 0;
 * const memoizedFn = memoize(function (a, b) {
 *	 callCount += 1;
 *   return a + b;
 * })
 * memoizedFn(2, 3) // 5
 * memoizedFn(2, 3) // 5
 * console.log(callCount) // 1 
 */