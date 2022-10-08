import React from 'react'
import useSWR from 'swr'
import { fetcher } from './fetcher'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

function ItemList({form, table, listPath}) {
  const { data: itemList, error } = useSWR(listPath, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false
  })

  if (error) return <div>List failed to Load.</div>
  if (!itemList) return <div>Loading...</div>

  return (

    <DataTable
      style={{ float: 'left' }}
      value={itemList}
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
      {Object.keys(itemList[0]).map( label => 
        <Column key={label} field={label} header={label} sortable /> 
      )}
    </DataTable>

  )
}

export default ItemList