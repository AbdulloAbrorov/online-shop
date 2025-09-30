"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const crypto_1 = require("crypto");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    async getCart(req, res) {
        const userId = req.user?.id;
        let guestId = req.cookies?.guestId;
        if (!userId && !guestId) {
            guestId = (0, crypto_1.randomUUID)();
            res.cookie('guestId', guestId, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
        }
        const identity = userId ? { userId } : { guestId: guestId };
        return this.cartService.getCart(identity);
    }
    async addItem(req, res, body) {
        const userId = req.user?.id;
        let guestId = req.cookies?.guestId;
        if (!userId && !guestId) {
            guestId = (0, crypto_1.randomUUID)();
            res.cookie('guestId', guestId, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 30,
            });
        }
        const identity = userId ? { userId } : { guestId: guestId };
        return this.cartService.addItem(identity, body.productId, body.quantity ?? 1);
    }
    async updateQuantity(req, productId, body) {
        const userId = req.user?.id;
        const guestId = req.cookies?.guestId;
        const identity = userId ? { userId } : { guestId: guestId };
        return this.cartService.updateQuantity(identity, productId, body.quantity);
    }
    async removeItem(req, productId) {
        const userId = req.user?.id;
        const guestId = req.cookies?.guestId;
        const identity = userId ? { userId } : { guestId: guestId };
        return this.cartService.removeItem(identity, productId);
    }
    async clearCart(req) {
        const userId = req.user?.id;
        const guestId = req.cookies?.guestId;
        const identity = userId ? { userId } : { guestId: guestId };
        return this.cartService.clearCart(identity);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':productId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Delete)(':productId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('productId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)('clear'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map