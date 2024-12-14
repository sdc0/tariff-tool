import { createContext, useState } from "react";

import { countries } from "./country.js";

export class RawMaterial {
    constructor(name) {
        this.name = name;
        this.harvest_prices = {};
        this.sell_prices = {};
    }

    addCountry(country_name, harvest_price, sell_prices) {
        this.harvest_prices[country_name] = harvest_price;
        this.sell_prices[country_name] = sell_prices;

        countries.find(c => c.name === country_name)?.addRawMaterial(this.name);
    }

    removeCountry(country_name) {
        delete this.harvest_prices[country_name];
        delete this.sell_prices[country_name];

        countries.find(c => c.name === country_name)?.removeRawMaterial(this.name);
    }

    static clone(material) {
        let m = new RawMaterial(material.name);

        // eslint-disable-next-line
        Object.entries(material.harvest_prices).map(([key, value]) => {
            m.addCountry(key, value, material.sell_prices[key]);
        });

        return m;
    }
}

export class BasicRawMaterial {
    constructor(name, country, harvest_price, sell_prices) {
        this.name = name;
        this.country = country;
        this.harvest_price = harvest_price;
        this.sell_prices = sell_prices;
    }

    static fromRawMaterial(material) {
        return Object.entries(material.harvest_prices).map(([key, value]) => new BasicRawMaterial(material.name, key, value, material.sell_prices[key]));
    }
}

export class ProcessedMaterial {
    constructor(name, materials) {
        this.name = name;
        this.materials = materials;
        this.sell_prices = {};
    }

    addCountry(country_name, sell_prices) {
        this.sell_prices[country_name] = sell_prices;

        countries.find(c => c.name === country_name)?.addProcessedMaterial(this.name);
    }

    removeCountry(country_name) {
        delete this.sell_prices[country_name];

        countries.find(c => c.name === country_name)?.removeProcessedMaterial(this.name);
    }

    static clone(material) {
        let m = new ProcessedMaterial(material.name);
        
        // eslint-disable-next-line
        Object.entries(material.sell_prices).map(([key, value]) => {
            m.addCountry(key, value);
        });

        return m;
    }
}

export class BasicProcessedMaterial {
    constructor(name, country, materials, sell_prices) {
        this.name = name;
        this.country = country;
        this.materials = materials;
        this.sell_prices = sell_prices;
    }

    static fromProcessedMaterial(material) {
        return Object.entries(material.sell_prices).map(([key, value]) => new BasicProcessedMaterial(material.name, key, material.materials, value))
    }
}

export const RawMaterialsContext = createContext([]);

export const RawMaterialsProvider = ({ children }) => {
    const [rawMaterials, setRawMaterials] = useState([]);
  
    return (
        <RawMaterialsContext.Provider value={{ rawMaterials, setRawMaterials }}>
            {children}
        </RawMaterialsContext.Provider>
    );
};

export const ProcessedMaterialsContext = createContext([]);

export const ProcessedMaterialsProvider = ({ children }) => {
    const [processedMaterials, setProcessedMaterials] = useState([]);
  
    return (
        <ProcessedMaterialsContext.Provider value={{ processedMaterials, setProcessedMaterials }}>
            {children}
        </ProcessedMaterialsContext.Provider>
    );
};