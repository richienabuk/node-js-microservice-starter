import express from 'express';
import route from './src/routes/index.js'

const PORT = 5001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.listen(PORT, () => {
    console.log(`movie service running at port ${PORT}`);
});
