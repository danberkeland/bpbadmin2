import React, { useState } from "react"
import { Button } from "primereact/button"
import { Dropdown } from "primereact/dropdown"
import { Calendar } from "primereact/calendar"
import { AutoComplete } from "primereact/autocomplete"

import { API, Auth } from "aws-amplify"
import useSWRImmutable from "swr/immutable"

import * as queries from '../../graphql/queries'
import * as CustomQueries from '../../customGraphQL/queries'

import * as Yup from 'yup'
import useSWR from "swr"

import { Orders } from "./orders-components/Orders"
import { Orders2 } from "./orders-components/Orders2"

const AaaBackendTest = () => {
	return <Orders2 />
}

export default AaaBackendTest

const fetcher = async (path) => await API.get('bpbrpc', path)

const gqlFetcher = async (query, variables) => {
	console.log("variables", variables)
	const response = await API.graphql({
		query: query,
		variables: variables
	})
	console.log("response", response)

	return response
}



const OrdersEditor = () => {
	const [selectedLocation, setSelectedLocation] = useState()
	const [selectedDate, setSelectedDate] = useState()
	const [currentOrders, setCurrentOrders] = useState()
	
	const variables = {
		limit: 50,
		filter: {
			locNick: {eq: selectedLocation},
			delivDate: {eq: selectedDate}
		}
	}
	const { data: locationList } = useSWRImmutable('/locations/listLocations', fetcher)
	const { data: orders } = useSWRImmutable((selectedLocation && selectedDate) ? [CustomQueries.listOrders, variables] : null, gqlFetcher)

	// const locationList = [
	// 	{locName: "Back Porch", locNick: "bpb"},
	// 	{locName: "Kreuzberg", locNick: "kberg"}
	// ]

	return (
		<div>	
			<Dropdown 
				options={locationList}
				optionLabel="locName"
				optionValue="locNick"
				value={selectedLocation}
				onChange={e => setSelectedLocation(e.value)}
				placeholder={locationList ? "Select Location" : "Loading..."}
			/>

			<Calendar 
				value={selectedDate}
				dateFormat="mm/dd/yy"
				showTime={false}
				onChange={e => {
					let month = ('0' + ((e.value).getMonth() + 1)).slice(-2)
					let day = ('0' + (e.value).getDate()).slice(-2)
					let year = (e.value).getFullYear()
					setSelectedDate(month + '/' + day + '/' + year)
				
				}}
				placeholder={"Select Date"}
			/>

			<Button 
				label="Execute"
				onClick={() => console.log("foo")}
				// disabled={!selectedDate || !selectedLocation}
			/>

			<pre>location :{JSON.stringify(selectedLocation, null, 2)}</pre>
			<pre>date: {JSON.stringify(selectedDate, null, 2)}</pre>
			<pre>orders :{JSON.stringify(orders, null, 2)}</pre>


		</div>
	)
	


}