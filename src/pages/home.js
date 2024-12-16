import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CountriesContext } from '../models/country';

import PlayerSelection from '../components/player-selection/player-selection';

const Home = () => {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
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
        </>
    );
}

export default Home;