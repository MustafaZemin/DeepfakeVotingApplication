import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const { connect, address, getCredibilityPoints,endVoteFlag } = useStateContext();
  const [credibilityPoints, setCredibilityPoints] = useState(null);

  useEffect(() => {
    const fetchCredibilityPoints = async () => {
      try {
        if (address) {
          const points = await getCredibilityPoints(address);
          
          if(parseFloat(points.toString())===1){
            setCredibilityPoints(1)
          }
          else{         
             setCredibilityPoints(parseFloat(points.toString())/1000)
        }
        console.log(points);
        }
      } catch (error) {
        console.error('Error fetching credibility points:', error);
      }
    };

    fetchCredibilityPoints();
  }, [address,endVoteFlag]); 

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between  mb-[32px] gap-6">
      <h1 className='text-3xl font-bold text-gray-800'>DeepFake Detection Dapp</h1>

      {/* Display credibility points */}
      <div className="flex justify-center bg-slate-200 px-10 rounded-full items-center text-black font-semibold">
  {credibilityPoints !== null && (
    
   <div className='flex'>
    <img className='h-8 w-8' src="https://static.thenounproject.com/png/969400-200.png"/> <span className='text-black'>Your Credibility Points: {credibilityPoints}</span></div>
  )}
  {/* <div>
  <span className="text-xs ml-1">Trust Score</span>
  </div> */}
</div>

     
      
      <div className="sm:flex hidden flex-row justify-end gap-4">
        <div className="flex mx-4">
          <CustomButton 
            btnType="button"
            title={address ? 'Create a campaign' : 'Connect'}
            styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
            handleClick={() => {
              if(address) navigate('create-campaign')
              else connect();
            }}
          />
        </div>

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-white flex justify-center items-center cursor-pointer">
            <img src="https://static.vecteezy.com/system/resources/thumbnails/007/461/014/small/profile-gradient-logo-design-template-icon-vector.jpg" alt="user" className="w-[60%] h-[60%] object-full" />
          </div>
        </Link>
  
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
          <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
        </div>
     

        <img 
          src={menu}
          alt="menu"
          className="w-[34px] h-[34px] object-contain cursor-pointer"
          onClick={() => setToggleDrawer((prev) => !prev)}
        />

        <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
          <ul className="mb-4">
            {navlinks.map((link) => (
              <li
                key={link.name}
                className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                onClick={() => {
                  setIsActive(link.name);
                  setToggleDrawer(false);
                  navigate(link.link);
                }}
              >
                <img 
                  src={link.imgUrl}
                  alt={link.name}
                  className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                />
                <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                  {link.name}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex mx-4">
            <CustomButton 
              btnType="button"
              title={address ? 'Create a campaign' : 'Connect'}
              styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
              handleClick={() => {
                if(address) navigate('create-campaign')
                else connect();
              }}
            />
          </div>
          
          
        </div>
      </div>
    </div>
  )
}

export default Navbar;
