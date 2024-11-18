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

const backgrounds = {
    'background7.gif': 'Sunset Window',
    'background1.gif': 'Blue Lagoon',
    'background4.gif': 'Cafe',
    'background6.gif': 'Beachside Living room',
    'background8.gif': 'Midnight Street'
};

function App() {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [showPlanner, setShowPlanner] = useState(false);
    const [showNoteArea, setShowNoteArea] = useState(false);
    const [showDropArea, setShowDropArea] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [background, setBackground] = useState('/images/background7.gif'); // Default to sunset window
    const [notes, setNotes] = useState('');
    const [isResizing, setIsResizing] = useState(false);
    const [dropAreaSize, setDropAreaSize] = useState({ width: 400, height: 300 });
    const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const taskInputRef = useRef();
    const audioPlayerRef = useRef();
    const fileInputRef = useRef();
    const dropAreaRef = useRef();

    useEffect(() => {
        // Update date and time every minute
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isResizing && dropAreaRef.current) {
                e.preventDefault();
                const dx = e.clientX - resizeStartPos.x;
                const dy = e.clientY - resizeStartPos.y;
                
                setDropAreaSize(prev => ({
                    width: Math.max(400, prev.width + dx),
                    height: Math.max(300, prev.height + dy)
                }));
                setResizeStartPos({ x: e.clientX, y: e.clientY });
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeStartPos]);

    // ... (keep all existing audio-related functions)

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
        dropArea.innerHTML = '';
    
        if (fileType === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = fileURL;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.allowFullscreen = true;
            dropArea.appendChild(iframe);
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

    const handleResizeStart = (e) => {
        e.preventDefault();
        setIsResizing(true);
        setResizeStartPos({ x: e.clientX, y: e.clientY });
    };

    const addTask = () => {
        const taskText = taskInputRef.current.value.trim();
        if (taskText !== '') {
            setTasks([...tasks, {
                text: taskText,
                completed: false,
                date: new Date().toISOString(),
                id: Date.now()
            }]);
            taskInputRef.current.value = '';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div style={{ backgroundImage: `url(${background})` }} className="App">
            <div id="topRightText"><img src="logo.png" alt="Logo" height="100" width="300" /></div>

            {/* ... (keep existing music player code) ... */}

            {showPlanner && (
                <div id="planner">
                    <h2>My Planner</h2>
                    <div className="current-datetime">
                        {currentDateTime.toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                    <div className="task-input-container">
                        <input
                            type="text"
                            ref={taskInputRef}
                            placeholder="Enter a new task..."
                            onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                        <button onClick={addTask} className="add-task-btn">Add Task</button>
                    </div>
                    <div id="tasks">
                        {tasks.sort((a, b) => new Date(b.date) - new Date(a.date)).map((task) => (
                            <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
                                <div className="task-header">
                                    <span className="task-date">{formatDate(task.date)}</span>
                                </div>
                                <div className="task-content">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTaskCompletion(task.id)}
                                    />
                                    <span className="task-text">{task.text}</span>
                                    <button onClick={() => removeTask(task.id)} className="remove-task-btn">
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showDropArea && (
                <div 
                    id="drop-area-container"
                    ref={dropAreaRef}
                    style={{
                        width: `${dropAreaSize.width}px`,
                        height: `${dropAreaSize.height}px`
                    }}
                >
                    <div
                        id="drop-area"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                    >
                        <div id="drop-area-content">
                            Drag & Drop any file here
                        </div>
                    </div>
                    <div 
                        className="resize-handle"
                        onMouseDown={handleResizeStart}
                    ></div>
                </div>
            )}

            {/* ... (keep existing note area code) ... */}

            <div id="backgroundSelector">
                <select 
                    onChange={(e) => setBackground(`/images/${e.target.value}`)} 
                    value={background.split('/').pop()}
                >
                    {Object.entries(backgrounds).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default App;