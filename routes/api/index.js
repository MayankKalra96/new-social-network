const router = require('express').Router();

const thoughtRoute = require('./thought-routes');
const userRoute = require('./user-routes');

router.use('/thoughts', thoughtRoute);
router.use('/users', userRoute);

module.exports = router;