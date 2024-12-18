import { useContext, useState, useEffect } from "react";

import { TariffsContext } from "../../models/tariff";
import { Trade, TradesContext } from "../../models/trade";
import { RawMaterialsContext, ProcessedMaterialsContext } from "../../models/material";
import { CountriesContext } from "../../models/country";

import "./trade-offer-form.css";

function TradeOfferForm() {
    // eslint-disable-next-line
    const {tariffs, setTariffs} = useContext(TariffsContext);
    // eslint-disable-next-line
    const {trades, setTrades} = useContext(TradesContext);
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    // eslint-disable-next-line
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);

    const [playerCountry, setPlayerCountry] = useState(countries.find((c) => c.player));
    const [targetCountry, setTargetCountry] = useState("");
    const [targetCountryList, setTargetCountryList] = useState([...countries]);
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [materialsList, setMaterialsList] = useState([]);
    const [tradeAmount, setTradeAmount] = useState(0);

    const Dropdown = (props) => {
        return (
            <div className={props.class}>
                <select value={props.value} onChange={(event) => {props.function(event.target.value)}}>
                    <option key="" value=""></option>
                    {
                        props.options.map((option) => (
                            <option key={option.name} value={option.name}>
                                {option.name}
                            </option>
                        ))
                    }
                </select>
            </div>
        );
    }

    function clear(form) {
        form.reset();
        setTargetCountry("");
        setSelectedMaterial("");
        setTradeAmount(0);
    }

    function calculatePrice() {
        let price = rawMaterials.find((m) => m.name === selectedMaterial).sell_prices[targetCountry.name][playerCountry.name];
        let tariff = tariffs.find((t) => t.target === playerCountry.name && t.source === targetCountry).tariffs[selectedMaterial];

        if (tariff !== undefined) {
            price *= (1 + (tariff / 100));
        }

        return price;
    }

    function submit(e) {
        e.preventDefault();

        let form = document.getElementById("trade-offer");
        
        if (tradeAmount <= 0) {
            alert("Enter an amount above 0");
            return;
        }

        if (targetCountry === "") {
            alert("Select a country");
            return;
        }

        if (selectedMaterial === "") {
            alert("Select a material");
            return;
        }

        if (tradeAmount > targetCountry.held_domestic_raw[selectedMaterial]) {
            alert(`${targetCountry} doesn't have enough ${selectedMaterial}`);
            return;
        }

        let price = calculatePrice();

        if (price > playerCountry.currency) {
            alert("Price is higher than you can afford");
            return;
        }

        let list = {...trades};
        let t = new Trade(playerCountry.name, targetCountry, selectedMaterial, price, playerCountry.name, targetCountry);

        list[t.initiator].push(t);
        setTrades(list);

        console.log(list);

        clear(form);
    }

    useEffect(() => {
        let player = countries.find((c) => c.player);
        let c = [...countries];
        c.splice(c.findIndex((country) => country.name === player.name), 1)

        setPlayerCountry(player);
        setTargetCountryList(c);
    }, [countries]);

    useEffect(() => {
        if (targetCountry !== "") {
            console.log(targetCountry);
            let raw = Object.fromEntries(Object.entries(countries.find((c) => c.name === targetCountry).held_domestic_raw).map(([m, num]) => {
                console.log([rawMaterials.find((mat) => mat.name === m), num]);
                return [rawMaterials.find((mat) => mat.name === m).name, num];
            }));
            let proc = Object.fromEntries(Object.entries(countries.find((c) => c.name === targetCountry).held_domestic_processed).map(([m, num]) => {
                console.log([processedMaterials.find((mat) => mat.name === m), num]);
                return [processedMaterials.find((mat) => mat.name === m).name, num];
            }));

            setMaterialsList({...raw, ...proc});
        }
    }, [targetCountry, rawMaterials, processedMaterials, countries]);

    return (
        <>
            <form id="trade-offer" className="trade-offer-form">
                <div className="form-header">
                    <h2>Trade Offer Form</h2>
                </div>

                <div className="form-body">
                    <div className="country-select">
                        <p className="country-select-label">Target Country</p>
                        <Dropdown options={targetCountryList} value={targetCountry} function={setTargetCountry} class="country-select-box" />
                    </div>

                    <div className="material-select">
                        <p className="material-select-label">Target Material</p>
                        <Dropdown options={Object.entries(materialsList).map(([key, value]) => (rawMaterials.find((m) => m.name === key) !== undefined) ? rawMaterials.find((m) => m.name === key) : processedMaterials.find((m) => m.name === key))} value={selectedMaterial} function={setSelectedMaterial} class="country-select-box" />
                    </div>

                    <div className="amount-select">
                        <p>Amount: </p>
                        <input type="text" placeholder="Enter amount to trade for" onInput={(e) => {
                            e.preventDefault();

                            if (!isNaN(Number(e.target.value))) setTradeAmount(Number(e.target.value));
                        }}/>
                    </div>
                </div>

                <div className="form-footer">
                    <button onClick={(e) => submit(e)}>Submit Trade Offer</button>
                </div>
            </form>
            <div style={{display: "flex", flexWrap: "wrap", width: "calc(100vw - 2vw - 2px)", margin: "1vh 1vw", justifyContent: "center", alignItems: "center", borderRadius: "10px", border: "1px solid black"}}>
                <div style={{borderBottom: "1px solid black", width: "100%", textAlign: "center"}}>
                    <h2 style={{margin: "0", padding: "0"}}>Trade Offers List</h2>
                </div>
                <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                    {
                        Object.entries(trades).map(([initiator, tradeList]) => {
                            return (initiator === playerCountry.name) ? (
                                <>
                                    {
                                        tradeList.map((t) => {
                                            return <p>{`${t.paying_country} ($${t.value}) -> ${t.material_giving_country} (${t.materials})`}</p>
                                        })
                                    }
                                </>
                            ) : <></>
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default TradeOfferForm;