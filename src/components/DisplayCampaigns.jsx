import React from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign, index) => {
    navigate(`/ballot-details/${campaign?.officialName}`, { state: { ...campaign, ballotId: index } });
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-gray-600 text-left">{title} ({campaigns?.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns?.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading && campaigns?.length > 0 && campaigns?.map((campaign, index) => (
          <FundCard 
            key={index}
            {...campaign}
            handleClick={() => handleNavigate(campaign, index)}
          />
        ))}
      </div>
    </div>
  )
}

export default DisplayCampaigns;
