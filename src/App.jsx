import { useState } from "react";

import "./App.css";
// const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [prevImages, setPrevImages] = useState([]);
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [lifeSpan, setLifeSpan] = useState("");
  const [breedGroup, setBreedGroup] = useState("");
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [temperament, setTemperament] = useState("");

  // const handleSubmit = async () => {
  //   let query = `https://api.thedogapi.com/v1/images/search?limit=1&api_key=live_wnXzmnO8GUkjjxcPgTcmZiTCcxRjTptwSNKfVFONs6SjH1qMbML8H965FzoYnnxF&width=200&height=100`;

  //   const response = await fetch(query);
  //   const json = await response.json();
  //   console.log(json);
  //   setCurrentImage(json[0].url);
  //   setName(json[0].breeds[0].name);
  //   setHeight(json[0].breeds[0].height.imperial);
  //   setWeight(json[0].breeds[0].weight.imperial);
  //   setLifeSpan(json[0].breeds[0].life_span);
  //   setBreedGroup(json[0].breeds[0].breed_group);
  // };

  const handleSubmit = async () => {
    let query = `https://api.thedogapi.com/v1/images/search?limit=1&api_key=live_wnXzmnO8GUkjjxcPgTcmZiTCcxRjTptwSNKfVFONs6SjH1qMbML8H965FzoYnnxF&width=200&height=100`;

    let response = await fetch(query);
    let json = await response.json();

    // Filter out breeds that match any banned attribute
    let filteredBreeds = json[0].breeds.filter((breed) => {
      return (
        !bannedAttributes.includes(breed.height.imperial) &&
        !bannedAttributes.includes(breed.weight.imperial) &&
        !bannedAttributes.includes(breed.life_span) &&
        !bannedAttributes.includes(breed.breed_group)
      );
    });

    // Keep making API calls until we find a result that is not banned
    while (filteredBreeds.length === 0) {
      response = await fetch(query);
      json = await response.json();

      filteredBreeds = json[0].breeds.filter((breed) => {
        return (
          !bannedAttributes.includes(breed.height.imperial) &&
          !bannedAttributes.includes(breed.weight.imperial) &&
          !bannedAttributes.includes(breed.life_span) &&
          !bannedAttributes.includes(breed.breed_group)
        );
      });
    }

    // Set the state with the first non-banned breed
    setCurrentImage(json[0].url);
    setPrevImages([...prevImages, json[0].url]);
    setName(filteredBreeds[0].name);
    setHeight(filteredBreeds[0].height.imperial);
    setWeight(filteredBreeds[0].weight.imperial);
    setLifeSpan(filteredBreeds[0].life_span);
    setBreedGroup(filteredBreeds[0].breed_group);
    setTemperament(filteredBreeds[0].temperament);
  };

  const handleClick = (attribute) => {
    if (!bannedAttributes.includes(attribute)) {
      setBannedAttributes([...bannedAttributes, attribute]);
    }
  };

  const handleRemoveFromBanned = (attribute) => {
    const updatedBannedAttributes = bannedAttributes.filter(
      (item) => item !== attribute
    );
    setBannedAttributes(updatedBannedAttributes);
  };

  return (
    <div className="container">
      <div className="left">
        <h2>The cute pupps we have seen so far!</h2>
        {prevImages &&
          prevImages.map((prevImage, i) => {
            return (
              <div key={i} className="prevImages">
                <img src={prevImage} width={300} />
                <h3 className="temperament">{temperament}</h3>
              </div>
            );
          })}
      </div>
      <div className="center">
        <h1>Discover Pups: Unleash Your Love for Dogs!</h1>
        <h3>🐩 🐾 🦮 🐶 🐕‍🦺 🐺 🐕 🐩 🐾 🦮</h3>
        <button className="discover" onClick={handleSubmit}>
          Discover
        </button>
        {name && <h2 className="name">{name}</h2>}

        <div className="attributes">
          {weight && (
            <h2 onClick={() => handleClick(weight)} className="attribute">
              {weight} lbs
            </h2>
          )}
          {height && (
            <h2 onClick={() => handleClick(height)} className="attribute">
              {height} inches
            </h2>
          )}
          {lifeSpan && (
            <h2 onClick={() => handleClick(lifeSpan)} className="attribute">
              {lifeSpan}
            </h2>
          )}
          {breedGroup && (
            <h2 onClick={() => handleClick(breedGroup)} className="attribute">
              {breedGroup}
            </h2>
          )}
        </div>
        {currentImage && (
          <div>
            <img src={currentImage} width={400} />
          </div>
        )}
      </div>

      <div className="banned">
        <h3>Banned List</h3>
        {bannedAttributes.length > 0 &&
          bannedAttributes.map((bannedAttribute, i) => {
            return (
              <div key={i}>
                <h2
                  onClick={() => handleRemoveFromBanned(bannedAttribute)}
                  className="attribute"
                >
                  {bannedAttribute}
                </h2>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
