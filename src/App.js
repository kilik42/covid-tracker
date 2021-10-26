import React, {useState, useEffect} from 'react';
import {
  MenuItem,FormControl,Select , Card, CardContent
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import {sortData } from "./util";




function App() {

  const [countries, setCountries]  = useState([]);
  const [country, setCountry] =  useState('woldwide');
 const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);


//https://disease.sh/v3/covid-19/countries

//use effect 
useEffect (() =>{
  fetch("https://disease.sh/v3/covid-19/all")
  .then((response) => response.json())
  .then((data) =>{
    setCountryInfo(data);
  });
},[]);
useEffect(() => {
  //async > send a request to the server wait for it and then do something with the info
  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response) => response.json() )
    .then((data) => {
      const  countries = data.map((country) => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ));
      const sortedData = sortData(data);

      setTableData(sortedData);
      setCountries(countries);

    })
  }
  getCountriesData();
}, []);

const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  //setCountry(countryCode);

  //make a call 
  //https://disease.sh/v3/covid-19/all
  //https://disease.sh/v3/covid-19/countries/[COUNTRY__CODE]
  const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  await  fetch(url)
  .then(response => response.json())
  .then (data => {
    setCountry(countryCode)
      setCountryInfo(data);
  })

}

  return (
    <div className="app">
        <div className="app__left">

              <div className="app__header">
            <h1>Covid-19 tracker</h1>
            <FormControl className="app__dropdown">
                <Select
                variant="outlined"
                value={country}
                onChange={onCountryChange}
                >
                  <MenuItem value ="worldwide"> Worldwide</MenuItem>
                    {/* <MenuItem value="worldwide">Worldwide</MenuItem>
                    <MenuItem value="worldwide">Option 2</MenuItem>
                    <MenuItem value="worldwide">Option 3</MenuItem>
                    <MenuItem value="worldwide">Option 4</MenuItem> */}

                    {/* loop through all countries and show dropdown list */}

                    {
                      countries.map((country) => (
                        <MenuItem  value ={country.value} > {country.name}</MenuItem>
                      ))
                    }
                
                </Select>
            

              
            </FormControl>
            </div> 
          {/* Header */}


          <div className="app__stats">
            <InfoBox title="Coronavirus cases" 
             cases = {countryInfo.todayCases}
             total ={countryInfo.cases}/>

            <InfoBox title="Coronavirus recovered" 
            cases = {countryInfo.todayRecovered} 
            total ={countryInfo.recovered}/>

            <InfoBox title="Coronavirus deaths" 
            cases = {countryInfo.todayDeaths} 
            total ={countryInfo.deaths} />

            
          </div>

                

                  {/* Map */}
                  <Map/>

          </div>
        
                  
                          <Card className="app__right">
                            <CardContent>
                              <h3>Live Cases by Country</h3>
                                  {/* table */}
                                  <Table countries ={tableData}/>
                              <h3>Worldwide new cases</h3>
                              <LineGraph />
                                  {/* graph */}
                            </CardContent>
                                
                          </Card>
                    
         </div>
     
    
  );
}

export default App;
