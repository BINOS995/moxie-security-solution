/**
 * Dynamic Image Loading from Local Storage
 * Loads images from local storage and updates the index.html page
 */

(function() {
    "use strict";

    // Image categories mapping
    const IMAGE_CATEGORIES = {
        'carousel': '#hero-carousel .carousel-item img',
        'hero': '#hero .carousel-item img',
        'portfolio': '.portfolio-item img'
    };

    /**
     * Debug function to log all images in storage
     */
    function debugStorage() {
        const images = loadImagesFromLocalStorage();
        console.log('=== DEBUG: Images in storage ===');
        console.log('Total images:', images.length);
        images.forEach((img, index) => {
            console.log(`Image ${index + 1}:`, {
                name: img.name,
                category: img.category,
                type: img.type,
                dataLength: img.data?.length || 0
            });
        });
        return images;
    }

    /**
     * Clear all images from local storage
     */
    function clearAllImages() {
        try {
            localStorage.removeItem('googleDriveImages');
            localStorage.removeItem('moxie_ghana_images');
            console.log('All images cleared from local storage');
            
            // Clear displayed images
            clearDisplayedImages();
            
            return true;
        } catch (error) {
            console.error('Error clearing images:', error);
            return false;
        }
    }

    /**
     * Clear images by category
     */
    function clearImagesByCategory(category) {
        try {
            const images = loadImagesFromLocalStorage();
            const filteredImages = images.filter(img => img.category !== category);
            
            localStorage.setItem('googleDriveImages', JSON.stringify(filteredImages));
            console.log(`Cleared ${images.length - filteredImages.length} images from category: ${category}`);
            
            // Refresh displayed images
            refreshImages();
            return true;
        } catch (error) {
            console.error('Error clearing images by category:', error);
            return false;
        }
    }

    /**
     * Delete a specific image by ID
     */
    function deleteImageById(imageId) {
        try {
            const images = loadImagesFromLocalStorage();
            const filteredImages = images.filter(img => img.id !== imageId);
            
            localStorage.setItem('googleDriveImages', JSON.stringify(filteredImages));
            console.log(`Deleted image with ID: ${imageId}`);
            
            // Refresh displayed images
            refreshImages();
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            return false;
        }
    }

    /**
     * Clear all displayed images from the page
     */
    function clearDisplayedImages() {
        // Clear carousel images
        const carouselImages = document.querySelectorAll('#hero-carousel .carousel-item img');
        carouselImages.forEach(img => {
            img.src = 'assets/img/placeholder.jpg'; // Placeholder image
            img.alt = 'Placeholder';
        });

        // Clear hero images
        const heroImages = document.querySelectorAll('#hero .carousel-item img, #hero-carousel .carousel-item img, .hero img');
        heroImages.forEach(img => {
            img.src = 'assets/img/placeholder.jpg'; // Placeholder image
            img.alt = 'Placeholder';
        });

        // Clear portfolio images
        const portfolioImages = document.querySelectorAll('.portfolio-item img');
        portfolioImages.forEach(img => {
            img.src = 'assets/img/placeholder.jpg'; // Placeholder image
            img.alt = 'Placeholder';
        });

        // Clear admin dashboard images
        const adminImages = document.querySelectorAll('#carouselImages img, #heroImages img, #portfolioImages img');
        adminImages.forEach(img => {
            img.src = 'assets/img/placeholder.jpg'; // Placeholder image
            img.alt = 'Placeholder';
        });

        console.log('All displayed images cleared');
    }

    /**
     * Load images from local storage with Google Drive priority
     */
    function loadImagesFromLocalStorage() {
        try {
            console.log('Loading images from local storage...');
            
            // Load Google Drive images with priority
            const googleDriveImages = localStorage.getItem('googleDriveImages');
            if (googleDriveImages) {
                try {
                    const googleImages = JSON.parse(googleDriveImages);
                    const formattedGoogleImages = googleImages.map(img => ({
                        id: img.id,
                        name: img.name,
                        data: img.data || img.url,
                        category: img.category || 'portfolio',
                        type: img.type || 'image/jpeg',
                        timestamp: img.timestamp || Date.now(),
                        size: img.size || 0
                    }));
                    console.log('Google Drive images found:', formattedGoogleImages.length);
                    return formattedGoogleImages;
                } catch (e) {
                    console.error('Error parsing Google Drive images:', e);
                }
            }
            
            // Fallback to legacy images if no Google Drive images
            const legacyImages = localStorage.getItem('moxie_ghana_images');
            if (legacyImages) {
                try {
                    const legacyImagesData = JSON.parse(legacyImages);
                    console.log('Legacy images found:', legacyImagesData.length);
                    return legacyImagesData;
                } catch (e) {
                    console.error('Error parsing legacy images:', e);
                }
            }
            
            console.log('No images found in local storage');
            return [];
        } catch (error) {
            console.error('Error loading images from local storage:', error);
            return [];
        }
    }

    /**
     * Convert base64 image to blob URL
     */
    function base64ToBlobUrl(base64Data, contentType = 'image/jpeg') {
        try {
            let data = base64Data;
            
            // Handle data URLs
            if (base64Data.startsWith('data:')) {
                data = base64Data.split(',')[1];
            }
            
            // Handle already decoded data
            if (!data || data.length === 0) {
                console.error('Invalid base64 data');
                return null;
            }
            
            const byteCharacters = atob(data);
            const byteNumbers = new Array(byteCharacters.length);
            
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: contentType });
            return URL.createObjectURL(blob);
        } catch (error) {
            console.error('Error converting base64 to blob:', error);
            console.error('Data length:', base64Data?.length);
            console.error('Data starts with:', base64Data?.substring(0, 50));
            return null;
        }
    }

    /**
     * Update carousel images
     */
    function updateCarouselImages(images) {
        const carouselImages = document.querySelectorAll('#hero-carousel .carousel-item img');
        console.log('Found carousel images:', carouselImages.length);
        
        if (carouselImages.length === 0) {
            console.warn('No carousel images found with selector: #hero-carousel .carousel-item img');
            return;
        }

        const carouselImagesData = images.filter(img => img.category === 'carousel');
        console.log('Carousel images to display:', carouselImagesData.length);
        
        if (carouselImagesData.length > 0) {
            carouselImages.forEach((img, index) => {
                if (carouselImagesData[index]) {
                    let imageUrl = carouselImagesData[index].data;
                    
                    // Use data URL directly if it's already formatted, otherwise convert
                    if (!imageUrl.startsWith('data:')) {
                        imageUrl = base64ToBlobUrl(imageUrl, carouselImagesData[index].type);
                    }
                    
                    if (imageUrl) {
                        img.src = imageUrl;
                        img.alt = carouselImagesData[index].name || 'Carousel image';
                        console.log(`Updated carousel image ${index + 1}:`, imageUrl);
                    }
                }
            });
        }
    }

    /**
     * Update hero images with Google Drive integration
     */
    function updateHeroImages(images) {
        const heroImages = document.querySelectorAll('#hero .carousel-item img, #hero-carousel .carousel-item img, .hero img');
        console.log('Found hero images:', heroImages.length);
        
        if (heroImages.length === 0) {
            console.warn('No hero images found');
            return;
        }

        // Filter Google Drive images for hero/carousel use
        const heroImagesData = images.filter(img => 
            img.category && ['hero', 'carousel', 'banner', 'general'].includes(img.category)
        );
        console.log('Google Drive hero images to display:', heroImagesData.length);
        
        if (heroImagesData.length > 0) {
            // Replace hero carousel with Google Drive images
            const heroCarousel = document.querySelector('#hero-carousel') || document.querySelector('#hero .carousel');
            if (heroCarousel && heroImagesData.length > 0) {
                // Clear existing carousel items
                const carouselInner = heroCarousel.querySelector('.carousel-inner');
                if (carouselInner) {
                    carouselInner.innerHTML = '';
                    
                    // Create new carousel items for each Google Drive image
                    heroImagesData.forEach((img, index) => {
                        let imageUrl = img.data;
                        
                        if (!imageUrl.startsWith('data:')) {
                            imageUrl = base64ToBlobUrl(imageUrl, img.type);
                        }
                        
                        if (imageUrl) {
                            const carouselItem = createHeroCarouselItem(imageUrl, img.name, img.description || 'Professional construction services', index === 0);
                            carouselInner.appendChild(carouselItem);
                        }
                    });
                    
                    console.log(`Replaced hero carousel with ${heroImagesData.length} Google Drive images`);
                } else {
                    // Fallback for simple hero images
                    heroImages.forEach((img, index) => {
                        if (heroImagesData[index]) {
                            let imageUrl = heroImagesData[index].data;
                            
                            if (!imageUrl.startsWith('data:')) {
                                imageUrl = base64ToBlobUrl(imageUrl, heroImagesData[index].type);
                            }
                            
                            if (imageUrl) {
                                img.src = imageUrl;
                                img.alt = heroImagesData[index].name || 'Hero image';
                            }
                        }
                    });
                }
            } else {
                // Fallback for simple hero images
                heroImages.forEach((img, index) => {
                    if (heroImagesData[index]) {
                        let imageUrl = heroImagesData[index].data;
                        
                        if (!imageUrl.startsWith('data:')) {
                            imageUrl = base64ToBlobUrl(imageUrl, heroImagesData[index].type);
                        }
                        
                        if (imageUrl) {
                            img.src = imageUrl;
                            img.alt = heroImagesData[index].name || 'Hero image';
                            console.log(`Updated hero image ${index + 1}:`, imageUrl);
                        }
                    }
                });
            }
        }
    }

    /**
     * Create hero carousel item
     */
    function createHeroCarouselItem(imageUrl, title, subtitle, isActive = false) {
        const div = document.createElement('div');
        div.className = `carousel-item ${isActive ? 'active' : ''}`;
        
        div.innerHTML = `
            <img src="${imageUrl}" alt="${title}" loading="lazy">
            <div class="carousel-container">
                <div class="container">
                    <h2 class="animate__animated animate__fadeInDown">${title}</h2>
                    <p class="animate__animated animate__fadeInUp animate__delay-1s">${subtitle}</p>
                    <a href="#about" class="btn-get-started animate__animated animate__fadeInUp animate__delay-2s scrollto">Get Started</a>
                </div>
            </div>
        `;
        
        return div;
    }

    /**
     * Update portfolio images with Google Drive integration
     */
    function updatePortfolioImages(images) {
        const portfolioContainer = document.querySelector('#portfolio-container, .portfolio-container, .isotope-container');
        const googleDriveImages = images.filter(img => 
            img.category === 'security' || 
            img.category === 'construction' || 
            img.category === 'civil-engineering' || 
            img.category === 'hvac' || 
            img.category === 'general'
        );
        
        if (googleDriveImages.length === 0) {
            console.log('No portfolio images to display');
            return;
        }

        if (portfolioContainer) {
            // Clear existing dynamic items
            const existingDynamicItems = portfolioContainer.querySelectorAll('.dynamic-portfolio-item');
            existingDynamicItems.forEach(item => item.remove());
            
            // Also update existing portfolio items to ensure consistent URLs
            const existingItems = portfolioContainer.querySelectorAll('.portfolio-item');
            existingItems.forEach(item => {
                const img = item.querySelector('img');
                const glightboxLink = item.querySelector('.glightbox');
                if (img && glightboxLink) {
                    // Ensure the lightbox uses the same URL as the thumbnail
                    glightboxLink.href = img.src;
                }
            });
            
            // Add new items for each category
            const categoryToFilterClass = {
                'security': 'filter-security',
                'construction': 'filter-construction',
                'civil-engineering': 'filter-civil-engineering',
                'hvac': 'filter-hvac',
                'general': 'filter-construction'
            };
            
            const categoryNames = {
                'security': 'Smart Security',
                'construction': 'Metal Works',
                'civil-engineering': 'Civil Engineering',
                'hvac': 'HVAC-Air conditioning',
                'general': 'General Construction'
            };
            
            googleDriveImages.forEach(image => {
                let imageUrl = image.data;
                if (!imageUrl.startsWith('data:')) {
                    imageUrl = base64ToBlobUrl(imageUrl, image.type);
                }
                
                if (imageUrl) {
                    const category = image.category || 'general';
                    const filterClass = categoryToFilterClass[category] || 'filter-construction';
                    
                    const newItem = createPortfolioItem(
                        imageUrl,
                        image.name || 'Project',
                        categoryNames[category] || 'Construction Services',
                        category
                    );
                    newItem.classList.add('dynamic-portfolio-item');
                    portfolioContainer.appendChild(newItem);
                }
            });
            
            // Refresh isotope layout if available
            if (window.jQuery && portfolioContainer.classList.contains('isotope-container')) {
                try {
                    jQuery(portfolioContainer).isotope('layout');
                } catch (e) {
                    console.log('Isotope layout refresh:', e);
                }
            }
        } else {
            // Fallback to updating existing items if container not found
            const portfolioImages = document.querySelectorAll('.portfolio-item img');
            portfolioImages.forEach((img, index) => {
                if (googleDriveImages[index]) {
                    let imageUrl = googleDriveImages[index].data;
                    
                    if (!imageUrl.startsWith('data:')) {
                        imageUrl = base64ToBlobUrl(imageUrl, googleDriveImages[index].type);
                    }
                    
                    if (imageUrl) {
                        img.src = imageUrl;
                        img.alt = googleDriveImages[index].name || 'Portfolio image';
                        
                        // Update glightbox href to use the same URL as thumbnail
                        const portfolioContent = img.closest('.portfolio-content');
                        if (portfolioContent) {
                            const glightboxLink = portfolioContent.querySelector('.glightbox');
                            if (glightboxLink) {
                                glightboxLink.href = imageUrl;
                                glightboxLink.title = googleDriveImages[index].name || 'Project';
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Create a portfolio item element
     */
    function createPortfolioItem(imageUrl, title, description, categoryClass) {
        // Map category to the correct filter class used by the portfolio
        const categoryToFilterClass = {
            'security': 'filter-security',
            'construction': 'filter-construction',
            'civil-engineering': 'filter-civil-engineering',
            'hvac': 'filter-hvac',
            'general': 'filter-construction' // Default for general portfolio
        };
        
        const filterClass = categoryToFilterClass[categoryClass] || 'filter-construction';
        
        const div = document.createElement('div');
        div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${filterClass}`;
        
        div.innerHTML = `
            <div class="portfolio-content h-100">
                <img src="${imageUrl}" class="img-fluid" alt="${title}" loading="lazy">
                <div class="portfolio-info">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <a href="${imageUrl}" title="${title}" data-gallery="portfolio-gallery" class="glightbox preview-link" aria-label="View ${title} project">
                        <i class="bi bi-zoom-in"></i>
                    </a>
                    <a href="#" title="More Details" class="details-link" aria-label="View more details">
                        <i class="bi bi-link-45deg"></i>
                    </a>
                </div>
            </div>
        `;
        
        return div;
    }

    /**
     * Update status indicator
     */
    function updateStatusIndicator(images) {
        const statusDiv = document.getElementById('image-status');
        const countSpan = document.getElementById('image-count');
        
        if (images.length > 0) {
            countSpan.textContent = images.length;
            statusDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        } else {
            statusDiv.style.display = 'none';
        }
    }

    /**
     * Load sample images for testing
     */
    function loadSampleImages() {
        const sampleImages = [
            {
                name: 'Sample Carousel 1',
                category: 'carousel',
                type: 'image/jpeg',
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A'
            },
            {
                name: 'Sample Portfolio 1',
                category: 'portfolio',
                type: 'image/jpeg',
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A'
            }
        ];
        
        localStorage.setItem('moxie_ghana_images', JSON.stringify(sampleImages));
        console.log('Sample images loaded!');
        initDynamicImages();
    }

    /**
     * Load sample Google Drive images for testing
     */
    function loadSampleGoogleDriveImages() {
        const sampleGoogleImages = [
            {
                name: 'Construction Project 1',
                category: 'construction',
                type: 'image/jpeg',
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A'
            },
            {
                name: 'HVAC Installation',
                category: 'hvac',
                type: 'image/jpeg',
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A'
            },
            {
                name: 'Security Camera Setup',
                category: 'security',
                type: 'image/jpeg',
                data: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AB8A'
            }
        ];
        
        localStorage.setItem('googleDriveImages', JSON.stringify(sampleGoogleImages));
        console.log('Sample Google Drive images loaded!');
        initDynamicImages();
    }

    /**
     * Initialize dynamic image loading
     */
    function initDynamicImages() {
        console.log('=== Dynamic Images Debug ===');
        console.log('Initializing dynamic image loading...');
        
        // Check if we're on the right page
        console.log('Current page:', window.location.pathname);
        
        const images = debugStorage();
        
        if (images.length === 0) {
            console.log('No images found to display');
            console.log('Run loadSampleImages() to add test images');
            console.log('OR run loadSampleGoogleDriveImages() to test Google Drive integration');
            
            // Also check if there are any Google Drive images
            const googleDriveImages = localStorage.getItem('googleDriveImages');
            if (googleDriveImages) {
                try {
                    const parsed = JSON.parse(googleDriveImages);
                    console.log('Found Google Drive images:', parsed.length);
                    if (parsed.length > 0) {
                        console.log('Sample image:', parsed[0]);
                    }
                } catch (e) {
                    console.error('Error parsing Google Drive images:', e);
                }
            }
            updateStatusIndicator([]);
            return;
        }

        console.log('Starting image updates...');
        
        // Update images by category
        updateCarouselImages(images);
        updateHeroImages(images);
        updatePortfolioImages(images);

        updateStatusIndicator(images);
        console.log(`Loaded ${images.length} dynamic images`);
    }

    /**
     * Check if images exist in storage
     */
    function checkStorageStatus() {
        const images = loadImagesFromLocalStorage();
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: rgba(0,0,0,0.8); color: white; border-radius: 5px; z-index: 9999; font-size: 12px;';
        statusDiv.textContent = `Dynamic Images: ${images.length} loaded`;
        
        // Remove existing status
        const existingStatus = document.querySelector('.dynamic-image-status');
        if (existingStatus) existingStatus.remove();
        
        statusDiv.className = 'dynamic-image-status';
        document.body.appendChild(statusDiv);
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) statusDiv.remove();
        }, 3000);
    }

    /**
     * Refresh images on page load
     */
    function refreshImages() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initDynamicImages);
        } else {
            initDynamicImages();
        }
    }

    /**
     * Manual refresh function for testing
     */
    window.refreshDynamicImages = function() {
        console.log('Manually refreshing dynamic images...');
        initDynamicImages();
        checkStorageStatus();
    };

    /**
     * Add debug utilities
     */
    window.debugImages = function() {
        const images = loadImagesFromLocalStorage();
        console.table(images.map(img => ({
            name: img.name,
            category: img.category,
            size: img.data.length,
            type: img.type
        })));
    };

    // Initialize on page load
    refreshImages();

    // Refresh function for manual updates
    window.refreshDynamicImages = function() {
        console.log('🔄 Manually refreshing dynamic images...');
        initDynamicImages();
    };

    // Make functions globally accessible for debug buttons
    window.loadSampleImages = loadSampleImages;
    window.debugStorage = debugStorage;
    window.initDynamicImages = initDynamicImages;

    // Listen for storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'moxie_ghana_images') {
            console.log('Images updated, refreshing...');
            setTimeout(initDynamicImages, 500); // Small delay to ensure storage is updated
        }
    });

    console.log('Dynamic Image Loader initialized');
})();