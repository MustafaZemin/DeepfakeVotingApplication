import React, { useState, useEffect } from 'react';
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, getUserBallots, getAllBallotDetails,contract } = useStateContext();

  useEffect(() => {
    if (address !=undefined) {
        const fetchOwnerBallots = async () => {
            setIsLoading(true);
            try {
                const data = await getUserBallots(address);
                console.log(data);
                setCampaigns(data);
            } catch (error) {
                console.error("Error fetching user's specific ballot:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOwnerBallots();
    }
}, [address, contract]);


  return (
    <DisplayCampaigns 
      title="Your Ballots"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Profile;
