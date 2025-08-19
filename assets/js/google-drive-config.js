// Google Drive Integration for Moxie Ghana Photo Management System
// This replaces Firebase Storage with Google Drive API integration

function GoogleDriveManager() {
  this.CLIENT_ID = '321096729616-365vvp2cmg9r5m86lnjb37b525eskp9s.apps.googleusercontent.com'; // Moxie Ghana Client ID
  this.API_KEY = 'AIzaSyDSVzMQhuFEGo70AABflyGsvrzxBn6nY84'; // Moxie Ghana API Key
  this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
  this.folderName = 'MoxieGhana_Images';
  this.folderId = null;
  this.isInitialized = false;
  this.useLocalStorage = false;
  this.localStorageKey = 'moxie_ghana_images';
}

// Initialize Google API Client
GoogleDriveManager.prototype.initialize = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    // Check if gapi is already loaded
    if (typeof gapi !== 'undefined') {
      self.initGapiClient().then(resolve).catch(reject);
      return;
    }
    
    var script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = function() {
      self.initGapiClient().then(resolve).catch(reject);
    };
    script.onerror = function() {
      console.warn('Google API failed to load - falling back to local storage');
      self.useLocalStorage = true;
      resolve();
    };
    document.head.appendChild(script);
  });
};

GoogleDriveManager.prototype.initGapiClient = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    gapi.load('client:auth2', function() {
      gapi.client.init({
        apiKey: self.API_KEY,
        clientId: self.CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: self.SCOPES
      }).then(function() {
        self.isInitialized = true;
        resolve();
      }).catch(function(error) {
        console.warn('Google API initialization failed - falling back to local storage:', error);
        self.useLocalStorage = true;
        resolve();
      });
    });
  });
};

  // Authenticate user
  GoogleDriveManager.prototype.authenticate = function() {
    var self = this;
    return new Promise(function(resolve, reject) {
      self.initialize().then(function() {
        var GoogleAuth = gapi.auth2.getAuthInstance();
        if (!GoogleAuth.isSignedIn.get()) {
          return GoogleAuth.signIn();
        }
        return Promise.resolve();
      }).then(function() {
        resolve(gapi.auth2.getAuthInstance().currentUser.get());
      }).catch(reject);
    });
  };

  // Create or get existing folder
  GoogleDriveManager.prototype.getOrCreateFolder = function(folderName) {
    var self = this;
    if (typeof folderName === 'undefined') folderName = this.folderName;
    return new Promise(function(resolve, reject) {
      // Check if folder exists
      gapi.client.drive.files.list({
        q: "name='" + folderName + "' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name)'
      }).then(function(response) {
        if (response.result.files.length > 0) {
          self.folderId = response.result.files[0].id;
          resolve(self.folderId);
          return;
        }

        // Create new folder
        return gapi.client.drive.files.create({
          resource: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder'
          }
        });
      }).then(function(createResponse) {
        if (createResponse) {
          self.folderId = createResponse.result.id;
          resolve(self.folderId);
        }
      }).catch(function(error) {
        console.error('Error creating/getting folder:', error);
        reject(error);
      });
    });
  };

  // Local storage fallback methods with compression and quota handling
  GoogleDriveManager.prototype.saveToLocalStorage = function(imageData) {
    try {
      var images = this.getFromLocalStorage();
      images.push(imageData);
      
      // Check if we're approaching localStorage limit
      var dataToStore = JSON.stringify(images);
      if (dataToStore.length > 5 * 1024 * 1024) { // 5MB threshold
        // Remove oldest images to stay under limit
        while (dataToStore.length > 4 * 1024 * 1024 && images.length > 1) {
          images.shift(); // Remove oldest image
          dataToStore = JSON.stringify(images);
        }
        console.warn('Storage limit approached, removed oldest images');
      }
      
      localStorage.setItem(this.localStorageKey, dataToStore);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Local storage quota exceeded:', error);
        // Remove oldest images to make space
        var images = this.getFromLocalStorage();
        while (images.length > 0) {
          images.shift();
          try {
            localStorage.setItem(this.localStorageKey, JSON.stringify(images));
            break;
          } catch (e) {
            continue;
          }
        }
      } else {
        throw error;
      }
    }
  };

  GoogleDriveManager.prototype.getFromLocalStorage = function() {
    return JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
  };

  GoogleDriveManager.prototype.removeFromLocalStorage = function(id) {
    var images = this.getFromLocalStorage();
    var filtered = images.filter(function(img) {
      return img.id !== id;
    });
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));
  };

  // Upload image to Google Drive or local storage fallback
  GoogleDriveManager.prototype.uploadImage = function(file, category) {
    var self = this;
    if (this.useLocalStorage) {
      return this.uploadImageLocal(file, category);
    }

    return this.authenticate().then(function() {
      return self.getOrCreateFolder();
    }).then(function(folderId) {
      var metadata = {
        name: category + '_' + Date.now() + '_' + file.name,
        parents: [folderId],
        mimeType: file.type
      };

      var form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + gapi.auth.getToken().access_token }),
        body: form
      });
    }).then(function(response) {
      return response.json().then(function(result) {
        return gapi.client.drive.permissions.create({
          fileId: result.id,
          resource: {
            role: 'reader',
            type: 'anyone'
          }
        }).then(function() {
          return gapi.client.drive.files.get({
            fileId: result.id,
            fields: 'id,name,webContentLink'
          });
        }).then(function(fileResponse) {
          var imageData = {
            id: result.id,
            name: result.name,
            url: fileResponse.result.webContentLink,
            category: category,
            timestamp: Date.now(),
            size: file.size,
            type: file.type
          };

          return {
            success: true,
            imageData: imageData,
            storage: 'google-drive'
          };
        });
      });
    }).catch(function(error) {
      console.warn('Google Drive upload failed, falling back to local storage:', error);
      self.useLocalStorage = true;
      return self.uploadImageLocal(file, category);
    });
  };

  // Utility method for image compression
  GoogleDriveManager.prototype.compressImage = function(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    return new Promise(function(resolve, reject) {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type'));
        return;
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');
          
          // Calculate new dimensions while maintaining aspect ratio
          var width = img.width;
          var height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            var ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG
          canvas.toBlob(function(blob) {
            var compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }, 'image/jpeg', quality);
        };
        
        img.onerror = function() {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target.result;
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Local storage upload fallback
  GoogleDriveManager.prototype.uploadImageLocal = function(file, category) {
    var self = this;
    return new Promise(function(resolve, reject) {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type'));
        return;
      }

      // Compress image before storage
      self.compressImage(file).then(function(compressedFile) {
        var reader = new FileReader();
        reader.onload = function(e) {
          var imageData = {
            id: 'local_' + Date.now(),
            name: compressedFile.name,
            url: e.target.result,
            category: category,
            timestamp: Date.now(),
            size: compressedFile.size,
            type: compressedFile.type,
            storage: 'local'
          };
          
          self.saveToLocalStorage(imageData);
          resolve({ success: true, imageData: imageData, storage: 'local' });
        };
        reader.readAsDataURL(compressedFile);
      }).catch(reject);
    });
  };

  // Get images by category
  GoogleDriveManager.prototype.getImagesByCategory = function(category) {
    var self = this;
    
    if (this.useLocalStorage) {
      var images = this.getFromLocalStorage().filter(function(img) {
        return img.category === category;
      });
      return Promise.resolve({ success: true, images: images });
    }

    return this.authenticate().then(function() {
      return self.getOrCreateFolder();
    }).then(function(folderId) {
      return gapi.client.drive.files.list({
        q: "'" + folderId + "' in parents and name contains '" + category + "_' and trashed=false",
        fields: 'files(id, name, webContentLink, createdTime, size, mimeType)',
        orderBy: 'createdTime desc'
      });
    }).then(function(response) {
      var images = response.result.files.map(function(file) {
        return {
          id: file.id,
          name: file.name,
          url: file.webContentLink,
          category: category,
          timestamp: new Date(file.createdTime).getTime(),
          size: parseInt(file.size),
          type: file.mimeType,
          storage: 'google-drive'
        };
      });

      return { success: true, images: images };
    }).catch(function(error) {
      console.warn('Google Drive get images failed, using local storage:', error);
      self.useLocalStorage = true;
      var images = self.getFromLocalStorage().filter(function(img) {
        return img.category === category;
      });
      return { success: true, images: images };
    });
  };

  // Get all images
  GoogleDriveManager.prototype.getAllImages = function() {
    var self = this;
    
    if (this.useLocalStorage) {
      var images = this.getFromLocalStorage();
      return Promise.resolve({ success: true, images: images });
    }

    return this.authenticate().then(function() {
      return self.getOrCreateFolder();
    }).then(function(folderId) {
      return gapi.client.drive.files.list({
        q: "'" + folderId + "' in parents and trashed=false",
        fields: 'files(id, name, webContentLink, createdTime, size, mimeType)',
        orderBy: 'createdTime desc'
      });
    }).then(function(response) {
      var images = response.result.files.map(function(file) {
        var categoryMatch = file.name.match(/^([^_]+)_/);
        var category = categoryMatch ? categoryMatch[1] : 'unknown';
        
        return {
          id: file.id,
          name: file.name,
          url: file.webContentLink,
          category: category,
          timestamp: new Date(file.createdTime).getTime(),
          size: parseInt(file.size),
          type: file.mimeType,
          storage: 'google-drive'
        };
      });

      return { success: true, images: images };
    }).catch(function(error) {
      console.warn('Google Drive get all images failed, using local storage:', error);
      self.useLocalStorage = true;
      var images = self.getFromLocalStorage();
      return { success: true, images: images };
    });
  };

  // Replace image
  GoogleDriveManager.prototype.replaceImage = function(fileId, newFile, category) {
    var self = this;
    return this.authenticate().then(function() {
      // Delete old file
      return gapi.client.drive.files.delete({ fileId: fileId });
    }).then(function() {
      // Upload new file
      return self.uploadImage(newFile, category);
    }).catch(function(error) {
      console.error('Replace image error:', error);
      return { success: false, error: error.message };
    });
  };

  // Delete image with local storage fallback
  GoogleDriveManager.prototype.deleteImage = function(fileId) {
    var self = this;
    
    if (this.useLocalStorage) {
      this.removeFromLocalStorage(fileId);
      return Promise.resolve({ success: true });
    }

    return this.authenticate().then(function() {
      return gapi.client.drive.files.delete({ fileId: fileId });
    }).then(function() {
      return { success: true };
    }).catch(function(error) {
      console.warn('Google Drive delete failed, removing from local storage:', error);
      self.useLocalStorage = true;
      self.removeFromLocalStorage(fileId);
      return { success: true };
    });
  };

  // Check storage status
  GoogleDriveManager.prototype.getStorageStatus = function() {
    return {
      googleDriveEnabled: !this.useLocalStorage,
      localStorageEnabled: this.useLocalStorage,
      totalImages: this.useLocalStorage ? this.getFromLocalStorage().length : 0,
      storageType: this.useLocalStorage ? 'local' : 'google-drive'
    };
  };

  // Clear all images (for testing/reset)
  GoogleDriveManager.prototype.clearAllImages = function() {
    var self = this;
    
    if (this.useLocalStorage) {
      localStorage.removeItem(this.localStorageKey);
      return Promise.resolve({ success: true });
    }

    return this.getAllImages().then(function(result) {
      var deletePromises = result.images.map(function(image) {
        return self.deleteImage(image.id);
      });
      return Promise.all(deletePromises);
    }).then(function() {
      return { success: true };
    }).catch(function(error) {
      console.warn('Google Drive clear failed, clearing local storage:', error);
      localStorage.removeItem(self.localStorageKey);
      return { success: true };
    });
  };

// Create global instance
var googleDriveManager = new GoogleDriveManager();

// Make globally available for use in other files
window.driveManager = googleDriveManager;