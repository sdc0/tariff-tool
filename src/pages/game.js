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
                                                let max_amount_per_country = Math.floor(amount / list.length);

                                                // eslint-disable-next-line
                                                list.map((c) => {
                                                    let sell_price = processedMaterials.find((m) => m.name === mat).sell_prices[country.name][c.name];
                                                    if (c.currency >= sell_price) trading[c.name][mat] = (sell_price * max_amount_per_country <= c.currency) ? max_amount_per_country : Math.floor(c.currency / sell_price);
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
                                    }}>Click to Continue to Trade Accepting</button>
                                </div>
                            </>
                        } />
                        <Route path="view" element={
                            <>
                                <div style={{display: "flex", flexWrap: "wrap", width: "calc(100vw - 2vw - 2px)", justifyContent: "center", alignItems: "center", border: "1px solid black", borderRadius: "10px", margin: "1vh 1vw"}}>
                                    <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center", borderBottom: "1px solid black"}}>
                                        <h2 style={{margin: "0"}}>Trade Offers List</h2>
                                    </div>
                                    {
                                        Object.entries(trades).map(([initiator, tradeList], i) => {
                                            return tradeList.map((trade, j) => {
                                                return (trade.target === playerCountry.name) ? (
                                                    <div style={{width: "100%", display: "inline-flex", justifyContent: "center", alignItems: "center"}}>
                                                        <p style={{margin: "0"}}>{`${trade.paying_country} ($${trade.value}) -> ${trade.material_giving_country} (${Object.entries(trade.materials).map(([m, amount]) => m + ': ' + amount)})`}</p>
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

                                        // do CPU shit
                                        for (let country of cpuCountries) {
                                            let applicableTrades = [];
                                            
                                            console.log(trades);

                                            // eslint-disable-next-line
                                            Object.entries(trades).map(([initiator, tradeList]) => {
                                                // eslint-disable-next-line
                                                tradeList.map((trade) => {
                                                    if (trade.target === country.name) applicableTrades.push(trade);
                                                });
                                            });

                                            console.log(country);
                                            console.log(applicableTrades);

                                            applicableTrades.sort(() => Math.random() - 0.5);

                                            for (let trade of applicableTrades) {
                                                let mc = Country.clone(countries.find((c) => c.name === trade.material_giving_country));
                                                let materials = {};
                                                // eslint-disable-next-line
                                                Object.entries(mc.held_domestic_raw).map(([material, amount]) => {
                                                    materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                });
                                                // eslint-disable-next-line
                                                Object.entries(mc.held_foreign_raw).map(([material, amount]) => {
                                                    materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                });
                                                // eslint-disable-next-line
                                                Object.entries(mc.held_domestic_processed).map(([material, amount]) => {
                                                    materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                });

                                                let cc = Country.clone(countries.find((c) => c.name === trade.paying_country));
                                                console.log(cc);
                                                console.log(mc);
                                                console.log(materials);
                                                console.log(cc.currency >= trade.value);
                                                console.log(trade);
                                                console.log(Object.entries(trade.materials).map(([material, amount]) => materials[material] >= amount))

                                                if (cc.currency >= trade.value && Object.entries(trade.materials).map(([material, amount]) => materials[material] >= amount).every(Boolean)) {
                                                    trade.accepted = true;
                                                    console.log(trade);

                                                    cc.currency -= trade.value;
                                                    
                                                    // eslint-disable-next-line
                                                    Object.entries(trade.materials).map(([mat, amount]) => {
                                                        let leftover = amount;
                                                        if (mat in mc.held_foreign_raw && leftover > 0) {
                                                            if (leftover > mc.held_foreign_raw[mat]) {
                                                                leftover = leftover - mc.held_foreign_raw[mat];
                                                                mc.held_foreign_raw[mat] = 0;
                                                            }else {
                                                                mc.held_foreign_raw[mat] = mc.held_foreign_raw[mat] - leftover;
                                                                leftover = 0;
                                                            }
                                                        }

                                                        if (mat in mc.held_domestic_raw && leftover > 0) {
                                                            if (leftover > mc.held_foreign_raw[mat]) {
                                                                leftover = leftover - mc.held_domestic_raw[mat];
                                                                mc.held_domestic_raw[mat] = 0;
                                                            }else {
                                                                mc.held_domestic_raw[mat] = mc.held_domestic_raw[mat] - leftover;
                                                                leftover = 0;
                                                            }
                                                        }

                                                        if (mat in mc.held_domestic_processed && leftover > 0) {
                                                            if (leftover > mc.held_foreign_raw[mat]) {
                                                                leftover = leftover - mc.held_domestic_processed[mat];
                                                                mc.held_domestic_processed[mat] = 0;
                                                            }else {
                                                                mc.held_domestic_processed[mat] = mc.held_domestic_processed[mat] - leftover;
                                                                leftover = 0;
                                                            }
                                                        }
                                                    });
                                                    
                                                    materials = {}
                                                    // eslint-disable-next-line
                                                    Object.entries(mc.held_domestic_raw).map(([material, amount]) => {
                                                        materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                    });
                                                    // eslint-disable-next-line
                                                    Object.entries(mc.held_foreign_raw).map(([material, amount]) => {
                                                        materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                    });
                                                    // eslint-disable-next-line
                                                    Object.entries(mc.held_domestic_processed).map(([material, amount]) => {
                                                        materials[material] = (material in materials) ? materials[material] + amount : amount;
                                                    });
                                                }
                                            }
                                        }

                                        // filter out rejected trades
                                        let accepted = Object.fromEntries(Object.entries(trades).map(([initiator, tradesList]) => {
                                            let subList = [];
                                            // eslint-disable-next-line
                                            tradesList.map((trade) => {
                                                if (trade.accepted) subList.push(trade);
                                            });
                                            return [initiator, subList];
                                        }));

                                        let countriesList = [...countries];
                                        // eslint-disable-next-line
                                        Object.entries(accepted).map(([initiator, tradeList]) => {
                                            // eslint-disable-next-line
                                            tradeList.map((trade) => {
                                                let cc = countriesList.find((c) => c.name === trade.paying_country);
                                                let mc = countriesList.find((c) => c.name === trade.material_giving_country);
                                                
                                                cc.currency -= trade.value;
                                                mc.currency += trade.value;

                                                // eslint-disable-next-line
                                                Object.entries(trade.materials).map(([mat, amount]) => {
                                                    if (mat in mc.held_domestic_processed) {
                                                        cc.held_foreign_processed[mat] = (mat in cc.held_foreign_processed) ? cc.held_foreign_processed[mat] + amount : amount;
                                                    }else {
                                                        cc.held_foreign_raw[mat] = (mat in cc.held_foreign_raw) ? cc.held_foreign_raw[mat] + amount : amount;
                                                    }

                                                    let leftover = amount;
                                                    if (mat in mc.held_foreign_raw && leftover > 0) {
                                                        if (leftover > mc.held_foreign_raw[mat]) {
                                                            leftover = leftover - mc.held_foreign_raw[mat];
                                                            mc.held_foreign_raw[mat] = 0;
                                                        }else {
                                                            mc.held_foreign_raw[mat] = mc.held_foreign_raw[mat] - leftover;
                                                            leftover = 0;
                                                        }
                                                    }

                                                    if (mat in mc.held_domestic_raw && leftover > 0) {
                                                        if (leftover > mc.held_foreign_raw[mat]) {
                                                            leftover = leftover - mc.held_domestic_raw[mat];
                                                            mc.held_domestic_raw[mat] = 0;
                                                        }else {
                                                            mc.held_domestic_raw[mat] = mc.held_domestic_raw[mat] - leftover;
                                                            leftover = 0;
                                                        }
                                                    }

                                                    if (mat in mc.held_domestic_processed && leftover > 0) {
                                                        if (leftover > mc.held_foreign_raw[mat]) {
                                                            leftover = leftover - mc.held_domestic_processed[mat];
                                                            mc.held_domestic_processed[mat] = 0;
                                                        }else {
                                                            mc.held_domestic_processed[mat] = mc.held_domestic_processed[mat] - leftover;
                                                            leftover = 0;
                                                        }
                                                    }
                                                });
                                            });
                                        });

                                        let g = GameState.clone(state);
                                        g.nextPhase();
                                        setState(g);

                                        let c = [...countriesList];
                                        c = c.map((country) => {
                                            let x = Country.clone(country);
                                            x.currency += g.income;
                                            return x;
                                        });
                                        setCountries(c);

                                        setTrades({});

                                        console.log(g);
                                        if (g.phase === "end") nav("/game/end");
                                        nav("/game");
                                    }}>Click to Continue to Next Turn</button>
                                </div>
                            </>
                        } />
                    </Route>
                    <Route path="end" element={
                        <div>
                            {
                                countries.map((c) => {
                                    let points = 0;

                                    // eslint-disable-next-line
                                    Object.entries(c.held_domestic_processed).map(([mat, amount]) => {
                                        let num_materials = 0;

                                        // eslint-disable-next-line
                                        Object.entries(processedMaterials.find((m) => m.name === mat).materials).map(([m, a]) => {
                                            num_materials += a;
                                        });

                                        points += num_materials;
                                    });

                                    // eslint-disable-next-line
                                    Object.entries(c.held_domestic_processed).map(([mat, amount]) => {
                                        let num_materials = 0;

                                        // eslint-disable-next-line
                                        Object.entries(processedMaterials.find((m) => m.name === mat).materials).map(([m, a]) => {
                                            num_materials += a;
                                        });

                                        points += Math.floor(num_materials * 1.5);
                                    });

                                    return (
                                        <p>{c.name}: {points}</p>
                                    );
                                })
                            }
                        </div>
                    } />
                </Route>
            </Routes>
        </>
    );
}

export default Game;