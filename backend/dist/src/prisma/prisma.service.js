"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    enableShutdownHooks(app) {
        this.$on('beforeExit', () => {
            void app.close();
        });
    }
    async cleanDatabase() {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('cleanDatabase should only be used in test environment!');
        }
        const modelNames = Object.getOwnPropertyNames(this)
            .filter((key) => key[0] !== '_' && key[0] !== '$')
            .filter((key) => typeof this[key] === 'object' &&
            this[key] !== null);
        for (const modelName of modelNames) {
            try {
                const modelUnknown = this[modelName];
                const deleteMany = modelUnknown.deleteMany;
                if (typeof deleteMany === 'function') {
                    await deleteMany({});
                }
            }
            catch {
                continue;
            }
        }
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map