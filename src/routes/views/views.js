import { Router } from 'express';
import { isAuthenticated, isNotAuthenticated, isAdmin } from '../../middleware/auth.js';

const router = Router();

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.send('Esta es una página solo para administradores');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

export default router;
