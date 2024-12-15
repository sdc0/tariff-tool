import { createContext, useState } from "react";

export class Country {
    constructor(name) {
        this.name = name;
        this.raw_materials = [];
        this.processed_materials = [];
    }

    addRawMaterial(material_name) {
        if (!this.raw_materials.includes(material_name)) this.raw_materials.push(material_name);
    }

    removeRawMaterial(material_name) {
        if (this.raw_materials.includes(material_name)) this.raw_materials.splice(this.raw_materials.findIndex(m => m.name === material_name), 1);
    }

    addProcessedMaterial(material_name) {
        if (!this.processed_materials.includes(material_name)) this.processed_materials.push(material_name);
    }

    removeProcessedMaterial(material_name) {
        if (this.processed_materials.includes(material_name)) this.processed_materials.splice(this.processed_materials.findIndex(m => m.name === material_name), 1);
    }

    static clone(country) {
        let c = new Country(country.name);

        // eslint-disable-next-line
        country.raw_materials.map((m) => {
            c.addRawMaterial(m);
        });
        
        // eslint-disable-next-line
        country.processed_materials.map((m) => {
            c.addProcessedMaterial(m);
        });

        return c;
    }

    addRawHelper(countries, material) {
        let index = countries.findIndex(c => c.name === this.name);

        let c = Country.clone(this);
        c.addRawMaterial(material);

        let list = [...countries];
        list[index] = c;
        return list;
    }

    removeRawHelper(countries, material) {
        let index = countries.findIndex(c => c.name === this.name);

        let c = Country.clone(this);
        c.removeRawMaterial(material);

        let list = [...countries];
        list[index] = c;
        return list;
    }

    addProcessedHelper(countries, material) {
        let index = countries.findIndex(c => c.name === this.name);

        let c = Country.clone(this);
        c.addProcessedMaterial(material);

        let list = [...countries];
        list[index] = c;
        return list;
    }

    removeProcessedHelper(countries, material) {
        let index = countries.findIndex(c => c.name === this.name);

        let c = Country.clone(this);
        c.removeProcessedMaterial(material);

        let list = [...countries];
        list[index] = c;
        return list;
    }
}

export const CountriesContext = createContext();

export const CountriesProvider = ({ children }) => {
    const [countries, setCountries] = useState([]);

    return (
        <CountriesContext.Provider value={{ countries, setCountries }}>
            {children}
        </CountriesContext.Provider>
    );
}