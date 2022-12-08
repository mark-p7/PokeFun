import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Admin() {

  const [calls, setCalls] = useState([]);
  const [labels, setLabels] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [options, setOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'API Calls',
      },
    },
  });
  const [urlRoute, setUrlRoute] = useState("");
  const [timePeriod, setTimePeriod] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(`http://localhost:8080/api/v1/pokeRequests?token=${localStorage.getItem('token')}`, {
        token: localStorage.getItem('token')
      })
      setCalls(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLabels([...new Set(res.data.map((call) => {
        if (call.userEmail === "")
          return "*(Invalid Token Call)"
        return call.userEmail
      }))])
    }
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(false)
  }, [calls, labels])

  const handleTimePeriodChange = (event) => {
    setTimePeriod(event.target.value);
  };

  const handleRouteChange = (event) => {
    setUrlRoute(event.target.value);
  };

  const extractRouteFromUrl = (url, method) => {
    if (url.includes("pokemons")) {
      if (method === "GET") return "pokemons GET";
    }
    if (url.includes("pokemonImage")) {
      if (method === "GET") return "pokemon Image GET";
    }
    if (url.includes("pokemon")) {
      if (method === "GET") return "pokemon GET";
      if (method === "PUT") return "pokemon PUT";
      if (method === "POST") return "pokemon POST";
      if (method === "PATCH") return "pokemon PATCH";
      if (method === "DELETE") return "pokemon DELETE";
    }
    return "*";
  }

  return (
    <div style={{ width: '90%', margin: '20px auto 0px auto' }}>
      <h1>Admin Dashboard</h1>
      {isLoading ? <>Loading</> :
        <div style={{ width: '80%', margin: 'auto' }}>
          <h1>API calls per user</h1>
          <Box sx={{ minWidth: 120, my: 5 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Time Period</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={timePeriod}
                label="Time Period"
                onChange={handleTimePeriodChange}
              >
                <MenuItem value={60 * 60}>Past 1 hour</MenuItem>
                <MenuItem value={60 * 60 * 12}>Past 12 hours</MenuItem>
                <MenuItem value={60 * 60 * 24}>Past 24 hours</MenuItem>
                <MenuItem value={60 * 60 * 24 * 30}>Past 1 Month</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Bar options={options} data={{
            labels,
            datasets: [
              {
                label: 'API calls per user',
                data: labels.map((label) => {
                  var count = 0;
                  for (let i = 0; i < calls.length; i++) {
                    if (calls[i].userEmail === label || (calls[i].userEmail === "" && label === "*(Invalid Token Call)")) {
                      if (timePeriod === 0 || calls[i].dateInSeconds > (Math.floor(Date.now() / 1000) - timePeriod)) count++;
                    }
                  }
                  return count;
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
            ],
          }} />
          <div style={{ width: '100%', margin: '50px auto', textAlign: 'right' }}>
            <i>*(Invalid Token Call) - The API call that was sent did not have a valid token attached to the request</i>
          </div>
          <br />
          <h1>Top API calls per endpoint</h1>
          <Box sx={{ minWidth: 120, my: 5 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label-2">Route</InputLabel>
              <Select
                labelId="demo-simple-select-label-2"
                id="demo-simple-select-2"
                value={urlRoute}
                label="Route"
                onChange={handleRouteChange}
              >
                <MenuItem value={"pokemons GET"}>Pokemons GET</MenuItem>
                <MenuItem value={"pokemon Image GET"}>Pokemon Image GET</MenuItem>
                <MenuItem value={"pokemon GET"}>Pokemon GET</MenuItem>
                <MenuItem value={"pokemon POST"}>Pokemon POST</MenuItem>
                <MenuItem value={"pokemon PUT"}>Pokemon PUT</MenuItem>
                <MenuItem value={"pokemon DELETE"}>Pokemon DELETE</MenuItem>
                <MenuItem value={"pokemon PATCH"}>Pokemon PATCH</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Bar options={options} data={{
            labels,
            datasets: [
              {
                label: 'API calls per user',
                data: labels.map((label) => {
                  var count = 0;
                  for (let i = 0; i < calls.length; i++) {
                    console.log(label)
                    if (calls[i].userEmail === label || (calls[i].userEmail === "" && label === "*(Invalid Token Call)")) {
                      if (extractRouteFromUrl(calls[i].url, calls[i].method) === urlRoute) count++;
                      // console.log(calls[i].url, extractRouteFromUrl(calls[i].url, calls[i].method))
                    }
                  }
                  return count;
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
            ],
          }} />
          <div style={{ width: '100%', margin: '50px auto', textAlign: 'right' }}>
            <i>*(Invalid Token Call) - The API call that was sent did not have a valid token attached to the request</i>
          </div>
          <br />
          <h2>4XX Errors By Endpoint</h2>
          <Bar options={options} data={{
            labels,
            datasets: [
              {
                label: '4XX Errors per API call',
                data: labels.map((label) => {
                  var count = 0;
                  for (let i = 0; i < calls.length; i++) {
                    if (calls[i].userEmail === label || (calls[i].userEmail === "" && label === "*(Invalid Token Call)")) {
                      if (extractRouteFromUrl(calls[i].url, calls[i].method) === urlRoute && (calls[i].status >= 400 && calls[i].status <= 499)) count++;
                    }
                  }
                  return count;
                }),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
              },
            ],
          }} />
          <div style={{ width: '100%', margin: '50px auto', textAlign: 'right' }}>
            <i>*(Invalid Token Call) - The API call that was sent did not have a valid token attached to the request</i>
          </div>

          <div style={{ width: '100%', margin: '25px auto' }}>
            <h1>Recent 4XX and 5XX errors <span style={{ fontSize: '15px' }}>(sorted from latest first)</span></h1>
            <div style={{ overflow: 'scroll', height: '600px', padding: '10px', border: '7px solid black' }}>
              {calls.map((call, index) => {
                if (call.status >= 400 && call.status <= 599) {
                  return (
                    <div key={index} style={{ border: '1px solid #000', padding: '10px', margin: '10px 0px', wordWrap: 'break-word' }}>
                      <h3>Request</h3>
                      <p>URL: {call.url}</p>
                      <p>Method: {call.method}</p>
                      <p>Status: {call.status}</p>
                      <p>Email (may be an *invalid token call): {call.userEmail}</p>
                      <p>Date: {call.date}</p>
                    </div>
                  )
                }
              })}
            </div>
          </div>
          <div style={{ width: '100%', margin: '50px auto', textAlign: 'right' }}>
            <i>*(Invalid Token Call) - The API call that was sent did not have a valid token attached to the request</i><br />
            <i>*If there is no request under "Recent 4XX and 5XX errors", then there are no responses that have been given that error status</i>
          </div>

        </div>
      }
    </div>
  )
}

export default Admin