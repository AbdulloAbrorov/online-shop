"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const fs_1 = __importDefault(require("fs"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: process.env.NODE_ENV === 'production'
            ? process.env.FRONTEND_URL || 'https://your-production-domain.com'
            : (origin, callback) => {
                if (!origin)
                    return callback(null, true);
                const allowed = [
                    /^http:\/\/localhost:\d+$/,
                    /^http:\/\/127\.0\.0\.1:\d+$/,
                ];
                const explicit = process.env.FRONTEND_URL
                    ? [process.env.FRONTEND_URL]
                    : [];
                if (explicit.includes(origin) ||
                    allowed.some((re) => re.test(origin))) {
                    return callback(null, true);
                }
                return callback(new Error(`CORS blocked for origin: ${origin}`));
            },
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Accept, Authorization',
    });
    app.use((0, cookie_parser_1.default)());
    const uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
    if (!fs_1.default.existsSync(uploadsDir)) {
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    }
    app.use('/uploads', express_1.default.static(uploadsDir));
    const port = Number(process.env.PORT) || 3001;
    await app.listen(port);
    console.log(`Server is running on http://localhost:${port}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map