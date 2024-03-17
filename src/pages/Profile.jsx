import React, { useState, useEffect } from 'react'

import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getUserBallots } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserBallots(address);
    
    console.log(data);
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="Your Ballots"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile