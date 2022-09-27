export const feedQuery = `query ProfileFeed(
  $request: PublicationsQueryRequest!
  $reactionRequest: ReactionFieldResolverRequest
  $profileId: ProfileId
) {
  publications(request: $request) {
    items {
      ... on Post {
        ...PostFields
        __typename
      }
      ... on Comment {
        ...CommentFields
        __typename
      }
      ... on Mirror {
        ...MirrorFields
        __typename
      }
      __typename
    }
    pageInfo {
      totalCount
      next
      __typename
    }
    __typename
  }
}

fragment PostFields on Post {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  hasCollectedByMe
  collectedBy {
    address
    defaultProfile {
      ...ProfileFields
      __typename
    }
    __typename
  }
  collectModule {
    ...MinimalCollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  __typename
}

fragment ProfileFields on Profile {
  id
  name
  handle
  bio
  ownedBy
  attributes {
    key
    value
    __typename
  }
  picture {
    ... on MediaSet {
      original {
        url
        __typename
      }
      __typename
    }
    ... on NftImage {
      uri
      __typename
    }
    __typename
  }
  followModule {
    __typename
  }
  __typename
}

fragment MinimalCollectModuleFields on CollectModule {
  ... on FreeCollectModuleSettings {
    type
    __typename
  }
  ... on FeeCollectModuleSettings {
    type
    amount {
      asset {
        address
        __typename
      }
      __typename
    }
    __typename
  }
  ... on LimitedFeeCollectModuleSettings {
    type
    amount {
      asset {
        address
        __typename
      }
      __typename
    }
    __typename
  }
  ... on LimitedTimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        address
        __typename
      }
      __typename
    }
    __typename
  }
  ... on TimedFeeCollectModuleSettings {
    type
    amount {
      asset {
        address
        __typename
      }
      __typename
    }
    __typename
  }
  __typename
}

fragment MetadataFields on MetadataOutput {
  name
  description
  content
  cover {
    original {
      url
      __typename
    }
    __typename
  }
  media {
    original {
      url
      mimeType
      __typename
    }
    __typename
  }
  attributes {
    value
    __typename
  }
  __typename
}

fragment StatsFields on PublicationStats {
  totalUpvotes
  totalAmountOfMirrors
  totalAmountOfCollects
  totalAmountOfComments
  __typename
}

fragment CommentFields on Comment {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  mirrors(by: $profileId)
  hasCollectedByMe
  collectedBy {
    address
    defaultProfile {
      ...ProfileFields
      __typename
    }
    __typename
  }
  collectModule {
    ...MinimalCollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  createdAt
  appId
  commentOn {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      hasCollectedByMe
      collectedBy {
        address
        defaultProfile {
          handle
          __typename
        }
        __typename
      }
      collectModule {
        ...MinimalCollectModuleFields
        __typename
      }
      metadata {
        ...MetadataFields
        __typename
      }
      stats {
        ...StatsFields
        __typename
      }
      mainPost {
        ... on Post {
          ...PostFields
          __typename
        }
        ... on Mirror {
          ...MirrorFields
          __typename
        }
        __typename
      }
      hidden
      createdAt
      __typename
    }
    ... on Mirror {
      ...MirrorFields
      __typename
    }
    __typename
  }
  __typename
}

fragment MirrorFields on Mirror {
  id
  profile {
    ...ProfileFields
    __typename
  }
  reaction(request: $reactionRequest)
  collectModule {
    ...MinimalCollectModuleFields
    __typename
  }
  stats {
    ...StatsFields
    __typename
  }
  metadata {
    ...MetadataFields
    __typename
  }
  hidden
  mirrorOf {
    ... on Post {
      ...PostFields
      __typename
    }
    ... on Comment {
      id
      profile {
        ...ProfileFields
        __typename
      }
      reaction(request: $reactionRequest)
      mirrors(by: $profileId)
      stats {
        ...StatsFields
        __typename
      }
      createdAt
      __typename
    }
    __typename
  }
  createdAt
  appId
  __typename
}`;
