"use client";

import { TeamsProps } from '@/types/types';
import { useEffect, useState } from 'react';

export const ScrapeOpgg = () => {
  const [teams, setTeams] = useState<TeamsProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/scrape-opgg', {
          method: "GET"
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setTeams(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className='text-white'>Loading...</div>;
  }

  if (error) {
    return <div className='text-white'>Error: {error}</div>;
  }

  return (
    <div className="text-white">
      <h1>LCK Teams</h1>
      <ul>
        {teams.map((team, index) => (
          <li key={index}>{team.teamName}</li>
        ))}
      </ul>
    </div>
  );
};
