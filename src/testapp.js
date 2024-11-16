import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const tracks = [
    { src: '/music/lofi1.mp3', name: 'Track 1' },
    { src: '/music/lofi2.mp3', name: 'Track 2' },
    { src: '/music/lofi3.mp3', name: 'Track 3' },
];

function App() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [showPlanner, setShowPlanner] = useState(false);
    const [showNoteArea, setShowNoteArea] = useState(false);
    const [showDropArea, setShowDropArea] = useState(false);
    const [notes, setNotes] = useState('');
    const [dropAreaSize, setDropAreaSize] = useState({ width: 600, height: 400 });

    const audioPlayerRef = useRef();

    // Load and play the selected track
    const loadTrack = (index) => {
        setCurrentTrackIndex(index);
    };

    const nextTrack = () => {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex);
    };

    const playAudio = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.play();
            setIsAudioPlaying(true);
        }
    };

    const pauseAudio = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            setIsAudioPlaying(false);
        }
    };

    useEffect(() => {
        if (isAudioPlaying && audioPlayerRef.current) {
            audioPlayerRef.current.load();
            audioPlayerRef.current.play().catch((error) => {
                console.warn("Playback error:", error);
            });
        }
    }, [currentTrackIndex, isAudioPlaying]);

    const toggleNoteArea = () => setShowNoteArea(!showNoteArea);

    const toggleDropArea = () => setShowDropArea(!showDropArea);

    const handleFileDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFile = (file) => {
        const fileType = file.type;
        const fileURL = URL.createObjectURL(file);

        if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileURL;
            img.style.width = '100%';
            img.style.height = 'auto';
            const dropArea = document.getElementById('drop-area');
            dropArea.innerHTML = ''; // Clear previous content
            dropArea.appendChild(img);
        } else {
            const dropArea = document.getElementById('drop-area');
            dropArea.innerHTML = `Unsupported file type: ${file.name}`;
        }
    };

    const importNotes = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = () => {
                setNotes(reader.result);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid text file.');
        }
    };

    const handleResize = (dimension, value) => {
        setDropAreaSize((prev) => ({
            ...prev,
            [dimension]: value,
        }));
    };

    return (
        <div className="App">
            <div id="musicPlayer">
                <button onClick={playAudio} disabled={isAudioPlaying}>Play</button>
                <button onClick={pauseAudio} disabled={!isAudioPlaying}>Pause</button>
                <button onClick={nextTrack}>Next Track</button>
                <audio ref={audioPlayerRef} onEnded={nextTrack}>
                    <source src={tracks[currentTrackIndex].src} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
                <p>Currently Playing: {tracks[currentTrackIndex].name}</p>
            </div>

            <button onClick={toggleNoteArea}>Notes</button>
            <button onClick={toggleDropArea}>Toggle Drop Area</button>

            {showNoteArea && (
                <div id="noteArea">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your notes here..."
                    ></textarea>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={importNotes}
                        style={{ marginTop: '10px' }}
                    />
                </div>
            )}

            {showDropArea && (
                <div
                    id="drop-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleFileDrop}
                    style={{
                        width: `${dropAreaSize.width}px`,
                        height: `${dropAreaSize.height}px`,
                        border: '2px dashed #fff',
                        margin: '10px auto',
                        position: 'relative',
                    }}
                >
                    Drag & Drop Files Here
                    <div style={{ marginTop: '10px' }}>
                        <label>
                            Width:
                            <input
                                type="number"
                                value={dropAreaSize.width}
                                onChange={(e) => handleResize('width', e.target.value)}
                                style={{ width: '60px', marginLeft: '5px' }}
                            />
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            Height:
                            <input
                                type="number"
                                value={dropAreaSize.height}
                                onChange={(e) => handleResize('height', e.target.value)}
                                style={{ width: '60px', marginLeft: '5px' }}
                            />
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
