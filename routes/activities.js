const express = require('express');
const activityRoute = express.Router();
const ActivityController = require('../controllers/activities');

activityRoute.get('/',ActivityController.getActivityWall);

module.exports = activityRoute;