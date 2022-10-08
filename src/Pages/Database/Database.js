import React, { useState } from "react";
import TableEditor from "../../Components/table-editor/TableEditor";

import { productSchema, locationSchema, doughSchema } from './itemSchemas'
import { Dropdown } from "primereact/dropdown";

const Database = () => {

	const [tableName, setTableName] = useState("foo")
	const [itemSchema, setItemSchema] = useState(null)

	const tables = [
		{ label: 'Product', value: 'Product' },
		{ label: 'Dough', value: 'Dough' },
		{ label: 'Location', value: 'Location' },
	]

	const schemas = {
		Product: productSchema,
		Location: locationSchema,
		Dough: doughSchema,
	}

	return (
		<>
			<h5>Select a Table</h5>
			<Dropdown 
				value={tableName}
        options={tables}
				optionLabel='label'
				optionValue='value'
        onChange={e => {
					setTableName(e.value)
					setItemSchema(schemas[e.value])
				}} 
        placeholder=""
			/>
			{/* <pre>{JSON.stringify(tableName, null, 2)}</pre> */}

			{itemSchema && <TableEditor tableName={tableName} itemSchema={itemSchema} />}
		</>
	)
}

export default Database