export class Country {
    constructor(name) {
        this.name = name;
        this.raw_materials = [];
        this.processed_materials = [];
    }

    addRawMaterial(material_name) {
        this.raw_materials.push(material_name);
    }

    removeRawMaterial(material_name) {
        this.raw_materials.splice(this.raw_materials.findIndex(m => m.name === material_name), 1);
    }

    addProcessedMaterial(material_name) {
        this.processed_materials.push(material_name);
    }

    removeProcessedMaterial(material_name) {
        this.processed_materials.splice(this.processed_materials.findIndex(m => m.name === material_name), 1);
    }
}

export const countries = [
    new Country("USA"),
    new Country("UK"),
    new Country("FR")
];
