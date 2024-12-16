import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { CountriesContext } from '../models/country';

import MaterialForm from '../components/material-form/material-form';
import MaterialsList from '../components/materials-list/materials-list';

const Material = () => {
    // eslint-disable-next-line
    const {countries, setCountries} = useContext(CountriesContext);
    const nav = useNavigate();

    function startGame(e) {
        e.preventDefault();

        // check for an even game
        let num_raw = -1;
        let num_proc = -1;
        for (let i = 0; i < countries.length; i++) {
            if (num_raw === -1) num_raw = countries[i].raw_materials.length;
            if (num_proc === -1) num_proc = countries[i].processed_materials.length;

            if (num_raw !== countries[i].raw_materials.length) {
                alert("Assign the same number of raw materials to all countries");
                return;
            }

            if (num_proc !== countries[i].processed_materials.length) {
                alert("Assign the same number of processed materials to all countries");
                return;
            }
        }

        // check for currency having been entered
        if (countries[0].currency < 1) {
            alert("Enter a number for the starting currency");
            return;
        }

        // route to game page
        nav("/game");
    }

    return (
        <>
            <MaterialForm />
            <MaterialsList />

            <div style={{display: "inline-flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                <p style={{marginRight: '1%'}}>Starting Currency:</p>
                <input id="currency-input" type="text" placeholder="Enter the starting currency..." style={{marginLeft: '1%'}} onInput={(e) => {
                    e.preventDefault();

                    let list = [...countries];

                    for (let i = 0; i < list.length; i++) {
                        list[i].currency = Number(document.getElementById("currency-input").value);
                    }

                    setCountries(list);
                }} />
            </div>

            <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: "center"}}>
                <button id="return-button" style={{marginRight: "1%"}} onClick={(e) => {e.preventDefault(); nav("/")}}>Return to Previous Page</button>
                <button id="start-button" style={{marginLeft: "1%"}} onClick={(e) => startGame(e)}>Click to Start Game</button>
            </div>
        </>
    );
}

export default Material;