/**
 * Compares original and change versions of objects with the same data key.
 * Currently only checks on qty. Can be extended to check other attributes.
 */
const detectChange = (standingBase, standingChanges) => {
  let changeDetected = false
  for (let dataKey of Object.keys(standingChanges)) {
    let changeItem = standingChanges[dataKey]
    if (changeItem.dayOfWeek === 'placeholder') continue

    let baseItem = standingBase[dataKey]
    if ((!baseItem) || (baseItem.qty !== changeItem.qty)) {
      changeDetected = true
      break
    }
  }

  return changeDetected
}

export default detectChange