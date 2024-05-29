export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const isAdmin = (req, res, next) => {
    const adminEmail = 'adminCoder@coder.com';
    const adminPassword = 'adminCod3r123';

    if (req.session.user && req.session.user.email === adminEmail && req.session.user.password === adminPassword) {
        req.session.user.isAdmin = true; // Marca al usuario como administrador en la sesión
        return next();
    } else {
        res.status(403).send('Acceso denegado');
    }
};
