import { MainWrapper } from "./styles.module";
import { AiOutlineSearch } from "react-icons/ai";
import { WiHumidity } from "react-icons/wi";
import { SiWindicss } from "react-icons/si";
import { BsFillCloudRainFill, BsFillSunFill } from "react-icons/bs";
import { BsCloudyFill } from "react-icons/bs";
//import { BsCloudRainFill } from "react-icons/bs";
import { BsCloudFog2Fill } from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

// Define interface for WeatherDataProps 
interface WeatherDataProps{
    name: string;

    main: {
        temp: number;
        humidity: number;
    };
    sys:{
        country: string;
    };
    weather:{
        main: string;
    }[];
    wind:{
        speed: number;
    };
}

// Define DisplayWeather
const DisplayWeather = () => {

    const api_key = "a9be9f96866cc735c978be601019571f";
    const api_endpoint = "https://api.openweathermap.org/data/2.5/";

    // Define state variables
    const [weatherData, setWeatherData] = useState<WeatherDataProps | null >(null);

    const [isLoading, setIsLoading] = useState(false);

    const [searchCity, setSearchCity] = useState("");

    // Fetch current weather based on latitude and longitude
    const fetchCurrentWeather = async (lat:number, lon:number) => {
        const url = `${api_endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        const response = await axios.get(url);
        return response.data;
    }

    // Fetch weather databased on city name
    const fetchWeatherData = async (city:string) => {
        try{
            const url = `${api_endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
            const searchResponse = await axios.get(url);

            const currentWeatherData:WeatherDataProps = searchResponse.data;
            return {currentWeatherData};
        }catch (error) {
            console.error("No Data Found");
            throw error;
        }
    }

    // Handle search functionality
    const handleSearch = async () =>{
        if(searchCity.trim()===""){
            return;
        }
        try{
            const { currentWeatherData } = await fetchWeatherData(searchCity);
            setWeatherData(currentWeatherData)
        }catch (error){
            console.error("No Results Found")
        }
    };

    // Change weather icon based on weather condition
    const iconChanger = (weather:string) =>{
        let iconElement: React.ReactNode;
        let iconColor: string;

        switch(weather){
            case "Rain":
            iconElement = <BsFillCloudRainFill />
            iconColor="#272829";
            break;

            case "Clear":
            iconElement = <BsFillSunFill />
            iconColor="#FFC436";
            break;

            case "Clouds":
            iconElement = <BsCloudyFill />
            iconColor= "#102C57";
            break;

            case "Mist":
            iconElement = <BsCloudFog2Fill />
            iconColor="#279EFF";  
            break;          

            default:
                iconElement = <TiWeatherPartlySunny />
                iconColor="#7B2869";
        }

        return (
            <span className="icon" style={{color: iconColor}}>
                {iconElement}
            </span>
        )
    }

    // Fetch current weather based on user's geolocation
    //Render as default
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
                ([currentWeather]) => {
                    setWeatherData(currentWeather);
                    setIsLoading(true);
                    console.log(currentWeather);
                }
            )
        })
    }, []);

    return (
        <MainWrapper>
            <div className="container">
                <div className="searchArea">
                    <input type="text" placeholder="enter a city"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    ></input>
                

                    <div className="searchCircle">
                        <AiOutlineSearch className="searchIcon" onClick={handleSearch}/>
                    </div>
                </div>
                
                {weatherData && isLoading ?(
                    <>
                    <div className="weatherArea">
                    <h1>{weatherData.name}</h1>
                    <span>{weatherData.sys.country}</span>
                    <div className="icon">
                        {iconChanger(weatherData.weather[0].main)}
                    </div>
                    <h1>{weatherData.main.temp.toFixed(0)}</h1>
                    <h2>{weatherData.weather[0].main}</h2>
                </div>

                <div className="bottomInfoArea">
                    <div className="humidityLevel">
                        <WiHumidity className="windIcon"/>
                        <div className="humidInfo">
                            <h1>{weatherData.main.humidity.toFixed(0)}%</h1>
                            <p>Humidity</p>
                        </div>
                    </div>

                    <div className="wind">
                        <SiWindicss className="windIcon"/>
                        <div className="windInfo">
                            <h1>{weatherData.wind.speed}km/h</h1>
                            <p>Wind Speed</p>
                        </div>
                    </div>

                </div>
                    </>
                ):(
                    <div className="loading">
                        <RiLoaderFill className="loadingIcon"/>
                        <p>Loading</p>
                    </div>
                
                )}


            </div>
        </MainWrapper>
    );
}

export default DisplayWeather;
