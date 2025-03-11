// Full mutations. No fluff, just the essentials for your GraphQL API.

export const CREATE_USER = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export const UPDATE_USER = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
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

export const DELETE_USER = /* GraphQL */ `
  mutation DeleteUser($userId: String!) {
    deleteUser(userId: $userId) {
      id
      userId
    }
  }
`;

export const CREATE_LINK = /* GraphQL */ `
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
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

export const UPDATE_LINK = /* GraphQL */ `
  mutation UpdateLink($input: UpdateLinkInput!) {
    updateLink(input: $input) {
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

export const DELETE_LINK = /* GraphQL */ `
  mutation DeleteLink($shortHash: String!) {
    deleteLink(shortHash: $shortHash) {
      id
      shortHash
    }
  }
`;

export const CREATE_CLICK = /* GraphQL */ `
  mutation CreateClick($input: CreateClickInput!) {
    createClick(input: $input) {
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