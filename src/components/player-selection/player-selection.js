import { useContext, useState } from "react";

import { CountriesContext, Country } from "../../models/country";

import './player-selection.css';

function PlayerSelection() {
    const {countries, setCountries} = useContext(CountriesContext);
    const [count, setCount] = useState(countries.length);

    return (
        <div className="player-select-form">
            <div className="country-count-select">
                <button onClick={(e) => {
                    e.preventDefault(); 
                    setCount((count - 1) < 0 ? 0 : count - 1); 

                    let list = [...countries];
                    list.pop(); 

                    setCountries(list); 
                }}>-</button>

                <p style={{margin: '0 5px', padding: 0}}>{count}</p>

                <button onClick={(e) => {
                    e.preventDefault(); 

                    if (count > 0 && countries[count - 1]?.name === "") {
                        alert("Enter a name before adding a new country");
                        return;
                    }

                    if (count === 0) setCountries([...countries, new Country("", true)]);
                    else if (count + 1 <= 5) setCountries([...countries, new Country("", false)]);
                    
                    setCount((count + 1) > 5 ? 5 : count + 1);
                }}>+</button>
            </div>
            <div className="country-name-select">
                {
                    [...Array(count)].map((_, i) => {
                        return (
                            <div key={`player-${i}`} className="player-name-input">
                                <p>{`Player ${i + 1} (${i === 0 ? "You" : "CPU"})`}</p>

                                <input id={`country-name-${i}`} type="text" placeholder="Enter a country name..." value={countries[i].name} onInput={(e) => {
                                    e.preventDefault(); 

                                    let list = [...countries];

                                    let c = Country.clone(list[i]);
                                    c.name = e.target.value;

                                    list[i] = c;

                                    setCountries(list);
                                }}/>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default PlayerSelection;