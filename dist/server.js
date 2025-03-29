"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const app_routes_1 = __importDefault(require("./routes/app.routes"));
const auth_routes_1 = __importDefault(require("./routes/v1/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use("/api/v1", app_routes_1.default);
app.use("/api/v1", auth_routes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));
