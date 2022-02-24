import axios from "axios";
import { Op } from "sequelize";
import model from '../models/index.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/sendResponse.js';

let { MOVIE_API_KEY } = process.env;

export default {
    async index(req, res) {
        try {
            const { Movie } = model;
            return sendSuccessResponse(res, 200, await Movie.findAll());
        } catch (e) {
            return sendErrorResponse(res, 500, 'Could not perform operation at this time, kindly try again later.', e);
        }
    },

    async store(req, res) {
        const { Movie } = model;
        const { title } = req.body;
        const {userId, role} = req.userData;

        if (!role || !['basic', 'premium'].includes(role)) {
            return sendErrorResponse(res, 401, 'You are not authorized to perform this action.');
        }

        if (!title) {
            return sendErrorResponse(res, 404, 'Movie title required.');
        }

        if (role === 'basic') {
            const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            const currMoCount = await Movie.count({
                where: {createdAt: {[Op.startsWith]: `${new Date().getFullYear()}-${months[new Date().getMonth()]}-%`}, ownerId: userId}
            })

            if (currMoCount >= 5) {
                return sendErrorResponse(res, 401, 'You are only allowed to create 5 movies per month. Upgrade to premium to upload more.', currMoCount);
            }
        }

        try {
            const item = (await axios.get(`https://www.omdbapi.com/?t=${title}&apikey=${MOVIE_API_KEY}`))?.data

            if (!item) {
                return sendErrorResponse(res, 404, 'Movie not found!');
            }

            if (item && item.Response && item.Response === 'False') {
                return sendErrorResponse(res, 404, item.Error);
            }

            const { Title, Released, Genre, Director } = item;

            const movie = await Movie.create({
                title: Title,
                released: Released,
                genre: Genre,
                director: Director,
                ownerId: userId,
            })

            return sendSuccessResponse(res, 200, movie);
        } catch (e) {
            return sendErrorResponse(res, 500, 'Could not perform operation at this time, kindly try again later.', e);
        }
    },
}
