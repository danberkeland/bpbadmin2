import React, { useState } from "react"

import ButtonArray from "./ButtonArray"
import ItemList from "./ItemList"
import { CreateForm, EditForm, ViewForm } from "./ItemForms"

function TableEditor({tableName, itemSchema}) {
  const idField = itemSchema.meta().idField
  const emptySelection = Object.fromEntries([[idField, null]])

  const [tableSelected, setTableSelected] = useState(emptySelection)
  const table = {
    name: tableName,
    selected: tableSelected,
    setSelected: (selection) => {
      selection !== null ? 
        setTableSelected(selection) : 
        setTableSelected(emptySelection)
    }
  }

  const [formViewMode, setFormViewMode] = useState("HIDDEN")
  const form = {
    viewMode: formViewMode,
    setViewMode: mode => setFormViewMode(mode)
  }



  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      
      <h1>{tableName}</h1>

      <pre>{JSON.stringify(table.selected, null, 2)}</pre>
      <pre>{JSON.stringify(form.viewMode, null, 2)}</pre>

      <ButtonArray form={form} table={table} itemSchema={itemSchema} />
      <ItemList form={form} table={table} listPath={itemSchema.meta().listPath} />

      {form.viewMode === "CREATE" && <CreateForm form={form} table={table} itemSchema={itemSchema} />}
      {form.viewMode === "VIEW" && <ViewForm form={form} table={table} itemSchema={itemSchema} />}
      {form.viewMode === "EDIT" && <EditForm form={form} table={table} itemSchema={itemSchema} />}

    </div>
  )
}

export default TableEditor