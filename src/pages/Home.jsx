import React, { useState, useEffect } from 'react'
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { address, contract, getAllBallotDetails } = useStateContext();

  const fetchBallots = async () => {
    setIsLoading(true);
    const data = await getAllBallotDetails();
    console.log(data);
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) 
    {fetchBallots();}

    
  }, [address, contract]);

  return (
    <DisplayCampaigns 
      title="All Ballots"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home




// [
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "asasa",
//       "asassaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "asasaa",
//       "aaaaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "asasaa",
//       "aaaaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "aa",
//       "aa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "aa",
//       "aaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "aa",
//       "aaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ],
//   [
//       "0x45ea70d59043b15d8B182f1A4eB6bDA260DD5cee",
//       "aaa",
//       "aaa",
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       {
//           "type": "BigNumber",
//           "hex": "0x00"
//       },
//       1
//   ]
// ]