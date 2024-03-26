import { getVideoInfo } from "youtube-video-exists";

export const daysLeft = (deadline) => {
  const millisecondsPerDay = 1000 * 3600 * 24;
  const remainingDays = deadline / millisecondsPerDay;
  console.log(remainingDays.toFixed(0));

  return remainingDays.toFixed(0);
};

export const ValidateYotubeVideo = async (url) => {
  const id =getYouTubeVideoId(url)
  const a = await getVideoInfo(id);
  return a.existing
  
};

export const calculateTimeLeft = (creationTime) => {
  const creationTimeMs = creationTime * 1000;

  const currentTimeMs = Date.now();

  const timeDifferenceMs = currentTimeMs - creationTimeMs;

  const remainingTimeMs = 2 * 24 * 60 * 60 * 1000 - timeDifferenceMs;

  const finalTimestamp = currentTimeMs + remainingTimeMs;

  const finalDate = new Date(finalTimestamp);

  const dayOfWeek = finalDate.toLocaleString("en-US", { weekday: "short" });
  const month = finalDate.toLocaleString("en-US", { month: "long" });
  const dayOfMonth = finalDate.getDate();
  const year = finalDate.getFullYear();
  const time = finalDate.toLocaleTimeString("en-US", { hour12: false });
  const timezone = finalDate.toString().match(/\(([^)]+)\)/)[1];
  // January 01, 2023 00:00:00 GMT+03:00
  // March 17, 2024 01:09:48 GMT+05:00 (Pakistan Standard Time)
  // March 17, 2024 01:50:36 GMT+0500 (Pakistan Standard Time)
  // Construct the final date string
  const finalDateString = `${month} ${dayOfMonth}, ${year} ${time}`;
  return finalDateString;
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export function getYouTubeVideoId(url) {
  // Extract the video ID from the URL
  const match = url?.match(/(?:\?|&)v=([^&#]+)/);

  // If there is a match, return the video ID, otherwise return null
  return match ? match[1] : null;
}

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
