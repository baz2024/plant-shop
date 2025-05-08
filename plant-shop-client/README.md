
# 🌿 Full Stack E-Commerce Plant Shop Tutorial

This tutorial walks you through building a complete e-commerce website using:

- **React + MUI** (frontend)
- **Node.js + Express** (backend)
- **Firebase** for Authentication and Firestore Database

---

## 1. 🔧 Project Setup

### Frontend (Vite + React + MUI)
```bash
npm create vite@latest plant-shop-client --template react
cd plant-shop-client
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material firebase react-router-dom
```

### Backend (Express + Firebase Admin SDK)
```bash
mkdir plant-shop-server
cd plant-shop-server
npm init -y
npm install express cors dotenv firebase-admin
```

---

## 2. 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project
3. Enable Authentication (Email/Password + Google)
4. Create Firestore DB
5. Download serviceAccountKey.json for server-side Firebase admin access

---

## 3. `firebase.js` Setup (React Client)
```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

## 4. Authentication with Firebase (Signup + Signin + Google Signin)

Use `createUserWithEmailAndPassword`, `signInWithEmailAndPassword`, and `signInWithPopup`.

### Redirect after login:
```js
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
navigate("/products");
```

---

## 5. Admin Authentication (Checking Firestore)
```js
import { doc, getDoc } from "firebase/firestore";

const checkIfAdmin = async (uid) => {
  const docRef = doc(db, "admins", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};
```

---

## 6. Backend API: `server.js`
```js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

app.get('/api/products', async (req, res) => {
  const snapshot = await db.collection('products').get();
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(products);
});

app.listen(5000, () => console.log('Server running on port 5000'));
```

---

## 7. App Routing (`App.jsx`)
```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ProductListPage from './components/ProductListPage';
import AdminCategories from './components/AdminCategories';
import ProductAdmin from './components/ProductAdmin';
import CssBaseline from '@mui/material/CssBaseline';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<ProductAdmin />} />
      </Routes>
    </Router>
  );
}
```

---

## 8. Product List Page (`ProductListPage.jsx`)
```jsx
import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "products")).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  if (loading) return <Box sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">All Products</Typography>
      <Grid container spacing={3}>
        {products.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card>
              <CardMedia component="img" height="180" image={p.imageUrl || "https://via.placeholder.com/180"} />
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography color="text.secondary">{p.category}</Typography>
                <Typography fontWeight="bold">€{p.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductListPage;
```

---

## 9. Admin Category Management (`AdminCategories.jsx`)

Allows CRUD operations on the `categories` collection.

> See earlier section: [AdminCategories code](#6-backend-api-serverjs)

---

## 10. Admin Product Management (`ProductAdmin.jsx`)

Allows CRUD operations on the `products` collection.

> See earlier section: [ProductAdmin code](#8-product-list-page-productlistpagejsx)

---

## ✅ Wrap-Up

You now have a working full-stack e-commerce app with:
- Firebase Authentication (email + Google)
- Firestore for categories and products
- Admin and user interfaces
