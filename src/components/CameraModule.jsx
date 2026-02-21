import { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';
import { submitData } from '../api';

const CameraModule = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });

            streamRef.current = mediaStream;
            setCameraActive(true);
            setError(null);
            return true;
        } catch (err) {
            console.error(err);
            setError('Camera access denied. Please allow camera permissions to proceed.');
            return false;
        }
    };

    useEffect(() => {
        if (cameraActive && videoRef.current && streamRef.current) {
            const video = videoRef.current;
            video.srcObject = streamRef.current;

            const handleLoadedMetadata = async () => {
                try {
                    await video.play();
                } catch (err) {
                    console.error("Video play error:", err);
                }
            };

            video.addEventListener('loadedmetadata', handleLoadedMetadata);

            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            };
        }
    }, [cameraActive]);

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setCameraActive(false);
    };

    const captureImage = () => {
        if (!videoRef.current || !canvasRef.current) return null;

        const video = videoRef.current;
        const canvas = canvasRef.current;

        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Mirror correctly since video is mirrored
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, width, height);

        const imageData = canvas.toDataURL('image/jpeg');
        return imageData;
    };

    const analyzeFace = async () => {
        if (!cameraActive) return;

        const image = captureImage();
        if (!image) return;

        setCapturedImage(image);
        stopCamera(); // Freeze frame effect

        setIsAnalyzing(true);

        setTimeout(() => {
            const mockResult = {
                symmetry: 0.98,
                status: 'Normal',
                message: 'No significant asymmetry detected.',
                confidence: 0.95
            };

            setResult(mockResult);
            setIsAnalyzing(false);

            submitData('temp-session', 'face', {
                ...mockResult,
                image
            });

        }, 2000);
    };

    const reset = () => {
        setResult(null);
        setIsAnalyzing(false);
        setCapturedImage(null);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <div className="module-container">
            <h2><Camera size={24} className="inline-icon" /> Face Analysis</h2>
            <p className="description">Align your face within the frame. Maintain a neutral expression.</p>

            <div className="camera-frame-container">
                {!cameraActive && !capturedImage ? (
                    <div className="camera-placeholder" onClick={startCamera}>
                        <Camera size={48} />
                        <span>Tap to Enable Camera</span>
                    </div>
                ) : capturedImage ? (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className={`camera-feed ${isAnalyzing ? 'scanning' : ''}`}
                    />
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`camera-feed ${isAnalyzing ? 'scanning' : ''}`}
                        />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div className="guide-overlay">
                            <div className="face-oval"></div>
                            <div className="grid-lines"></div>
                        </div>
                    </>
                )}
            </div>

            {error && <div className="error-message"><AlertTriangle size={16} /> {error}</div>}

            <div className="controls">
                {!result ? (
                    <button
                        className="btn btn-primary action-btn"
                        onClick={analyzeFace}
                        disabled={isAnalyzing || !cameraActive}
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Capture & Analyze'}
                    </button>
                ) : (
                    <div className="result-card animate-fade-in">
                        <div className="result-header">
                            <CheckCircle size={24} color="var(--status-success)" />
                            <h3>Analysis Complete</h3>
                        </div>
                        <div className="result-body">
                            <div className="metric">
                                <span className="label">Symmetry Score</span>
                                <span className="value">{(result.symmetry * 100).toFixed(0)}%</span>
                            </div>
                            <p className="result-message">{result.message}</p>
                        </div>
                        <button className="btn btn-secondary" onClick={reset}>
                            <RefreshCw size={16} /> Retake
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                .module-container {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-md);
                }
                .inline-icon { vertical-align: middle; margin-right: 8px; color: hsl(var(--color-primary)); }
                .description { font-size: 0.9rem; margin-bottom: var(--space-lg); }

                .camera-frame-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4/3;
                    background: #eee;
                    border-radius: var(--radius-lg);
                    overflow: hidden;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.1);
                }

                .camera-placeholder {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: hsl(var(--text-muted));
                    cursor: pointer;
                    background: #f0f2f5;
                    transition: background 0.2s;
                }
                .camera-placeholder:hover { background: #e5e8eb; }

                .camera-feed {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform: scaleX(-1);
                }
                
                .scanning {
                    filter: sepia(0.2) contrast(1.1);
                    transition: filter 2s;
                }

                .guide-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .face-oval {
                    width: 50%;
                    height: 70%;
                    border: 2px dashed rgba(255, 255, 255, 0.7);
                    border-radius: 50%;
                    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
                }

                .error-message {
                    color: hsl(var(--status-error));
                    background: rgba(255,0,0,0.1);
                    padding: var(--space-sm);
                    border-radius: var(--radius-sm);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.9rem;
                }

                .controls {
                    display: flex;
                    justify-content: center;
                    margin-top: var(--space-md);
                }

                .action-btn { width: 100%; padding: var(--space-lg); font-size: 1.1rem; }

                .result-card {
                    background: hsl(var(--bg-card));
                    border: 1px solid rgba(0,0,0,0.05);
                    padding: var(--space-md);
                    border-radius: var(--radius-md);
                    width: 100%;
                    text-align: center;
                }
                .result-header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-bottom: var(--space-sm);
                    color: hsl(var(--status-success));
                }
                .metric {
                    display: flex;
                    justify-content: space-between;
                    padding: var(--space-sm) 0;
                    border-bottom: 1px solid #eee;
                    margin-bottom: var(--space-sm);
                }
                .value { font-weight: 700; color: hsl(var(--text-main)); }
            `}</style>
        </div>
    );
};

export default CameraModule;