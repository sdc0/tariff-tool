import { createContext, useState } from "react"

export class Trade {
    constructor(paying_country, material_giving_country, materials, value, initiator, target, accepted=false) {
        this.paying_country = paying_country;
        this.material_giving_country = material_giving_country;
        this.materials = materials;
        this.value = value;

        this.initiator = initiator;
        this.target = target;

        this.accepted = accepted;
    }

    static clone(trade) {
        return new Trade(trade.paying_country, trade.material_giving_country, trade.materials, trade.value, trade.initiator, trade.target, trade.accepted);
    }
}

export const TradesContext = createContext();

export const TradesProvider = ({ children }) => {
    const [trades, setTrades] = useState({});

    return (
        <TradesContext.Provider value={{ trades, setTrades }}>
            {children}
        </TradesContext.Provider>
    )
}