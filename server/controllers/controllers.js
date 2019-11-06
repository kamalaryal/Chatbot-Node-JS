const request = require('request');
const requestPromise = require('request-promise');
const mongoose = require('mongoose');

const chatstatus = require('../models/chatstatus');
const campaign = require('../models/campaign');
const templates =  require('../models/templates');

exports.getWebhook = (req, res, next) => {

	const VERIFY_TOKEN = process.env.VERIFICATION_TOKEN;
	var mode = req.query['hub.mode'];
	var token = req.query['hub.verify_token'];
	var challenge = req.query['hub.challenge'];
	
	if (mode && token) {
	
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			console.log('WEBHOOK_VERIFIED');
			res.status(200).send(challenge);
		} else {
			console.log("Wrong token");
			res.status(403).send("Wrong token");;
		}
	}
}

exports.postWebook = (req, res, next) => {

	let body = req.body;

	if (body.object === 'page') {
	  
		body.entry.forEach(function(entry) {
	
			let webhook_event = entry.messaging[0];
			console.log(webhook_event);
		
			let sender_psid = webhook_event.sender.id;
			console.log('Sender ID: ' + sender_psid);

			if (webhook_event.message) {
				if (webhook_event.message.quick_reply) {
					handleJoinusPostback(sender_psid, webhook_event.message.quick_reply);
				} else {
					handleMessage(sender_psid, webhook_event.message);
				}
			} else if (webhook_event.postback) {
				handlePostback(sender_psid, webhook_event.postback);
			}
	
		});
		console.log('EVENT_RECEIVED');
		res.status(200).send('EVENT_RECEIVED');
	  
	} else {
		console.log("Error !!!");
		res.sendStatus(404);
	}	  
}

exports.getChatUserListControllers = (req, res, next) => {
	var limit = Math.max(1, parseInt(req.params.limit, 5)); ;
	var skip = Math.max(0, parseInt(req.params.skip, 5));
	
	chatstatus.find()
	.limit(limit)
    .skip(skip)
	.exec()
	.then(result => {
		if(result.length == 0) {
			console.log("No data found.");
			return res.status(404).json({
				message: "No data found."
			});
		}

		const response = result.map(data => {
			return {
				_id: data._id,
				first_name: data.first_name,
				last_name: data.last_name,
				user_id: data.user_id,
				profile_pic: data.profile_pic,
				male: data.male,
				gender: data.gender,
				locale: data.locale
			}
		});
		res.status(200).json(response);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err.message
		});
	});
}

exports.messageDataControllers = (req, res, next) => {
	campaign.find({ campaignSequence: req.params.campaignSequence })
	.select('templatesId campaignSequence')
	.populate('templatesId', templates)
	.exec()
	.then(result => {
		if (result.length === 0) {
			res.status(404).json({
				message: "Invalid Campaign."
			});
		}
		const response = result.map(data => {
			return {
				campaignSequence: data.campaignSequence,
				templates: {
					template_type: data.templatesId.templatesType,
					title: data.templatesId.title,
					sub_title: data.templatesId.subTitle,
					image_url:  data.templatesId.imageURL,
					text: data.templatesId.text,
					postback: data.templatesId.postback.map(docs => {
					return {
						type: docs.type,
						url: docs.url,
						title: docs.title,
						media_type: docs.mediaType,
						payload: docs.payload,
						content_type: docs.content_type
					}
				})
				}
			}
		});
		res.status(200).send(response);
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err.message
		});
	});
}

async function handleMessage(sender_psid, received_message) {
	const message = await getMessageData(1);
	var response;
	
	var FullName = await getProfileInformation(sender_psid);
	if (received_message.text) {
	  response = {
		"attachment": {
            "type" : "template",
            "payload" : { 
                "template_type": message[0].templates.template_type,
				"text" : message[0].templates.text.replace(/FullName/g, FullName),
				"buttons" : message[0].templates.postback
            }
        }
	  }
	};
	callSendAPI(sender_psid, response);
}

function handlePostback(sender_psid, received_postback) {
	let response;
	let receivedPayload = received_postback.payload;
	switch (receivedPayload) {
		case 'know us':
		handleAboutusPostback(sender_psid);
		break;

		case 'contact us':
		handleContactPostback(sender_psid);
		break;

		default:
		console.log('Cannot differentiate the payload type');
		response = { "text": "Cannot differentiate the payload type" };
		callSendAPI(sender_psid, response);
	}
}

async function handleAboutusPostback(sender_psid) {
	const message = await getMessageData(2);

	const response = {
		"text": message[0].templates.text,
		"quick_replies": message[0].templates.postback
	};
	callSendAPI(sender_psid, response);
}

async function handleContactPostback(sender_psid){
	const message = await getMessageData(3);
	
	const response = {
	  "attachment": {
		 "type":"template",
		 "payload": {
			"template_type": message[0].templates.template_type,
			"elements": [
				{
				   "title": message[0].templates.title,
				   "image_url": message[0].templates.image_url,
				   "subtitle": message[0].templates.sub_title,
				   "buttons": message[0].templates.postback
				}
			]
		}
	   }
	};
	callSendAPI(sender_psid, response);
}

async function handleJoinusPostback(sender_psid, message) {
	var quickReplyPayload = message.payload;
	var message;
	if(quickReplyPayload === 'yes') {
		message = await getMessageData(4);
		// const response = {
		// 	"text": message[0].templates.text
		// }
		// callSendAPI(sender_psid, response);
	}
	else if(quickReplyPayload === 'no') {
		message = await getMessageData(5);
		// const response = {
		// 	"text" : message[0].templates.text
		// }
		// callSendAPI(sender_psid, response);
	}
	
	const response = {
		"text" : message[0].templates.text
	}
	callSendAPI(sender_psid, response);
}

function graphTemplatePostback(sender_psid, message) {
	const response = {
		"attachment":{
			"type":"template",
			"payload":{
				"template_type":"open_graph",
				"elements": [
					{
					"url":"https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb",
					"buttons": [
						{
							"type":"web_url",
							"url":"https://en.wikipedia.org/wiki/Rickrolling",
							"title":"View More"
						},
						{
							"type":"web_url",
							"url":"https://en.wikipedia.org/wiki/Rickrolling",
							"title":"View More"
						}
					]
				}
			  ]
			}
		}
	};
	callSendAPI(sender_psid, response);
}

function mediaTemplatePostback(sender_psid, message) {
	const response = {
		"attachment": {
			"type": "template",
			"payload": {
			   "template_type": "media",
			   "elements": [
				   {
						"media_type": "<image|video>",
						"url": "<FACEBOOK_URL>"
					},
					{
						"media_type": "<image|video>",
						"url": "<FACEBOOK_URL>"
					}
			   ]
			}
		}
	};
	callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {

	let request_body = {
	  "recipient": {
		"id": sender_psid
	  },
	  "message": response
	}
	request({
	  "uri": "https://graph.facebook.com/v2.6/me/messages",
	  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
	  "method": "POST",
	  "json": request_body
	}, (err, res, body) => {
	  if (!err) {
        console.log('message sent!');
	  } else {
        console.log("Unable to send message:", err);
	  }
	});
}

async function getMessageData(campaignSequence) {
	let message;
	await requestPromise(`https://converzee-messenger-chat-bot.herokuapp.com/messageData/` + campaignSequence)
	.then(result =>{
		result = JSON.parse(result);
		message = result;
		// console.log("Message:", result)
	})
	.catch(err =>{
		console.log(err);
	});
	return message;
}

async function getProfileInformation(sender_psid) {
	var name;
	var profileData;
	await requestPromise(`https://graph.facebook.com/`+sender_psid+`?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=`+process.env.PAGE_ACCESS_TOKEN)
	.then(result => {
		result = JSON.parse(result);
		profileData = result;
		name = result.first_name +  " " + result.last_name;

		chatstatus.findOne({ user_id: result.id })
		.exec()
		.then(docs => {
			if(docs === null) {
				const newchatstatus = new chatstatus({
					_id: new mongoose.Types.ObjectId,
					user_id: profileData.id,
					name: {
						first: profileData.first_name,
						last: profileData.last_name
					},
					profile_pic: profileData.profile_pic,
					locale: profileData.locale,
					gender:  profileData.gender,
					status: "pending"
				});
				newchatstatus
				.save()
				.then(result =>{
					console.log("Profile is created.", result);
				})
				.catch(err =>{
					console.log(err);
				});
			} else {
				console.log("Profile already exist!");
			}
		})
		.catch(err =>{
			console.log(err);
		});
	})
	.catch(err=> {
		console.log(err);
	})
	// console.log(name);
	return name;
}
