import React, { useState, useEffect } from 'react';
import './UrlShortener.scss';
import { BackButton } from '../../shared/back-button/BackButton';

interface UrlData {
  id: number;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: Date;
  customAlias?: string;
}

const UrlShortener: React.FC = () => {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    const savedUrls = localStorage.getItem('shortenedUrls');
    if (savedUrls) {
      const parsedUrls = JSON.parse(savedUrls).map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt)
      }));
      setUrls(parsedUrls);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(urls));
  }, [urls]);

  const generateShortCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!inputUrl.trim()) return;
    
    if (!isValidUrl(inputUrl)) {
      alert('Please enter a valid URL');
      return;
    }

    if (customAlias && urls.some(url => url.shortUrl.includes(customAlias))) {
      alert('Custom alias already exists. Please choose a different one.');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const shortCode = customAlias || generateShortCode();
    const newUrl: UrlData = {
      id: Date.now(),
      originalUrl: inputUrl,
      shortUrl: `https://short.ly/${shortCode}`,
      clicks: 0,
      createdAt: new Date(),
      customAlias: customAlias || undefined
    };

    setUrls([newUrl, ...urls]);
    setInputUrl('');
    setCustomAlias('');
    setIsLoading(false);
  };

  const copyToClipboard = async (url: string, id: number) => {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteUrl = (id: number) => {
    setUrls(urls.filter(url => url.id !== id));
  };

  const simulateClick = (id: number) => {
    setUrls(urls.map(url => 
      url.id === id ? { ...url, clicks: url.clicks + 1 } : url
    ));
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clicks, 0);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="url-shortener">
      <BackButton />
      <div className="shortener-container">
        <div className="header">
          <h1 className="title">🔗 URL Shortener</h1>
          <p className="subtitle">Create short, memorable links in seconds</p>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <span className="stat-number">{urls.length}</span>
              <span className="stat-label">URLs Shortened</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👆</div>
            <div className="stat-content">
              <span className="stat-number">{getTotalClicks()}</span>
              <span className="stat-label">Total Clicks</span>
            </div>
          </div>
        </div>

        <div className="shorten-section">
          <div className="input-group">
            <div className="url-input-container">
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter your long URL here..."
                className="url-input"
                onKeyPress={(e) => e.key === 'Enter' && shortenUrl()}
              />
              <span className="input-icon">🌐</span>
            </div>
            
            <div className="alias-input-container">
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                placeholder="Custom alias (optional)"
                className="alias-input"
                maxLength={20}
              />
              <span className="input-icon">✏️</span>
            </div>

            <button 
              onClick={shortenUrl} 
              className="shorten-btn"
              disabled={isLoading || !inputUrl.trim()}
            >
              {isLoading ? '🔄' : '✂️'} {isLoading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>

          <div className="url-preview">
            {customAlias && (
              <p className="preview-text">
                Your short URL will be: <span className="preview-url">https://short.ly/{customAlias}</span>
              </p>
            )}
          </div>
        </div>

        <div className="urls-section">
          <h3 className="section-title">Your Shortened URLs</h3>
          
          {urls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔗</div>
              <p>No URLs shortened yet. Create your first short link above!</p>
            </div>
          ) : (
            <div className="urls-list">
              {urls.map(url => (
                <div key={url.id} className="url-card">
                  <div className="url-info">
                    <div className="url-details">
                      <div className="short-url-section">
                        <span className="short-url">{url.shortUrl}</span>
                        <div className="url-actions">
                          <button
                            onClick={() => copyToClipboard(url.shortUrl, url.id)}
                            className={`copy-btn ${copiedId === url.id ? 'copied' : ''}`}
                          >
                            {copiedId === url.id ? '✅' : '📋'}
                          </button>
                          <button
                            onClick={() => simulateClick(url.id)}
                            className="visit-btn"
                          >
                            🔗
                          </button>
                          <button
                            onClick={() => deleteUrl(url.id)}
                            className="delete-btn"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <div className="original-url">
                        <span className="url-label">Original:</span>
                        <span className="original-link" title={url.originalUrl}>
                          {url.originalUrl.length > 60 
                            ? `${url.originalUrl.substring(0, 60)}...` 
                            : url.originalUrl
                          }
                        </span>
                      </div>
                    </div>

                    <div className="url-meta">
                      <div className="meta-item">
                        <span className="meta-icon">📅</span>
                        <span className="meta-text">{formatDate(url.createdAt)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon">👆</span>
                        <span className="meta-text">{url.clicks} clicks</span>
                      </div>
                      {url.customAlias && (
                        <div className="meta-item">
                          <span className="meta-icon">✏️</span>
                          <span className="meta-text">Custom</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="click-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min((url.clicks / Math.max(getTotalClicks(), 1)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;
