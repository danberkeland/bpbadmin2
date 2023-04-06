
  
  import {
    convertDatetoBPBDate,
    todayPlus,
    tomBasedOnDelivDate,
  } from "../helpers/dateTimeHelpers";

  import {
    updateProduct, updateDough, updateDoughBackup
  } from "../graphql/mutations"
  
  import { API, graphqlOperation } from "aws-amplify";
  
  import { getOrdersList } from "../Pages/Production/Utils/utils"
  import ComposeNorthList from "../Pages/Logistics/utils/composeNorthList";
  import ComposeCroixInfo from "../Pages/Logistics/utils/composeCroixInfo";
  
  const clonedeep = require("lodash.clonedeep");
  const { DateTime } = require("luxon");
  
  const composer = new ComposeCroixInfo();
  const compose = new ComposeNorthList();
  
  let tomorrow = todayPlus()[1];
  let today = todayPlus()[0];
  let yesterday2 = todayPlus()[4];
  let weekAgo = todayPlus()[5];
  
  let yesterday = convertDatetoBPBDate(todayPlus()[4]);
  
  
  
  export const checkForUpdates = async (
    db,
    ordersHasBeenChanged,
    setOrdersHasBeenChanged,
    delivDate,
    setIsLoading
  ) => {
    setIsLoading(true)
    
    const [products, customers, routes, standing, orders, doughs, altPricing] =
      db;
    
    console.log("Checking if Orders Have been changed");
    let prodsToUpdate = clonedeep(products);
    let doughsToUpdate = clonedeep(doughs);
    let ordersToUpdate = clonedeep(orders);
    
   
    if (ordersHasBeenChanged) {
      console.log('changes')
        /*
      console.log("Yes they have! deleting old orders");
  
      let newYest = convertDatetoBPBDate(yesterday2);
      let newWeekAgo = convertDatetoBPBDate(weekAgo);
  
      for (let ord of ordersToUpdate) {
        let ind = customers.findIndex((cust) => cust.custName === ord.custName);
        let weeklyCheck = "daily";
  
        if (ind > -1) {
          weeklyCheck = customers[ind].invoicing;
        }
        if (
          (ord.delivDate === newYest && weeklyCheck === "daily") ||
          (ord.delivDate === newWeekAgo && weeklyCheck === "weekly")
        ) {
          let ordToUpdate = {
            id: ord.id,
          };
          try {
            await API.graphql(
              graphqlOperation(deleteOrder, { input: { ...ordToUpdate } })
            );
          } catch (error) {
            console.log("error on deleting Order", error);
          }
        }
      }
      */

      console.log("Yes they have!  Updating freezerNorth numbers");
  
      try {
        let bakedOrdersList = getOrdersList(tomBasedOnDelivDate(today), db);
        
        bakedOrdersList = bakedOrdersList.filter((frz) =>
          NorthCroixBakeFilter(frz)
        );
        console.log('bakedOrdersList', bakedOrdersList)
        
        for (let prod of bakedOrdersList) {
          console.log('prod', prod)
          if (prod.freezerNorthFlag !== tomorrow) {
            prod.freezerNorthFlag = today;
          }
          
          if (prod.freezerNorthFlag === today) {
            try {
              let projectionCount = composer.getProjectionCount(db, delivDate);
  
              for (let proj of projectionCount) {
                if (prod.forBake === proj.prod) {
                  prod.freezerCount = proj.today;
                }
              }
            } catch {}
  
            prod.freezerNorth = prod.freezerNorthClosing;
  
            let frozenDelivsArray = compose.getFrozensLeavingCarlton(today, db);
            let frozenDeliv;
            try {
              frozenDeliv =
                frozenDelivsArray[
                  frozenDelivsArray.findIndex((fr) => fr.prod === prod.prodNick)
                ].qty;
            } catch {
              frozenDeliv = 0;
            }
            let setOutArray = compose.getBakedTomorrowAtCarlton(today, db);
            let setOut;
            try {
              setOut =
                setOutArray[
                  setOutArray.findIndex((set) => set.prod === prod.prodNick)
                ].qty;
            } catch {
              setOut = 0;
            }
  
            prod.freezerNorthClosing =
              prod.freezerNorthClosing +
              Math.ceil((setOut + frozenDeliv - prod.freezerNorthClosing) / 12) *
                12 -
              setOut -
              frozenDeliv +
              Number(prod.bakeExtra);
  
            prod.freezerNorthFlag = tomorrow;
            let prodToUpdate = {
              prodNick: prod.prodNick,
              freezerNorth: prod.freezerNorth,
              freezerCount: prod.freezerClosing,
              freezerNorthClosing: prod.freezerNorthClosing,
              freezerNorthFlag: prod.freezerNorthFlag,
              sheetMake: 0,
            };
            
            try {
              await API.graphql(
                graphqlOperation(updateProduct, { input: { ...prodToUpdate } })
              );
              console.log("update good")
            } catch (error) {
              console.log("error on updating product", error);
            }
          }
        }
      } catch {}
    
      console.log("Yes they have!  Updating preshaped numbers");
  
      for (let prod of prodsToUpdate) {
        console.log('prodpreshaped', prod)
        if (prod.updatePreDate !== tomorrow) {
          prod.updatePreDate = today;
        }
        if (prod.updatePreDate === today) {
          prod.preshaped = prod.prepreshaped;
          prod.updatePreDate = tomorrow;
          let prodToUpdate = {
            prodNick: prod.nickName,
            preshaped: prod.preshaped,
            prepreshaped: prod.prepreshaped,
            updatePreDate: prod.updatePreDate,
          };
          
          try {
            await API.graphql(
              graphqlOperation(updateProduct, { input: { ...prodToUpdate } })

            );
            console.log("update good")
          } catch (error) {
            console.log("error on creating Orders", error);
          }
        }
      }
  
      console.log("Yes they have!  Updating prepped bucket numbers");
  
      for (let dgh of doughsToUpdate) {
        console.log('dgh', dgh)
        if (dgh.updatePreBucket !== tomorrow) {
          dgh.updatePreBucket = today;
        }
        if (dgh.updatePreBucket === today) {
          //  need to update correct prebucket set number
          dgh.bucketSets = dgh.preBucketSets;
          dgh.updatePreBucket = tomorrow;
          let doughToUpdate = {
            id: dgh.id,
            bucketSets: dgh.bucketSets,
            preBucketSets: dgh.preBucketSets,
            updatePreBucket: dgh.updatePreBucket,
          };
          
          try {
            await API.graphql(
              graphqlOperation(updateDoughBackup, { input: { ...doughToUpdate } })
            );
            console.log("update good")
          } catch (error) {
            console.log("error on creating Orders", error);
          }
        }
      }
      /*
      console.log("Yes they have!  Loading new Square Orders in DB");
  
      let ord = await fetchSq(db);
      if (ord) {
        for (let newOrd of ord) {
          console.log("newSqOrd", newOrd)
          let qty = Number(newOrd["qty"]);
          let dt = new Date().toISOString();
          let delivDate = newOrd["delivDate"].split("T")[0];
          delivDate = delivDate.split("-");
          delivDate = delivDate[1] + "/" + delivDate[2] + "/" + delivDate[0];
  
          let locIDBPBN = "16VS30T9E7CM9";
  
          let rt = "slopick";
          let custName = newOrd["custName"]+"__"+newOrd["id"];
          let prodName;
          try {
            prodName =
              products[
                products.findIndex((prod) =>
                  newOrd["item"].includes(prod.squareID)
                )
              ]["prodName"];
          } catch {
            prodName = "Brownie";
          }
  
          if (newOrd.location === locIDBPBN) {
            rt = "atownpick";
          }
  
          let itemToAdd = {
            SO: qty,
            qty: qty,
            timeStamp: dt,
            isWhole: false,
            PONote: "paid",
            delivDate: delivDate,
            custName: custName,
            prodName: prodName,
            route: rt,
          };
  
          let ind = orders.findIndex(
            (ord) => ord["custName"] === custName && ord["prodName"] === prodName
          );
  
          if (ind === -1) {
            try {
              await API.graphql(
                graphqlOperation(createOrder, { input: { ...itemToAdd } })
              );
  
              ordersToUpdate.push(itemToAdd);
            } catch (error) {
              console.log("error on creating Orders", error);
            }
          }
        }
      } else {
        console.log("Square orders did not load");
      }*/
    }
    let DBToMod = clonedeep(db);
    DBToMod[4] = ordersToUpdate;
    DBToMod[5] = doughsToUpdate;
    DBToMod[0] = prodsToUpdate;
    setOrdersHasBeenChanged(false);
    setIsLoading(false)
    return DBToMod
    
  };
  
  const fetchSq = async () => {
    try {
      let response = await fetch(
        "https://8eo1jrov6a.execute-api.us-east-2.amazonaws.com/done"
      );
  
      let newOrders = await response.json();
      newOrders = JSON.parse(newOrders);
      return newOrders;
    } catch {
      console.log("Error on Square load");
    }
  };
  
  const NorthCroixBakeFilter = (ord) => {
    return (
     
      ord.packGroup === "baked pastries" &&
      ord.doughType === "Croissant"
    );
  };
  