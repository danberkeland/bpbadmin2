import React from 'react'

// State Management
import { useLocationStore, useLocationList } from './hooks'

// Components
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

function LocationTable() {
	const { form, table } = useLocationStore()
	const { locationList } = useLocationList()

	// Render
	if (locationList.isLoading) return <div>Table Loading...</div>
	if (locationList.isError) return <div>Table Failed to load</div>
	return (
		<>
			<DataTable
				value={locationList.data}
				selectionMode="single"
				metaKeySelection={false}
				selection={table.selected}
				onSelectionChange={(e) => {
					if (form.viewType === "HIDDEN") {
					table.setSelected(e.value)
					console.log(JSON.stringify(e.value))
					}
				}}
				responsiveLayout="scroll"
				size="small"
				showGridlines
			>
				{Object.keys(locationList.data[0]).map( label => 
					<Column key={label} field={label} header={label} sortable /> 
				)}
			</DataTable>
		</>
	)
}

export default LocationTable