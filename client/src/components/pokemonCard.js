import React, { useState } from 'react'

function PokemonCard(props) {

    const [name, setName] = useState(props.pokemon.name.english)
    const [type, setType] = useState(props.pokemon.type[0])
    const [urlId, setUrlId] = useState(props.pokemon.id)
    const [overlay, setOverlay] = useState(false);

    if (urlId.length != 3) {
        setUrlId(urlId.toString())
        // console.log(urlId)
        if (urlId.length == 1) {
            setUrlId("00" + urlId)
        }
        if (urlId.length == 2) {
            setUrlId("0" + urlId)
        }
        // console.log('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/' + urlId + ".png")
    }

    const handlePokemonDetails = () => {
        setOverlay(!overlay)
    }

    var types = {
        "Normal": "#A8A77A",
        "Fire": "#EE8130",
        "Water": "#6390F0",
        "Electric": "#F7D02C",
        "Grass": "#7AC74C",
        "Ice": "#96D9D6",
        "Fighting": "#C22E28",
        "Poison": "#A33EA1",
        "Ground": "#E2BF65",
        "Flying": "#A98FF3",
        "Psychic": "#F95587",
        "Bug": "#A6B91A",
        "Rock": "#B6A136",
        "Ghost": "#735797",
        "Dragon": "#6F35FC",
        "Dark": "#705746",
        "Steel": "#B7B7CE",
        "Fairy": "#D685AD"
    }

    return (
        <>
            {overlay ?
                <div style={{ padding: '5px', margin: '5px 0px', width: '100%', height: '80vh', backgroundColor: types[type], cursor: 'pointer', textAlign: 'center' }} onClick={handlePokemonDetails}>
                    <img style={{ marginTop: '50px'}} src={'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/' + urlId + ".png"} height="200px" />
                    <h1>{name}</h1>
                    <h2>HP: {props.pokemon.base.HP}</h2>
                    <h2>Attack: {props.pokemon.base.Attack}</h2>
                    <h2>Defense: {props.pokemon.base.Defense}</h2>
                    <h2>Speed: {props.pokemon.base.Speed}</h2>
                    <br></br>
                    {props.pokemon["type"].map((currentType, index) => {
                        return <span style={{fontSize: '24px', fontWeight: 'bold'}} key={currentType} >
                            &nbsp;{currentType}&nbsp;
                        </span>
                    })
                    }
                </div>
                : <div style={{ width: '100%', height: '80px', backgroundColor: types[type], padding: '5px', margin: '5px 0px', textAlign: 'center' }} onClick={handlePokemonDetails}>
                    <div style={{ display: 'inline-flex' }}>
                        <h1>{name}</h1>
                        <img src={'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/' + urlId + ".png"} height="80px" />
                    </div>
                </div>}
        </>
    )
}

export default PokemonCard