"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
// Middleware
app.use((0, cors_1.default)({
    origin: [env_1.config.cors.origin, 'http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Global rate limiter
app.use('/api/', rateLimiter_1.rateLimiter);
// Routes
app.use('/api', routes_1.default);
// Error handler (must be last)
app.use(errorHandler_1.errorHandler);
const PORT = env_1.config.port;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${env_1.config.nodeEnv}`);
    console.log(`🔗 CORS enabled for: ${env_1.config.cors.origin}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map