// src/components/SearchComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.trim() !== '') {
      // Make an API request when the query changes
      axios.get(`http://wafront.localhost.com/api/search/${query}`)
        .then(response => {
          setResults(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    } else {
      // Clear results when the query is empty
      setResults([]);
    }
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map(result => (
          <li key={result.id}>{result.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
