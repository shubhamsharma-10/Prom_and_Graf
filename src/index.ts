import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    console.log("Hello World");
        
    res.json({ 
        message: 'Hello World!' 
    });
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});