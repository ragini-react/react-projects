import React, { useState, useRef, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  cover: string;
  audio: string;
}

const MusicPlayer: React.FC = () => {
  const [songs] = useState<Song[]>([
    {
      id: 1,
      title: "Tera Ban Jaunga",
      artist: "Akhil Sachdeva & Tulsi Kumar",
      duration: "4:32",
      cover: "💕",
      audio: ""
    },
    {
      id: 2,
      title: "Saiyaara",
      artist: "Mohit Chauhan & Tarannum Mallik",
      duration: "5:18",
      cover: "🌙",
      audio: ""
    },
    {
      id: 3,
      title: "Tu Tho Rootha Nahi Hai",
      artist: "Arijit Singh",
      duration: "4:45",
      cover: "💔",
      audio: ""
    },
    {
      id: 4,
      title: "Mann Bharrya",
      artist: "B Praak",
      duration: "3:56",
      cover: "🎤",
      audio: ""
    },
    {
      id: 5,
      title: "Filhaal",
      artist: "B Praak",
      duration: "4:28",
      cover: "🎵",
      audio: ""
    },
    {
      id: 6,
      title: "Qismat",
      artist: "B Praak",
      duration: "4:12",
      cover: "✨",
      audio: ""
    }
  ]);

  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      // Stop any generated audio
      if ((window as any).audioContext) {
        (window as any).audioContext.suspend();
      }
    } else {
      // Generate a simple tone for demonstration
      generateTone(220 + (currentSong * 110)); // Different frequency for each song
      
      // Since we don't have actual audio files, we'll simulate playback
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 240) { // 4 minutes simulation
            clearInterval(interval);
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };

  // Function to generate audio tones
  const generateTone = (frequency: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
      // Store context for cleanup
      (window as any).audioContext = audioContext;
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  };

  const handleNext = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(randomIndex);
    } else {
      setCurrentSong((prev) => (prev + 1) % songs.length);
    }
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    setCurrentSong((prev) => (prev - 1 + songs.length) % songs.length);
    setCurrentTime(0);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * 240; // 4 minutes simulation
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  const selectSong = (index: number) => {
    setCurrentSong(index);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center position-relative" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <BackButton />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="display-4 fw-bold text-white mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.2)'}}>
                Music Player
              </h1>
              <p className="lead text-white-50 mb-0">Your personal music experience</p>
            </div>

            {/* Main Player Card */}
            <div className="card shadow-lg border-0 mb-4" style={{borderRadius: '24px', backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.95)'}}>
              <div className="card-body p-5">
                {/* Album Art */}
                <div className="text-center mb-4">
                  <div className="d-inline-block position-relative">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center bg-light shadow-sm"
                      style={{width: '200px', height: '200px', fontSize: '4rem'}}
                    >
                      {songs[currentSong].cover}
                    </div>
                    {isPlaying && (
                      <div 
                        className="position-absolute top-0 start-0 rounded-circle border border-3 border-primary"
                        style={{
                          width: '200px', 
                          height: '200px',
                          animation: 'spin 3s linear infinite'
                        }}
                      ></div>
                    )}
                  </div>
                </div>

                {/* Song Info */}
                <div className="text-center mb-4">
                  <h2 className="h4 fw-bold text-dark mb-2">{songs[currentSong].title}</h2>
                  <p className="text-muted mb-0">{songs[currentSong].artist}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div 
                    className="progress mb-2" 
                    style={{height: '8px', cursor: 'pointer'}}
                    ref={progressRef}
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="progress-bar bg-primary"
                      style={{width: `${(currentTime / 240) * 100}%`}}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>{formatTime(currentTime)}</span>
                    <span>{songs[currentSong].duration}</span>
                  </div>
                </div>

                {/* Player Controls */}
                <div className="d-flex justify-content-center align-items-center mb-4">
                  <button 
                    className={`btn btn-outline-secondary me-3 ${isShuffled ? 'btn-primary' : ''}`}
                    onClick={toggleShuffle}
                    style={{width: '50px', height: '50px', borderRadius: '50%'}}
                  >
                    
                  </button>
                  
                  <button 
                    className="btn btn-outline-primary me-3"
                    onClick={handlePrevious}
                    style={{width: '60px', height: '60px', borderRadius: '50%'}}
                  >
                    
                  </button>
                  
                  <button 
                    className="btn btn-primary me-3"
                    onClick={togglePlay}
                    style={{width: '80px', height: '80px', borderRadius: '50%', fontSize: '1.5rem'}}
                  >
                    {isPlaying ? '' : ''}
                  </button>
                  
                  <button 
                    className="btn btn-outline-primary me-3"
                    onClick={handleNext}
                    style={{width: '60px', height: '60px', borderRadius: '50%'}}
                  >
                    
                  </button>
                  
                  <button 
                    className={`btn btn-outline-secondary ${repeatMode !== 'none' ? 'btn-primary' : ''}`}
                    onClick={toggleRepeat}
                    style={{width: '50px', height: '50px', borderRadius: '50%'}}
                  >
                    {repeatMode === 'one' ? '' : ''}
                  </button>
                </div>

                {/* Volume Control */}
                <div className="d-flex align-items-center justify-content-center">
                  <span className="me-3"></span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="form-range"
                    style={{width: '200px'}}
                  />
                </div>
              </div>
            </div>

            {/* Playlist */}
            <div className="card shadow border-0" style={{borderRadius: '16px', background: 'rgba(255,255,255,0.9)'}}>
              <div className="card-header bg-transparent border-0 pb-0">
                <h3 className="h5 fw-bold text-center mb-0">Playlist</h3>
              </div>
              <div className="card-body pt-3">
                <div className="list-group list-group-flush">
                  {songs.map((song, index) => (
                    <div 
                      key={song.id}
                      className={`list-group-item list-group-item-action border-0 rounded mb-2 ${index === currentSong ? 'active' : ''}`}
                      onClick={() => selectSong(index)}
                      style={{cursor: 'pointer'}}
                    >
                      <div className="d-flex align-items-center">
                        <div className="me-3" style={{fontSize: '1.5rem'}}>
                          {song.cover}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-semibold">{song.title}</div>
                          <div className="text-muted small">{song.artist}</div>
                        </div>
                        <div className="text-muted small me-3">
                          {song.duration}
                        </div>
                        {index === currentSong && isPlaying && (
                          <div className="d-flex align-items-center">
                            <div className="bg-primary rounded-circle me-1" style={{width: '4px', height: '20px', animation: 'pulse 1s infinite'}}></div>
                            <div className="bg-primary rounded-circle me-1" style={{width: '4px', height: '15px', animation: 'pulse 1s infinite 0.2s'}}></div>
                            <div className="bg-primary rounded-circle" style={{width: '4px', height: '10px', animation: 'pulse 1s infinite 0.4s'}}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <audio ref={audioRef} />
    </div>
  );
};

export default MusicPlayer;
