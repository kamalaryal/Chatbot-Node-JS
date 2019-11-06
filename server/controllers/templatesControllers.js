const templates = require('../models/templates');
const campaign = require('../models/campaign');
const mongoose = require('mongoose');

exports.postTemplates = (req, res, next) => {
    const newTemplates = new templates({
        _id: new mongoose.Types.ObjectId,
        templatesType: req.body.templatesType,
        title: req.body.title,
        subTitle:  req.body.subTitle,
        imageURL: req.body.imageURL,
        text: req.body.text,
        postback: req.body.postback,
        status: "pending",
        createdDate: Date.now()
    });
    newTemplates
    .save()
    .then(result =>{
        console.log("Template is created.", result);
        res.status(201).json(result);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.getTemplates = (req, res, next) => {
    templates.find()
    .exec()
    .then(result => {
        if(result.length === 0) {
            console.log("No data found.");
            return res.send(401).json({
                message: "No data found."
            })
        }
        console.log(result);
        res.send(200).json({
            result
        });
    })
    .catch(err =>{
        console.log(err);
        res.send(500).json({
            error: err.message 
        })
    });
}

exports.getSingleTemplates = (req, res, next) => {
    templates.findOne({ _id: req.params._id })
    .exec()
    .then(result=> {
        if(result === null) {
            console.log("No templates found.")
            return res.status(404).json({
                message: "No templates found."
            });
        }
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.patchTemplates = (req, res, next) => {
    templates.findOne({ _id: req.params._id })
    .exec()
    .then(res => {
        if(res === null) {
            return res.status(404).json({
                message: "No Data found."
            });
        }

        templates.update({ _id: req.params._id }, { $set:  req.body })
        .exec()
        .then(result => {
            console.log("Tempalte is updated.", result);
            res.send(200).json({
                message: "Tempalte is updated."
            });
        })
        .catch(err => {
            console.log(err)
            res.send(500).json({
                error: err.message
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({
            error: err.message
        });
    });
}
 
exports.deleteTemplates = (req, res, next) => {
    templates.findOne({ _id: req.params._id })
    .exec()
    .then(res => {
        if(res === null) {
            console.log("No data found.");
            return res.status(404).json({
                message: "No data found."
            })
        }
        templates.delete({ _id : req.params._id })
        .exec()
        .then(result => {
            console.log("Template is deleted", result);
            res.send(200).json({
                message: "Template is deleted"
            })
        })
        .catch(err => {
            console.log(err);
            res.send(500).json({
                error: err.message
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.send(500).json({
            error: err.message
        });
    });
}

exports.postCampaign = async(req, res, next) => {
    await templates.findOne({ _id: req.body.templatesId })
    .exec()
    .then(res => {
        if(res === null) {
            console.log("Templates does not exit")
            return res.status(404).json({
                message: "Templates does not exit."
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });

    const newCampaign = new campaign({
        _id: new mongoose.Types.ObjectId,
        templatesId: req.body.templatesId,
        campaignSequence: req.body.campaignSequence,
        status: "pending",
        createdDate: Date.now()
    });
    newCampaign
    .save()
    .then(result =>{
        console.log("Campaign is created.", result);
        res.status(201).json({
            message: "Campaign is created."
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.getCampaign = (req, res, next) => {
    campaign.find()
    .exec()
    .then(result => {
        if(result.length === 0) {
            console.log("Campaign is not found.");
            return res.status(404).json({
                message: "Campaign is not found."
            });
        }
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.getSingleCampaign = (req, res, next) => {
    campaign.findOne({ _id : req.params._id})
    .exec()
    .then(result => {
        if(result === null) {
            console.log("Campaign is not found.");
            return res.status(404).json({
                message: "Campaign is not found."
            });
        }
        console.log(result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.patchCampaign = (req, res, next) => {
    campaign.findOne({ _id : req.params._id })
    .exec()
    .then(res => {
        if(res === null) {
            console.log("Campaign is not found.");
            res.status(404).json({
                message: "Campaign is not found."
            });
        }
        campaign.update({ _id: req.params._id }, { $set:  req.body })
        .exec()
        .then(result => {
            console.log("Campaign is updated.", result);
            res.status(200).json({
                message: "Campaign is updated."
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}

exports.deleteCampaign = (req, res, next) => {
    campaign.findOne({ _id : req.params._id })
    .exec()
    .then(res => {
        if(res === null) {
            console.log("Campaign is not found.");
            res.status(404).json({
                message: "Campaign is not found."
            });
        }
        campaign.delete({ _id: req.params._id })
        .exec()
        .then(result => {
            console.log("Campaign is deleted.", result);
            res.status(200).json({
                message: "Campaign is deleted."
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    });
}