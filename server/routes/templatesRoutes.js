const express = require('express');
const router = express.Router();

const { 
    postTemplates, 
    getTemplates,
    getSingleTemplates,
    patchTemplates, 
    deleteTemplates,
    postCampaign,
    getCampaign,
    getSingleCampaign,
    patchCampaign,
    deleteCampaign
} = require('../controllers/templatesControllers');

router.post('/templates', postTemplates);
router.get('/templates', getTemplates);
router.get('/templates/single/:_id',getSingleTemplates);
router.patch('/templates/:_id', patchTemplates);
router.delete('/templates/:_id', deleteTemplates);

router.post('/campaign', postCampaign);
router.get('/campaign', getCampaign);
router.get('/campaign/single/:_id',getSingleCampaign);
router.patch('/campaign/:_id', patchCampaign);
router.delete('/campaign/:_id', deleteCampaign);

module.exports = router;