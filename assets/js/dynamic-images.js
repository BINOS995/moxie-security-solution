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
     * Load images from local storage
     */
    function loadImagesFromLocalStorage() {
        try {
            const storedImages = localStorage.getItem('moxie_ghana_images');
            if (!storedImages) {
                console.log('No images found in local storage');
                return [];
            }
            
            return JSON.parse(storedImages);
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
     * Update hero images
     */
    function updateHeroImages(images) {
        const heroImages = document.querySelectorAll('#hero .carousel-item img');
        console.log('Found hero images:', heroImages.length);
        
        if (heroImages.length === 0) {
            console.warn('No hero images found with selector: #hero .carousel-item img');
            return;
        }

        const heroImagesData = images.filter(img => img.category === 'hero');
        console.log('Hero images to display:', heroImagesData.length);
        
        if (heroImagesData.length > 0) {
            heroImages.forEach((img, index) => {
                if (heroImagesData[index]) {
                    let imageUrl = heroImagesData[index].data;
                    
                    // Use data URL directly if it's already formatted, otherwise convert
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

    /**
     * Update portfolio images
     */
    function updatePortfolioImages(images) {
        const portfolioImages = document.querySelectorAll('.portfolio-item img');
        console.log('Found portfolio images:', portfolioImages.length);
        
        if (portfolioImages.length === 0) {
            console.warn('No portfolio images found with selector: .portfolio-item img');
            return;
        }

        const portfolioImagesData = images.filter(img => img.category === 'portfolio');
        console.log('Portfolio images to display:', portfolioImagesData.length);
        
        if (portfolioImagesData.length > 0) {
            portfolioImages.forEach((img, index) => {
                if (portfolioImagesData[index]) {
                    let imageUrl = portfolioImagesData[index].data;
                    
                    // Use data URL directly if it's already formatted, otherwise convert
                    if (!imageUrl.startsWith('data:')) {
                        imageUrl = base64ToBlobUrl(imageUrl, portfolioImagesData[index].type);
                    }
                    
                    if (imageUrl) {
                        img.src = imageUrl;
                        img.alt = portfolioImagesData[index].name || 'Portfolio image';
                        
                        // Update glightbox href
                        const portfolioContent = img.closest('.portfolio-content');
                        if (portfolioContent) {
                            const glightboxLink = portfolioContent.querySelector('.glightbox');
                            if (glightboxLink) {
                                glightboxLink.href = imageUrl;
                            }
                        }
                        console.log(`Updated portfolio image ${index + 1}:`, imageUrl);
                    }
                }
            });
        }
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