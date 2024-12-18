import { useContext, useState, useEffect } from "react";

import { CountriesContext, Country } from "../../models/country";
import { RawMaterialsContext } from "../../models/material";

import "./raw-material-harvest-form.css";

function RawMaterialHarvestForm() {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);

    const [playerCountry, setPlayerCountry] = useState(countries.find((c) => c.player));
    const [produced, setProduced] = useState({});

    function sumProduced() {
        let sum = 0;

        // eslint-disable-next-line
        Object.entries(produced).map(([key, value]) => {
            sum += rawMaterials.find(m => m.name === key).harvest_prices[playerCountry.name] * value;
        });

        return sum;
    }

    function parseForm() {
        let cost = sumProduced();

        if (cost > playerCountry.currency) {
            alert("Raw materials cost more than you have");
            return;
        }

        let c = Country.clone(playerCountry);

        c.currency -= cost;
        // eslint-disable-next-line
        Object.entries(produced).map(([key, value]) => {
            c.held_domestic_raw[key] = (key in c.held_domestic_raw) ? c.held_domestic_raw[key] + value : value;
        });

        let list = [...countries];
        list[list.findIndex(m => m.name === playerCountry.name)] = c;

        setCountries(list);
        document.getElementById("raw-harvest")?.reset();

        console.log(c);
    }

    useEffect(() => {
        setPlayerCountry(countries.find((c) => c.player));
    }, [countries]);

    return (
        <form id="raw-harvest" className="raw-harvest-form">
            <div className="form-header">
                <h2>Harvest Raw Materials</h2>
            </div>

            <div className="form-body">
                {
                    playerCountry.raw_materials.map((m) => {
                        return (
                            <div style={{display: "inline-flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                <p style={{padding: "0", margin: "0 2% 0 2%"}}>{m}</p>
                                <input id={`${m}-input`} type="text" placeholder="Amount to produce" onInput={(e) => {
                                    e.preventDefault();

                                    let amount = Number(e.target.value);

                                    if (!isNaN(amount)) {
                                        let dict = structuredClone(produced);
                                        dict[m] = Number(e.target.value);
                                        setProduced(dict);
                                    }
                                }}/>
                            </div>
                        );
                    })
                }
            </div>

            <div className="form-footer">
                <p style={{margin: "2% 1% 2% 0", padding: "0"}}>{`Cost: ${sumProduced()}`}</p>
                <button style={{margin: "2% 0 2% 1%", padding: "0"}} onClick={(e) => {e.preventDefault(); parseForm()}}>Harvest Materials</button>
            </div>
        </form>
    );
}

export default RawMaterialHarvestForm;