import React, { useState, useEffect } from 'react';
import { BackButton } from '../../shared/back-button/BackButton';
import './ImageGallery.scss';

interface Image {
  id: number;
  title: string;
  category: string;
  url: string;
  description: string;
  tags: string[];
}

const ImageGallery: React.FC = () => {
  const [images] = useState<Image[]>([
    {
      id: 1,
      title: "Mountain Sunrise",
      category: "nature",
      url: "🏔️",
      description: "Beautiful sunrise over mountain peaks",
      tags: ["mountain", "sunrise", "nature"]
    },
    {
      id: 2,
      title: "Ocean Waves",
      category: "nature",
      url: "🌊",
      description: "Peaceful ocean waves at sunset",
      tags: ["ocean", "waves", "sunset"]
    },
    {
      id: 3,
      title: "City Skyline",
      category: "urban",
      url: "🏙️",
      description: "Modern city skyline at night",
      tags: ["city", "skyline", "night"]
    },
    {
      id: 4,
      title: "Forest Path",
      category: "nature",
      url: "🌲",
      description: "Serene path through dense forest",
      tags: ["forest", "path", "trees"]
    },
    {
      id: 5,
      title: "Desert Dunes",
      category: "landscape",
      url: "🏜️",
      description: "Golden sand dunes in the desert",
      tags: ["desert", "sand", "dunes"]
    },
    {
      id: 6,
      title: "Space Galaxy",
      category: "space",
      url: "🌌",
      description: "Stunning view of distant galaxy",
      tags: ["space", "galaxy", "stars"]
    },
    {
      id: 7,
      title: "Tropical Beach",
      category: "nature",
      url: "🏖️",
      description: "Paradise tropical beach with palm trees",
      tags: ["beach", "tropical", "paradise"]
    },
    {
      id: 8,
      title: "Urban Street",
      category: "urban",
      url: "🛣️",
      description: "Busy urban street with traffic",
      tags: ["street", "urban", "traffic"]
    },
    {
      id: 9,
      title: "Autumn Leaves",
      category: "nature",
      url: "🍂",
      description: "Colorful autumn leaves falling",
      tags: ["autumn", "leaves", "fall"]
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  const categories = [
    { value: 'all', label: 'All Images', count: images.length },
    { value: 'nature', label: 'Nature', count: images.filter(img => img.category === 'nature').length },
    { value: 'urban', label: 'Urban', count: images.filter(img => img.category === 'urban').length },
    { value: 'landscape', label: 'Landscape', count: images.filter(img => img.category === 'landscape').length },
    { value: 'space', label: 'Space', count: images.filter(img => img.category === 'space').length }
  ];

  const filteredImages = images.filter(image => {
    const matchesCategory = filter === 'all' || image.category === filter;
    const matchesSearch = searchTerm === '' || 
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const openModal = (image: Image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    if (!selectedImage) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  return (
    <div className="image-gallery">
      <BackButton />
      <div className="gallery-container">
        <div className="header">
          <h1 className="title">📸 Image Gallery</h1>
          <p className="subtitle">Explore beautiful images from around the world</p>
        </div>

        <div className="gallery-controls">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search images..."
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="filter-section">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`filter-btn ${filter === category.value ? 'active' : ''}`}
                  onClick={() => setFilter(category.value)}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>

            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞
              </button>
              <button
                className={`view-btn ${viewMode === 'masonry' ? 'active' : ''}`}
                onClick={() => setViewMode('masonry')}
              >
                ⊟
              </button>
            </div>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className={`gallery-grid ${viewMode}`}>
          {filteredImages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🖼️</div>
              <p>No images match your search criteria</p>
            </div>
          ) : (
            filteredImages.map((image, index) => (
              <div 
                key={image.id} 
                className={`gallery-item ${viewMode === 'masonry' ? `height-${(index % 3) + 1}` : ''}`}
                onClick={() => openModal(image)}
              >
                <div className="image-container">
                  <div className="image-placeholder">
                    <span className="image-emoji">{image.url}</span>
                  </div>
                  <div className="image-overlay">
                    <h3 className="image-title">{image.title}</h3>
                    <p className="image-category">{image.category}</p>
                    <div className="image-tags">
                      {image.tags.map(tag => (
                        <span key={tag} className="tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            
            <div className="modal-navigation">
              <button className="nav-btn prev" onClick={prevImage}>‹</button>
              <button className="nav-btn next" onClick={nextImage}>›</button>
            </div>

            <div className="modal-image">
              <div className="modal-image-container">
                <span className="modal-emoji">{selectedImage.url}</span>
              </div>
            </div>

            <div className="modal-info">
              <h2 className="modal-title">{selectedImage.title}</h2>
              <p className="modal-description">{selectedImage.description}</p>
              <div className="modal-meta">
                <span className="modal-category">Category: {selectedImage.category}</span>
                <div className="modal-tags">
                  {selectedImage.tags.map(tag => (
                    <span key={tag} className="modal-tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
