import dynamicSort from "../../../../../Functions/dynamicSort"

/**
 * Data transform on standingChanges. Filter and change to array of objects structured for different DataTable displays.
 */
const makeStandingView = (standingChanges, isWhole, isStand, viewMode, dayOfWeek, selectedProduct) => {
  if (!standingChanges) return []
  if (viewMode === 'DAY' && !dayOfWeek) return []
  if (viewMode === 'PRODUCT' && !selectedProduct) return []

  // Filter down to 'grid type'
  let viewItems = Object.entries(standingChanges).map(([k, v]) => {return { ...v, dataKey: k}}) // convert back to array of objects
    .filter(item => item.isStand === isStand && item.isWhole === isWhole)

  // define products/days for this grid type
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const products = viewItems
    .reduce((acc, curr) => {
      if (acc.findIndex(item => item.prodNick === curr.product.prodNick) === -1) {
        acc.push(curr.product)
      }
      return acc
      
    }, [])
    .sort(dynamicSort('prodName'))

  // make transformation for given viewMode
  let standingView = []

  // console.log(products)
  // console.log(viewItems)

  if (viewMode === 'DAY') {
    viewItems = viewItems.filter(item => item.dayOfWeek === dayOfWeek)
    
    for (let p of products) {
      let matchItem = viewItems.find(item => item.product.prodNick === p.prodNick)

      standingView.push({
        label: p.prodName,
        prodNick: p.prodNick,
        prodName: p.prodName,
        dayOfWeek: dayOfWeek,
        dataKey: matchItem ? matchItem.dataKey : null
      })
    }

  }

  if (viewMode === 'PRODUCT') {
    viewItems = viewItems.filter(item => item.product.prodNick === selectedProduct.prodNick)

    for (let day of weekdays) {
      let matchItem = viewItems.find(item => item.dayOfWeek === day)

      standingView.push({
        label: day,
        prodNick: selectedProduct.prodNick,
        prodName: selectedProduct.prodName,
        dayOfWeek: day,
        dataKey: matchItem ? matchItem.dataKey : null
      })
    }

  }

  return standingView

}

export default makeStandingView