// hooks/usePatients.js
import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function usePatients(filters = {}) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await api.getPatients(filters);
        setPatients(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [JSON.stringify(filters)]); // Re-fetch if filters change

  // Allow manual refresh of patient list
  const refreshPatients = () => {
    setLoading(true);
    // We need to define fetchPatients outside useEffect to call here
    // So let's move fetchPatients outside useEffect

    // Instead, we can do this:
    (async () => {
      try {
        const data = await api.getPatients(filters);
        setPatients(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  };

  return { patients, loading, error, refreshPatients };
}
