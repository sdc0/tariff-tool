function CountryInfo(props) {
    let country = props.country;

    return (
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center", border: "1px solid black", borderRadius: "10px", margin: "1vh 1vw", width: "100%"}}>
            <p style={{width: "100%", padding: "0", margin: "0", borderBottom: "1px solid black"}}>{country.name}</p>
            <p style={{width: "100%", padding: "0", margin: "0", borderBottom: "1px solid black"}}>Currency: {country.currency}</p>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <h4 style={{borderBottom: "1px solid black", width: "auto", padding: "0", margin: "0"}}>Held Raw Materials</h4>
                {
                    Object.entries({...country.held_domestic_raw, ...country.held_foreign_raw}).map(([mat, amount]) => 
                        <p style={{width: "100%", padding: "0", margin: "0"}}>{mat}: {amount}</p>
                    )
                }
            </div>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <h4 style={{borderBottom: "1px solid black", width: "auto", padding: "0", margin: "0"}}>Held Domestic Produced Materials</h4>
                {
                    Object.entries(country.held_domestic_processed).map(([mat, amount]) => 
                        <p style={{width: "100%", padding: "0", margin: "0"}}>{mat}: {amount}</p>
                    )
                }
            </div>

            <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", width: "100%"}}>
                <h4 style={{borderBottom: "1px solid black", width: "auto", padding: "0", margin: "0"}}>Held Foreign Produced Materials</h4>
                {
                    Object.entries(country.held_foreign_processed).map(([mat, amount]) => 
                        <p style={{width: "100%", padding: "0", margin: "0"}}>{mat}: {amount}</p>
                    )
                }
            </div>
        </div>
    );
}

export default CountryInfo;