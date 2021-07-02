import React, { useState, useCallback } from "react";
import axios from "axios";

const API_TOKEN = "Bearer F421D63D166CA343454DD833B599C";
const API_URL =
  "https://stg-recoapi.ottplay.com/api/v3.1/web/search/v1.1/autocomplete?query=";


export default function SearchInput() {
  const [suggetions, setSuggetions] = useState([]);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const self = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(self, args);
      }, 500);
    };
  };

  const getAPIresponse = async (keyword) => {
    const res = await axios({
      method: "GET",
      url: `${API_URL}${keyword}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: API_TOKEN,
      },
    });
    setSuggetions(res.data?.result);
  };

  const searchHandler = (e) => {
    e.preventDefault();
    const keyword = e.target.value.trim();
    if (keyword === "") {
        setSuggetions([])
        return;
    };
    getAPIresponse(encodeURI(keyword));
  };

  const debouncedSearchHandler = useCallback(debounce(searchHandler), []);
  
  
  return (
    <div className="wrapper">
      <input id="new-web-search-input" onChange={debouncedSearchHandler} />
      
      <SearchSuggestions suggetions={suggetions} />
    </div>
  );
}

function SearchSuggestions({ suggetions }) {
  return (
    <div className={"searchContainer"}>
      {suggetions.map((item) => {
        return (
          <div key={item.key} className={"searchTypeContainer"}>
            <h2>{item.key}</h2>
            <ul>
              {item.data?.map((data, i) => (
                <li key={i} className={"searchItem"}>
                    <img src={data.images} alt={data.name} />
                    <div><h3>{data.name}</h3>
                    <p>
                        {data.genres} {data.release_year ? data.release_year : ""}
                    </p></div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
