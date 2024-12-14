import { useContext } from "react";

import { TariffsContext } from "../../models/tariff.js";

import "./tariffs-list.css";

function TariffsList() {
    // eslint-disable-next-line
    const {tariffs, setTariffs} = useContext(TariffsContext);

    return (
        <div className="tariff-list">
            <div className={tariffs.length > 0 ? "center bottom-border" : "center"}>
                <h2>Tariffs</h2>
            </div>
            {
                tariffs.map((t, index) => {
                    return (
                        <div className="tariff">
                            <span id={`${t.source + "-" + t.target}-label`} onClick={(e) => {e.preventDefault(); document.getElementById(`${t.source + "-" + t.target}-hidden`)?.classList.toggle("hidden"); document.getElementById(`${t.source + "-" + t.target}-label`)?.classList.toggle("bottom-border")}} className={index === 0 ? "" : "top-border"}>{t.source + " -> " + t.target}</span>
                            <div id={`${t.source + "-" + t.target}-hidden`} className="hidden d-flex">
                                {
                                    Object.entries(t.tariffs).map(([key, value]) => {
                                        return (
                                            <div className="tariff-material">
                                                <p>{key + ", " + value}</p>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default TariffsList;