const express = require("express");

const PORT = 5000;

const app = express();

app.get('/', (req, res) => {
    return res.status(200).json({ message: "Hello World" });
});

app.use((error, _, res, __) => {
    console.error(
        `Error processing request ${error}. See next message for details`
    );
    console.error(error);

    return res.status(500).json({ error: "internal server error" });
});

app.listen(PORT, () => {
    console.log(`movie service running at port ${PORT}`);
});
