import { useEffect, useState, useContext } from "react";

import { RawMaterialsContext, ProcessedMaterialsContext, BasicRawMaterial, BasicProcessedMaterial } from "../../models/material.js";

import "./materials-list.css";

function MaterialsList() {
    // eslint-disable-next-line
    const {rawMaterials, setRawMaterials} = useContext(RawMaterialsContext);
    // eslint-disable-next-line
    const {processedMaterials, setProcessedMaterials} = useContext(ProcessedMaterialsContext);

    const [rawList, setRawList] = useState({});
    const [procList, setProcList] = useState({});
    
    useEffect(() => {
        let list = {};
        rawMaterials.forEach((m) => {
            list[m.name] = BasicRawMaterial.fromRawMaterial(m);
        });
        setRawList(list);
    }, [rawMaterials]);

    useEffect(() => {
        let list = {};
        processedMaterials.forEach((m) => {
            list[m.name] = BasicProcessedMaterial.fromProcessedMaterial(m);
        });
        setProcList(list);
    }, [processedMaterials]);

    return (
        <div className="material-list">
            <div className={Object.entries(rawList).length > 0 ? "center bottom-border" : "center"}>
                <h2>Materials</h2>
            </div>
            {
                Object.entries(rawList).map(([key, value], index) => {
                    return (
                        <div className="material">
                            <span id={`${key}-label`} onClick={(e) => {e.preventDefault(); document.getElementById(`${key}-hidden`)?.classList.toggle("hidden"); document.getElementById(`${key}-label`)?.classList.toggle("bottom-border")}} className={index === 0 ? "" : "top-border"}>{key}</span>
                            <div id={`${key}-hidden`} className="hidden d-flex">
                                {
                                    value.map((m) => {
                                        return (
                                            <div className="country-material">
                                                <p>{m.country + ", " + m.harvest_price + ", {" + Object.entries(m.sell_prices).map(([key, value], i) => ((i === 0 ? "" : " ") + key + ": " + value)) + "}"}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })
            }

            {
                Object.entries(procList).map(([key, value], index) => {
                    return (
                        <div className="material">
                        <span id={`${key}-label`} onClick={(e) => {e.preventDefault(); document.getElementById(`${key}-hidden`)?.classList.toggle("hidden"); document.getElementById(`${key}-label`)?.classList.toggle("bottom-border")}} className="top-border">{key}</span>
                            <div id={`${key}-hidden`} className="hidden d-flex">
                                {
                                    value.map((m) => {
                                        return (
                                            <div className="country-material">
                                                <p>{m.country + ", [" + m.materials.map((mat_name, i) => ((i === 0 ? "" : " ") + mat_name)) + "], {" + Object.entries(m.sell_prices).map(([key, value], i) => ((i === 0 ? "" : " ") + key + ": " + value)) + "}"}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default MaterialsList;