import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const tracks = [
    { src: '/music/lofi1.mp3', name: 'Track 1' },
    { src: '/music/lofi2.mp3', name: 'Track 2' },
    { src: '/music/lofi3.mp3', name: 'Track 3' },
    { src: '/music/lofi4.mp3', name: 'Track 4' },
    { src: '/music/lofi5.mp3', name: 'Track 5' },
    { src: '/music/lofi6.mp3', name: 'Track 6' },
    { src: '/music/lofi7.mp3', name: 'Track 7' },
    { src: '/music/lofi8.mp3', name: 'Track 8' },
    { src: '/music/lofi9.mp3', name: 'Track 9' },
];

function App() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showPlanner, setShowPlanner] = useState(false);
    const [showNoteArea, setShowNoteArea] = useState(false);
    const [showDropArea, setShowDropArea] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [background, setBackground] = useState('/images/background1.gif');
    const [notes, setNotes] = useState('');
    const [dropAreaSize, setDropAreaSize] = useState({ width: '400px', height: '300px' });
    const [isPlaying, setIsPlaying] = useState(false);
    const taskInputRef = useRef();
    const audioPlayerRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        const audioElement = audioPlayerRef.current;
        
        const handleTrackEnd = () => {
            nextTrack();
        };

        audioElement.addEventListener('ended', handleTrackEnd);
        
        return () => {
            audioElement.removeEventListener('ended', handleTrackEnd);
        };
    }, [currentTrackIndex]);

    const loadTrack = (index) => {
        const audioElement = audioPlayerRef.current;
        audioElement.src = tracks[index].src;
        audioElement.load();
        if (isPlaying) {
            audioElement.play();
        }
    };

    const nextTrack = () => {
        const newIndex = (currentTrackIndex + 1) % tracks.length;
        setCurrentTrackIndex(newIndex);
        loadTrack(newIndex);
    };

    const previousTrack = () => {
        const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        setCurrentTrackIndex(newIndex);
        loadTrack(newIndex);
    };

    useEffect(() => {
        const audioElement = audioPlayerRef.current;
        audioElement.addEventListener('play', () => setIsPlaying(true));
        audioElement.addEventListener('pause', () => setIsPlaying(false));
        
        return () => {
            audioElement.removeEventListener('play', () => setIsPlaying(true));
            audioElement.removeEventListener('pause', () => setIsPlaying(false));
        };
    }, []);

    const togglePlanner = () => {
        setShowPlanner(!showPlanner);
    };

    const toggleDropArea = () => setShowDropArea(!showDropArea);

    const toggleNoteArea = () => setShowNoteArea(!showNoteArea);

    const changeBackground = (event) => setBackground(`/images/${event.target.value}`);

    const handleDropAreaResize = (dimension, value) => {
        setDropAreaSize(prev => ({
            ...prev,
            [dimension]: value
        }));
    };

    const addTask = () => {
        const taskText = taskInputRef.current.value.trim();
        if (taskText !== '') {
            setTasks([...tasks, { text: taskText, completed: false }]);
            taskInputRef.current.value = '';
        }
    };

    const toggleTaskCompletion = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    };

    const removeTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    const exportNotes = () => {
        const blob = new Blob([notes], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const loadNotesFromFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setNotes(e.target.result);
            };
            reader.readAsText(file);
        }
    };

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
        const dropArea = document.getElementById('drop-area-content');
        dropArea.innerHTML = ''; // Clear previous content

        if (fileType === 'application/pdf') {
            const preview = document.createElement('embed');
            preview.src = fileURL;
            preview.style.width = '100%';
            preview.style.height = '100%';
            dropArea.appendChild(preview);
        } else if (fileType.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileURL;
            img.style.width = '100%';
            img.style.height = 'auto';
            dropArea.appendChild(img);
        } else if (fileType.startsWith('video/')) {
            const videoElement = document.createElement('video');
            videoElement.src = fileURL;
            videoElement.controls = true;
            videoElement.style.width = '100%';
            dropArea.appendChild(videoElement);
        } else {
            dropArea.innerHTML = `Unsupported file type: <strong>${file.name}</strong>`;
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div style={{ backgroundImage: `url(${background})` }} className="App">
            <div id="topRightText"><img src="logo.png" alt="Logo" height="100" width="300" /></div>

            <div id="musicPlayer">
                <button onClick={previousTrack} title="Previous Track">&#9664;</button>
                <div className="track-info">
                    <span>Now Playing: {tracks[currentTrackIndex].name}</span>
                </div>
                <audio ref={audioPlayerRef} controls>
                    <source src={tracks[currentTrackIndex].src} type="audio/mp3" />
                    Your browser does not support the audio element.
                </audio>
                <button onClick={nextTrack} title="Next Track">&#9654;</button>
                <button onClick={togglePlanner} title="Planner">📅</button>
                <button onClick={toggleDropArea} title="File viewer">📂</button>
                <button onClick={toggleNoteArea} title="Notes">📝</button>
                <button onClick={toggleFullscreen} title="Fullscreen">⛶</button>

                <div id="backgroundSelector">
                    <select onChange={changeBackground} value={background}>
                        <option value="background1.gif">Blue Lagoon</option>
                        <option value="background4.gif">Cafe</option>
                        <option value="background6.gif">Beachside Living room</option>
                        <option value="background7.gif">Sunset Window</option>
                        <option value="background8.gif">Midnight Street</option>
                    </select>
                </div>
            </div>

            {showNoteArea && (
                <div id="noteArea">
                    <textarea
                        id="noteTextArea"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write your notes here..."
                    ></textarea>
                    <div className="note-controls">
                        <button onClick={exportNotes}>Save Notes</button>
                        <input
                            type="file"
                            accept=".txt"
                            onChange={loadNotesFromFile}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                        />
                        <button onClick={() => fileInputRef.current.click()}>
                            Load Notes
                        </button>
                    </div>
                </div>
            )}

            {showPlanner && (
                <div id="planner">
                    <h2>My Planner</h2>
                    <input
                        type="text"
                        ref={taskInputRef}
                        placeholder="Enter a new task..."
                    />
                    <button onClick={addTask}>Add Task</button>
                    <div id="tasks">
                        {tasks.map((task, index) => (
                            <div key={index} className={`task ${task.completed ? 'completed' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(index)}
                                />
                                {task.text}
                                <button onClick={() => removeTask(index)}>Remove</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showDropArea && (
                <div id="drop-area-container">
                    <div className="drop-area-controls">
                        <label>
                            Width:
                            <input
                                type="text"
                                value={dropAreaSize.width}
                                onChange={(e) => handleDropAreaResize('width', e.target.value)}
                            />
                        </label>
                        <label>
                            Height:
                            <input
                                type="text"
                                value={dropAreaSize.height}
                                onChange={(e) => handleDropAreaResize('height', e.target.value)}
                            />
                        </label>
                    </div>
                    <div
                        id="drop-area"
                        style={{
                            width: dropAreaSize.width,
                            height: dropAreaSize.height,
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                    >
                        <div id="drop-area-content">
                            Drag & Drop any file here
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;