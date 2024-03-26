import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateContext } from "../context";
import { CountBox, Loader, CustomButton } from "../components";
import { thirdweb } from "../assets";
import toast from "react-hot-toast";
import { calculateTimeLeft } from "../utils";
import { getYouTubeVideoId } from "../utils";

const CampaignDetails = () => {
  const { state } = useLocation();
  const { doVote, address, getResult, endVote, getBallot,setEndVoteFlag,endVoteFlag } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [voteEnd, setVoteEnd] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(48 * 60 * 60); // 48 hours in seconds
  const [voterName, setVoterName] = useState(""); // State to store the voter's name
  const [voteOption, setVoteOption] = useState(""); // State to store the selected voting option
  const [ballot, setBallot] = useState(null);
  const [creationTime, setCreationTime] = useState();
  const [voteSuccessful, setVoteSuccessful] = useState(false); // State to track successful vote
const [videoId, setVideoId] = useState("")


const getSpecificBallot = async (id) => {

      
  try {
    setIsLoading(true);
    const res = await getBallot(id);

    const creationTimeBallot = parseInt(res?.creationTime.toString());
    const time = calculateTimeLeft(creationTimeBallot);
    const vidId = getYouTubeVideoId(res?.proposal);
    setVideoId(vidId)
    setCreationTime(time);
    setBallot(res);

    setIsLoading(false);
  } catch (error) {
    console.error("Error fetching ballot details:", error);
  }
};
  
  useEffect(() => {
    
      getSpecificBallot(state.ballotId);
    
  }, [state.ballotId,address]);

  const handleVote = async () => {
    try {
      setIsLoading(true);
      if (voteOption === "") {
        toast.error("Please select a vote option.");
        setIsLoading(false);
        return;
      }

      // Check if voter name is provided
      if (voterName === "") {
        toast.error("Please provide your name.");
        setIsLoading(false);
        return;
      }

      const res = await doVote(state.ballotId, voteOption, voterName);
      console.log(res);
      toast.success("Vote submitted successfully!");
      getSpecificBallot(state.ballotId)
      setIsLoading(false);
      setVoteSuccessful(true);
    
    } catch (error) {
      setIsLoading(false);

      console.error("Error submitting vote:", error);

      if (error.message.includes("execution reverted:")) {
        let errorMessage = error.message.split("execution reverted:")[1].trim();
        let currentIndex = 0;
        let nextIndex = errorMessage.indexOf(".");
        while (nextIndex !== -1) {
          const sentence = errorMessage.substring(currentIndex, nextIndex + 1);
          toast.error(sentence);
          currentIndex = nextIndex + 1;
          nextIndex = errorMessage.indexOf(".", currentIndex);
        }
      }

      // toast.error('Failed to submit vote. Please try again later.');
    }
  };

  const handleEndVote = async () => {
    try {
      setIsLoading(true);
      await endVote(state.ballotId);
      getSpecificBallot(state.ballotId)
      setIsLoading(false);
      toast.success("Ballot Ended Successfully.")
      setEndVoteFlag(!endVoteFlag)
    } catch (error) {
      setIsLoading(false);
      console.error("Error ending vote:", error);

      if (error.message.includes("execution reverted:")) {
        const errorMessage = error.message
          .split("execution reverted:")[1] // Get the part after "execution reverted:"
          .split(",")[0] // Take the part before the first comma
          .trim();
        console.log(errorMessage);
        toast.error(errorMessage);
      }
      // Handle error
    }
  };

  useEffect(() => {
    if (voteEnd) {
      getResult(state.ballotId);
    }
  }, [voteEnd]);

  return (
    <>
      <div className="bg-white  font-bold p-4">
        {isLoading && <Loader />}

        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <h4 className="font-semibold text-lg">Ballot Name:</h4>
              <p className="text-sm text-gray-600 truncate">
                {ballot?.officialName}
              </p>
            </div>
            <div className="ml-4 w-1/2">
              <h4 className="font-semibold text-lg">Proposal:</h4>
              <a
                href={ballot?.proposal}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline "
              >
                {ballot?.proposal.substring(0, 47)}...
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:flex-1 flex flex-col">
            <iframe
              width="100%"
              height="410px"
              src={`https://www.youtube.com/embed/${videoId} `}
            ></iframe>
          </div>

          <div className="md:w-[150px] flex flex-col flex-wrap gap-20">
            <CountBox title="Days Left" value="2" />
            {/* <CountBox title={`Raised of ${ballot?.target}`} value={ballot?.amountCollected} /> */}
            <CountBox
              title="Ballot State"
              value={`${ballot?.state == 1 ? "Running" : "Ended"}`}
            />
            <CountBox
              title="Total Votes"
              value={`${ballot?.totalVote.toString()}`}
            />
          </div>
        </div>

        <div className="mt-4 md:flex md:flex-row flex-col gap-4">
          <div className="md:flex-2 flex flex-col gap-4">
            <div>
              <h4 className="font-semibold text-lg uppercase">Creator</h4>
              <div className="mt-2 flex flex-row items-center gap-2">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 cursor-pointer">
                  <img
                    src={thirdweb}
                    alt="user"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-base">{ballot?.creator}</h4>
                  <p className="mt-1 text-sm ">Campaigns</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg uppercase">
                Ballot Ending Time:
              </h4>
              <div className=" text-md text-gray-500">
                {" "}
                {ballot && creationTime}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg uppercase">Total Votes</h4>
              <div className=" text-md text-gray-500">
                {ballot?.totalVote.toString()}
              </div>
            </div>
          </div>

          {ballot?.state == 1 && (
            <>
              <div className="md:flex-1 bg-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-lg uppercase text-center mb-4">
                  Vote
                </h4>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="voterName"
                      className="block text-md font-semibold  "
                    >
                      Enter Your Name
                    </label>
                    <input
                      id="voterName"
                      type="text"
                      className="w-full py-1 px-2 border border-gray-300 bg-white  font-medium text-lg placeholder-gray-400 rounded-lg focus:outline-none focus:border-blue-800"
                      placeholder="Your Name"
                      value={voterName}
                      onChange={(e) => setVoterName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-sm   font-bold">
                      Choose Your Vote
                    </label>
                    <div className="flex  space-x-4">
                      <button
                        className={`flex-1 py-2 px-2 border border-gray-300 bg-white  font-medium text-lg rounded-lg transition duration-300 ease-in-out focus:outline-none focus:border-blue-800 focus:bg-red-700 hover:bg-gray-300  ${
                          voteOption === "REAL" ? "bg-red-700 text-black" : "bg-red-700"
                        }`}
                        onClick={() => setVoteOption("REAL")}
                      >
                        REAL
                      </button>
                      <button
                        className={`flex-1 py-2 px-2 border border-gray-300 bg-white  font-medium text-lg rounded-lg transition duration-300 ease-in-out focus:outline-none  focus:border-blue-800 focus:bg-red-700 hover:bg-gray-300  ${
                          voteOption === "FAKE" ? "bg-red-700 text-black" : "bg-red-700"
                        }`}
                        onClick={() => setVoteOption("FAKE")}
                      >
                        FAKE
                      </button>
                    </div>
                  </div>
                  <div className="flex ">
                    <CustomButton
                      btnType="button"
                      title="Submit Vote"
                      styles="w-full bg-slate-800  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-2 px-2 rounded-4axl transition duration-300 ease-in-out"
                      handleClick={handleVote}
                      disabled={ballot?.state === "2"}
                    />
                  </div>

                  {address === ballot?.creator && (
                    <div className="flex mt-4">
                      <CustomButton
                        btnType="button"
                        title="End Vote"
                        styles="w-full bg-gray-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 py-2 px-2 rounded-lg transition duration-300 ease-in-out"
                        handleClick={handleEndVote}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            {/* Placeholder content for result */}

            {ballot?.state === 2 && (
              <p className="font-2xl text-center my-2">
                {parseInt(ballot?.totalVote.toString()) >= 1 ? (
                  <>
                    This Youtube video is identified to be{" "}
                    <b>{ballot?.result}</b>
                  </>
                ) : (
                  "Not enough votes to conclude results"
                )}
              </p>
            )}

            {/* <div className="h-3 bg-green-300 rounded-full mb-4">
                            <div
                                className="h-full bg-green-600 rounded-full"
                                style={{ width: "100%" }} // You can set the width dynamically based on the percentage
                            ></div>
                        </div> */}

            {/* Additional unique styling and elements */}
            <div className="py-4 px-6 bg-yellow-100 rounded-lg border border-yellow-300 mb-4">
              <p className="text-sm text-center text-yellow-800 font-semibold">
                {ballot?.state == 1
                  ? "Note: Result will be shown after voting is Completed "
                  : "Note: The voting results indicate whether the YouTube videos are identified as real or fake through the participants' votes. The result is determined based on the majority opinion."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignDetails;
