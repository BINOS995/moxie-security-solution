// Firebase Configuration for Moxie Ghana Photo Management System

// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Authentication has been moved to direct implementation in HTML files

// Storage functions
const uploadImage = async (file, category) => {
  try {
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
    
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURLWithCORS(snapshot.ref);
    
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
    
    await addDoc(collection(db, "images"), imageData);
    
    return { success: true, imageData };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
};

const getImagesByCategory = async (category) => {
  try {
    const imagesRef = collection(db, "images");
    const q = query(imagesRef, where("category", "==", category));
    const querySnapshot = await getDocs(q);
    
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
    return { success: false, error: error.message };
  }
};

const getAllImages = async () => {
  try {
    const imagesRef = collection(db, "images");
    const querySnapshot = await getDocs(imagesRef);
    
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
    return { success: false, error: error.message };
  }
};

const replaceImage = async (docId, oldPath, newFile, category) => {
  try {
    // Delete old image from storage
    const oldStorageRef = ref(storage, oldPath);
    await deleteObject(oldStorageRef);
    
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
    
    const snapshot = await uploadBytes(newStorageRef, newFile, metadata);
    const downloadURL = await getDownloadURLWithCORS(snapshot.ref);
    
    // Update Firestore document
    const imageRef = doc(db, "images", docId);
    await updateDoc(imageRef, {
      name: newFile.name,
      url: downloadURL,
      path: `images/${category}/${fileName}`,
      timestamp: timestamp,
      size: newFile.size,
      type: newFile.type
    });
    
    return { success: true, url: downloadURL };
  } catch (error) {
    console.error("Replace image error:", error);
    return { success: false, error: error.message };
  }
};

const deleteImage = async (docId, path) => {
  try {
    // Delete from storage
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
    // Delete from Firestore
    const imageRef = doc(db, "images", docId);
    await deleteDoc(imageRef);
    
    return { success: true };
  } catch (error) {
    console.error("Delete image error:", error);
    return { success: false, error: error.message };
  }
};

// Custom getDownloadURL function with CORS handling
const getDownloadURLWithCORS = async (ref) => {
  try {
    const url = await getDownloadURL(ref);
    // Add a cache-busting parameter to the URL to prevent CORS caching issues
    const urlWithCacheBusting = new URL(url);
    urlWithCacheBusting.searchParams.append('t', new Date().getTime());
    return urlWithCacheBusting.toString();
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
};

// Export functions
export {
  storage,
  db,
  uploadImage,
  getImagesByCategory,
  getAllImages,
  replaceImage,
  deleteImage,
  corsHeaders
};