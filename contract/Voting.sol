// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.4.16 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Voting {
    using SafeMath for uint256;
    struct Vote {
        address voterAddress;
        string choice;
    }
   

    struct Voter {
        string voterName;
        bool voted;
        bool credibilityAssigned;
        uint256 credibilityPoints;
    }
    struct Ballot {
        address creator;
        string officialName;
        string proposal;
        mapping(address => Voter) voterRegister;
        uint256 totalVoter;
        uint256 totalVote;
        mapping(uint256 => Vote) votes;
        string result;
        State state;
        uint256 creationTime;
    }

    enum State {
        Created,
        Voting,
        Ended
    }

    mapping(uint256 => Ballot) public ballots;
    uint256 public totalBallots;
    uint256 constant DECIMAL_FACTOR = 1000;

    event VoteStarted(uint256 ballotId);
    event VoteEnded(uint256 ballotId);
    event VoteDone(uint256 ballotId, address voter);
    event CredibilityPointsAssigned(address voter, uint256 points);
    uint256 constant VOTING_DURATION = 2 days;
    event CredibilityPointsAdjusted(address voter, uint256 newCredibility);

    function getVote(uint256 _ballotId, string memory _choice)
        public
        view
        inBallotState(_ballotId, State.Ended)
        returns (uint256 voteCount)
    {
        Ballot storage currentBallot = ballots[_ballotId];
        uint256 count = 0;

        for (uint256 i = 0; i < currentBallot.totalVote; i++) {
            if (
                keccak256(bytes(currentBallot.votes[i].choice)) ==
                keccak256(bytes(_choice))
            ) {
                count++;
            }
        }

        return count;
    }

    // Create Ballot
    function createBallot(
        string memory _ballotOfficialName,
        string memory _proposal
    ) public {
        uint256 ballotId = totalBallots++;
        Ballot storage newBallot = ballots[ballotId];
        newBallot.creator = msg.sender;
        newBallot.officialName = _ballotOfficialName;
        newBallot.proposal = _proposal;
        newBallot.state = State.Voting;
        newBallot.creationTime = block.timestamp;
    }

    modifier onlyBallotOfficial(uint256 _ballotId) {
        require(
            msg.sender == ballots[_ballotId].creator,
            "Only Owner Can perform this action"
        );
        _;
    }

    modifier inBallotState(uint256 _ballotId, State _state) {
        require(
            ballots[_ballotId].state == _state,
            "ballot has not ended yet "
        );
        _;
    }

    // End Vote
    function endVote(uint256 _ballotId)
        public
        onlyBallotOfficial(_ballotId)
        inBallotState(_ballotId, State.Voting)
    {
        Ballot storage currentBallot = ballots[_ballotId];

        // ensure  1 day have passed since ballot creation
        require(
            block.timestamp >= currentBallot.creationTime +1 days,
            "Cannot end ballot before 24 hours"
        );
        string memory result;
        currentBallot.state = State.Ended;
        result = calculateResult(_ballotId);
        currentBallot.result = result;

        emit VoteEnded(_ballotId);
    }




function getLeaderboard() public view returns (address[10] memory, uint256[10] memory) {
    address[10] memory topAddresses;
    uint256[10] memory topCredibilityPoints;
    address[10] memory processedAddresses;
    uint256 addedAddresses = 0;

    // Initialize the top credibility points array with 0s
    for (uint256 i = 0; i < 10; i++) {
        topCredibilityPoints[i] = 0;
    }

    // Iterate through all ballots and their votes to find the top 10 unique voters
    for (uint256 i = 0; i < totalBallots; i++) {
        Ballot storage currentBallot = ballots[i];
        for (uint256 j = 0; j < currentBallot.totalVote; j++) {
            Vote storage v = currentBallot.votes[j];
            bool alreadyProcessed = false;
            // Check if the voter address is already considered
            for (uint256 k = 0; k < addedAddresses; k++) {
                if (processedAddresses[k] == v.voterAddress) {
                    alreadyProcessed = true;
                    break;
                }
            }
            if (!alreadyProcessed) {
                uint256 credibilityPoints = getCredibilityPoints(v.voterAddress);
                // Update the top addresses and credibility points array if the voter has more credibility points
                for (uint256 k = 0; k < 10; k++) {
                    if (credibilityPoints > topCredibilityPoints[k]) {
                        // Shift elements to the right to make space for the new top entry
                        for (uint256 l = 9; l > k; l--) {
                            topCredibilityPoints[l] = topCredibilityPoints[l - 1];
                            topAddresses[l] = topAddresses[l - 1];
                        }
                        // Add the new entry to the leaderboard
                        topCredibilityPoints[k] = credibilityPoints;
                        topAddresses[k] = v.voterAddress;
                        processedAddresses[addedAddresses] = v.voterAddress;
                        addedAddresses++;
                        if (addedAddresses == 10) {
                            return (topAddresses, topCredibilityPoints);
                        }
                        break; // Break the loop after updating the top entries
                    }
                }
            }
        }
    }

    return (topAddresses, topCredibilityPoints);
}







    // Get Votes

    function doVote(
        uint256 _ballotId,
        string memory _choice,
        string memory _voterName
    ) public inBallotState(_ballotId, State.Voting) returns (bool voted) {
        Ballot storage currentBallot = ballots[_ballotId];

        require(
            block.timestamp < currentBallot.creationTime + VOTING_DURATION,
            "Voting period has ended."
        );

        Voter storage voter = currentBallot.voterRegister[msg.sender];

        require(!voter.voted, "You have already voted in this ballot.");

        // Check if the voter's name is registered for this ballot
        if (bytes(voter.voterName).length == 0) {
            voter.voterName = _voterName;
            voter.credibilityAssigned = false;
            currentBallot.totalVoter++;
        }

        voter.voted = true;
        Vote storage v = currentBallot.votes[currentBallot.totalVote];
        v.voterAddress = msg.sender;
        v.choice = _choice;
        currentBallot.totalVote++;

        emit VoteDone(_ballotId, msg.sender);
        return true;
    }

    function getCredibilityPoints(address _voterAddress)
        public
        view
        returns (uint256)
    {
        uint256 totalCredibility = 1;
        uint256 votecount = 0;
        string memory result;
        // Iterate through all ended ballots
        for (uint256 i = 0; i < totalBallots; i++) {
            Ballot storage currentBallot = ballots[i];
            if (
                currentBallot.state == State.Ended ||
                block.timestamp >= currentBallot.creationTime + VOTING_DURATION
            ) {
                if (
                    block.timestamp >=
                    currentBallot.creationTime + VOTING_DURATION
                ) {
                    result = calculateResult(i);
                } else {
                    result = currentBallot.result;
                }

                // Determine multipliers based on the final result of the ballot
                uint256 realMultiplier;
                uint256 fakeMultiplier;
                if (keccak256(bytes(result)) == keccak256("REAL")) {
                    realMultiplier = 1100;
                    fakeMultiplier = 900;
                } else {
                    realMultiplier = 900;
                    fakeMultiplier = 1100;
                }

                // Adjust credibility points based on the multipliers and voter's choice
                for (uint256 j = 0; j < currentBallot.totalVote; j++) {
                    Vote storage v = currentBallot.votes[j];
                    if (v.voterAddress == _voterAddress) {
                        votecount++;
                        Voter storage voter = currentBallot.voterRegister[
                            _voterAddress
                        ];
                        uint256 multiplier;
                        if (keccak256(bytes(v.choice)) == keccak256("REAL")) {
                            multiplier = realMultiplier;
                        } else {
                            multiplier = fakeMultiplier;
                        }

                        // Adjust credibility points
                        uint256 adjustedCredibility;
                        if (voter.credibilityPoints == 0) {
                            adjustedCredibility = multiplier
                                .mul(DECIMAL_FACTOR)
                                .div(DECIMAL_FACTOR);
                        } else {
                            adjustedCredibility = voter
                                .credibilityPoints
                                .mul(multiplier)
                                .div(DECIMAL_FACTOR);
                        }
                        totalCredibility *= adjustedCredibility;
                    }
                }
            }
        }

        if (votecount >= 1) {
            for (uint256 i = 0; i < votecount - 1; i++) {
                totalCredibility /= 1000;
            }
        }

        return totalCredibility;
    }

    function getBallotDetails(uint256 _ballotId)
        public
        view
        returns (
            address creator,
            string memory officialName,
            string memory proposal,
            uint256 totalVoter,
            uint256 totalVote,
            State state,
            uint256 creationTime,
            string memory result,
            bool voteEnd // Include voteEnd field
        )
    {
        Ballot storage currentBallot = ballots[_ballotId];
        bool votingPeriodEnded = block.timestamp >=
            currentBallot.creationTime + VOTING_DURATION;

        if (votingPeriodEnded) {
            state = State.Ended;
            if (currentBallot.totalVote == 0) {
                result = "";
            } else {
                result = calculateResult(_ballotId);
            }
        } else {
            state = currentBallot.state;
            result = currentBallot.result;
        }

        return (
            currentBallot.creator,
            currentBallot.officialName,
            currentBallot.proposal,
            currentBallot.totalVoter,
            currentBallot.totalVote,
            state, // Use the updated state
            currentBallot.creationTime,
            result, // Use the updated result
            votingPeriodEnded
        );
    }

 function getAllBallotDetails() public view returns (BallotDetail[] memory) {
        BallotDetail[] memory allBallotDetails = new BallotDetail[](
            totalBallots
        );

        for (uint256 i = 0; i < totalBallots; i++) {
            (
                address creator,
                string memory officialName,
                string memory proposal,
                uint256 totalVoter,
                uint256 totalVote,
                State state,
                uint256 creationTime,
                string memory result,
            ) = getBallotDetails(i);

            allBallotDetails[i] = BallotDetail({
                ballotId: i, // Add ballotId
                creator: creator,
                officialName: officialName,
                proposal: proposal,
                totalVoter: totalVoter,
                totalVote: totalVote,
                state: state,
                creationTime: creationTime,
                result: result
            });
        }

        return allBallotDetails;
    }



struct BallotDetail {
    uint256 ballotId; // Added ballotId field
    address creator;
    string officialName;
    string proposal;
    uint256 totalVoter;
    uint256 totalVote;
    State state;
    uint256 creationTime;
    string result;
}


    function calculateResult(uint256 _ballotId)
        internal
        view
        returns (string memory)
    {
        Ballot storage currentBallot = ballots[_ballotId];

        uint256 totalRealVoteCount;
        uint256 totalFakeVoteCount;

        for (uint256 i = 0; i < currentBallot.totalVote; i++) {
            Vote storage v = currentBallot.votes[i];
            Voter storage voter = currentBallot.voterRegister[v.voterAddress];
            uint256 voteWeight = voter.credibilityPoints == 0
                ? 1
                : voter.credibilityPoints;

            if (keccak256(bytes(v.choice)) == keccak256("REAL")) {
                totalRealVoteCount += voteWeight;
            } else if (keccak256(bytes(v.choice)) == keccak256("FAKE")) {
                totalFakeVoteCount += voteWeight;
            }
            
        }
        if (totalRealVoteCount > totalFakeVoteCount) {
            return "REAL";
        } else if(totalRealVoteCount < totalFakeVoteCount) {
            return "FAKE";
        }
          else {
        return "FAKE"; // Default return statement
    }
    }

    function getFinalResult(uint256 _ballotId)
        public
        inBallotState(_ballotId, State.Ended)
        returns (string memory finalResult)
    {
        string memory result = calculateResult(_ballotId);

        // Update the state after obtaining the result
        if (keccak256(bytes(result)) == keccak256("REAL")) {
            adjustCredibilityPoints(_ballotId, "REAL");
        } else {
            adjustCredibilityPoints(_ballotId, "FAKE");
        }
        ballots[_ballotId].state = State.Ended;

        return result;
    }
function adjustCredibilityPoints(uint256 _ballotId, string memory result) internal {
    Ballot storage currentBallot = ballots[_ballotId];
    uint256 realMultiplier;
    uint256 fakeMultiplier;

    if (keccak256(bytes(result)) == keccak256("REAL")) {
        realMultiplier = 1100;
        fakeMultiplier = 900;
    } else {
        realMultiplier = 900;
        fakeMultiplier = 1100;
    }

    for (uint256 i = 0; i < currentBallot.totalVote; i++) {
        Vote storage v = currentBallot.votes[i];
        Voter storage voter = currentBallot.voterRegister[v.voterAddress];

        uint256 multiplier = keccak256(bytes(v.choice)) == keccak256("REAL")
            ? realMultiplier
            : fakeMultiplier;

        // Adjust credibility points based on the multipliers and voter's choice
        uint256 adjustedCredibility;
        if (voter.credibilityPoints == 0) {
            adjustedCredibility = multiplier.mul(DECIMAL_FACTOR).div(DECIMAL_FACTOR);
        } else {
            adjustedCredibility = voter.credibilityPoints.mul(multiplier).div(DECIMAL_FACTOR);
        }
        
        voter.credibilityPoints = adjustedCredibility;
        emit CredibilityPointsAdjusted(v.voterAddress, adjustedCredibility);
    }
}

}
