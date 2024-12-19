import { useNavigate } from "react-router-dom";

const Intro = () => {
    const nav = useNavigate();

    return (
        <div style={{display: "flex", flexWrap: "wrap", margin: "1vh 1vw", width: "calc(100vw - 2vw)"}}>
            <div style={{width: "100%"}}>
                <h2>An Intro on How to Play</h2>
                <div style={{margin: "0 1vw"}}>
                    <h3 style={{margin: "0 -0.5vw"}}>Before the Game</h3>
                    <p>You will be asked to create a list of countries (min. 2) and select names for them. You will play as the first of these.</p>
                    <p>Next, you will create a set of processed and raw materials to run the game with.</p>
                    <div style={{margin: "0 2vw"}}>
                        <p>Raw Materials: materials harvested in a country at for a certain price</p>
                        <p>Processed Materials: materials produced in a country at from a list of required raw materials</p>
                    </div>
                    <p>Your goal in the game will be to accumulate as many processed materials as possible, yielding points.</p>
                </div>
                <div style={{margin: "0 1vw"}}>
                    <h3 style={{margin: "0 -0.5vw"}}>During the Game</h3>
                    <p>A usual turn will occur in the following pattern:</p>
                    <div style={{margin: "0 2vw"}}>
                        <p>1. Produce processed materials from all available raw materials (note this is not possible on the first turn)</p>
                        <p>2. Harvest raw materials using available currency</p>
                        <p>3. Create any tariffs between countries (note that CPUs will not do this themselves, only the player can do this)</p>
                        <p>4. Make all trade offers to get other materials from countries (note that there is no safeguard for going over currency limits because this surpassed project scope)</p>
                        <p>5. View all trade offers from other countries, accepting the ones you want</p>
                        <p>6. All accepted trades are resolved and the next turn begins from 1</p>
                    </div>
                    <p>As a side note, the CPUs are able to harvest raw materials, create processed materials, and make trade offers, but do this in a very simple manner, without the ability to create tariffs.</p>
                </div>
                <div style={{margin: "0 1vw"}}>
                    <h3 style={{margin: "0 -0.5vw"}}>Ending the game</h3>
                    <p>As mentioned previously, the goal of the game is to accumulate points from owning processed materials at the end of the game.</p>
                    <p>Processed materials are valued according to the amount of raw materials necessary to create them (1 point per necessary material) with an additional 50% bonus awarded for foreign produced materials</p>
                    <div style={{margin: "0 2vw"}}>
                        <p>ex. A processed material made of two raw materials A and one raw material B (3 total materials) would be worth 3 points at the end of the game if the country who made it holds it, otherwise it would be worth 4 points (4.5 rounded down)</p>
                    </div>
                    <p>All points are summed at the end of the game and the highest points is declared the winner.</p>
                </div>
                <div style={{margin: "0 1vw"}}>
                    <h3 style={{margin: "0 -0.5vw"}}>A Few Brief Notes</h3>
                    <p>While the scope to this project may not seem too large, it is by far the biggest project I have done individually in both Political Science and Computer Science courses, so the simplicity is somewhat deceiving.</p>
                    <p>As to the understanding of the class material, while this game is extremely simplified, there are some design choices I would like to justify:</p>
                    <div stlye={{margin: "0 2vw"}}>
                        <p>Processed materials being the main goal of the game is simply based on an idea of global trade furthering the benefit of everyone, tightening diplomatic ties and giving easier future access to materials and markets, so trading to get goods seems logical as a goal, as it prioritizes both trading (exchanging goods for 50% bonus) and inidividual gain (getting more materials)</p>
                        <p>The point system is just a way of simplifying the goal of trade, as it values goods that would be typically more expensive (more materials in production) and values foreign made products more (50% bonus to incentivize trade)</p>
                        <p>Tariffs were simplified to direct material taxes, which does somewhat demonstrate the advantages of them, with differing harvest costs being offset by tariffs</p>
                    </div>
                </div>
            </div>
            <div style={{display: "flex", width: "100%", justifyContent: "center", alignItems: "center"}}>
                <button onClick={(e) => {
                    e.preventDefault();

                    nav("/home");
                }}>Continue to Game</button>
            </div>
        </div>
    )
}

export default Intro;