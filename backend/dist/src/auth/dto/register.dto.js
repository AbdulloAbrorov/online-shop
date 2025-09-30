"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
const types_1 = require("../../types");
class RegisterDto {
    email;
    password;
    firstName;
    lastName;
    role = types_1.AppRole.USER;
}
exports.RegisterDto = RegisterDto;
//# sourceMappingURL=register.dto.js.map