// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

// Turn counter property
const TURN_COUNTER_PROPERTY = 'turnCounterProperty';

class MyBot extends ActivityHandler {
    constructor(conversationState) {
        // super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async turnContext => { console.log('this gets called'); await turnContext.sendActivity(`Wow '${turnContext.activity.text}'`); });
        this.onConversationUpdate(async turnContext => { console.log('this gets called (conversatgion update'); await turnContext.sendActivity('[conversationUpdate event detected]'); });
        // this.countProperty = conversationState.createProperty(TURN_COUNTER_PROPERTY);
        // this.conversationState = conversationState;
    }

    // async onTurn(turnContext) {
    // 	if(turnContext.activity.type === ActivityHandler.Message) {
    // 		let count = await this.countProperty.get(turnContext);
    //         count = count === undefined ? 1 : ++count;

    //         await turnContext.sendActivity(`${count}: You said "${turnContext.activity.text}" `);
    //         await this.countProperty.set(turnContext, count);

    // 	} else {
    // 		await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
    // 	}

    // 	await this.conversationState.saveChanges(turnContext);
    // }
}

module.exports.MyBot = MyBot;