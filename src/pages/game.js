import { useContext } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import TariffForm from "../components/tariff-form/tariff-form";
import TariffList from "../components/tariffs-list/tariffs-list";
import RawMaterialHarvestForm from "../components/raw-material-harvest-form/raw-material-harvest-form";
import ProcMaterialHarvestForm from "../components/proc-material-harvest-form/proc-material-harvest-form";

import CountryInfo from "../components/country-info/country-info.js";

import { CountriesContext } from "../models/country.js";
import { GameState, GameStateContext } from "../models/game-state.js";

const Game = () => {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    const {state, setState} = useContext(GameStateContext);
    const nav = useNavigate();

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

                                    console.log(g);
                                    console.log(state);

                                    nav("/game/trade");
                                }}>Click to Start Trading Phase</button>
                            </div>
                        </>
                    } />
                    <Route path="trade/*">
                        <Route path="" element={
                            <>
                                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                                    <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => {
                                        e.preventDefault(); 

                                        let g = GameState.clone(state);
                                        g.nextPhase();
                                        setState(g);

                                        console.log(g);
                                        console.log(state);

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