import { useState, useEffect } from "react";

import { countries } from "../../models/country.js";
import { RawMaterial, ProcessedMaterial, raw_materials, processed_materials } from "../../models/material.js";
import { Tariff, tariffs } from "../../models/tariff.js";

import './tariff-form.css';

function TariffForm() {
    const [targetCountry, setTargetCountry] = useState("");
    const [sourceCountry, setSourceCountry] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [targetCountryList, setTargetCountryList] = useState([...countries]);
    const [sourceCountryList, setSourceCountryList] = useState([...countries]);
    const [materialsList, setMaterialsList] = useState([]);

    function clear(form) {
        form.reset();
        setTargetCountry("");
        setSourceCountry("");
        setSelectedMaterial("");
    }

    function parseTariffFormAdd(e) {
        e.preventDefault();

        let form = document.querySelector("#tariff");
        let tariff_percent = Number(document.querySelector("#tariff .tariff-input input").value);

        if (isNaN(tariff_percent)) {
            alert("Tariff percent was not valid");
            clear(form);
            return;
        }

        if (sourceCountry === "") {
            alert("Select a source country");
            clear(form);
            return;
        }

        if (targetCountry === "") {
            alert("Select a target country");
            clear(form);
            return;
        }

        if (selectedMaterial === "") {
            alert("Select a target material");
            clear(form);
            return;
        }

        let tariff = tariffs.find(t => (t.target === targetCountry && t.source === sourceCountry));
        if (tariff === undefined) {
            tariff = new Tariff(sourceCountry, targetCountry);
            tariff.addTariff(selectedMaterial, tariff_percent);
            tariffs.push(tariff);
        }else {
            tariff.addTariff(selectedMaterial, tariff_percent);
        }

        console.log(tariffs);
        clear(form);
    }

    function parseTariffFormRemove(e) {
        e.preventDefault();

        let form = document.querySelector("#tariff");

        if (sourceCountry === "") {
            alert("Select a source country");
            clear(form);
            return;
        }

        if (targetCountry === "") {
            alert("Select a target country");
            clear(form);
            return;
        }

        if (selectedMaterial === "") {
            alert("Select a target material");
            clear(form);
            return;
        }

        let tariff = tariffs.find(t => (t.target === targetCountry && t.source === sourceCountry));
        if (tariff === undefined) {
            alert("Tariff does not exist");
        }else {
            tariff.removeTariff(selectedMaterial);
        }

        console.log(tariffs);
        clear(form);
    }

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

    useEffect(() => {
        let countries_list = [...countries];
        if (targetCountry !== "") countries_list.splice(countries_list.findIndex(c => c.name === targetCountry), (countries_list.findIndex(c => c.name === targetCountry) === -1) ? 0 : 1);
        setSourceCountryList(countries_list);
    }, [targetCountry]);

    useEffect(() => {
        let countries_list = [...countries];
        if (sourceCountry !== "") countries_list.splice(countries_list.findIndex(c => c.name === sourceCountry), (countries_list.findIndex(c => c.name === sourceCountry) === -1) ? 0 : 1);
        setTargetCountryList(countries_list);
    }, [sourceCountry]);

    useEffect(() => {
        if (targetCountry !== "") {
            let country = countries.find(c => c.name === targetCountry);
            setMaterialsList([...country?.raw_materials.map(m => raw_materials.find(i => i.name === m)), ...country?.processed_materials.map(m => processed_materials.find(i => i.name === m))]);
        }
    }, [targetCountry])

    return (
        <form id="tariff" className="tariff-form">
            <div className="center bottom-border">
                <h2 className="form-header">Tariff Submission Form</h2>
            </div>

            <div className="form-body">
                <div className="country-select">
                    <p className="country-select-label">Source Country</p>
                    <Dropdown options={sourceCountryList} value={sourceCountry} function={setSourceCountry} class="country-select-box" />
                </div>

                <div className="country-select">
                    <p className="country-select-label">Target Country</p>
                    <Dropdown options={targetCountryList} value={targetCountry} function={setTargetCountry} class="country-select-box" />
                </div>

                <div className="material-select">
                    <p className="material-select-label">Targeted Material</p>
                    <Dropdown options={materialsList} value={selectedMaterial} function={setSelectedMaterial} class="material-select-box" />
                </div>

                <div className="tariff-input">
                    <input type="text" placeholder="Enter tariff as a percentage" />
                    <p>%</p>
                </div>
            </div>

            <div className="form-submit">
                <button className="submit-btn" onClick={(e) => parseTariffFormAdd(e)}>Add Tariff</button>
                <button className="submit-btn" onClick={(e) => parseTariffFormRemove(e)}>Remove Tariff</button>
            </div>
        </form>
    )
}

export default TariffForm;