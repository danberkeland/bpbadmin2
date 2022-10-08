import React from "react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
//import useSWR from "swr"
import useSWRImmutable from "swr/immutable"

import { fetchQuery, useProductsPageStore } from "./hooks"



function ProductsTable() {
  const productList = useSWRImmutable('/products/listProducts', fetchQuery)
  const { table, form } = useProductsPageStore()
  
  if (productList.error) return <div>failed to load</div>
  if (!productList.data) return <div>loading...</div>

  return (
  
    <DataTable
      style={{ float: 'left' }}
      value={productList.data}
      selectionMode="single"
      metaKeySelection={false}
      selection={table.selected}
      onSelectionChange={(e) => {
        if (form.viewMode === "HIDDEN") {
        table.setSelected(e.value)
        }
      }}
      responsiveLayout="scroll"
      size="small"
      showGridlines
      scrollable 
      scrollHeight="600px"
    >
      {Object.keys(productList.data[0]).map( label => 
        <Column key={label} field={label} header={label} sortable /> 
      )}
    </DataTable>
    

  )

}

export default ProductsTable