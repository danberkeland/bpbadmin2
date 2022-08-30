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
        subs {
          nextToken
        }
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
      locs {
        items {
          id
          authType
          locNick
          sub
          createdAt
          updatedAt
          locationSubsId
          userLocsId
        }
        nextToken
      }
      createdAt
      updatedAt
      userDefaultLocId
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