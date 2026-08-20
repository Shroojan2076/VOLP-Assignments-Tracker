import dotenv from "dotenv";

dotenv.config();

export function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Missing authorization header"
        });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: "Invalid authorization format"
        });
    }

    if (token !== process.env.APP_API_KEY) {
        return res.status(401).json({
            error: "Invalid API key"
        });
    }

    next();
}