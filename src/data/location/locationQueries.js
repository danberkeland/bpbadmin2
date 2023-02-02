export const listLocationNames = /* GraphQL */ `
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
      }
    }
  }
`;

export const getLocationDetails = /* GraphQL */ `
query MyQuery(
    $locNick: String!, 
  ) {
    getLocation(locNick: $locNick) {
      locNick
      locName
      zoneNick
      customProd {
        items {
          prodNick
          wholePrice
        }
      }
      prodsNotAllowed {
        items {
          id
          isAllowed
          prodNick
        }
      }
      altLeadTimeByProduct {
        items {
          id
          leadTime
          prodNick
        }
      }
      templateProd {
        items {
          id
          prodNick
        }
      }
    }
  }
`