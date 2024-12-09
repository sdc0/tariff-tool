export class RawMaterial {
    constructor(name) {
        this.name = name;
        this.harvest_prices = {};
        this.sell_prices = {};
    }

    addCountry(country_name, harvest_price, sell_prices) {
        this.harvest_prices[country_name] = harvest_price;
        this.sell_prices[country_name] = sell_prices;
    }

    removeCountry(country_name) {
        delete this.harvest_prices[country_name];
        delete this.sell_prices[country_name];
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
    }

    removeCountry(country_name) {
        delete this.sell_prices[country_name];
    }
}

export const raw_materials = [];
export const processed_materials = [];