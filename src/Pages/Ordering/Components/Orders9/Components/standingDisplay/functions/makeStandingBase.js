/**
 * Converts AppSync array-of-objects to a nested object with prodNick/dayOfWeek/isWhole/isStand compound keys 
 */
const makeStandingBase = (standingData) => {

  const _standingData = standingData.map(item => {
    let dataKey = [item.product.prodNick, item.dayOfWeek, (item.isWhole ? '1' : '0'), (item.isStand ? '1' : '0')].join('_')
    return ([dataKey, item])
  })

  return Object.fromEntries(_standingData)
}

export default makeStandingBase