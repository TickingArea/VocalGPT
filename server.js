"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openai_1 = require("openai");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 3000;
const dir = path_1.default.join(__dirname, 'main');
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const key = 'your api key';
const openai = new openai_1.OpenAI({ apiKey: key });
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(dir, 'index.html'));
});
app.post('/api', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = req.body['message'];
    try {
        const response = yield openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 16000
        });
        res.status(200).json(JSON.stringify((_a = response.choices[0].message.content) === null || _a === void 0 ? void 0 : _a.replace(/\n\n/g, '').replace(/\\/g, '"').trim()));
    }
    catch (e) {
        console.error(e);
    }
    res.status(500);
}));
app.use(express_1.default.static(dir));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
