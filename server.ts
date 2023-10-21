import express, { Express, Request, Response } from 'express';
import { OpenAI } from 'openai';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
const app: Express = express();
const port: number = 3000;

const dir: string = path.join(__dirname, 'main');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const key: string = 'your api key';
const openai: OpenAI = new OpenAI({ apiKey: key });

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(dir, 'index.html'));
})

app.post('/api', async (req: Request, res: Response) => {
    const message: string = req.body['message'];
    try {
        const response: OpenAI.Chat.Completions.ChatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [
                {
                    role: 'user',
                    content: message
                }
            ],
            max_tokens: 16000
        })  

        res.status(200).json(JSON.stringify(response.choices[0].message.content?.replace(/\n\n/g, '').replace(/\\/g, '"').trim()));
    } catch (e: any) {
        console.error(e);
    }
    res.status(500);
})

app.use(express.static(dir));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})