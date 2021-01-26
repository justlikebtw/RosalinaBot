const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("../config.json");
const BotDBDriver = require('../models/BotDBDriver');

const Platform = require('./Platform');

var driver;

client.ws.on('INTERACTION_CREATE', async interaction => {
    let guild = client.guilds.cache.get(interaction.guild_id);
    if (guild.available) {
        let channel = client.channels.cache.get(interaction.channel_id);
        switch (interaction.data.name.toLowerCase()) {
            case 'platform':
                Platform.handle(interaction, driver, channel, interaction.member.user.id, client);
                break;
            default:
            // Do nothing
        }
    }
});

client.on('message', msg => {
    if (msg.content.toLowerCase().startsWith('r!') && msg.author.bot != true) {
        var input = msg.content.toLowerCase().split('r!')[1].split(' ')[0];
        switch (input) {
            case 'help':
            case '8ball':
            case 'github':
            case 'die':
            case 'dice':
            case 'ping':
            case 'echo':
            case 'echod':
            case 'coin':
            case 'c':
            case 'build':
            case 'switchcode':
            case 'sc':
            case '3dscode':
            case 'dscode':
            case 'ds':
            case 'pogocode':
            case 'ssbu':
            case 'acnh':
            case 'anch':
            case 'privacy':
            case 'invite':
            case 'serverinfo':
            case 'clear':
            case 'support':
            case 'settings':
            case 'direct':
            case 'vote':
        }
    }
});

client.on('ready', () => {
    console.log('Shard in ready state');
    driver = new BotDBDriver(config.db.uri, config.db.dbName);

    client.options.messageCacheLifetime = 30;
    client.options.messageSweepInterval = 45;
});

client.login(config.botToken).then(r => console.log('Shard logged in'));

