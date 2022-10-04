import callGraphQL from '../../project_modules/appsync-crud.js';

/*******************
 * UPDATE LOCATION *
 *******************/

const mutation = /* GraphQL */ `
	mutation MyMutation(
		$locNick: String!, 
		$locName: String, 
	    $zoneNick: String,
	    $addr1: String,
	    $addr2: String,
	    $city: String,
	    $zip: String,
	    $email: String,
	    $phone: String,
	    $toBePrinted: Boolean,
	    $toBeEmailed: Boolean,
	    $printDuplicate: Boolean,
	    $terms: String,
	    $invoicing: String,
	    $latestFirstDeliv: Float,
	    $latestFinalDeliv: Float,
	    $webpageURL: String,
	    $picURL: String,
	    $gMap: String,
	    $specialInstructions: String,
	    $delivOrder: Int,
	    $qbID: String,
	    $currentBalance: String
	) {
		updateLocation(
			input: {
				locNick: $locNick, 
				locName: $locName,
				zoneNick: $zoneNick,
				addr1: $addr1,
				addr2: $addr2,
				city: $city,
				zip: $zip,
				email: $email,
				phone: $phone,
				toBePrinted: $toBePrinted,
				toBeEmailed: $toBeEmailed,
				printDuplicate: $printDuplicate,
				terms: $terms,
				invoicing: $invoicing,
				latestFirstDeliv: $latestFirstDeliv,
				latestFinalDeliv: $latestFinalDeliv,
				webpageURL: $webpageURL,
				picURL: $picURL,
				gMap: $gMap,
				specialInstructions: $specialInstructions,
				delivOrder: $delivOrder,
				qbID: $qbID,
				currentBalance: $currentBalance
			}
		) {
	    	locNick
	        locName
	        zoneNick
	        addr1
	        addr2
	        city
	        zip
	        email
	        phone
	        toBePrinted
	        toBeEmailed
	        printDuplicate
	        terms
	        invoicing
	        latestFirstDeliv
	        latestFinalDeliv
	        webpageURL
	        picURL
	        gMap
	        specialInstructions
	        delivOrder
	        qbID
	        currentBalance
		}
	}
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	return gqlResponse.data.updateLocation;
	
}

export default apiFunction;