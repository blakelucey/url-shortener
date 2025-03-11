// Full queries. Direct and to the point, just like your API should be.

export const GET_USER = /* GraphQL */ `
  query GetUser($userId: String!) {
    getUser(userId: $userId) {
      id
      userId
      authType
      email
      firstName
      lastName
      isPro
      createdAt
      updatedAt
    }
  }
`;

export const LIST_USERS = /* GraphQL */ `
  query ListUsers {
    listUsers {
      id
      userId
      authType
      email
      firstName
      lastName
      isPro
      createdAt
      updatedAt
    }
  }
`;

export const GET_LINK = /* GraphQL */ `
  query GetLink($shortHash: String!) {
    getLink(shortHash: $shortHash) {
      id
      userId
      originalUrl
      shortHash
      channels
      campaigns
      createdAt
      updatedAt
    }
  }
`;

export const LIST_LINKS = /* GraphQL */ `
  query ListLinks {
    listLinks {
      id
      userId
      originalUrl
      shortHash
      channels
      campaigns
      createdAt
      updatedAt
    }
  }
`;

export const GET_CLICK = /* GraphQL */ `
  query GetClick($id: ID!) {
    getClick(id: $id) {
      id
      linkId
      userId
      timestamp
      referrer
      ip
      userAgent
      deviceType
      browser
      operatingSystem
      country
      region
      city
      utm_source
      utm_medium
      utm_campaign
      utm_term
      utm_content
    }
  }
`;

export const LIST_CLICKS = /* GraphQL */ `
  query ListClicks {
    listClicks {
      id
      linkId
      userId
      timestamp
      referrer
      ip
      userAgent
      deviceType
      browser
      operatingSystem
      country
      region
      city
      utm_source
      utm_medium
      utm_campaign
      utm_term
      utm_content
    }
  }
`;