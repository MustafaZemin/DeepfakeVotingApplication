
// SPDX-License-Identifier: Unlicensed

pragma solidity >=0.4.16 <0.9.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Voting {
    using SafeMath for uint256;
    struct Vote {
        address voterAddress;
        string choice;
    }
    struct BallotDetail {
        address creator;
        string officialName;
        string proposal;
        uint256 totalVoter;
        uint256 totalVote;
        State state;
        uint256 creationTime;
        string result; 
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

    // Create Ballot
    function createBallot(string memory _ballotOfficialName, string memory _proposal)
        public
    {
        uint256 ballotId = totalBallots++;
        Ballot storage newBallot = ballots[ballotId];
        newBallot.creator = msg.sender;
        newBallot.officialName = _ballotOfficialName;
        newBallot.proposal = _proposal;
        newBallot.state = State.Voting;
        newBallot.creationTime = block.timestamp;
    }

    modifier onlyBallotOfficial(uint256 _ballotId) {
        require(msg.sender == ballots[_ballotId].creator, "Only Owner Can perform this action");
        _;
    }

    modifier inBallotState(uint256 _ballotId, State _state) {
        require(ballots[_ballotId].state == _state);
        _;
    }

    function doVote(uint256 _ballotId, string memory _choice, string memory _voterName)
        public
        inBallotState(_ballotId, State.Voting)
        returns (bool voted)
    {
        Ballot storage currentBallot = ballots[_ballotId];

        require(block.timestamp < currentBallot.creationTime + VOTING_DURATION, "Voting period has ended.");

        Voter storage voter = currentBallot.voterRegister[msg.sender];

        require(!voter.voted, "You have already voted in this ballot.");

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

        if (!voter.credibilityAssigned) {
            voter.credibilityPoints = DECIMAL_FACTOR;
            voter.credibilityAssigned = true;
            emit CredibilityPointsAssigned(msg.sender, voter.credibilityPoints);
        }

        emit VoteDone(_ballotId, msg.sender);
        return true; // Return true when the vote  casted
    }

    // End Vote
    function endVote(uint256 _ballotId)
        public
        onlyBallotOfficial(_ballotId)
        inBallotState(_ballotId, State.Voting)
    {
        Ballot storage currentBallot = ballots[_ballotId];

        // ensure  1 day have passed since ballot creation
        require(block.timestamp >= currentBallot.creationTime + 1 days, "Cannot end ballot before 24 hours");

        // if voting  ended
        currentBallot.state = State.Ended;
        calculateResult(_ballotId);

        emit VoteEnded(_ballotId);
    }

    // Get Votes
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
                keccak256(bytes(currentBallot.votes[i].choice)) == keccak256(bytes(_choice))
            ) {
                count++;
            }
        }

        return count;
    }

    //  Credibility of voter
    function getCredibilityPoints(address _voterAddress)
        public
        view
        returns (uint256)
    {
        uint256 credibilityPoints;

        for (uint256 i = 0; i < totalBallots; i++) {
            Ballot storage currentBallot = ballots[i];
            Voter storage voter = currentBallot.voterRegister[_voterAddress];
            credibilityPoints += voter.credibilityPoints;
        }

        return credibilityPoints;
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
             bool   voteEnd

             // Include result field
        )
    {

        
        Ballot storage currentBallot = ballots[_ballotId];
            bool votingPeriodEnded = block.timestamp >= currentBallot.creationTime + VOTING_DURATION;

        
        return (
            currentBallot.creator,
            currentBallot.officialName,
            currentBallot.proposal,
            currentBallot.totalVoter,
            currentBallot.totalVote,
            currentBallot.state,
            currentBallot.creationTime,
            currentBallot.result, // Return result
            votingPeriodEnded 
        );
    }

    function getAllBallotDetails() public view returns (BallotDetail[] memory) {
        BallotDetail[] memory allBallotDetails = new BallotDetail[](totalBallots);

        for (uint256 i = 0; i < totalBallots; i++) {
            (
                address creator,
                string memory officialName,
                string memory proposal,
                uint256 totalVoter,
                uint256 totalVote,
                State state,
                uint256 creationTime,
                string memory result ,
                
            ) = getBallotDetails(i);

            allBallotDetails[i] = BallotDetail({
                creator: creator,
                officialName: officialName,
                proposal: proposal,
                totalVoter: totalVoter,
                totalVote: totalVote,
                state: state,
                creationTime: creationTime,
                result: result // Assign result
            });
        }

        return allBallotDetails;
    }

    function calculateResult(uint256 _ballotId) internal {
        Ballot storage currentBallot = ballots[_ballotId];
        uint256 totalRealVoteCount;
        uint256 totalFakeVoteCount;

        for (uint256 i = 0; i < currentBallot.totalVote; i++) {
            Vote storage v = currentBallot.votes[i];
            Voter storage voter = currentBallot.voterRegister[v.voterAddress];
            uint256 voteWeight = voter.credibilityPoints; // Get the credibility points of the voter

            if (keccak256(bytes(v.choice)) == keccak256("REAL")) {
                totalRealVoteCount += voteWeight;
            } else if (keccak256(bytes(v.choice)) == keccak256("FAKE")) {
                totalFakeVoteCount += voteWeight;
            }
        }

        if (totalRealVoteCount > totalFakeVoteCount) {
            currentBallot.result = "REAL";
        } else {
            currentBallot.result = "FAKE";
        }
        for (uint256 i = 0; i < currentBallot.totalVote; i++) {
            Vote storage v = currentBallot.votes[i];
            Voter storage voter = currentBallot.voterRegister[v.voterAddress];
            uint256 voteWeight = voter.credibilityPoints;
            if (keccak256(bytes(v.choice)) == keccak256(bytes(currentBallot.result))) {
                voter.credibilityPoints = voteWeight.mul(1100).div(DECIMAL_FACTOR);
            } else {
                voter.credibilityPoints = voteWeight.mul(900).div(DECIMAL_FACTOR);
            }
        }
    }

    function getResult(uint256 _ballotId)
        public
        view
        inBallotState(_ballotId, State.Ended)
        returns (string memory)
    {
        return ballots[_ballotId].result;
    }
}
