import axios from "axios";
import "./weather.css";
import { useState, useEffect } from "react";

const Weather = () => {
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);

    const apiKey = "ed390a0c58d0bea9b103d7c59984a2a5";

    // Adicionando estado para armazenar a localização do usuário
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        // Função para obter a localização do usuário
        const getUserLocation = () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Erro ao obter a localização do usuário", error);
                    }
                );
            } else {
                console.error("Geolocalização não é suportada neste navegador");
            }
        };

        getUserLocation();
    }, []); // Executa apenas uma vez no início

    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
            setWeatherData(response.data);
        } catch (error) {
            console.error("Erro ao buscar dados do clima", error);
        }
    };

    useEffect(() => {
        // Se a localização do usuário estiver disponível e a cidade não for fornecida manualmente, busca automaticamente as informações do clima
        if (userLocation && !city) {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation.lat}&lon=${userLocation.lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            fetchData(url);
        }
    }, [userLocation, city]); // Executa sempre que a localização do usuário ou a cidade são atualizadas

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Se a localização do usuário não estiver disponível ou se uma cidade for fornecida manualmente, busca as informações do clima com a cidade fornecida
        if (!userLocation || city) {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
            fetchData(url);
            setCity("");
        }
    };

    return (
        <>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Digite a cidade..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button type="submit">Buscar</button>
                </form>
            </div>

            {weatherData !== null && (
                <div className="date">
                    <h6>Tempo agora em </h6>
                    <p class="city">{weatherData.name}</p>
                    <p>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                            alt="Ícone do Tempo"
                            width="50"
                        />
                    </p>
                    <p className="clima">{weatherData.weather[0].description}</p>
                    <p>{Math.round(weatherData.main.temp)}º C</p>
                    <p>Sensação térmica: {Math.round(weatherData.main.feels_like)}º C</p>
                    <p>Máx:{Math.round(weatherData.main.temp_max)}º C | Mín: {Math.round(weatherData.main.temp_min)}º C</p>
                </div>
            )}
        </>
    );
};

export default Weather;
