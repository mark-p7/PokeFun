import React, { useEffect, useState } from 'react';
import PokemonCard from '../components/pokemonCard';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { TextField } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import usePagination from '../hooks/pagination';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const validTypes = [
    'Normal',
    'Fire',
    'Water',
    'Electric',
    'Grass',
    'Ice',
    'Fighting',
    'Poison',
    'Ground',
    'Flying',
    'Psychic',
    'Bug',
    'Rock',
    'Ghost',
    'Dragon',
    'Dark',
    'Steel',
    'Fairy',
];

function App() {

    const [pokemon, setPokemon] = useState([]);
    const [displayPokemon, setDisplayPokemon] = useState([]);
    const [type, setType] = useState([]);
    const [name, setName] = useState("");
    const [page, setPage] = useState(1);
    const PER_PAGE = 10;
    const count = Math.ceil(displayPokemon.length / PER_PAGE);
    const data = usePagination(displayPokemon, PER_PAGE);

    useEffect(() => {
        var pokemonArray = [];
        console.log(type)
        for (let i = 0; i < pokemon.length; i++) {
            if (pokemon[i].name.english.toLowerCase().includes(name.toLowerCase()) && (type.length === 0 || type.every((value) => pokemon[i].type.includes(value)))) {
                pokemonArray.push(pokemon[i]);
            }
        }
        setDisplayPokemon(pokemonArray);
    }, [pokemon, name, type]);

    useEffect(() => {
        var authToken = localStorage.getItem('token')
        if (authToken) {
            fetch(`https://164.92.122.241:8080/api/v1/pokemons?token=${authToken}/`)
                .then(res => res.json())
                .then(pokemon => { setPokemon(pokemon) });
        }
    }, []);

    const handleDataChange = (e, p) => {
        setPage(p);
        data.jump(p);
    };

    const handleTypeChange = (event) => {
        const {
            target: { value },
        } = event;
        setType(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    return (
        <>
            <div style={{ width: '80%', margin: 'auto' }}>
                <h1>Pokemon</h1>
                <TextField id="outlined-basic" label="Name" variant="outlined" onChange={handleNameChange} />
                <Box sx={{ minWidth: 500 }}>
                    <FormControl sx={{ my: 2, width: 500 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Types</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            multiple
                            value={type}
                            onChange={handleTypeChange}
                            input={<OutlinedInput label="Types" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {validTypes.map((typeName) => (
                                <MenuItem key={typeName} value={typeName}>
                                    <Checkbox checked={type.indexOf(typeName) > -1} />
                                    <ListItemText primary={typeName} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <div style={{ fontFamily: 'sans-serif' }}>
                    {
                        data.currentData().map((pokemon) => {
                            return <PokemonCard pokemon={pokemon} key={pokemon.id} />
                        })
                    }
                </div>
                <Pagination
                    page={page}
                    count={count}
                    onChange={handleDataChange}
                    sx={{ my: 2, mx: 'auto', width: 'fit-content' }}
                    size="large" />
            </div>
        </>
    )
}

export default App;