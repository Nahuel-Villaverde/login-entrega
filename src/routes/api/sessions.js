import { Router } from 'express';
import User from '../../dao/models/user.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).send('Usuario no encontrado');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).send('Contraseña incorrecta');

        req.session.user = {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            password: password, // Almacenar temporalmente para la validación
        };

        // Marca al usuario como administrador si el email y la contraseña coinciden
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user.isAdmin = true;
        }

        res.redirect('/products');
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ first_name, last_name, email, age, password: hashedPassword });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router;
