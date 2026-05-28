const {
    buildAdminToken,
    isEnvReady,
    setAdminCookie,
    verifyCredentials
} = require("../services/adminAuthService");

async function login(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        return res.status(400).json({ message: "Faltan credenciales" });
    }

    if (!isEnvReady()) {
        return res.status(500).json({ message: "Servidor no configurado" });
    }

    const result = await verifyCredentials(username, password);
    if (!result.ok) {
        return res.status(result.status).json({ message: result.message });
    }

    const token = buildAdminToken();
    setAdminCookie(res, token);
    return res.json({ message: "Autenticación exitosa" });
}

function me(req, res) {
    const token = buildAdminToken();
    setAdminCookie(res, token);
    return res.json({ ok: true });
}

module.exports = { login, me };
