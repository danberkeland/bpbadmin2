import React, { useRef } from "react"
import { useProductsPageStore } from "./components/hooks"

import ProductsTable from "./components/ProductTable"
import { Button } from "primereact/button"
import { DeleteButton } from "./components/CrudButtons"

function Products() {
  const { table, form } = useProductsPageStore()

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      
      <h1>Products</h1>
      <Button label="View Details" onClick={() => form.setViewMode("READ")} disabled={!table.selected.prodNick} />
      <Button label="Edit" onClick={() => form.setViewMode("EDIT")} disabled={!table.selected.prodNick} />

      <DeleteButton 
        disabled={!table.selected.prodNick} 
        toDelete={table.selected.prodNick} />

      <Button label="Create" onClick={() => form.setViewMode("CREATE")} />
      
      <pre>{"form: " + JSON.stringify(form)}</pre>
      <pre>{"table: " + JSON.stringify(table)}</pre>

      <ProductsTable/>


    </div>
  )
}

export default Products