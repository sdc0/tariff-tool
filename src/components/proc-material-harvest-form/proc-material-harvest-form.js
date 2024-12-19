import { useContext, useState, useEffect } from "react";

import { CountriesContext, Country } from "../../models/country";
import { RawMaterialsContext, ProcessedMaterialsContext } from "../../models/material";

import "./proc-material-harvest-form.css";

function ProcMaterialHarvestForm() {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    // eslint-disable-next-line
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);

    const [playerCountry, setPlayerCountry] = useState(countries.find((c) => c.player));
    const [produced, setProduced] = useState({});

    function sumProduced() {
        let required = {};

        // eslint-disable-next-line
        Object.entries(produced).map(([key, value]) => {
            // eslint-disable-next-line
            Object.entries(processedMaterials.find(m => m.name === key).materials).map(([m, amount]) => {
                required[m] = (m in required) ? required[m] + (value * amount) : (value * amount);
            });
        });

        return required;
    }

    function parseForm() {
        let req = sumProduced();

        let mats = {};

        // eslint-disable-next-line
        Object.entries(playerCountry.held_domestic_raw).map(([mat, amount]) => {
            mats[mat] = (mat in mats) ? mats[mat] + amount : amount;
        });
        
        // eslint-disable-next-line
        Object.entries(playerCountry.held_foreign_raw).map(([mat, amount]) => {
            mats[mat] = (mat in mats) ? mats[mat] + amount : amount;
        });

        // test requirements to ensure required materials are owned
        for (const [key, value] of Object.entries(req)) {
            if (!(key in mats) || mats[key] < value) {
                alert(`Not enough ${key}`);
                return;
            }
        }

        let c = Country.clone(playerCountry);
        
        // eslint-disable-next-line
        Object.entries(req).map(([m, amount]) => {
            let leftover = amount;

            if (m in playerCountry.held_foreign_raw && leftover > 0) {
                if (playerCountry.held_foreign_raw[m] > leftover) {
                    playerCountry.held_foreign_raw[m] -= leftover;
                    leftover = 0;
                }else {
                    leftover -= playerCountry.held_foreign_raw[m];
                    playerCountry.held_foreign_raw[m] = 0;
                }
            }

            if (m in playerCountry.held_domestic_raw && leftover > 0) {
                if (playerCountry.held_domestic_raw[m] > leftover) {
                    playerCountry.held_domestic_raw[m] -= leftover;
                    leftover = 0;
                }else {
                    leftover -= playerCountry.held_domestic_raw[m];
                    playerCountry.held_domestic_raw[m] = 0;
                }
            }
        });

        // eslint-disable-next-line
        Object.entries(produced).map(([key, value]) => {
            c.held_domestic_processed[key] = (key in c.held_domestic_processed) ? c.held_domestic_processed[key] + value : value;
        });

        let list = [...countries];
        list[list.findIndex(m => m.name === playerCountry.name)] = c;

        setCountries(list);
        document.getElementById("proc-harvest")?.reset();
    }

    useEffect(() => {
        setPlayerCountry(countries.find((c) => c.player));
    }, [countries]);

    return (
        <form id="proc-harvest" className="proc-harvest-form">
            <div className="form-header">
                <h2>Produce Materials</h2>
            </div>

            <div className="form-body">
                {
                    playerCountry.processed_materials.map((m) => {
                        return (
                            <div style={{display: "inline-flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                <p style={{padding: "0", margin: "0 2% 0 2%"}}>{m}</p>
                                <input id={`${m}-input`} type="text" placeholder="Amount to produce" onInput={(e) => {
                                    e.preventDefault();

                                    let amount = Number(e.target.value);

                                    if (!isNaN(amount)) {
                                        let list = structuredClone(produced);
                                        list[m] = amount;
                                        setProduced(list);
                                    }
                                }}/>
                            </div>
                        );
                    })
                }
            </div>

            <div className="form-footer">
                <button style={{margin: "2% 0 2% 1%", padding: "0"}} onClick={(e) => {e.preventDefault(); parseForm()}}>Produce Materials</button>
            </div>
        </form>
    );
}

export default ProcMaterialHarvestForm;