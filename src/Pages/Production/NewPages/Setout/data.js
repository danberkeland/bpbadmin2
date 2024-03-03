import { groupBy, keyBy, sortBy, sumBy } from "lodash"
import { useT0T7ProdOrders } from "../../../../data/useT0T7ProdOrders"
import { useMemo } from "react"
import { useListData } from "../../../../data/_listData"
import { isoToDT } from "../BPBN/utils"
import { HOLIDAYS } from "../_constants/holidays"
import { scheduleForwardOnHolidays } from "../_utils/holidayScheduling"

/**For croissant orders, maps back to the shaped type consumed at setout*/
const prodNickToSetoutKey = {
  pl: 'pl', frpl: 'pl', al: 'pl', fral: 'pl',
  ch: 'ch', frch: 'ch',
  pg: 'pg', frpg: 'pg',
  sf: 'sf', frsf: 'sf',
  mb: 'mb', frmb: 'mb', unmb: 'mb',
  mini: 'mini', frmini: 'mini',
}

const qtyToPanMap = { ch: 12, mb: 6, mini: 15, pg: 12, pl: 12, sf: 12 }

// Filter functions
const isPastry = (product) =>
  ['frozen pastries', 'baked pastries'].includes(product.packGroup)

const isBakedCroix = (product) =>
  product.doughNick === 'Croissant' && product.packGroup === 'baked pastries'
  
const isAlmondType = (product) => ['al', 'fral'].includes(product.prodNick)

/**We limit to only the baked versions, so no scone rounds */
const isNonCroixPastry = (product) =>
  product.doughNick !== 'Croissant' && product.packGroup === 'baked pastries'

/**Baked only at the Carlton */
const isExclusiveNorthProduct = (product) => product.bakedWhere.length === 1
  && product.bakedWhere[0] === "Carlton"

/**Baked only at Prado */
const isExclusiveSouthProduct = (product) => product.bakedWhere.length === 1
  && product.bakedWhere[0] === "Prado"

/**
 * retail brownies serve as a placeholder for cafe items shouldn't be 
 * counted for setout. Differentiate between square retail orders & a potential
 * special order for brownies by detecting the "__" which separates the
 * (Square) purchaser's name from the id token string.
 */
const isRetailBrownie = (order) => 1
  && order.isWhole === false
  && order.locNick.includes("__")
  && order.prodNick === 'brn'

/**Can be baked at both locations */
const isNonExclusiveProduct = (product) => product.bakedWhere.length > 1



// Main Hook ****************************************************************

export const useSetoutData = ({ 
  reportDate,  
  shouldFetch=true 
}) => {

  const { data:_prodOrders } = useT0T7ProdOrders({ shouldFetch, reportDate })
  const { data:PRD } = useListData({ tableName: "Product", shouldFetch })

  const composeData = () => {
    if (!_prodOrders || !PRD ) return undefined
    
    const products = keyBy(PRD, 'prodNick')

    const reportDateDT = isoToDT(reportDate)
    const adjustedRelDates = 
      [0].concat(scheduleForwardOnHolidays(
        [1,2,3,4,5].map(daysAhead => reportDateDT.plus({ days: daysAhead }))
      ).map(dt => 
        dt.diff(reportDateDT, 'days').days
      ))

    const prodOrders = _prodOrders
      .filter(order => 
        isPastry(products[order.prodNick])
          // && [0,1,2,3].includes(order.relDate)
          && order.locNick !== "bpbextras"
      ).map(order => ({
        ...order,
        setoutKey: prodNickToSetoutKey[order.prodNick],
        // qty: HOLIDAYS.includes(order.delivDate.slice(5)) ? 0 : order.qty
      }))
    //console.log("prodOrders", prodOrders)

    // Non-almond Croissant Setout ******************************************

    const T1BakedNotAlmond = prodOrders.filter(order => 
      order.relDate === adjustedRelDates[1]
      && isBakedCroix(products[order.prodNick])   
      && !isAlmondType(products[order.prodNick])  
    )

    const T1NonAlmondCroixSouth = T1BakedNotAlmond.filter(order => 
      order.routeMeta.route.RouteDepart === "Prado"
      || order.locNick === 'backporch'
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))

    const T1NonAlmondCroixNorth = T1BakedNotAlmond.filter(order => 
      order.routeMeta.route.RouteDepart === "Carlton"
      || order.locNick === 'backporch' // not necessary
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))

    // Almond-Type orders farther into the future will add to plain setout.
    const T2Fral = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[2] && order.prodNick === 'fral'  
    )
    const T2SouthAl = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[2]
      && order.prodNick === 'al'  
      && (
        order.routeMeta.route.RouteDepart === 'Prado'
        || order.locNick === 'backporch'
      )
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))

    
    const T3NorthAl = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[3]
      && order.prodNick === 'al'  
      && (
        order.routeMeta.route.RouteDepart === 'Carlton'
        || order.locNick === 'backporch' // not necessary
      )
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))

    const nonAlmondCroixNorth = Object.values(
      groupBy(T1NonAlmondCroixNorth, 'setoutKey')
    ).map(row => {
      const total = sumBy(row, 'qty')

      return {
        setoutKey: row[0].setoutKey,
        total,
        pans: Math.floor(total / qtyToPanMap[row[0].setoutKey]),
        remainder: total % qtyToPanMap[row[0].setoutKey],
        orders: row,
      }
    })

    // setout key groups almond types with plain, unmb with mb
    const nonAlmondCroixSouth = Object.values(
      groupBy(
        [...T1NonAlmondCroixSouth, ...T2Fral, ...T2SouthAl, ...T3NorthAl],
          // .map(order => HOLIDAYS.includes(reportDateDT.plus({days: 1}).toFormat('MM-dd'))
          //   ? { ...order, qty: 0 }
          //   : order
          // ),
        'setoutKey'
      )
    ).map(row => {
      const total = sumBy(row, 'qty')

      return {
        setoutKey: row[0].setoutKey,
        total,
        pans: Math.floor(total / qtyToPanMap[row[0].setoutKey]),
        remainder: total % qtyToPanMap[row[0].setoutKey],
        orders: row,
      }
    })
    // console.log("nonAlmondCroixSouth", nonAlmondCroixSouth)

    // Almond Types *********************************************************
    // BPBS only
    // For almond prep task, not setout
    // orders for this task are scheduled forward for holidays
    
    const T1SouthAl = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[1] && order.prodNick === 'al'  
      && (
        order.routeMeta.route.RouteDepart === 'Prado'
        || order.locNick === 'backporch'
      )
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))
      
    const T1Fral = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[1] && order.prodNick === 'fral'  
    )

    const T2NorthAl = prodOrders.filter(order =>
      order.relDate === adjustedRelDates[2] && order.prodNick === 'al'  
      && (
        order.routeMeta.route.RouteDepart === 'Carlton'
        || order.locNick === 'backporch'
      )
    ).map(order => ({
      ...order,
      qty: order.locNick === 'backporch' 
        ? Math.ceil(order.qty / 2) 
        : order.qty
    }))

    const freezerAlmondOrders = [...T1Fral, ...T2NorthAl]

    const fridgeAlmond = {
      rowKey: 'refrigerator',
      total: sumBy(T1SouthAl, 'qty'),
      orders: T1SouthAl,
    }

    const freezerAlmond = {
      rowKey: 'freezer',
      total: sumBy(freezerAlmondOrders, 'qty'),
      orders: freezerAlmondOrders
    }

    // Other Pastries *******************************************************

    // I guess these counts DO include bpbextras orders, 
    // so filter from _prodOrders instead of prodOrders.
    const T1OtherPastryOrders = _prodOrders.filter(order =>
      order.relDate === adjustedRelDates[1]
      && products[order.prodNick].packGroup === "baked pastries"
      && products[order.prodNick].doughNick !== "Croissant"
    )
    // .map(order => ({
    //   ...order,
    //   qty: HOLIDAYS.includes(order.delivDate.slice(5)) ? 0 : order.qty
    // }))

    const T1OthersSouth = T1OtherPastryOrders.filter(order => 0
      || (1
        && isExclusiveSouthProduct(products[order.prodNick])
        && !isRetailBrownie(order)
        )
      || (1
        && isNonExclusiveProduct(products[order.prodNick])
        && (0
          || order.routeMeta.route.RouteDepart === "Prado"
          || order.routeMeta.routeNick === "Pick up SLO"
        )

      )
    )
    const otherPastriesSouth = Object.values(
      groupBy(T1OthersSouth, 'prodNick')
    ).map(row => ({
      rowKey: row[0].prodNick,
      total: sumBy(row, 'qty'),
      orders: row
    }))


    const T1OthersNorth = T1OtherPastryOrders.filter(order => 
      isExclusiveNorthProduct(products[order.prodNick])
      || (
        isNonExclusiveProduct(products[order.prodNick])
        && (
          order.routeMeta.route.RouteDepart === "Carlton"
          || order.routeMeta.routeNick === "Pick up SLO"
        )
      )
    )
    const otherPastriesNorth = Object.values(
      groupBy(T1OthersNorth, 'prodNick')
    ).map(row => ({
      rowKey: row[0].prodNick,
      total: sumBy(row, 'qty'),
      orders: row
    }))

    return {
      north: {
        nonAlmondCroix: sortBy(nonAlmondCroixNorth, 'setoutKey'),
        otherPastries: sortBy(otherPastriesNorth, 'rowKey'),
      },
      south: {
        nonAlmondCroix: sortBy(nonAlmondCroixSouth, 'setoutKey'),
        almondCroix: [fridgeAlmond, freezerAlmond],
        otherPastries: sortBy(otherPastriesSouth, 'rowKey'),
      },
    }

  } // end composeData
  
  return { data:useMemo(composeData, [_prodOrders, reportDate, PRD]) }

}