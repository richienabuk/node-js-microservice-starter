"use strict";

import MovieController from "../controllers/MovieController.js";
import Auth from "../middlewares/Auth.js";

export default (app) => {
    app.get('/movies', MovieController.index);

    app.post('/movies', Auth, MovieController.store);

    app.get('/', (req, res) => {
        return res.status(200).json({ message: "Hello World" });
    });

    app.use((error, _, res, __) => {
        console.error(
            `Error processing request ${error}. See next message for details`
        );
        console.error(error);

        return res.status(404).json({ error: "Route does not exist" });
    });
};
