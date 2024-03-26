import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context';

const LeaderboardPage = () => {
  const { getLeaderboard } = useStateContext();
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardData = await getLeaderboard();
        setLeaderboard(leaderboardData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [getLeaderboard]);

  return (
    <div className="bg-gray-100 rounded-lg mt-20 min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="w-full border-collapse border bg-gray-50 border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Address</th>
                <th className="p-4 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard?.map((entry, index) => (
                entry.score.toString() !== "0" && (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{entry.address}</td>
                    <td className="p-4">{entry.score.toString()}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
