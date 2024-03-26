import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { CustomButton, FormField, Loader } from '../components';
import toast from 'react-hot-toast';
import { ValidateYotubeVideo } from '../utils';


const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createBallot } = useStateContext();
  const [form, setForm] = useState({
    officialName: '',
    proposal: '',
  });

  const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.proposal.match(youtubeUrlRegex)) {
      toast.error('Please enter a valid YouTube video link.');
      return;
    }
    const validate = await ValidateYotubeVideo(form.proposal)
    if(!validate){
      toast.error("This Youtube video does not exit. Please Enter a correct link")
      return;
    }

    setIsLoading(true); 
    try {
      await createBallot(form.officialName, form.proposal);

      toast.success('Ballot Created Successfully');
      navigate('/');
    } catch (error) {
      console.error('Error creating ballot:', error);
      toast.error('Failed to create ballot.');

    }
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#58db9c] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-gray-800">
          Create a Ballot
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <FormField
          labelName="Official Name *"
          placeholder="Enter official name"
          inputType="text"
          value={form.officialName}
          handleChange={(e) => handleFormFieldChange('officialName', e)}
        />

        <FormField
          labelName="Proposal *"
          placeholder="Enter YouTube video link"
          isTextArea={false}
          value={form.proposal}
          handleChange={(e) => handleFormFieldChange('proposal', e)}
        />
        <div className="flex items-center gap-2 text-gray-600">
          <span>Valid URL example:</span>
          <span>https://www.youtube.com/watch?v=VIDEO_ID</span>
        </div>

        <div className="flex justify-center items-center mt-[40px]">
          <CustomButton btnType="submit" title="Submit new ballot" styles="bg-[#1dc071] text-white" />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
