const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const ADMIN_COOKIE = process.env.ADMIN_COOKIE || "admin_token";
const ADMIN_USER = process.env.ADMIN_USER || "";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "";
const ADMIN_TOKEN_TTL = process.env.ADMIN_TOKEN_TTL || "30m";
const ADMIN_COOKIE_TTL_MS = Number(process.env.ADMIN_COOKIE_TTL_MS || 1000 * 60 * 60 * 2);

function isEnvReady() {
    return Boolean(ADMIN_USER && ADMIN_PASSWORD_HASH && ADMIN_JWT_SECRET);
}

function buildAdminToken() {
    return jwt.sign({ sub: "admin" }, ADMIN_JWT_SECRET, { expiresIn: ADMIN_TOKEN_TTL });
}

function setAdminCookie(res, token) {
    res.cookie(ADMIN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: ADMIN_COOKIE_TTL_MS
    });
}

async function verifyCredentials(username, password) {
    if (!isEnvReady()) {
        return { ok: false, status: 500, message: "Servidor no configurado" };
    }

    if (username !== ADMIN_USER) {
        return { ok: false, status: 401, message: "Credenciales incorrectas" };
    }

    const ok = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!ok) {
        return { ok: false, status: 401, message: "Credenciales incorrectas" };
    }

    return { ok: true, status: 200 };
}

function verifyToken(token) {
    return jwt.verify(token, ADMIN_JWT_SECRET);
}

module.exports = {
    ADMIN_COOKIE,
    buildAdminToken,
    setAdminCookie,
    verifyCredentials,
    verifyToken,
    isEnvReady
};
