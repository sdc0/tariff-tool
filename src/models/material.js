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
}

export const raw_materials = [];
export const processed_materials = [];