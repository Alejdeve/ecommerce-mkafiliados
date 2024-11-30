# E-commerce-mkafiliados
## Guía Fase 1: Primera Semana

### **1. Configurar Proyecto Next.js**
Objetivo: Crear el frontend del proyecto utilizando Next.js, un framework de React que permite renderizado del lado del servidor y generación de sitios estáticos.

Pasos:

Crear un nuevo proyecto Next.js:

<div style="background-color: #f0f0f0; padding: 0px; border: 1px solid #ddd;">
<pre><code class="powershell">
sh
npx create-next-app@latest ecommerce-infantil-frontend
cd ecommerce-infantil-frontend
</code></pre>
</div>
<br>

Opciones de configuración: Durante la configuración inicial, seleccionamos crear el código dentro del directorio src para mantener una estructura organizada.

Ejecutar el proyecto:

<div style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd;">
<pre><code class="python">
sh
npm run dev
</code></pre>
</div>
<br>
Razón: Next.js facilita el desarrollo de aplicaciones React con funcionalidades integradas como el enrutamiento, la pre-renderización y la optimización automática, mejorando tanto el rendimiento como la experiencia del desarrollador.

2. Configurar Express y MongoDB
Objetivo: Configurar el backend utilizando Express para crear un servidor HTTP y MongoDB como base de datos para almacenar los datos.

Pasos:

Inicializar un proyecto Node.jsen el backend:
<div style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd;">
<pre><code class="python">
sh
cd backend
npm init -y
</code></pre>
</div>
<br>
Instalar dependencias:
<div style="background-color: #f0f0f0; padding: 10px; border: 1px solid #ddd;">
<pre><code class="python">
sh
npm install express mongoose dotenv
Crear el archivo index.js en backend/src:
</code></pre>
</div>
<br>
js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
Razón: Express es un framework minimalista para Node.jsque facilita la creación de servidores HTTP y la gestión de rutas. MongoDB es una base de datos NoSQL escalable y flexible que se integra fácilmente con Node.jsa través de Mongoose.

3. Implementar Autenticación JWT
Objetivo: Implementar autenticación segura utilizando JSON Web Tokens (JWT) para proteger las rutas y verificar la identidad de los usuarios.

Pasos:

Instalar dependencias JWT:

sh
npm install jsonwebtoken bcryptjs
Crear middleware de autenticación en backend/src/middleware/auth.js:

js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
Añadir rutas de autenticación en backend/src/routes/auth.js:

js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Modelo de Usuario
const auth = require('../middleware/auth');

// Registro de usuario
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Ruta protegida de ejemplo
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
Incluir las rutas en el servidor Express en index.js:

js
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
Razón: JWT ofrece una forma segura de transmitir información entre el cliente y el servidor mediante tokens firmados, asegurando que solo los usuarios autenticados puedan acceder a rutas protegidas.

4. Configurar Redux y React Query
Objetivo: Configurar Redux para la gestión del estado global y React Query para la gestión eficiente de las consultas de datos.

Pasos:

Instalar Redux y React Query en el frontend:

sh
cd ecommerce-infantil-frontend
npm install @reduxjs/toolkit react-redux react-query
Crear y configurar el store.js en frontend/src:

js
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        // Añadir tus reducers aquí
    },
});
Configurar Provider en pages/_app.js:

js
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </Provider>
    );
}

export default MyApp;
Razón: Redux facilita la gestión del estado global de la aplicación, permitiendo un flujo de datos predecible. React Query simplifica la obtención, almacenamiento en caché y sincronización de datos del servidor, mejorando la eficiencia de las consultas de datos.

Con esta guía, podrás estudiar y comprender cada paso que hemos realizado durante la primera semana de la Fase 1 de tu proyecto. Si necesitas más detalles o tienes alguna otra pregunta, ¡estaré encantado de ayudarte! 😊🚀246810121416