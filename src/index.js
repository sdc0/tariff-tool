import Home from './pages/home';
import Game from './pages/game';
import Material from './pages/materials';

import { RawMaterialsProvider, ProcessedMaterialsProvider } from './models/material';
import { TariffsProvider } from './models/tariff';
import { CountriesProvider } from './models/country';
import { GameStateProvider } from './models/game-state';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from "react-router-dom";

import './index.css';

export default function App() {
    return (
        <CountriesProvider>
            <RawMaterialsProvider>
                <ProcessedMaterialsProvider>
                    <TariffsProvider>
                        <GameStateProvider>
                            <HashRouter>
                                <Routes>
                                    <Route path='/' element={<Home />} />
                                    <Route path='materials' element={<Material />} />
                                    <Route path="game/*" element={<Game />} />
                                </Routes>
                            </HashRouter>
                        </GameStateProvider>
                    </TariffsProvider>
                </ProcessedMaterialsProvider>
            </RawMaterialsProvider>
        </CountriesProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);