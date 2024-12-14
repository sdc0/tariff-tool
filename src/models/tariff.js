import { createContext, useState } from "react";

export class Tariff {
    constructor(source_country_name, target_country_name) {
        this.source = source_country_name;
        this.target = target_country_name;
        this.tariffs = {};
    }

    addTariff(material_name, percentage) {
        this.tariffs[material_name] = percentage;
    }

    removeTariff(material_name) {
        delete this.tariffs[material_name];
    }

    static clone(tariff) {
        let t = new Tariff(tariff.source, tariff.target);

        // eslint-disable-next-line
        Object.entries(tariff.tariffs).map(([key, value]) => {
            t.addTariff(key, value);
        });

        return t;
    }
}

export const TariffsContext = createContext();

export const TariffsProvider = ({ children }) => {
    const [tariffs, setTariffs] = useState([]);

    return (
        <TariffsContext.Provider value={{ tariffs, setTariffs }}>
            {children}
        </TariffsContext.Provider>
    );
}