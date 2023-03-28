import React, { useState, useEffect } from "react"
import { Terminal } from "primereact/terminal"
import { TerminalService } from "primereact/terminalservice"
import { useProductDataWithLocationCustomization } from "../../../../../data/productData"
import { useLocationDetails, useLocationListSimple } from "../../../../../data/locationData"
import { dateToMmddyyyy, dateToYyyymmdd, getWorkingDate, getWorkingDateTime } from "../../../../../functions/dateAndTime"
import { DateTime } from "luxon"
import { handleAddCartProduct, handleAddCartProducts } from "../../_utils/handleAddProduct"

export const BpbTerminal = ({ 
  locNick, setLocNick, 
  delivDate, setDelivDate, 
  headerBase, headerChanges, setHeaderChanges, 
  itemBase, itemChanges, setItemChanges 
}) => {
  const { data:locationList, isValidating:locListIsValidating } = useLocationListSimple(true)
  const { data:locationDetails, isValidating:locIsValidating } = useLocationDetails(locNick, !!locNick)
  const { data:productData, isValidating:prodsAreValidating } = useProductDataWithLocationCustomization(locNick)

  const [commandQueue, setCommandQueue] = useState(null)
  const [isExecuting, setIsExecuting] = useState(false)
  const [terminalResp, setTerminalResp] = useState([])

  const prompt=`bpbadmin/ordering$`

//   const commandHandler = (text) => {
//     let response;
//     let command = text.trim()
//     let hasExecuted = false

//     if (!locationList) {
//       TerminalService.emit('response', "Location Data not loaded.")
//       hasExecuted = true
//     }
    
//     if (command.startsWith('view')) {
//       if (command === 'view') {
//         response = <>
//           <div>{`${locNick}:`}</div>
//           <div>{`${headerChanges.route} ${dateToMmddyyyy(delivDate)}`}</div>
//           <div style={{display: "flex", gap: ".5rem", paddingLeft: "2rem"}} >
//             <span style={{width: "fit-content"}}>
//               {itemChanges.map(item => <div key={`${item.product.prodNick}#pn`}>{item.product.prodNick}: </div>)}
//             </span>
//             <span style={{width: "fit-content"}}>
//               {itemChanges.map(item => <div key={`${item.product.prodNick}#qty`}>{item.qty}</div>)}
//             </span>
//           </div>
//         </>
//       }
//       else {
//         command = command.split(' ').filter(i => i !== '').map(i => i.trim())
//         let orderItem = itemChanges.find(item => item.product.prodNick === command[1])
//         response = !!orderItem ? orderItem.product.prodName : "not found."

//       }

//       TerminalService.emit('response', response)
//       hasExecuted = true
//     }

//     if (!hasExecuted) {
//       let delivDateJS = parseDateCommand(command)
//       if (delivDateJS) setDelivDate(delivDateJS)
//       hasExecuted = true
//     }

//     if (!hasExecuted) {
      
//     }
//     // if (isOrderCommand(command)) {
//     //   TerminalService.emit('response', "order command detected")
//     //   hasExecuted = true
//     // }

//     if (!hasExecuted) {
//       let locMatch = locationList.find(item => item.locNick === command)
//       if (locMatch) {
//         response = `Location set to ${locMatch.locNick}`
//         setLocNick(locMatch.locNick)
//         TerminalService.emit('response', response)
//         hasExecuted = true
//       }
//       else if (command === 'clear') TerminalService.emit('clear')
//       else TerminalService.emit('response', `Error: command "${command}" not recognized.`)
//     }

// };
  const readyForExecution = !!locationList && !locListIsValidating 
    && !!locationDetails && !locIsValidating
    && !!productData && !prodsAreValidating

  const commandFunctions = {
    setDelivDate: (value) => {
      let { date, diff } = value
      setDelivDate(value.date)
      console.log("set date")
      return ([`delivDate set to ${dateToMmddyyyy(date)} (T ${diff >= 0 ? "+" : ""}${diff})`])
    },
    setLocNick: (value) => {
      setLocNick(value)
      return [`location set to ${value}`]
    },
    set: (values) => setProductQtys(values, itemChanges, setItemChanges),
    inc: (values) => incProductQtys(values, itemChanges, setItemChanges),
    dec: (values) => decProductQtys(values, itemChanges, setItemChanges),
    help: () => [<pre>{helpText}</pre>],
    helpLocation: () => [<pre>{helpTextLocation}</pre>],
    helpDate: () => [<pre>{helpTextDate}</pre>],
    helpItems: () => [<pre>{helpTextItems}</pre>],
    display: () => {
      return [renderOrder(locNick, delivDate, headerChanges, itemChanges)]
    },
    clear: (value) => {
      return 'clear'
    }
  }


  const executeCommand = (command) => {
    let fn = commandFunctions[command.commandType]
    let value = command.value
    return fn(value)
  }




  const commandHandler = (text) => {
    if (!locationList || !locationDetails || !productData) {
      console.log("error: data not loaded yet")
      return
    }
    const args = text.trim().split(' ').filter(i => i !== '').map(i => i.trim().toLowerCase())
    console.log(args)

    let commands = []
    for (let i = 0; i < args.length; i++) {
      let parsedFlag = false

      if (!parsedFlag) {
        let helpType = parseHelp(args[i])
        if (helpType) {
          commands.push({ 
            commandType: helpType,
            value: null
          })
          parsedFlag = true
        } 
      }

      if (!parsedFlag) {
        if (args[i] === 'clear') {
          commands.push({ 
            commandType: 'clear',
            value: null
          })
          parsedFlag = true
        } 
      }

      if (!parsedFlag) {
        if (['view', 'ds'].includes(args[i])) {
          commands.push({ 
            commandType: 'display',
            value: [locNick, delivDate]
          })
          parsedFlag = true
        } 
      }
  
      if (!parsedFlag) {
        let matchLocation = locationList.find(loc => loc.locNick === args[i])
        if (matchLocation) {
          commands.push({ 
            commandType: 'setLocNick',
            value: matchLocation.locNick
          })
          parsedFlag = true
        } 
      }

      if (!parsedFlag) {
        let dateValue = parseDateCommand(args[i])
        if (dateValue) {
          commands.push({ 
            commandType: 'setDelivDate',
            value: dateValue
          })
          parsedFlag = true
        }
      }

      if (!parsedFlag) {
        let commandType = parseOrderCommand(args[i])
        if (commandType) {
          let commandObj = {
            commandType: commandType,
            value: null
          }
          
          let parseItems = true
          let errorFlag = false

          let items = []
          let currentItem = {
            product: undefined,
            qty: undefined,
          }

          
          while (parseItems && !errorFlag && i < (args.length - 1)) {
            i = i + 1
            let product = parseProduct(args[i], productData)
            let qty = parseQty(args[i])

            // console.log("item:", prodNick, qty)
            

            if (product) {
              if (currentItem.product) {errorFlag = true; console.log("flag")}
              else currentItem.product = product
            }
            if (qty !== undefined) {
              if (currentItem.qty !== undefined) {errorFlag = true; console.log("flag")}
              else currentItem.qty = qty
            }
            
            if (i === args.length - 1 && (!!currentItem.product + (currentItem.qty !== undefined) < 2)) {
              errorFlag = true; console.log("flag")
            }
            if (currentItem.product && currentItem.qty !== undefined) {
              items.push(currentItem)
              currentItem = { product: undefined, qty: undefined }
            }

            if (!product && qty === undefined) parseItems = false
          } // end while

          if (errorFlag) {
            console.log(`Error: ${commandType} command malformed.`)
            commands.push("error")
          } else {
            commandObj.value = items
            commands.push(commandObj)
            if (i < args.length - 1) i = i - 1
          }
          parsedFlag = true

        }
      } // end parsing orderItem commands

      if (!parsedFlag) {
        console.log(`Error: command ${args[i]} not recognized.`)
        commands.push("error")
      }

    }

    console.log(commands)

    if (!commands.includes('error')) {
      setCommandQueue(commands)
    }
    else TerminalService.emit('response', "Command error.")

  } // end commmandHandler

  useEffect(() => {
    TerminalService.on('command', commandHandler);

    return () => {
        TerminalService.off('command', commandHandler);
    };
  }, [locationList, locationDetails, productData, headerChanges, itemChanges, commandHandler]);
    
  useEffect(() => {
    // exit if no commands or data is still refreshing
    if (!commandQueue || !readyForExecution || isExecuting) return

    setIsExecuting(true)
    const responsePart = executeCommand(commandQueue[0])

    if (responsePart !== 'clear') {
      const newResponse = terminalResp.concat(responsePart)
      setTerminalResp(newResponse)
      const response = newResponse.map((resp, idx) => <div key={idx}>{resp}</div>)
      TerminalService.emit('response', response)
    } else {
      TerminalService.emit('clear')
      setTerminalResp([])
    }

    if (commandQueue.length === 1) {
      setCommandQueue(undefined)
      setTerminalResp([])
    } else setCommandQueue(commandQueue.slice(1))

    setIsExecuting(false)
  }, [commandQueue, readyForExecution, locationList, locationDetails, productData, executeCommand, terminalResp])

  return (
    <>
      {!!locationList &&
        <Terminal welcomeMessage={`Welcome. Type "help" for a list of commands.`}  prompt={prompt} />
      }
    </>
  )

}


const isDateCommand = (command) => {
  const shortRE = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
  return shortRE.test(command)
}
const coerceDate = (dateString) => {
  const shortRE = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
  const matches = dateString.match(shortRE)

  console.log(matches)
  const month = Number(matches[1])
  const day = Number(matches[2])

  const currentWorkingDate = getWorkingDateTime('NOW')
  
  let testDate = DateTime.fromObject({ day: day, month: month, year: currentWorkingDate.year }, { zone: 'America/Los_Angeles' })
  let diff = testDate.diff(currentWorkingDate, 'days').toObject().days
  if (diff < -30) {
    testDate = testDate.plus({ years: 1 })
    diff = testDate.diff(currentWorkingDate, 'days').toObject().days
  }
  console.log(diff)

  return [testDate.toJSDate(), diff]
}

const isDayCommand = (command) => {
  const isDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].includes(command.toUpperCase())
  return isDay
}
const coerceDay = (dayString) => {
  const inputDayNum = weekdayToNumber[dayString.toUpperCase()]
  const todayDayNum = getWorkingDateTime('NOW').toJSDate().getDay()
  const diff = (7 + inputDayNum - todayDayNum) % 7

  return [getWorkingDateTime('NOW').plus({ days: diff }).toJSDate(), diff]
}

const isDateDeltaCommand = (command) => {
  const deltaRE = /[Tt][+-]?(\d+)/
  return deltaRE.test(command)
}
const coerceDelta = (deltaString) => {
  const deltaRE = /[Tt]([+-])?(\d+)/
  const matches = deltaString.match(deltaRE)
  const diff = matches[1] === '-' ? (-1 * Number(matches[2])) : matches[2]
  return [getWorkingDateTime('NOW').plus({ days: diff }).toJSDate(), diff]
}


const weekdayToNumber = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6
}

const parseOrderCommand = (command) => {
  // if (["set", "inc", "dec"].includes(command)) return command
  if (["set", "="].includes(command)) return "set"
  else if (["inc", "+"].includes(command)) return "inc"
  else if (["dec", "-", "short"].includes(command)) return "dec"
  else return undefined
}


const parseDateCommand = (command) => {
  if (command.toUpperCase() === "TODAY") command = "T0"
  if (command.toUpperCase() === "TOMORROW") command = "T1"
  // console.log(command)
  let delivDateJS
  let diff

  if (isDateCommand(command)) [delivDateJS, diff] = coerceDate(command)
  else if (isDayCommand(command)) [delivDateJS, diff] = coerceDay(command)
  else if (isDateDeltaCommand(command)) [delivDateJS, diff] = coerceDelta(command)

  if (!delivDateJS) return undefined
  
  const parseErrorFlag = isNaN(delivDateJS.getTime())
  const rangeErrorFlag = (-30 <= diff && diff < 0) || 120 <= diff
  // const response = parseErrorFlag ? `delivDate set to ${dateToMmddyyyy(delivDateJS)} (T ${diff >= 0 ? "+" : ""}${diff})`
  //   : rangeErrorFlag? 'Error: Date outside planning range.'
  //   : `delivDate set to ${dateToMmddyyyy(delivDateJS)} (T ${diff >= 0 ? "+" : ""}${diff})`
  

  if (!parseErrorFlag && ! rangeErrorFlag) {
    // TerminalService.emit('response', response)
    return { date: delivDateJS, diff: diff }
  } else {
    return undefined
  }

}

const parseQty = (token) => {
  const intRE = /[0-9]+/
  return (intRE.test(token)) ? Number(token) : undefined
}

const parseProduct = (token, productData) => {
  let matchProduct = productData.find(prod => prod.prodNick === token)
  return !!matchProduct ? matchProduct : undefined
}




const setProductQtys = (values, itemChanges, setItemChanges) => {
  handleAddCartProducts(values, itemChanges, setItemChanges)

}
const incProductQtys = (values, itemChanges, setItemChanges) => {
  // for (let value of values) {
  //   let { product, qty } = value
    
  //   let matchProduct = itemChanges.find(item => item.product.prodNick === product.prodNick)
  //   let newQty = !!matchProduct ? matchProduct.qty + qty : qty

  // }
  const items = values.map(value => {
    let { product, qty } = value
    const matchProduct = itemChanges.find(item => item.product.prodNick === product.prodNick)
    return ({
      product: product,
      qty: !!matchProduct ? matchProduct.qty + qty : qty
    })
  })
  handleAddCartProducts(items, itemChanges, setItemChanges)

}
const decProductQtys = (values, itemChanges, setItemChanges) => {
  // for (let value of values) {
  //   let { product, qty } = value

  //   let matchProduct = itemChanges.find(item => item.product.prodNick === product.prodNick)

  //   if (!!matchProduct) {
  //     let newQty = Math.max(matchProduct.qty - qty, 0)
  //   }
  // }
    const items = values
      .map(value => {
        let { product, qty } = value
        const matchProduct = itemChanges.find(item => item.product.prodNick === product.prodNick)
        return ({
          product: product,
          qty: !!matchProduct ? Math.max(matchProduct.qty - qty, 0) : null
        })
      })
      .filter(value => value.qty !== null)
    handleAddCartProducts(items, itemChanges, setItemChanges)

}

const renderOrder = (locNick, delivDate, headerChanges, itemChanges) => {
  return(
    <>
      <div style={{display: "flex", gap: ".5rem"}} >
        <span style={{width: "fit-content"}}>
          <div>Location:</div>
          <div>Deliv Date:</div>
          <div>Fulfillment:</div>
          <div>Item Note:</div>
        </span>
        <span style={{width: "fit-content"}}>
          <div>{locNick}</div>
          <div>{dateToMmddyyyy(delivDate)}</div>
          <div>{headerChanges.route}</div>
          <div>{headerChanges.ItemNote || 'N/A'}</div>
        </span>
      </div>
      {/* <div>{`${locNick}:`}</div>
      <div>{`${headerChanges.route} ${dateToMmddyyyy(delivDate)}`}</div> */}
      <div style={{display: "flex", gap: ".5rem", paddingLeft: "2rem"}} >
        <span style={{width: "fit-content"}}>
          {itemChanges.map((item, idx) => <div key={`pn#${idx}`}>{item.product.prodNick}: </div>)}
        </span>
        <span style={{width: "fit-content"}}>
          {itemChanges.map((item, idx) => <div key={`qty#${idx}`}>{item.qty}</div>)}
        </span>
      </div>
    </>
  )
}


const parseHelp = (command) => {
  if (command.startsWith('help')) {
    if (command === 'help') return 'help'
    if (command === 'help-date') return 'helpDate'
    if (command === 'help-location') return 'helpLocation'
    if (command === 'help-items') return 'helpItems'
  }
}

const helpText = `LIST OF COMMANDS
  note: commands are case insensitive
  commands can be entered in batches and will be read left to right.

  - [location]: Command(s) to set the location. Try "help-location"
  - [date]: Command(s) to set the delivery date. Try "help-date"
  - [items]: Commands(s) to manipulate order items/qtys. Try "help-items"

  - view: display the order for the current location/date.
  - clear: clear terminal text.

`

const helpTextLocation = `COMMANDS:
  "[locNick]": specify the desired location by its prodNick
      ex: "high" will set the location to High St. Deli.
`
const helpTextDate = `Dates can be entered in several formats.
  valid dates are restricted to days starting the current day,
  up to 120 days in the future.

  COMMANDS:
  - "[date]": use mm/dd or mm-dd format (1 or 2 digits ok)
    ex: 10-2 sets the date to October 2nd.

  - "[ddd]": use a 3 letter weekday. returns the closest 
    corresponding date.
    ex: "wed" sets the date to the next occuring Wednesday, 
    or to today if today is Wednesday.

  - "T+[N]" or "T[N]": Set the date [N] days in the future. 
    ex: "t0" sets the date to today.
`
const helpTextItems = `COMMANDS:
  manipulating order items requires specifying the type 
  of action first. The basic format is

  [action] [prodNick] [qty] ([prodnick] [qty] ...) or
  [action] [qty] [prodNick] ([qty] [prodNick] ...).

  Action commands:
  - "set" or "=": will set the following product(s) 
    to corresponding qty values.

  - "inc" or "+": will increase the following product 
    quantities by the given amount. If the product is 
    not in the order it will be added and set to the 
    given amount.

  - "dec" or "-": will decrease the following product 
    quantities by the given amount. If the product is 
    not in the order no actio will be taken. If the 
    amount specified would set the qty below 0, the 
    qty will be set to 0 instead.
  
  Ex: Suppose an order has the following items:
    bag: 10
    bz:   5
    fr:   6
  
  We enter "set bz 10 pl 5 inc 1 fr - 4 bag"

  The order will become:
    bag:  6
    bz:  10
    fr:   7
    pl:   5

`