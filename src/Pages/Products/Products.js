import React from "react"
import { useProductsPageStore } from "./components/hooks"

import ProductsTable from "./components/ProductTable"
import { EditForm, CreateForm, ViewForm } from "./components/ProductForms"
import { CreateButton, ViewButton, EditButton, DeleteButton } from "./components/CrudButtons"

function Products() {
  const { table, form } = useProductsPageStore()

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      
      <h1>Products</h1>

      <CreateButton />
      <ViewButton />
      <EditButton />
      <DeleteButton />

      <pre>{"form: " + JSON.stringify(form)}</pre>
      <pre>{"table: " + JSON.stringify(table)}</pre>
      <ProductsTable/>

      {form.viewMode === "CREATE" && <CreateForm />}
      {form.viewMode === "VIEW" && <ViewForm prodNick={table.selected.prodNick} />}
      {form.viewMode === "EDIT" && <EditForm prodNick={table.selected.prodNick} />}

    </div>
  )
}

export default Products