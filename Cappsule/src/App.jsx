import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchBox.css";
import { Card, Col, Row } from "antd";

const Cappsule = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  console.log('searchResults: ', searchResults);
  console.log('searchResults: ', searchResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (searchTerm.trim() !== "") {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://backend.cappsule.co.in/api/v1/new_search?q=${encodeURIComponent(
              searchTerm
            )}&pharmacyIds=1,2,3`
          );
          if (response.status === 200) {
            setSearchResults(
              response.data.data.medicineSuggestions.filter((suggestion) =>
                suggestion.name_with_short_pack
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
            );
          } else {
            setError("Failed to fetch search results");
          }
        } catch (error) {
          setError("Error fetching search results: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchData();
  }, [searchTerm]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="search-box">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search for a medicine..."
          className="search-input"
        />
      </div>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {searchResults.length === 0 ? (
        <h3 className="card-content">
          {`"Find medicines with amazing discount"`}
        </h3>
      ) : (
        <div className="cards-container">
        {searchResults.map((result, index) => {
          
          let type;
          if (result.name_with_short_pack.endsWith("tablets")) {
            type = "tablet";
          } else if (result.name_with_short_pack.endsWith("ml")) {
            type = "injection";
          } else if (result.name_with_short_pack.endsWith("capsule")) {
            type = "capsule";
          }
  
          return (
            <Row key={index}>
              <Col lg="12" sm="12" md="12">
                <Card className="medicine-card">
                  <div>
                    Form: {type}
                  </div>
                  <div>
                    MRP: {result.mrp}
                  </div>
                  <div>
                    Strength: {result.salt_full}
                  </div>
                  {/* Add more details if needed */}
                </Card>
              </Col>
            </Row>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default Cappsule;
