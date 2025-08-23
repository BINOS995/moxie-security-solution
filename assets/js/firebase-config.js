// Firebase Configuration for Moxie Ghana Photo Management System

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc, enableNetwork, disableNetwork } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCA6ZjkjaaldEAeUlS-4gw3QtMXPtEHrAA",
  authDomain: "moxie-gh.firebaseapp.com",
  projectId: "moxie-gh",
  storageBucket: "moxie-gh.appspot.com", // Fixed format from .firebasestorage.app to .appspot.com
  messagingSenderId: "1041086492116",
  appId: "1:1041086492116:web:bbeba21def33d6ac2a7a41"
};

// Set CORS headers for Firebase Storage
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

// Connection state tracking
let isOnline = navigator.onLine;
let retryCount = 0;
const maxRetries = 3;

// Listen for online/offline events
window.addEventListener('online', () => {
  isOnline = true;
  console.log('Network connection restored');
  enableFirebaseNetwork();
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Network connection lost - using offline mode');
  disableFirebaseNetwork();
});

// Enable/disable Firebase network based on connection
async function enableFirebaseNetwork() {
  try {
    await enableNetwork(db);
    console.log('Firebase network enabled');
  } catch (error) {
    console.warn('Could not enable Firebase network:', error);
  }
}

async function disableFirebaseNetwork() {
  try {
    await disableNetwork(db);
    console.log('Firebase network disabled - offline mode');
  } catch (error) {
    console.warn('Could not disable Firebase network:', error);
  }
}

// Retry mechanism for failed operations
async function retryOperation(operation, operationName) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!isOnline) {
        throw new Error('No internet connection');
      }
      
      const result = await operation();
      if (attempt > 1) {
        console.log(`${operationName} succeeded after ${attempt} attempts`);
      }
      return result;
    } catch (error) {
      console.error(`${operationName} attempt ${attempt} failed:`, error);
      
      if (attempt === maxRetries) {
        console.error(`${operationName} failed after ${maxRetries} attempts`);
        throw error;
      }
      
      // Exponential backoff delay
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}

// Authentication has been moved to direct implementation in HTML files

// Storage functions
const uploadImage = async (file, category) => {
  try {
    if (!isOnline) {
      console.warn('Upload failed: No internet connection');
      return { success: false, error: 'No internet connection - using local storage only' };
    }

    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `images/${category}/${fileName}`);
    
    // Add metadata with CORS settings
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
      }
    };
    
    const snapshot = await retryOperation(
      () => uploadBytes(storageRef, file, metadata),
      'Upload to storage'
    );
    
    const downloadURL = await retryOperation(
      () => getDownloadURLWithCORS(snapshot.ref),
      'Get download URL'
    );
    
    // Save metadata to Firestore
    const imageData = {
      name: file.name,
      url: downloadURL,
      category: category,
      path: `images/${category}/${fileName}`,
      timestamp: timestamp,
      size: file.size,
      type: file.type
    };
    
    await retryOperation(
      () => addDoc(collection(db, "images"), imageData),
      'Save to Firestore'
    );
    
    return { success: true, imageData };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
};

const getImagesByCategory = async (category) => {
  try {
    if (!isOnline) {
      console.warn('Get images failed: No internet connection - using local storage');
      return { success: false, error: 'No internet connection - using local storage', offline: true };
    }

    const imagesRef = collection(db, "images");
    const q = query(imagesRef, where("category", "==", category));
    const querySnapshot = await retryOperation(
      () => getDocs(q),
      `Get images by category: ${category}`
    );
    
    const images = [];
    querySnapshot.forEach((doc) => {
      const imageData = doc.data();
      // Add a cache-busting parameter to the URL to prevent CORS caching issues
      const url = new URL(imageData.url);
      url.searchParams.append('t', new Date().getTime());
      images.push({ id: doc.id, ...imageData, url: url.toString() });
    });
    
    return { success: true, images };
  } catch (error) {
    console.error("Get images error:", error);
    return { success: false, error: error.message, offline: !isOnline };
  }
};

const getAllImages = async () => {
  try {
    if (!isOnline) {
      console.warn('Get all images failed: No internet connection - using local storage');
      return { success: false, error: 'No internet connection - using local storage', offline: true };
    }

    const imagesRef = collection(db, "images");
    const querySnapshot = await retryOperation(
      () => getDocs(imagesRef),
      'Get all images from Firestore'
    );
    
    const images = [];
    querySnapshot.forEach((doc) => {
      const imageData = doc.data();
      // Add a cache-busting parameter to the URL to prevent CORS caching issues
      const url = new URL(imageData.url);
      url.searchParams.append('t', new Date().getTime());
      images.push({ id: doc.id, ...imageData, url: url.toString() });
    });
    
    return { success: true, images };
  } catch (error) {
    console.error("Get all images error:", error);
    return { success: false, error: error.message, offline: !isOnline };
  }
};

const replaceImage = async (docId, oldPath, newFile, category) => {
  try {
    if (!isOnline) {
      console.warn('Replace image failed: No internet connection');
      return { success: false, error: 'No internet connection - using local storage only' };
    }

    // Delete old image from storage
    const oldStorageRef = ref(storage, oldPath);
    await retryOperation(
      () => deleteObject(oldStorageRef),
      'Delete old image from storage'
    );
    
    // Upload new image
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${newFile.name}`;
    const newStorageRef = ref(storage, `images/${category}/${fileName}`);
    
    // Add metadata with CORS settings
    const metadata = {
      contentType: newFile.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS'
      }
    };
    
    const snapshot = await retryOperation(
      () => uploadBytes(newStorageRef, newFile, metadata),
      'Upload new image'
    );
    
    const downloadURL = await retryOperation(
      () => getDownloadURLWithCORS(snapshot.ref),
      'Get new download URL'
    );
    
    // Update Firestore document
    const imageRef = doc(db, "images", docId);
    await retryOperation(
      () => updateDoc(imageRef, {
        name: newFile.name,
        url: downloadURL,
        path: `images/${category}/${fileName}`,
        timestamp: timestamp,
        size: newFile.size,
        type: newFile.type
      }),
      'Update Firestore document'
    );
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Replace image error:", error);
    return { success: false, error: error.message };
  }
};

const deleteImage = async (docId, path) => {
  try {
    if (!isOnline) {
      console.warn('Delete image failed: No internet connection');
      return { success: false, error: 'No internet connection - image not deleted from cloud' };
    }

    // Delete from storage
    const storageRef = ref(storage, path);
    await retryOperation(
      () => deleteObject(storageRef),
      'Delete image from storage'
    );
    
    // Delete from Firestore
    const imageRef = doc(db, "images", docId);
    await retryOperation(
      () => deleteDoc(imageRef),
      'Delete image from Firestore'
    );
    
    return { success: true };
  } catch (error) {
    console.error("Delete image error:", error);
    return { success: false, error: error.message };
  }
};

// Custom getDownloadURL function with CORS handling and retry
const getDownloadURLWithCORS = async (ref) => {
  try {
    if (!isOnline) {
      throw new Error('No internet connection');
    }
    
    const url = await retryOperation(
      () => getDownloadURL(ref),
      'Get download URL'
    );
    
    // Add a cache-busting parameter to the URL to prevent CORS caching issues
    const urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.searchParams.append('t', new Date().getTime());
    return urlWithCacheBusting.toString();
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
};

// Connection status utilities
const checkConnectionStatus = () => {
  return {
    isOnline: isOnline,
    dbConnected: isOnline && db ? true : false,
    retryCount: retryCount,
    maxRetries: maxRetries
  };
};

// Initialize Firebase network based on initial connection
if (!isOnline) {
  disableFirebaseNetwork();
} else {
  enableFirebaseNetwork();
}

// Export functions
export {
  storage,
  db,
  uploadImage,
  getImagesByCategory,
  getAllImages,
  replaceImage,
  deleteImage,
  corsHeaders,
  checkConnectionStatus,
  enableFirebaseNetwork,
  disableFirebaseNetwork
};