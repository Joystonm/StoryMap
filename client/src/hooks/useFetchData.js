import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const useFetchData = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(url);
      setData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
};

export default useFetchData;
