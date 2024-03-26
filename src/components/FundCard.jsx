import React from "react";
import { thirdweb } from "../assets"; // Assuming thirdweb is the default user avatar
import { daysLeft } from "../utils";
import { getYouTubeVideoId } from "../utils";

const FundCard = ({
  creator,
  officialName,
  proposal,
  state,
  totalVote,
  totalVoter,
  handleClick,
  timestamp,
}) => {
  const totalVoterString = totalVoter?.toString();

  const id = getYouTubeVideoId(proposal);

  // Determine the voting state text based on the state prop
  let votingStateText;
  if (state === 1) {
    votingStateText = "Running";
  } else if (state === 2) {
    votingStateText = "Ended";
  } else {
    votingStateText = "Unknown";
  }

  return (
    <>
      <div
        className="sm:w-[288px] w-full rounded-[15px] bg-[#e5eaee] shadow-md cursor-pointer border border-gray-200"
        onClick={handleClick}
      >
        <img
          src={`http://img.youtube.com/vi/${id}/0.jpg`}
          alt="fund"
          className="w-full h-[158px] object-cover rounded-t-[15px]"
        />

        <div className="">
            <div className="flex flex-col p-4 pb-0">
          <div className="block">
            <h3 className="font-epilogue font-semibold text-lg text-gray-800 leading-[26px] truncate mb-2">
              {officialName}
            </h3>
            <p className="font-epilogue font-normal text-gray-600 leading-[18px] truncate">
              {proposal}
            </p>
          </div>

          <div className="flex justify-between mt-3">
            <div className="flex flex-col">
              <h4 className="font-epilogue font-semibold text-md text-blue-500 leading-[22px]">
                {totalVote.toString()}{" "}
                {/* Assuming totalVote is a BigNumber object */}
              </h4>
              <p className="font-epilogue font-normal text-sm leading-[18px] text-gray-600">
                Total Votes
              </p>
            </div>
            <div className="flex flex-col">
              <h4 className="font-epilogue font-semibold text-md text-blue-500 leading-[22px]">
                {totalVoterString}
              </h4>
              <p className="font-epilogue font-normal text-sm leading-[18px] text-gray-600">
                Total Voters
              </p>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <p className="flex-1 font-epilogue font-normal text-sm text-gray-600 truncate">
              by <span className="text-gray-700">{creator}</span>
            </p>
          </div>

          
        </div>
        <p className={`mt-2 font-epilogue text-center py-1 rounded-b-xl text-gray-200 font-semibold text-sm ${state==2?"bg-red-700":"bg-green-700"}`}>
            Ballot State: {votingStateText}
          </p>
        </div>
      </div>
    </>
  );
};

export default FundCard;
