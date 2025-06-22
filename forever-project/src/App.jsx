// App.jsx
import React, { useState, useEffect, useRef } from "react";
import './App.css';
import logo from './assets/spotify-logo.png'
import add from './assets/botao-adicionar.png'
import play from './assets/botao-play.png'
import dots from './assets/dots.png'
import pause from './assets/botao-de-pausa.png'
import euiela1 from './assets/euiela1.jpg'
import euiela2 from './assets/euiela2.jpg'
import euiela3 from './assets/euiela3.jpg'
import matheuskauan from './assets/matheuskauan.mp3'


const startDate = new Date("2025-03-05T00:00:00");

function getTimeDifference(from) {
  const now = new Date();
  const diff = now - from;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / 1000 / 60) % 60;
  const hours = Math.floor(diff / 1000 / 60 / 60) % 24;
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;


  return { months, days, hours, minutes, seconds };
}

const images = [
  euiela1,euiela3,euiela2
];

export default function App() {
  const [timePassed, setTimePassed] = useState(getTimeDifference(startDate));
  const [showPopup, setShowPopup] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!showPopup && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay bloqueado:", err);
      });
      setIsPlaying(true);
    }
  }, [showPopup]);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimePassed(getTimeDifference(startDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Carrossel automático a cada 5 segundos
  useEffect(() => {
    if (!showPopup) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showPopup]);

  useEffect(() => {
    if (!showPopup && audioRef.current) {
      const audio = audioRef.current;
      console.log(audio);
      if (!audio) return;

      const updateProgress = () => {
        setCurrentTime(audio.currentTime || 0);
        setDuration(audio.duration || 0);
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);

      audio.addEventListener("timeupdate", updateProgress);
      audio.addEventListener("loadedmetadata", updateProgress);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);

      // Chama update inicial
      updateProgress();

      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
        audio.removeEventListener("loadedmetadata", updateProgress);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
      };
    }
  },[showPopup]);


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };


  return (
    <>
      <div className="hearts-background">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            className="heart"
            key={i}
            style={{
              left: `${(i * 100) / 30}%`, // distribuição mais uniforme
              animationDelay: `${(i % 10) * 1.5}s`, // intervalos espaçados
              animationDuration: `${6 + (i % 5)}s`, // velocidades variadas
            }}
          >
            💗
          </span>
        ))}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Bem-vinda ao nosso cantinho 💖</h2>
            <button
              onClick={() => {
                setShowPopup(false);
                document.documentElement.style.height = "auto"; // ou "100vh" por exemplo
              }}
              className="enter-button"
              aria-label="Entrar no site"
            >
              Entrar
            </button>
          </div>
        </div>
      )}

      {!showPopup && (
        <div className="spotify-container">
             <audio
                ref={audioRef}
                src={matheuskauan}
                preload="auto"
                loop
              />
            <div className="spotify-container-title">
              <img id="album-photo" width={90} src="https://www.mgtradio.net/_next/image?url=https%3A%2F%2Fapi.mgtradio.net%2Ffiles%2Fimages%2Fartists%2Fmaster%2Fmatheus-kauan.jpg&w=384&q=75"/>
              <div className="spotify-mid">
                <div className="spotify-titles">
                  <h3>Te assumi pro Brasil</h3>
                  <p>Matheus & Kauan</p>
                </div>
                <div className="spotify-buttons">
                  <div className="progress-bar">
                    <span>{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => {
                        const newTime = parseFloat(e.target.value);
                        audioRef.current.currentTime = newTime;
                        setCurrentTime(newTime);
                      }}
                    />
                    <span>{formatTime(duration)}</span>
                  </div>

                  <div className="spotify-control">
                    <img width={30} src={add}/>
                    <img width={30} src={dots}/>
                    <div onClick={() => {
                      if (isPlaying) {
                        audioRef.current.pause();
                        setIsPlaying(false);
                      } else {
                        audioRef.current.play().catch(() => {});
                        setIsPlaying(true);
                      }
                    }}>
                      <img width={30} src={isPlaying ? pause : play} alt="Play/Pause" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img id="spotify-icon" width={30} height={30} src={logo}/>
          </div>
      )}

      {!showPopup && (
        <div className="container">
          <div className="carousel">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Foto ${index + 1}`}
                  className="carousel-image"
                />
              ))}
            </div>
          </div>
          <h1>❤️ Eu te amo há:</h1>
          <p className="time">
            {String(timePassed.months)} meses, {String(timePassed.days).padStart(2, "0")} dias, {" "}
            {String(timePassed.hours).padStart(2, "0")} horas, {" "}
            {String(timePassed.minutes).padStart(2, "0")} minutos e{" "}
            {String(timePassed.seconds).padStart(2, "0")} segundos
          </p>
          <hr/>
          <p>
            Esse contador esta contando desde o dia 05/03/2025, o dia que a gente se conheceu, pode parecer clichê
            mas eu ja sentia que seria você e ainda digo que te amo desde então.
            A cada segundo que esse contador passa, meu coração se enche mais de carinho e admiração por você,
            seu abraço apertado me faz me sentir tão bem e confortavel, cada sorriso seu me faz cada vez mais
            se sentir em casa quando estou com você, seu beijo me fez sentir que estou onde eu deveria e onde 
            sempre quis estar, você me fez voltar a ver a vida com mais alegria.
          </p>
          <p>Eu te amo minha princesa 💖</p>
        </div>
      )}
    </>
  );
}
