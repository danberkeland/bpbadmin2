import { getTimeToLive } from "../../utils/dateAndTime/getTimeToLive"
import { LegacyOrder, LegacyProduct } from "../legacyData"
import { CreateOrderInput } from "../order/types.d"

const SQ_URL = "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
const LOC_ID_BPBN = "16VS30T9E7CM9"


/**
 * Query orders placed within the last day
 * @returns {Promise<SqOrderResponseItem[]>}
 */
export const fetchSquareOrders = () => fetch(SQ_URL).then(response => {
  console.log("fetch sq:", response.status + (response.ok ? " ok" : ''))
  return response.json()

}).then(json => {
  if (json?.errorMessage) {
    console.warn(
      "The ol' response 200 error:", 
      json
    )
    return []
  } else {
    /**@type {SqOrderResponseItem[]} */
    const responseItem = JSON.parse(json)
    return responseItem
  } // Yo dawg, I heard you like JSON

}).catch(error => {
  console.error("Unhandled Error:", error)
  return []
})

/** 
 * @typedef {Object} SqOrderResponseItem
 * @property {string} custName
 * @property {string} delivDate
 * @property {string} id - transaction id; may apply to more than 1 product (line item)
 * @property {string} location - The Square location id indicating BPBN or BPBS
 * @property {string} item - points to the product
 * @property {number} qty
 * 
 */


/**
 * Data plumbing
 * @param {SqOrderResponseItem} sqOrder 
 * @param {LegacyProduct[]} products 
 * @returns {CreateOrderInput}
 */
export const sqOrderToCreateOrderInput = (sqOrder, products) => {
  const product = products.find(P => sqOrder.item.includes(P.squareID))
  const delivDate = sqOrder.delivDate.split("T")[0]
  const timestamp = new Date().toISOString()

  return {
    Type:          'Orders',
    prodNick:      product?.nickName ?? "brn",
    qty:           Number(sqOrder.qty),
    qtyShort:      null,
    qtyUpdatedOn:  timestamp,
    sameDayMaxQty: Number(sqOrder.qty),
    rate:          null,

    isWhole:   false,
    locNick:   sqOrder.custName + "__" + sqOrder.id,
    delivDate: delivDate,
    ItemNote:  "paid",
    route:     sqOrder.location === LOC_ID_BPBN ? "atownpick" : "slopick",
    delivFee:  null,

    ttl:       delivDate ? getTimeToLive(delivDate) : null,
    createdOn: timestamp,
    updatedOn: timestamp,
    updatedBy: "bpb_admin",

    SO:     null,
    isLate: null
  }

}

/**
 * Data plumbing
 * @param {SqOrderResponseItem} sqOrder 
 * @param {LegacyProduct[]} products 
 * @returns {LegacyOrder}
 */
export const sqOrderToLegacyOrder = (sqOrder, products) => {
  const product = products.find(P => sqOrder.item.includes(P.squareID))
  const delivDate = sqOrder.delivDate.split("T")[0]
  const timestamp = new Date().toISOString()

  return {
    Type:          'Orders',
    id:            null,
    prodName:      product?.prodName ?? "Brownie",
    qty:           Number(sqOrder.qty),
    qtyShort:      null,
    qtyUpdatedOn:  timestamp,
    sameDayMaxQty: Number(sqOrder.qty),
    rate:          null,

    isWhole:       false,
    custName:      sqOrder.custName + "__" + sqOrder.id,
    delivDate:     delivDate,
    PONote:        "paid",
    route:         sqOrder.location === LOC_ID_BPBN ? "atownpick" : "slopick",
    delivFee:      null,

    timestamp: timestamp,
    createdOn: timestamp,

    SO:     null,
    isLate: null
  }

}