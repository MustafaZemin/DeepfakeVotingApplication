export const votingAbi=[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_ballotOfficialName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_proposal",
				"type": "string"
			}
		],
		"name": "createBallot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newCredibility",
				"type": "uint256"
			}
		],
		"name": "CredibilityPointsAdjusted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "CredibilityPointsAssigned",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ballotId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_choice",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_voterName",
				"type": "string"
			}
		],
		"name": "doVote",
		"outputs": [
			{
				"internalType": "bool",
				"name": "voted",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ballotId",
				"type": "uint256"
			}
		],
		"name": "endVote",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ballotId",
				"type": "uint256"
			}
		],
		"name": "getFinalResult",
		"outputs": [
			{
				"internalType": "string",
				"name": "finalResult",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ballotId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "voter",
				"type": "address"
			}
		],
		"name": "VoteDone",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ballotId",
				"type": "uint256"
			}
		],
		"name": "VoteEnded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ballotId",
				"type": "uint256"
			}
		],
		"name": "VoteStarted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ballots",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "officialName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proposal",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalVoter",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVote",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "result",
				"type": "string"
			},
			{
				"internalType": "enum Voting.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "creationTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllBallotDetails",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "ballotId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "creator",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "officialName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "proposal",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "totalVoter",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalVote",
						"type": "uint256"
					},
					{
						"internalType": "enum Voting.State",
						"name": "state",
						"type": "uint8"
					},
					{
						"internalType": "uint256",
						"name": "creationTime",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "result",
						"type": "string"
					}
				],
				"internalType": "struct Voting.BallotDetail[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ballotId",
				"type": "uint256"
			}
		],
		"name": "getBallotDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "creator",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "officialName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "proposal",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalVoter",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalVote",
				"type": "uint256"
			},
			{
				"internalType": "enum Voting.State",
				"name": "state",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "creationTime",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "result",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "voteEnd",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_voterAddress",
				"type": "address"
			}
		],
		"name": "getCredibilityPoints",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLeaderboard",
		"outputs": [
			{
				"internalType": "address[10]",
				"name": "",
				"type": "address[10]"
			},
			{
				"internalType": "uint256[10]",
				"name": "",
				"type": "uint256[10]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_ballotId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_choice",
				"type": "string"
			}
		],
		"name": "getVote",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "voteCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalBallots",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]