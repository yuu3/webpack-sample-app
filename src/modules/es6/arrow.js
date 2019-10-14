
const data = [1,2,3,4,5,6]
let arw = data.map(v => v + 1) // ES6
/**
 * conventional
 * const arw = data.map(function(val) {
 *   return val + 1
 * })
 */

data.forEach(val => {
  arw.push(val)
})
/**
 * Convertional
 * data.forEach(function(val) {
 *   console.log(val)
 * })
 */
