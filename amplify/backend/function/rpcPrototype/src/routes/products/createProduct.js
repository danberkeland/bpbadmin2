import callGraphQL from '../../project_modules/appsync-crud.js';

/******************
 * CREATE PRODUCT *
 ******************/

const mutation = /* GraphQL */ `
    mutation MyMutation(
        $bakeDay: Int, 
        $bakeExtra: Int, 
        $bakeNick: String, 
        $bakedWhere: [String], 
        $batchSize: Int, 
        $defaultInclude: Boolean, 
        $descrip: String, 
        $doughNick: String, 
        $forBake: String, 
        $freezerThaw: Boolean, 
        $guarantee: String, 
        $inventoryProductId: ID, 
        $isWhole: Boolean, 
        $leadTime: Int, 
        $packGroup: String, 
        $packGroupOrder: Int, 
        $packSize: Int, 
        $picURL: String, 
        $prodName: String!, 
        $prodNick: String!, 
        $qbID: String, 
        $readyTime: Float, 
        $retailPrice: Float, 
        $shapeDay: Int, 
        $shapeNick: String, 
        $squareID: String, 
        $transferStage: String, 
        $weight: Float, 
        $wholePrice: Float
    ) {
        createProduct(
            input: {
                bakeDay: $bakeDay,
                bakeExtra: $bakeExtra,
                bakeNick: $bakeNick,
                bakedWhere: $bakedWhere,
                batchSize: $batchSize,
                defaultInclude: $defaultInclude,
                descrip: $descrip,
                doughNick: $doughNick,
                forBake: $forBake,
                freezerThaw: $freezerThaw,
                guarantee: $guarantee,
                inventoryProductId: $inventoryProductId,
                isWhole: $isWhole,
                leadTime: $leadTime,
                packGroup: $packGroup,
                packGroupOrder: $packGroupOrder,
                packSize: $packSize,
                picURL: $picURL,
                prodName: $prodName,
                prodNick: $prodNick,
                qbID: $qbID,
                readyTime: $readyTime,
                retailPrice: $retailPrice,
                shapeDay: $shapeDay,
                shapeNick: $shapeNick,
                squareID: $squareID,
                transferStage: $transferStage,
                weight: $weight,
                wholePrice: $wholePrice
            }
        ) {
            bakeDay
            bakeExtra
            bakeNick
            bakedWhere
            batchSize
            defaultInclude
            descrip
            doughNick
            forBake
            freezerThaw
            guarantee
            inventoryProductId
            isWhole
            leadTime
            packGroup
            packGroupOrder
            packSize
            picURL
            prodName
            prodNick
            qbID
            readyTime
            retailPrice
            shapeDay
            shapeNick
            squareID
            transferStage
            weight
            wholePrice
        }
    }
`;

async function apiFunction(queryStringParameters, body){
	let gqlResponse = await callGraphQL(mutation, body);
	return gqlResponse.data.createProduct;
}

export default apiFunction;