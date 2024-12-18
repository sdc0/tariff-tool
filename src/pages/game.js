import { useContext, useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import TariffForm from "../components/tariff-form/tariff-form";
import TariffList from "../components/tariffs-list/tariffs-list";
import RawMaterialHarvestForm from "../components/raw-material-harvest-form/raw-material-harvest-form";
import ProcMaterialHarvestForm from "../components/proc-material-harvest-form/proc-material-harvest-form";

import TradeOfferForm from "../components/trade-offer-form/trade-offer-form.js";

import CountryInfo from "../components/country-info/country-info.js";

import { CountriesContext, Country } from "../models/country.js";
import { GameState, GameStateContext } from "../models/game-state.js";
import { RawMaterialsContext, ProcessedMaterialsContext } from "../models/material.js";
import { Trade, TradesContext } from "../models/trade.js";

const Game = () => {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    // eslint-disable-next-line
    const {trades, setTrades} = useContext(TradesContext);
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    // eslint-disable-next-line
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);
    const {state, setState} = useContext(GameStateContext);

    // eslint-disable-next-line
    const [playerCountry, setPlayerCountry] = useState(countries.find((c) => c.player));
    const [cpuCountries, setCPUCountries] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        let player = countries.find((c) => c.player);
        let c = [...countries];
        c.splice(c.findIndex((country) => country.name === player.name), 1);

        setPlayerCountry(player);
        setCPUCountries(c);
    }, [countries]);

    return (
        <>
            <div style={{display: "inline-flex", alignItems: "center", justifyContent: "center", width: "calc(100vw - 2vw - 2px)", borderRadius: "10px", border: "1px solid black", margin: "1vh 1vw"}}>
                <p style={{margin: "2% 2%", padding: "0"}}>Turn {state.turn}/{state.max_turns}</p>
                <p style={{margin: "2% 2%", padding: "0"}}>Phase: {state.phase}</p>
            </div>

            <div style={{display: "inline-flex", flexGrow: "1", width: "100vw", justifyContent: "center", alignItems: "center"}}>
                {
                    countries.map((c) => <CountryInfo country={c} />)
                }
            </div>

            <Routes>
                <Route path="/">
                    <Route path="/" element={
                        <>
                            <ProcMaterialHarvestForm />
                            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                    e.preventDefault();

                                    // do CPU shit
                                    let list = [...countries];
                                    for (let country of cpuCountries) {
                                        let c = Country.clone(country);
                                        for (let proc of country.processed_materials.map((p) => processedMaterials.find((m) => m.name === p))) {
                                            let num = 0;

                                            // eslint-disable-next-line
                                            while(Object.entries(proc.materials).map(([mat, amount]) => {
                                                let domestic = isNaN(country.held_domestic_raw[mat]) ? 0 : country.held_domestic_raw[mat];
                                                let foreign = isNaN(country.held_foreign_raw[mat]) ? 0 : country.held_foreign_raw[mat];

                                                return (amount * (num + 1)) <= (domestic + foreign);
                                            }).every(Boolean)) {
                                                num++;
                                            }

                                            if (num > 0) {
                                                let req = Object.fromEntries(Object.entries(proc.materials).map(([mat, amount]) => [mat, amount * num]));
                                                
                                                // eslint-disable-next-line
                                                Object.entries(req).map(([mat, amount]) => {
                                                    let domestic = isNaN(country.held_domestic_raw[mat]) ? 0 : country.held_domestic_raw[mat];
                                                    let foreign = isNaN(country.held_foreign_raw[mat]) ? 0 : country.held_foreign_raw[mat];

                                                    let leftover = amount;

                                                    if (foreign > 0) {
                                                        if (foreign > leftover) {
                                                            leftover -= foreign;
                                                            foreign = 0;
                                                        }else {
                                                            foreign -= leftover;
                                                            leftover = 0;
                                                        }
                                                    }

                                                    if (leftover > 0) {
                                                        domestic -= leftover;
                                                        leftover = 0;
                                                    }

                                                    c.held_domestic_raw[mat] = domestic;
                                                    if (mat in c.held_foreign_raw) c.held_foreign_raw[mat] = foreign;
                                                });

                                                c.held_domestic_processed[proc.name] = (proc.name in c.held_domestic_processed) ? c.held_domestic_processed[proc.name] + num : num;
                                            }
                                        }
                                        list[list.findIndex((x) => x.name === c.name)] = c;
                                    }
                                    setCountries(list);

                                    // move to next route
                                    nav("/game/raw");
                                }}>Click to Start Raw Materials Phase</button>
                            </div>
                        </>
                    } />
                    <Route path="raw" element={
                        <>
                            <RawMaterialHarvestForm />
                            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                    e.preventDefault(); 

                                    // do CPU shit
                                    let list = [...countries];
                                    for (let country of cpuCountries) {
                                        let index = Math.floor(Math.random() * country.raw_materials.length);
                                        let mat = rawMaterials.find((m) => m.name === country.raw_materials[index]);
                                        let num = Math.floor((country.currency / 2) / mat.harvest_prices[country.name]);
                                        let price = num * mat.harvest_prices[country.name];
                                        
                                        let c = Country.clone(country);
                                        c.currency = c.currency - price;
                                        c.held_domestic_raw[mat.name] = (mat.name in c.held_domestic_raw) ? c.held_domestic_raw[mat.name] + num : num;

                                        list[list.findIndex((x) => x.name === c.name)] = c;
                                    }
                                    setCountries(list);

                                    // move to next route
                                    nav("/game/tariff");
                                }}>Click to Start Tariff Setting Phase</button>
                            </div>
                        </>
                    } />
                    <Route path="tariff" element={
                        <>
                            <TariffForm />
                            <TariffList />
                            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                    e.preventDefault();

                                    let g = GameState.clone(state);
                                    g.nextPhase();
                                    setState(g);

                                    nav("/game/trade");
                                }}>Click to Start Trading Phase</button>
                            </div>
                        </>
                    } />
                    <Route path="trade/*">
                        <Route path="" element={
                            <>
                                <TradeOfferForm />
                                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                    <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                        e.preventDefault();

                                        // do CPU shit
                                        let tradeList = {...trades};
                                        for (let country of cpuCountries) {
                                            let trading = {};

                                            let list = [...countries];
                                            list.splice(list.findIndex((c) => c.name === country.name), 1);

                                            // eslint-disable-next-line
                                            list.map((c) => {
                                                trading[c.name] = {};
                                            });

                                            // eslint-disable-next-line
                                            Object.entries(country.held_domestic_processed).map(([mat, amount]) => {
                                                let amount_per_country = Math.floor(amount / list.length);

                                                // eslint-disable-next-line
                                                list.map((c) => {
                                                    trading[c.name][mat] = amount_per_country;
                                                });
                                            });

                                            
                                            if (!(country.name in tradeList)) tradeList[country.name] = [];
                                            // eslint-disable-next-line
                                            Object.entries(trading).map(([target_country, allTrades]) => {
                                                // eslint-disable-next-line
                                                Object.entries(allTrades).map(([target_material, amount]) => {
                                                    let target = processedMaterials.find((m) => m.name === target_material);

                                                    let materials = {};
                                                    materials[target_material] = amount;

                                                    tradeList[country.name].push(new Trade(target_country, country.name, materials, amount * target.sell_prices[country.name][target_country], country.name, target_country));
                                                });
                                            });
                                        }
                                        setTrades(tradeList);

                                        // go to next page
                                        nav("/game/trade/view");
                                    }}>Click to Start Game</button>
                                </div>
                            </>
                        } />
                        <Route path="view" element={
                            <>
                                <div style={{display: "flex", flexWrap: "wrap", width: "100%", justifyContent: "center", alignItems: "center"}}>
                                    {
                                        Object.entries(trades).map(([initiator, tradeList], i) => {
                                            return tradeList.map((trade, j) => {
                                                return (trade.target === playerCountry.name) ? (
                                                    <div style={{width: "100%"}}>
                                                        <p>{`${trade.paying_country} ($${trade.value}) -> ${trade.material_giving_country} (${Object.entries(trade.materials).map(([m, amount]) => m + ': ' + amount)})`}</p>
                                                        <input type="checkbox" onChange={(e) => {
                                                            e.preventDefault();

                                                            trade.accepted = !trade.accepted;
                                                            e.target.checked = trade.accepted;
                                                        }} checked={trade.accepted} />
                                                    </div>
                                                ) : <></>;
                                            });
                                        })
                                    }
                                </div>
                                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                    <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                        e.preventDefault();

                                        for (let country of cpuCountries) {
                                            let applicableTrades = [];

                                            Object.entries(trades).map(([initiator, tradeList]) => {
                                                tradeList.map((trade) => {
                                                    if (true) {

                                                    }
                                                });
                                            });
                                        }

                                        nav("/game/trade/accept");
                                    }}>Click to Start Game</button>
                                </div>
                            </>
                        } />
                        <Route path="accept" element={
                            <>
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
                                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                    <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                        e.preventDefault(); 

                                        let g = GameState.clone(state);
                                        g.nextPhase();
                                        setState(g);
                                        
                                        let list = [...countries].map((c) => {c.currency += Number(g.income); return c});
                                        setCountries(list);

                                        nav("/game");
                                    }}>Click to Start Game</button>
                                </div>
                            </>
                        } />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default Game;