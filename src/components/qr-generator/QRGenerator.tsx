import React, { useState, useRef } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './QRGenerator.scss';

interface QRCode {
  id: number;
  text: string;
  size: number;
  color: string;
  backgroundColor: string;
  createdAt: Date;
}

const QRGenerator: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [currentQR, setCurrentQR] = useState<QRCode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = () => {
    if (!inputText.trim()) return;

    const newQR: QRCode = {
      id: Date.now(),
      text: inputText.trim(),
      size: qrSize,
      color: qrColor,
      backgroundColor: backgroundColor,
      createdAt: new Date()
    };

    setQrCodes([newQR, ...qrCodes]);
    setCurrentQR(newQR);
    drawQRCode(newQR);
  };

  const drawQRCode = (qr: QRCode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = qr.size;
    canvas.height = qr.size;

    // Clear canvas
    ctx.fillStyle = qr.backgroundColor;
    ctx.fillRect(0, 0, qr.size, qr.size);

    // Generate a simple QR-like pattern (this is a simulation)
    const moduleSize = qr.size / 25; // 25x25 grid
    ctx.fillStyle = qr.color;

    // Generate pattern based on text hash
    const hash = simpleHash(qr.text);
    const pattern = generatePattern(hash);

    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, moduleSize);
    drawFinderPattern(ctx, 18 * moduleSize, 0, moduleSize);
    drawFinderPattern(ctx, 0, 18 * moduleSize, moduleSize);
  };

  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const generatePattern = (hash: number): boolean[][] => {
    const pattern: boolean[][] = Array(25).fill(null).map(() => Array(25).fill(false));
    
    // Use hash to generate pseudo-random pattern
    let seed = hash;
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        // Skip finder pattern areas
        if ((row < 7 && col < 7) || 
            (row < 7 && col > 17) || 
            (row > 17 && col < 7)) {
          continue;
        }
        
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        pattern[row][col] = (seed % 100) < 45; // ~45% fill rate
      }
    }
    
    return pattern;
  };

  const drawFinderPattern = (ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number) => {
    // Outer square (7x7)
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // Inner white square (5x5)
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Center square (3x3)
    ctx.fillStyle = qrColor;
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  };

  const downloadQR = () => {
    if (!currentQR || !canvasRef.current) return;

    const link = document.createElement('a');
    link.download = `qr-code-${currentQR.id}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const copyQRToClipboard = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('QR Code copied to clipboard!');
        }
      });
    } catch (err) {
      console.error('Failed to copy QR code:', err);
      alert('Failed to copy QR code to clipboard');
    }
  };

  const selectQR = (qr: QRCode) => {
    setCurrentQR(qr);
    setInputText(qr.text);
    setQrSize(qr.size);
    setQrColor(qr.color);
    setBackgroundColor(qr.backgroundColor);
    drawQRCode(qr);
  };

  const deleteQR = (id: number) => {
    setQrCodes(qrCodes.filter(qr => qr.id !== id));
    if (currentQR && currentQR.id === id) {
      setCurrentQR(null);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
  };

  const presetTexts = [
    'https://example.com',
    'Hello World!',
    'Contact: +1234567890',
    'WiFi:T:WPA;S:MyNetwork;P:password;;',
    'mailto:example@email.com',
    'Visit our website for more info!'
  ];

  return (
    <div className="qr-generator">
      <BackButton />
      <div className="generator-container">
        <div className="header">
          <h1 className="title">📱 QR Code Generator</h1>
          <p className="subtitle">Create custom QR codes instantly</p>
        </div>

        <div className="generator-section">
          <div className="input-section">
            <div className="text-input-group">
              <label>Text or URL</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text, URL, or any content..."
                className="text-input"
                rows={3}
              />
            </div>

            <div className="presets-section">
              <label>Quick Presets</label>
              <div className="presets-grid">
                {presetTexts.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(preset)}
                    className="preset-btn"
                  >
                    {preset.length > 20 ? `${preset.substring(0, 20)}...` : preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="customization-section">
              <div className="control-group">
                <label>Size: {qrSize}px</label>
                <input
                  type="range"
                  min="150"
                  max="400"
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="size-slider"
                />
              </div>

              <div className="color-controls">
                <div className="color-group">
                  <label>Foreground Color</label>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="color-input"
                  />
                </div>

                <div className="color-group">
                  <label>Background Color</label>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="color-input"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={generateQRCode}
              className="generate-btn"
              disabled={!inputText.trim()}
            >
              🎨 Generate QR Code
            </button>
          </div>

          <div className="preview-section">
            <div className="qr-display">
              <canvas
                ref={canvasRef}
                className="qr-canvas"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  border: '2px solid #e1e8ed',
                  borderRadius: '12px'
                }}
              />
              
              {!currentQR && (
                <div className="placeholder">
                  <div className="placeholder-icon">📱</div>
                  <p>Your QR code will appear here</p>
                </div>
              )}
            </div>

            {currentQR && (
              <div className="qr-actions">
                <button onClick={downloadQR} className="action-btn primary">
                  💾 Download PNG
                </button>
                <button onClick={copyQRToClipboard} className="action-btn secondary">
                  📋 Copy to Clipboard
                </button>
              </div>
            )}

            {currentQR && (
              <div className="qr-info">
                <h4>QR Code Details</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Content:</span>
                    <span className="info-value">{currentQR.text}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Size:</span>
                    <span className="info-value">{currentQR.size}x{currentQR.size}px</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created:</span>
                    <span className="info-value">{currentQR.createdAt.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="history-section">
          <h3 className="section-title">Generated QR Codes</h3>
          
          {qrCodes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📱</div>
              <p>No QR codes generated yet. Create your first one above!</p>
            </div>
          ) : (
            <div className="qr-grid">
              {qrCodes.map(qr => (
                <div 
                  key={qr.id} 
                  className={`qr-item ${currentQR?.id === qr.id ? 'active' : ''}`}
                  onClick={() => selectQR(qr)}
                >
                  <div className="qr-preview">
                    <div 
                      className="mini-qr"
                      style={{
                        backgroundColor: qr.backgroundColor,
                        border: `2px solid ${qr.color}`
                      }}
                    >
                      📱
                    </div>
                  </div>
                  
                  <div className="qr-details">
                    <p className="qr-text">
                      {qr.text.length > 30 ? `${qr.text.substring(0, 30)}...` : qr.text}
                    </p>
                    <p className="qr-meta">
                      {qr.size}px • {qr.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQR(qr.id);
                    }}
                    className="delete-qr-btn"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
