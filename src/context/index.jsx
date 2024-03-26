import React, { useContext, createContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { votingAbi } from "../constants/ABI";
import { useNavigate } from 'react-router-dom';
import { getVideoInfo } from "youtube-video-exists";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const [address, setAddress] = useState("");
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [endVoteFlag, setEndVoteFlag] = useState(true)
    const history = useNavigate();
    // 0x67B0A41f06D28c699E4b589Fe427A5e17b90472b
    // 0x8c835497487F9e08cA59dd5B3799B428c5A0Ba3B
    useEffect(() => {
        async function connectAccount() {
            try {
                if (window.ethereum) {
                    const provider = new ethers.providers.Web3Provider(
                        window.ethereum
                    );
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(
                        "0x406165E1da05A9a4Eb5A6d44C667430b3efEC3Ed",
                        votingAbi,
                        signer
                    ); // Use your contract address here
                    console.log(contract);
                    window.ethereum.on("accountsChanged", (newAccounts) => {
                        console.log(newAccounts[0]);
                        setAddress(newAccounts[0]);
                    });

                    // Listen for network change events
                    window.ethereum.on("chainChanged", () => {
                        window.location.reload(); // Reload the page if the network changes
                    });

                    setAddress(await provider.getSigner().getAddress());
                    setProvider(provider);
                    setContract(contract);
                } else {
                    console.log(
                        "MetaMask not available. Please install MetaMask to interact with the application."
                    );
                }
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        }

        connectAccount();
    }, []);

    const createBallot = async (officialName, proposal) => {
        
            const trx = await contract.createBallot(officialName, proposal);
            const receipt = await trx.wait();
            console.log("Transaction confirmed:", receipt);
            return receipt;
        
    };

    const doVote = async (ballotId, choice, voterName) => {
        const trx = await contract.doVote(ballotId, choice, voterName);
        const receipt = await trx.wait();
        return receipt;
    };


    const endVote = async (ballotId) => {
        
            const trx = await contract.endVote(ballotId);
            const receipt = await trx.wait();
            return receipt;
        
    };

    const getBallot = async (id) => {
        try {
            const ballot = await contract.getBallotDetails(id);
            return ballot;
        } catch (error) {
            console.log(error);
        }
    };
    const getAllBallotDetails = async () => {
        try {
            const ballots = await contract.getAllBallotDetails();
            // Spread the array to create a new mutable array
            const mutableBallots = [...ballots];
            // Sort the ballots based on their state
            const sortedBallots = mutableBallots.sort((a, b) => parseInt(a.state.toString()) - parseInt(b.state.toString()));
            // Separate running and ended ballots
            const runningBallots = sortedBallots.filter(ballot => parseInt(ballot.state.toString()) === 1);
            const endedBallots = sortedBallots.filter(ballot => parseInt(ballot.state.toString()) === 2);
            // Concatenate the two filtered arrays
            const allBallots = [...runningBallots, ...endedBallots];
            return allBallots;
        } catch (error) {
            console.error("Error fetching ballot details:", error);
            return null;
        }
    };
    
    const getLeaderboard = async () => {
        try {
            const leaderboardData = await contract.getLeaderboard();
            const addresses = leaderboardData[0];
            const scores = leaderboardData[1];
            // Return an array of objects containing addresses and scores
            return addresses.map((address, index) => ({
                address,
                score: scores[index]
            }));
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return null;
        }
    };

    const getCredibilityPoints = async (voterAddress) => {
        try {
            return await contract.getCredibilityPoints(voterAddress);
        } catch (error) {
            console.error("Error fetching credibility points:", error);
            return null;
        }
    };

    const getResult = async (ballotId) => {
        try {
            return await contract.getResult(ballotId);
        } catch (error) {
            console.error("Error fetching result:", error);
            return null;
        }
    };

    const getVote = async (ballotId, choice) => {
        try {
            return await contract.getVote(ballotId, choice);
        } catch (error) {
            console.error("Error fetching vote:", error);
            return null;
        }
    };

    const getUserBallots = async (address) => {
        try {
            const allBallots = await getAllBallotDetails();
            console.log("balots",allBallots);
            const userBallots = [];
            for (let i = 0; i < allBallots.length; i++) {
                const ballot = allBallots[i];
                if (ballot.creator === address) {
                    userBallots.push(ballot);
                }
            }
            console.log(userBallots);
            return userBallots;
        } catch (error) {
            console.error("Error fetching user's specific ballot:", error);
            return null; // Return null in case of an error
        }
    };

    const totalBallots = async () => {
        try {
            return await contract.totalBallots();
        } catch (error) {
            console.error("Error fetching total ballots:", error);
            return null;
        }
    };

    return (
        <StateContext.Provider
            value={{
                address,
                contract,
                connect: async () => {
                    try {
                        // Specify the Sepolia testnet network ID and chain ID
                        const sepoliaNetworkId = "11155111"; // Replace '0x123456' with the actual network ID of Sepolia testnet
                        const sepoliaChainId = "0xaa36a7"; // Replace '0xabcdef' with the actual chain ID of Sepolia testnet

                        // Check if MetaMask is installed and connected
                        if (
                            !window.ethereum ||
                            !window.ethereum.isConnected()
                        ) {
                            console.error(
                                "MetaMask is not installed or not connected."
                            );
                            return;
                        }

                        // Check if MetaMask is already connected to the correct network
                        const networkId = await window.ethereum.request({
                            method: "net_version",
                        });
                        if (networkId === sepoliaNetworkId) {
                            console.log(
                                "Already connected to Sepolia testnet."
                            );
                        } else {
                            // Prompt the user to switch to Sepolia testnet
                            try {
                                await window.ethereum.request({
                                    method: "wallet_switchEthereumChain",
                                    params: [{ chainId: sepoliaChainId }],
                                });
                                console.log("Switched to Sepolia testnet.");
                            } catch (error) {
                                console.error(
                                    "Failed to switch network:",
                                    error
                                );
                                return;
                            }
                        }

                        // Request accounts from MetaMask
                        await window.ethereum.request({
                            method: "eth_requestAccounts",
                        });
                        history(0);

                        console.log("Connected to Sepolia testnet.");
                    } catch (error) {
                        console.error("Error connecting to MetaMask:", error);
                    }
                },
                createBallot,
                doVote,
                endVote,
                getAllBallotDetails,
                getCredibilityPoints,
                getResult,
                setEndVoteFlag,
                getLeaderboard,
                endVoteFlag,
                getVote,
                totalBallots,
                getBallot,
                getUserBallots,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
