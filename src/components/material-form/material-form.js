import { useState, useEffect, useContext } from "react";

import { CountriesContext } from "../../models/country.js";
import { RawMaterial, ProcessedMaterial, RawMaterialsContext, ProcessedMaterialsContext } from "../../models/material.js";

import './material-form.css';

function MaterialForm() {
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);
    const {countries, setCountries} = useContext(CountriesContext);
    const [countriesList, setCountriesList] = useState([...countries]);
    const [materialsList, setMaterialsList] = useState({});
    const [selectedCountry, setSelectedCountry] = useState("");
    const [processed, setProcessed] = useState(false);

    function clear(form) {
        form.reset();
        setMaterialsList([]);
        setSelectedCountry("");
    }

    function parseMaterialFormAdd(e) {
        e.preventDefault();
    
        let form = document.querySelector("#material");
        let material = document.querySelector("#material .material-input").value;

        let harvest_price = undefined;
        if (!processed) harvest_price = Number(document.querySelector("#material .price-input").value);

        let sell_prices = Object.fromEntries([].slice.call(document.querySelectorAll("#material .country-list .country-sell-price")).map(e => [e.getAttribute("data-country"), Number(e.querySelector(".sell-price-input-box").value)]));
    
        if (!processed && isNaN(harvest_price)) {
            alert("The harvest price was not recognized as a number");
            clear(form);
            return;
        }
    
        if (Object.values(sell_prices).some(p => isNaN(p))) {
            alert("One or more sell prices were not recognized as a number");
            clear(form);
            return;
        }
    
        let country_elem = countries.find(c => c.name === selectedCountry);
        if (country_elem === undefined || selectedCountry === "") {
            (selectedCountry === "") ? alert("Enter a country name") : alert(`Country ${selectedCountry} was not found`);
            clear(form);
            return;
        }
    
        let material_elem = (processed ? processedMaterials : rawMaterials).find(m => m.name === material);
        if (selectedCountry in (material_elem === undefined ? {} : material_elem.sell_prices) || material === "") {
            (material === "") ? alert("Enter a material name") : alert(`Material ${material} was already found in country ${selectedCountry}`);
            clear(form);
            return;
        }
    
        let m;
        let used_materials = {};
        let list = [];
        if (processed) {
            for (const [key, value] of Object.entries(materialsList)) {
                if (value) used_materials[key] = value;
            }
            
            if (material_elem === undefined) {
                m = new ProcessedMaterial(material, used_materials);
                m.addCountry(country_elem.name, sell_prices);

                list = [...processedMaterials];
                list.push(m);
                setProcessedMaterials(list);
                setCountries(country_elem.addProcessedHelper(countries, material));
            }else {
                let index = processedMaterials.findIndex(m => m.name === material);

                m = ProcessedMaterial.clone(material_elem);
                m.addCountry(country_elem.name, sell_prices);

                list = [...processedMaterials];
                list[index] = m;
                
                setProcessedMaterials(list);
                setCountries(country_elem.addProcessedHelper(countries, material));
            }
        }else {
            if (material_elem === undefined) {
                m = new RawMaterial(material);
                m.addCountry(country_elem.name, harvest_price, sell_prices);

                list = [...rawMaterials];
                list.push(m);
                setRawMaterials(list);
                setCountries(country_elem.addRawHelper(countries, material));
            }else {
                let index = rawMaterials.findIndex(m => m.name === material);

                m = RawMaterial.clone(material_elem);
                m.addCountry(country_elem.name, harvest_price, sell_prices);

                list = [...rawMaterials];
                list[index] = m;
                
                setRawMaterials(list);
                setCountries(country_elem.addRawHelper(countries, material));
            }
        }
    
        console.log(`Successfully added material ${material} to country ${selectedCountry}`);
        clear(form);
    }
    
    function parseMaterialFormRemove(e) {
        e.preventDefault();
    
        let form = document.querySelector("#material");
        let material = document.querySelector("#material .material-input").value;
    
        let country_elem = countries.find(c => c.name === selectedCountry);
        if (country_elem === undefined || selectedCountry === "") {
            (selectedCountry === "") ? alert("Enter a country name") : alert(`Country ${selectedCountry} was not found`);
            clear(form);
            return;
        }
    
        let material_elem = (processed ? processedMaterials : rawMaterials).find(m => m.name === material);
        if (!(selectedCountry in material_elem.sell_prices) || material === "") {
            (material === "") ? alert("Enter a material name") : alert(`Material ${material} was not found in country ${selectedCountry}`);
            clear(form);
            return;
        }
    
        if (processed) {
            let index = processedMaterials.findIndex(m => m.name === material);

            let m = ProcessedMaterial.clone(material_elem);
            m.removeCountry(selectedCountry);

            let list = [...processedMaterials];
            list[index] = m;
            
            setProcessedMaterials(list);
            setCountries(country_elem.removeProcessedHelper(countries, material));
        }else {
            let index = rawMaterials.findIndex(m => m.name === material);

            let m = RawMaterial.clone(material_elem);
            m.removeCountry(selectedCountry);

            let list = [...rawMaterials];
            list[index] = m;
            
            setRawMaterials(list);
            setCountries(country_elem.removeRawHelper(countries, material));
        }
        console.log(`Successfully removed material ${material} from country ${selectedCountry}`);
        clear(form);
    }

    const Dropdown = (props) => {
        return (
            <div className={props.class}>
                <select value={selectedCountry} onChange={(event) => {setSelectedCountry(event.target.value)}}>
                    <option key="" value=""></option>
                    {props.options.map((option) => (
                        <option key={option.name} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
    
    const handleCheck = () => setProcessed(!processed);
    const handleMaterialCheck = (material, amount) => {
        let materials = structuredClone(materialsList);
        materials[material] = amount;
        setMaterialsList(materials);
    }

    useEffect(() => {
        let countries_list = [...countries];
        if (selectedCountry !== "") {
            countries_list.splice(countries_list.findIndex(c => c.name === selectedCountry), (countries_list.findIndex(c => c.name === selectedCountry) === -1) ? 0 : 1);
        }
        setCountriesList(countries_list);
    }, [selectedCountry, countries]);

    return (
        <form id="material" className="material-form">
            <div className="center bottom-border">
                <h2 className="form-header">Material Submission Form</h2>
            </div>

            <div className="form-top">
                <div className="processed-checkbox">
                    <p>Processed Material</p>
                    <input type="checkbox" id="material-processed-checkbox" onChange={handleCheck} checked={processed} />
                </div>

                <Dropdown class="country-input" options={countries} />
                <input type="text" className="material-input" placeholder="Material Name..." />
                {
                    processed ? <></> : <input type="text" className="price-input" placeholder="Harvest Price..." />
                }
            </div>

            <div id="country-list-material" className="country-list">
                {
                    countriesList.map((c, i) => {
                        return (
                            <div key={c.name} data-country={c.name} className="country-sell-price" style={{borderLeft: ((i === 0) ? "0" : "1px solid black")}}>
                                <p className="sell-price-country">{c.name}</p>
                                <div className="sell-price-input">
                                    <input className="sell-price-input-box" type="text" placeholder='Selling price' />
                                </div>
                            </div>
                        );
                    })
                }
            </div>

            {
                processed ? <div className="raw-materials-checklist">
                    {
                        countries.find(c => c.name === selectedCountry)?.raw_materials?.map((m) => {
                            return (
                                <div className="raw-materials-checklist-item">
                                    <p>{m}</p>
                                    <input type="text" value={materialsList[m]} onInput={(e) => {e.preventDefault(); if (!isNaN(Number(e.target.value))) handleMaterialCheck(m, Number(e.target.value))}}/>
                                </div>
                            );
                        })
                    }
                </div> : <></>
            }

            <div className="center">
                <button id="material-add-btn" className="submit-btn" onClick={(e) => parseMaterialFormAdd(e)}>Add Material</button>
                <button id="material-remove-btn" className="submit-btn" onClick={(e) => parseMaterialFormRemove(e)}>Remove Material</button>
            </div>
        </form>
    );
}

export default MaterialForm;