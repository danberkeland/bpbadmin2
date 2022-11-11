export const listLocationUsers = /* GraphQL */ `
  query ListLocationUsers(
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        location {
          subs {
            items {
              userID
            }
          }
          locNick
          locName
        }
        user {
          name
          sub
        }
        authType
      }
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($sub: String!) {
    getUser(sub: $sub) {
      name
      email
      phone
      sub
      defaultLoc {
        locNick
        locName
      }
      locs {
        items {
          id
          authType
          locNick
        }
        nextToken
      }
    }
  }
`;


export const listAuth = /* GraphQL */ `
  query ListLocationUsers(
    $filter: ModelLocationUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLocationUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        authType
        locNick
        sub
        location {
          locNick
          locName
          zone
          addr1
          addr2
          city
          zip
          email
          phone
          createdAt
          updatedAt
        }
        user {
          name
          email
          phone
          sub
          createdAt
          updatedAt
          userDefaultLocId
        }
        createdAt
        updatedAt
        locationSubsId
        userLocsId
      }
      nextToken
    }
  }
`;

export const listProductsForTable = /* GraphQL */ `
  query ProdSortAZ(
    $Type: String!
    $prodName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prodSortAZ(
      Type: $Type
      prodName: $prodName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        prodName
        prodNick
        doughNick
        readyTime
        bakedWhere
        wholePrice
        retailPrice
        leadTime
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const getProductForEditing = /* GraphQL */ `
  query GetProduct($prodNick: String!) {
    getProduct(prodNick: $prodNick) {
      Type
      prodName
      prodNick
      packGroup
      packSize
      doughNick
      freezerThaw
      packGroupOrder
      readyTime
      bakedWhere
      wholePrice
      retailPrice
      isWhole
      weight
      descrip
      picURL
      squareID
      forBake
      bakeExtra
      batchSize
      defaultInclude
      leadTime
      qbID
      createdAt
      updatedAt
      inventoryProductId
    }
  }
`;

export const listLocationsForTable = /* GraphQL */ `
  query ListLocations(
    $locNick: String
    $filter: ModelLocationFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listLocations(
      locNick: $locNick
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        locNick
        locName
        subs {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        Type
        id
        qty
        product {
          prodNick
          prodName
        }
        locNick
        ItemNote
        SO
        isWhole
        delivDate
        rate
        isLate
        createdOn
      }
      nextToken
    }
  }
`;

export const listOrdersFromLocation = /* GraphQL */ `
  query customQuery(
    $locNick: String!
    $dayOfWeek: String
    $delivDate: String
  ) {
    getLocation(locNick: $locNick) {
      locNick
      standing (filter: {dayOfWeek: {eq: $dayOfWeek}}) {
        items {
          id
          prodNick
          qty
          dayOfWeek
          ItemNote
          isWhole
          isStand
          startDate
          endDate
        }
        nextToken
      }
      orders(filter: {delivDate: {eq: $delivDate}}) {
        items {
          id
          prodNick
          qty
          delivDateISO
          delivDate
          ItemNote
          SO
          isWhole
          rate
          isLate
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;