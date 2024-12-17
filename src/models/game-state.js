import { createContext, useState } from "react";

export class GameState {
    constructor(turn, max_turns, phase) {
        this.turn = turn;
        this.max_turns = max_turns;
        this.phase = phase;
    }

    nextPhase() {
        if (this.phase === "production") {
            this.phase = "trade";
        }else if (this.phase === "trade") {
            if (this.turn < this.max_turns) {
                this.phase = "production";
                this.turn += 1;
            }else {
                this.phase = "end";
            }
        }
    }

    static clone(state) {
        return new GameState(state.turn, state.max_turns, state.phase);
    }
}

export const GameStateContext = createContext();

export const GameStateProvider = ({ children }) => {
    const [state, setState] = useState(new GameState(0, 10, "production"));

    return (
        <GameStateContext.Provider value={{ state, setState }}>
            {children}
        </GameStateContext.Provider>
    )
}