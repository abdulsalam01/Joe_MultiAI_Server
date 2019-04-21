const dotenv = require('dotenv');
const path = require('path');
const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// This bot's main dialog.
const { MyBot } = require('./bot');

// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');
dotenv.config({ path: ENV_FILE });

// Create HTTP server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${server.name} listening to ${server.url}`);
    console.log(`\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    console.log(`\nTo talk to your bot, open the emulator select "Open Bot"`);
    console.log(`\nSee https://aka.ms/connect-to-bot for more information`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about how bots work.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    channelService: process.env.ChannelService,
    openIdMetadata: process.env.BotOpenIdMetadata
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${error}`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);

    // Clear out state
    // await conversationState.clear(context);
    // Save state changes.
    // await conversationState.saveChanges(context);
};

// let conversationState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
// const memoryStorage = new MemoryStorage();
// conversationState = new ConversationState(memoryStorage);

// Create the main dialog.
const myBot = new MyBot();

// Listen for incoming requests.
// server.post('/api/messages', (req, res) => {
//     adapter.processActivity(req, res, async (context) => {
//         // Route to main dialog.
//         await myBot.run(context);
//     });
// });

server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, (session) => {
    session.sendTyping();
    setTimeout(function () {
        session.send("Hello there...");
    }, 3000);
    session.endDialog(`I'm sorry, I did not understand '${session.message.text}'.\nType 'help' to know more about me :)`);
});

var luisRecognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL).onEnabled(function (context, callback) {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(luisRecognizer);

bot.dialog('Greetings', [
    (session, args, next) => {
        var greetings = builder.EntityRecognizer.findEntity(args.intent.entities, 'greetings');


        if (greetings && greetings.resolution.values.length > 0) {
            session.dialogData.greetings = greetings.resolution.values[0];
        }

        session.dialogData.firstmessage = session.message.text;

        if (!session.dialogData.greetings) {

            builder.Prompts.text(session, `it seems you are having a tough day, but i hope I can make it better by recommending the best pizza place to you`);
        } else {
            next();
        }
    },

    (session, result, next) => {
        builder.Prompts.text(session, `But first can you tell me your name please?`);
    },


    (session, result, next) => {
        session.dialogData.name = result.response;
        session.send(`Glad to meet you ${session.dialogData.name}`);
        builder.Prompts.text(session, `Tell me about yourself ${session.dialogData.name}. What do you do? What do you do for fun?`);
    },

    (session, result, next) => {
        session.dialogData.about = result.response;
        about = session.dialogData.about;
    }
])
    .triggerAction({ matches: 'Greetings' });

bot.dialog('Weather.GetForecast',[
    (session, args, next) =>{
        //Find which city the weather forecast is being asked
        var city = new builder.EntityRecognizer.findEntity(args.entities, 'Weather.Location').entity;
        var api = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&amp;APPID=a590007f62779ccdd4d2e3bfb47856ea&amp;callback=?'
        var request = require('request');

        request(api, function (error, response, body) {
            if (response.statusCode == 200) {
            session.send("Weather in: " + city);
            session.send(JSON.stringify(body, null, 4));
            }
        }
    }
])
.triggerAction({matches: 'Weather.GetForecast'});