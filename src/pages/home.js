import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CountriesContext, Country } from '../models/country';
import { RawMaterialsContext, ProcessedMaterialsContext, RawMaterial, ProcessedMaterial } from '../models/material';

import PlayerSelection from '../components/player-selection/player-selection';

const Home = () => {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    // eslint-disable-next-line
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);
    const nav = useNavigate();

    function startGame(e) {
        e.preventDefault();

        // check more than one country
        if (countries.length <= 1) {
            alert("Create more than one country");
            return;
        }

        // route to game page
        nav("/materials");
    }

    return (
        <>
            <PlayerSelection />
            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                <button id="start-button" onClick={(e) => startGame(e)}>Click to Continue</button>
            </div>
            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                <button id="start-button" onClick={(e) => {
                    e.preventDefault();

                    let c = [new Country("America", true), new Country("France", false), new Country("Britain", false)];
                    let r = [new RawMaterial("Wood"), new RawMaterial("Iron"), new RawMaterial("Copper")];
                    let p = [new ProcessedMaterial("House", {"Wood": 3}), new ProcessedMaterial("Cars", {"Iron": 2}), new ProcessedMaterial("Elcetronics", {"Copper": 2}), new ProcessedMaterial("Furniture", {"Iron": 1, "Wood": 3}, new ProcessedMaterial("Power Lines", {"Copper": 2, "Wood": 2}), new ProcessedMaterial("Bronze", {"Copper": 1, "Iron": 2}))];

                    c[0].addRawMaterial(r[0].name);
                    c[1].addRawMaterial(r[1].name);
                    c[2].addRawMaterial(r[2].name);
                    
                    r[0].addCountry(c[0].name, 1, {"France": 2, "Britain": 2});
                    r[1].addCountry(c[1].name, 2, {"America": 4, "Britain": 4});
                    r[2].addCountry(c[2].name, 3, {"America": 5, "France": 5});

                    c[0].addProcessedMaterial(p[0].name);
                    c[1].addProcessedMaterial(p[1].name);
                    c[2].addProcessedMaterial(p[2].name);

                    p[0].addCountry(c[0].name, {"France": 7, "Britain": 7});
                    p[1].addCountry(c[1].name, {"America": 8, "Britain": 8});
                    p[2].addCountry(c[2].name, {"America": 10, "France": 10});

                    c[0].addProcessedMaterial(p[3].name);
                    c[1].addProcessedMaterial(p[3].name);

                    c[0].addProcessedMaterial(p[4].name);
                    c[2].addProcessedMaterial(p[4].name);

                    c[1].addProcessedMaterial(p[5].name);
                    c[2].addProcessedMaterial(p[5].name);

                    p[3].addCountry(c[0].name, {"France": 10, "Britain": 10});
                    p[3].addCountry(c[1].name, {"America": 11, "Britain": 11});

                    p[4].addCountry(c[0].name, {"France": 15, "Britain": 15});
                    p[4].addCountry(c[2].name, {"America": 12, "France": 12});

                    p[5].addCountry(c[1].name, {"America": 11, "Britain": 11});
                    p[5].addCountry(c[2].name, {"America": 13, "France": 13});

                    c[0].currency = 40;
                    c[1].currency = 40;
                    c[2].currency = 40;

                    setCountries(c);
                    setRawMaterials(r);
                    setProcessedMaterials(p);

                    nav("/game");
                }}>Start with Preset</button>
            </div>
        </>
    );
}

export default Home;