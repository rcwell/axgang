export const static_variables = {
	from: 0,
	size: 24,
	sort: "IdDesc",
	auctionType: "All",
	criteria: {
		region: null,
		parts: null,
		bodyShapes: null,
		classes: null,
		stages: null,
		numMystic: null,
		pureness: null,
		title: null,
		breedable: null,
		breedCount: null,
		hp: [],
		skill: [],
		speed: [],
		morale: [],
	},
};

export const axies_query = `
	query ($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $roninAddress: String!) {
		publicProfileWithRoninAddress(roninAddress: $roninAddress) {
			accountId
			name
			addresses {
				ethereum
				tomo
				loom
				ronin
				__typename
			}
		  	__typename
	  	}
		axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $roninAddress) {
			total
			results {
				id
				name
				stage
				class
				breedCount
				image
				title
				battleInfo {
					banned
					__typename
				}
				auction {
					currentPrice
					currentPriceUSD
					__typename
				}
				parts {
					id
					name
					class
					type
					specialGenes
					__typename
				}
				__typename
			}
			__typename
		}
	}
`;

export const axie_info = `query GetAxieDetail($axieId: ID!) {
  axie(axieId: $axieId) {
    ...AxieDetail
    __typename
  }
}

fragment AxieDetail on Axie {
  id
  image
  class
  chain
  name
  genes
  owner
  birthDate
  bodyShape
  class
  sireId
  sireClass
  matronId
  matronClass
  stage
  title
  breedCount
  level
  figure {
    atlas
    model
    image
    __typename
  }
  parts {
    ...AxiePart
    __typename
  }
  stats {
    ...AxieStats
    __typename
  }
  ownerProfile {
    name
    __typename
  }
  children {
    id
    name
    class
    image
    title
    stage
    __typename
  }
  __typename
}

fragment AxiePart on AxiePart {
  id
  name
  class
  type
  specialGenes
  stage
  abilities {
    ...AxieCardAbility
    __typename
  }
  __typename
}

fragment AxieCardAbility on AxieCardAbility {
  id
  name
  attack
  defense
  energy
  description
  backgroundUrl
  effectIconUrl
  __typename
}

fragment AxieStats on AxieStats {
  hp
  speed
  skill
  morale
  __typename
}
`;

export const eth_slp_rate = `query NewEthExchangeRate {
	exchangeRate {
		slp {
		  usd
		  __typename
		}
	  	__typename
	}
}`;

export const public_profile = `
	query ($roninAddress: String!) {
		publicProfileWithRoninAddress(roninAddress: $roninAddress) {
			accountId
			name
			addresses {
				ethereum
				tomo
				loom
				ronin
				__typename
			}
		  	__typename
	  	}
	}
`;
