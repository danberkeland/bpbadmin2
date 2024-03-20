import React, { useState } from "react"

import { useRusticData } from "./useRusticData"
import { useProducts } from "../../../data/product/useProducts"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { DrilldownCellTemplate } from "./DrilldownCellTemplate"

import { DT } from "../../../utils/dateTimeFns"
import { keyBy } from "../../../utils/collectionFns"

import { Button } from "primereact/button"
import { useOtherPrepData } from "./useOtherPrepData"
import { useCroixSetoutData } from "./useCroixSetoutData"
import { exportBaker2 } from "./exportBaker2"



const Baker2 = () => {
  const todayDT = DT.today()
  const [reportDT, setReportDT] = useState(todayDT)
  const isToday = reportDT.toMillis() === todayDT.toMillis()
  
  const { data:rusticData }      = useRusticData({ bakeDT: reportDT.plus({ days: 1 }), useHolding: true })
  const { data:otherPrepData }   = useOtherPrepData({ bakeDT: reportDT })
  const { data:croixSetoutData } = useCroixSetoutData({ bakeDT: reportDT.plus({ days: 1 }) })
  const { data:PRD=[], submitMutations, updateLocalData } = useProducts({ shouldFetch: true})
  const products = keyBy(PRD, P => P.prodNick)

  const submitPrepreshapes = async () => {
    const updateInputs = rusticData?.map(row => ({
      prodNick: row.representativeProdNick,
      prepreshaped: row.qty
    }))

    // updateLocalData(
    //   await submitMutations({ updateInputs })
    // )

    console.log(updateInputs)

  }

  return (
    <div style={{maxWidth: "50rem", padding: "2rem 5rem 5rem 5rem", margin: "auto"}}>
      
      <h1>What to Shape {reportDT.toFormat('MM/dd/yyyy')}</h1>
      <Button 
        label="Print Prep List" 
        icon="pi pi-print" 
        style={{marginBottom: "2rem"}} 
        onClick={() => {
          submitPrepreshapes()
          exportBaker2({
            reportDT,
            rusticData,
            otherPrepData,
            croixSetoutData,
          })
        }}  
      />

      <DataTable 
        value={rusticData ?? []}
        size="small" 
        responsiveLayout="scroll"   
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="forBake" />
        <Column header="Weight"  field="weight" />
        <Column header="Dough"   field="doughNick" />
        <Column header="Qty" 
          body={rowData => DrilldownCellTemplate({ 
            dialogHeader: `${rowData.forBake} Orders to be Baked`,
            cellValue: rowData.qty, 
            tableData: rowData.items,
            products,
          })} 
          style={{width: "6rem"}}
        />
      </DataTable>

      <h2>Other Prep</h2>
      <DataTable 
        value={otherPrepData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="prodName"   />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.prodName} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>

      <h2>Croissant Setout</h2>
      <DataTable 
        value={croixSetoutData}
        size="small"
        responsiveLayout="scroll"
        style={{marginTop: "1rem"}}
        className={isToday ? '' : 'not-today'}
      >
        <Column header="Product" field="prodNick" />
        <Column header="Qty"
          body={rowData => DrilldownCellTemplate({
            dialogHeader: `${rowData.prodNick} Orders to be Shaped`,
            cellValue: rowData.qty,
            tableData: rowData.items,
            products
          })}
          style={{width: "6rem"}}
        />

      </DataTable>


    </div>
  )

}

export { Baker2 as default }