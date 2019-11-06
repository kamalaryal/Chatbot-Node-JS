const express = require('express');
const router = express.Router();

const { 
    getWebhook, 
    postWebook, 
    getChatUserListControllers, 
    messageDataControllers 
} = require('../controllers/controllers.js');

router.get('/', (req, res, next) => {
    console.log("Hi I am a chatbot");
	res.status(200).send("Hi I am a chatbot");
});

router.get('/webhook/', getWebhook);
router.post('/webhook/', postWebook);
router.get('/getChatUser/:skip?/:limit?', getChatUserListControllers);
router.get('/messageData/:campaignSequence', messageDataControllers);

module.exports = router;