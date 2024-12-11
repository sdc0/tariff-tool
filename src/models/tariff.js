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
}

export const tariffs = [];