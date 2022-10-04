import React from "react"

// State Management
import { useLocationStore } from './components/hooks.js'

// Components
import LocationTable from "./components/LocationTable.jsx"
import LocationForm from "./components/LocationForm.jsx"
import LocationDeleteDialog from "./components/LocationDeleteDialog.jsx"
import { Button } from "primereact/button"

const Locations = () => {
	const { form, table } = useLocationStore()

	return (
				<div style={{ maxWidth: "500px", margin: "0 auto" }}>

					<h1>Locations</h1>

					<Button label="View"
						onClick={ () => {
							form.setViewType("READ")
						}}
						disabled={!table.selected}
					/>

					<Button label="Edit" 
						onClick={() => {
							form.setViewType("EDIT")
						}}
						disabled={!table.selected}
					/>

					<Button label="Delete"
						onClick={() => {
							form.setViewType("DELETE")
						}}
						disabled={!table.selected}
					/>

					<Button label="Create New"
						onClick={() => {
							table.setSelected(null)
							form.setViewType("CREATE")
						}}
					/>

					<LocationTable />
					{(form.viewType == "READ" || 
						form.viewType == "CREATE" || 
						(form.viewType == "EDIT" && table.selected)) &&
						<LocationForm />
					}

					{(form.viewType == "DELETE" && table.selected) &&
						<LocationDeleteDialog />
					}
			</div>
	)
}

export default Locations