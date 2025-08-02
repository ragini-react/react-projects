import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './ColorPalette.scss';

interface Color {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

interface Palette {
  id: number;
  name: string;
  colors: Color[];
  createdAt: Date;
  category: string;
}

const ColorPalette: React.FC = () => {
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [paletteMode, setPaletteMode] = useState<'generator' | 'custom' | 'harmony'>('generator');
  const [baseColor, setBaseColor] = useState('#3498db');
  const [harmonyType, setHarmonyType] = useState<'complementary' | 'triadic' | 'analogous' | 'monochromatic'>('complementary');

  useEffect(() => {
    const savedPalettes = localStorage.getItem('colorPalettes');
    if (savedPalettes) {
      const parsedPalettes = JSON.parse(savedPalettes).map((palette: any) => ({
        ...palette,
        createdAt: new Date(palette.createdAt)
      }));
      setPalettes(parsedPalettes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('colorPalettes', JSON.stringify(palettes));
  }, [palettes]);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    const toHex = (c: number): string => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const createColorObject = (hex: string): Color => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { hex, rgb, hsl };
  };

  const generateRandomPalette = (): Color[] => {
    const colors: Color[] = [];
    for (let i = 0; i < 5; i++) {
      const hue = Math.floor(Math.random() * 360);
      const saturation = 50 + Math.floor(Math.random() * 50);
      const lightness = 30 + Math.floor(Math.random() * 40);
      const hex = hslToHex(hue, saturation, lightness);
      colors.push(createColorObject(hex));
    }
    return colors;
  };

  const generateHarmonyPalette = (baseHex: string, type: string): Color[] => {
    const baseRgb = hexToRgb(baseHex);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const colors: Color[] = [createColorObject(baseHex)];

    switch (type) {
      case 'complementary':
        colors.push(createColorObject(hslToHex((baseHsl.h + 180) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex(baseHsl.h, Math.max(20, baseHsl.s - 30), Math.min(80, baseHsl.l + 20))));
        colors.push(createColorObject(hslToHex((baseHsl.h + 180) % 360, Math.max(20, baseHsl.s - 30), Math.min(80, baseHsl.l + 20))));
        colors.push(createColorObject(hslToHex(baseHsl.h, Math.max(10, baseHsl.s - 50), Math.max(20, baseHsl.l - 20))));
        break;
      
      case 'triadic':
        colors.push(createColorObject(hslToHex((baseHsl.h + 120) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex((baseHsl.h + 240) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex(baseHsl.h, Math.max(20, baseHsl.s - 20), Math.min(80, baseHsl.l + 15))));
        colors.push(createColorObject(hslToHex((baseHsl.h + 120) % 360, Math.max(20, baseHsl.s - 20), Math.min(80, baseHsl.l + 15))));
        break;
      
      case 'analogous':
        colors.push(createColorObject(hslToHex((baseHsl.h + 30) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex((baseHsl.h - 30 + 360) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex((baseHsl.h + 60) % 360, baseHsl.s, baseHsl.l)));
        colors.push(createColorObject(hslToHex((baseHsl.h - 60 + 360) % 360, baseHsl.s, baseHsl.l)));
        break;
      
      case 'monochromatic':
        colors.push(createColorObject(hslToHex(baseHsl.h, baseHsl.s, Math.min(90, baseHsl.l + 30))));
        colors.push(createColorObject(hslToHex(baseHsl.h, baseHsl.s, Math.max(10, baseHsl.l - 30))));
        colors.push(createColorObject(hslToHex(baseHsl.h, Math.max(20, baseHsl.s - 30), baseHsl.l)));
        colors.push(createColorObject(hslToHex(baseHsl.h, Math.min(100, baseHsl.s + 20), baseHsl.l)));
        break;
    }

    return colors;
  };

  const generatePalette = () => {
    let colors: Color[] = [];
    let name = '';
    let category = '';

    switch (paletteMode) {
      case 'generator':
        colors = generateRandomPalette();
        name = `Random Palette ${Date.now()}`;
        category = 'Random';
        break;
      case 'harmony':
        colors = generateHarmonyPalette(baseColor, harmonyType);
        name = `${harmonyType.charAt(0).toUpperCase() + harmonyType.slice(1)} Harmony`;
        category = 'Harmony';
        break;
      case 'custom':
        colors = [createColorObject(baseColor)];
        name = 'Custom Palette';
        category = 'Custom';
        break;
    }

    const newPalette: Palette = {
      id: Date.now(),
      name,
      colors,
      createdAt: new Date(),
      category
    };

    setPalettes([newPalette, ...palettes]);
    setCurrentPalette(newPalette);
  };

  const addColorToPalette = (hex: string) => {
    if (!currentPalette || currentPalette.colors.length >= 8) return;

    const newColor = createColorObject(hex);
    const updatedPalette = {
      ...currentPalette,
      colors: [...currentPalette.colors, newColor]
    };

    setCurrentPalette(updatedPalette);
    setPalettes(palettes.map(p => p.id === currentPalette.id ? updatedPalette : p));
  };

  const removeColorFromPalette = (index: number) => {
    if (!currentPalette || currentPalette.colors.length <= 1) return;

    const updatedPalette = {
      ...currentPalette,
      colors: currentPalette.colors.filter((_, i) => i !== index)
    };

    setCurrentPalette(updatedPalette);
    setPalettes(palettes.map(p => p.id === currentPalette.id ? updatedPalette : p));
  };

  const copyColorToClipboard = (color: Color) => {
    navigator.clipboard.writeText(color.hex);
    setSelectedColor(color);
    setTimeout(() => setSelectedColor(null), 2000);
  };

  const exportPalette = (format: 'css' | 'scss' | 'json' | 'ase') => {
    if (!currentPalette) return;

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'css':
        content = `:root {\n${currentPalette.colors.map((color, i) => `  --color-${i + 1}: ${color.hex};`).join('\n')}\n}`;
        filename = `${currentPalette.name.toLowerCase().replace(/\s+/g, '-')}.css`;
        mimeType = 'text/css';
        break;
      case 'scss':
        content = currentPalette.colors.map((color, i) => `$color-${i + 1}: ${color.hex};`).join('\n');
        filename = `${currentPalette.name.toLowerCase().replace(/\s+/g, '-')}.scss`;
        mimeType = 'text/scss';
        break;
      case 'json':
        content = JSON.stringify(currentPalette, null, 2);
        filename = `${currentPalette.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deletePalette = (id: number) => {
    setPalettes(palettes.filter(p => p.id !== id));
    if (currentPalette && currentPalette.id === id) {
      setCurrentPalette(null);
    }
  };

  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  return (
    <div className="color-palette">
      <BackButton />
      <div className="palette-container">
        <div className="header">
          <h1 className="title">🎨 Color Palette Generator</h1>
          <p className="subtitle">Create beautiful color combinations for your designs</p>
        </div>

        <div className="generator-section">
          <div className="controls-panel">
            <div className="mode-selector">
              <h3>Generation Mode</h3>
              <div className="mode-buttons">
                <button
                  className={`mode-btn ${paletteMode === 'generator' ? 'active' : ''}`}
                  onClick={() => setPaletteMode('generator')}
                >
                  🎲 Random
                </button>
                <button
                  className={`mode-btn ${paletteMode === 'harmony' ? 'active' : ''}`}
                  onClick={() => setPaletteMode('harmony')}
                >
                  🌈 Harmony
                </button>
                <button
                  className={`mode-btn ${paletteMode === 'custom' ? 'active' : ''}`}
                  onClick={() => setPaletteMode('custom')}
                >
                  ✏️ Custom
                </button>
              </div>
            </div>

            {(paletteMode === 'harmony' || paletteMode === 'custom') && (
              <div className="base-color-selector">
                <h3>Base Color</h3>
                <div className="color-input-group">
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="color-input"
                  />
                  <input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="hex-input"
                    placeholder="#000000"
                  />
                </div>
              </div>
            )}

            {paletteMode === 'harmony' && (
              <div className="harmony-selector">
                <h3>Harmony Type</h3>
                <select
                  value={harmonyType}
                  onChange={(e) => setHarmonyType(e.target.value as any)}
                  className="harmony-select"
                >
                  <option value="complementary">Complementary</option>
                  <option value="triadic">Triadic</option>
                  <option value="analogous">Analogous</option>
                  <option value="monochromatic">Monochromatic</option>
                </select>
              </div>
            )}

            <button onClick={generatePalette} className="generate-btn">
              ✨ Generate Palette
            </button>
          </div>

          <div className="palette-display">
            {currentPalette ? (
              <div className="current-palette">
                <div className="palette-header">
                  <h3>{currentPalette.name}</h3>
                  <div className="palette-actions">
                    <button onClick={() => exportPalette('css')} className="export-btn">CSS</button>
                    <button onClick={() => exportPalette('scss')} className="export-btn">SCSS</button>
                    <button onClick={() => exportPalette('json')} className="export-btn">JSON</button>
                  </div>
                </div>

                <div className="colors-grid">
                  {currentPalette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="color-card"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColorToClipboard(color)}
                    >
                      <div className="color-overlay" style={{ color: getContrastColor(color.hex) }}>
                        <div className="color-hex">{color.hex}</div>
                        <div className="color-rgb">
                          RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                        </div>
                        <div className="color-hsl">
                          HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)
                        </div>
                        {selectedColor === color && (
                          <div className="copied-indicator">Copied!</div>
                        )}
                      </div>
                      
                      {currentPalette.colors.length > 1 && (
                        <button
                          className="remove-color-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeColorFromPalette(index);
                          }}
                          style={{ color: getContrastColor(color.hex) }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {paletteMode === 'custom' && currentPalette.colors.length < 8 && (
                    <div className="add-color-card">
                      <input
                        type="color"
                        onChange={(e) => addColorToPalette(e.target.value)}
                        className="add-color-input"
                      />
                      <div className="add-color-text">Add Color</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-palette">
                <div className="empty-icon">🎨</div>
                <p>Generate a palette to see colors here</p>
              </div>
            )}
          </div>
        </div>

        <div className="palettes-history">
          <h3 className="section-title">Saved Palettes</h3>
          
          {palettes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <p>No palettes saved yet. Generate your first palette!</p>
            </div>
          ) : (
            <div className="palettes-grid">
              {palettes.map(palette => (
                <div
                  key={palette.id}
                  className={`palette-item ${currentPalette?.id === palette.id ? 'active' : ''}`}
                  onClick={() => setCurrentPalette(palette)}
                >
                  <div className="palette-preview">
                    {palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="preview-color"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  
                  <div className="palette-info">
                    <h4 className="palette-name">{palette.name}</h4>
                    <p className="palette-meta">
                      {palette.category} • {palette.colors.length} colors
                    </p>
                    <p className="palette-date">
                      {palette.createdAt.toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePalette(palette.id);
                    }}
                    className="delete-palette-btn"
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

export default ColorPalette;
