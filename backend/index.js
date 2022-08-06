import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.listen(5000, () => console.log("Server up and running !"));