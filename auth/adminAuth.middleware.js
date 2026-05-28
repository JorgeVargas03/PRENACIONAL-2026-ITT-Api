const { ADMIN_COOKIE, verifyToken, isEnvReady } = require("../services/adminAuthService");

function requireAdminAuth(req, res, next) {
    if (!isEnvReady()) {
        return res.status(500).json({ message: "Servidor no configurado" });
    }
    try {
        const token = req.cookies[ADMIN_COOKIE];
        if (!token) return res.status(401).json({ message: "No autenticado" });
        const payload = verifyToken(token);
        req.admin = payload;
        return next();
    } catch (e) {
        return res.status(401).json({ message: "Token inválido" });
    }
}

module.exports = { requireAdminAuth };
