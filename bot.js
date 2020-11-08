var express = require("express");
var app = express();
const discord = require('discord.js');
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var manga_all = require("./model/mangaAll");
const RssFeedEmitter = require('rss-feed-emitter');
const feeder = new RssFeedEmitter({ skipFirstLoad: true });
mongoose.connect("mongourlwith the full database", {

    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true

}).then(() => {

    console.log('Connected to DB');

}).catch(err => {
    console.log('ERROR :', err.message);

});
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
const token = "discord token"
const client = new discord.Client();
app.get("/", function(req, res) {
    res.send("bot started")
})
app.get("/join", function(req, res) {
    res.redirect('join link')
})
const emojiNext = '➡'; // unicode emoji are identified by the emoji itself
const emojiPrevious = '⬅';
const reactionArrow = [emojiPrevious, emojiNext];
const time = 60000; // time limit: 1 min

function getList(i) {
    return list[i]; // i+1 because we start at 0
}

function filter(reaction, user) {
    return (!user.bot) && (reactionArrow.includes(reaction.emoji.name)); // check if the emoji is inside the list of emojis, and if the user is not a bot
}

function onCollect(emoji, message, i, getList) {
    if ((emoji.name === emojiPrevious) && (i > 0)) {
        message.edit(getList(--i));
    } else if ((emoji.name === emojiNext) && (i < list.length - 1)) {
        message.edit(getList(++i));
    }
    return i;
}

function createCollectorMessage(message, getList) {
    let i = 0;
    const collector = message.createReactionCollector(filter, { time });
    collector.on('collect', r => {
        i = onCollect(r.emoji, message, i, getList);
    });
    collector.on('end', collected => message.clearReactions());
}

function sendList(channel, getList) {
    channel.send(getList(0))
        .then(msg => msg.react(emojiPrevious))
        .then(msgReaction => msgReaction.message.react(emojiNext))
        .then(msgReaction => createCollectorMessage(msgReaction.message, getList));
}


function updatespm(client, msg, url) {
    found = 0
    x = msg.author.id + " " + msg.content;
    for (let i = 0; i < feeder.list.length; i++) {
        if (feeder.list) {
            if (feeder.list[i].eventName === x) {
                found = 1
            }
        }
    }
    if (found === 0) {
        feeder.add({
            url: url,
            eventName: x
        });
        feeder.on(x, function(item) {
            a = item.description.split(" ")
            b = a.indexOf("Language:")
            if (a[b + 1] === "English") {
                client.users.cache.get(msg.author.id).send(item.link)
            }
        })
    } else {
        msg.reply("already added");
    }
}

function removpm(client, msg, url) {
    y = msg.content.split(" ")
    x = msg.author.id + " " + ".remindx " + y[1];
    for (let i = 0; i < feeder.list.length; i++) {
        if (feeder.list) {
            if (feeder.list[i].eventName === x) {
                clearInterval(feeder.list[i].interval);
                delete feeder.list[i].interval;
                feeder.list.splice(i, 1);
            }
        }
    }
}

function remov(client, msg, url) {
    y = msg.content.split(" ")
    x = msg.channel.id + " " + "remindx " + y[1];
    for (let i = 0; i < feeder.list.length; i++) {
        if (feeder.list) {
            if (feeder.list[i].eventName === x) {
                clearInterval(feeder.list[i].interval);
                delete feeder.list[i].interval;
                feeder.list.splice(i, 1);
            }
        }
    }
    msg.channel.send("Removed")
    console.log(feeder.list);
}

function updates(client, msg, url) {
    found = 0
    x = msg.channel.id + " " + msg.content;
    for (let i = 0; i < feeder.list.length; i++) {
        if (feeder.list) {
            if (feeder.list[i].eventName === x) {
                found = 1
                console.log("already added")
            }
        }
    }
    if (found === 0) {
        feeder.add({
            url: url,
            eventName: x
        });
        feeder.on(x, function(item) {
            msg.channel.send(item.title)
            a = item.description.split(" ")
            b = a.indexOf("Language:")
            if (a[b + 1] === "English") {

                msg.channel.send(item.link)
            }
        })
    } else {
        msg.reply("already added");
    }
}
client.on('message', async(msg) => {
    function regExpEscape(literal_string) {
        return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
    }

    function sear(key) {
        var regex = new RegExp(regExpEscape(key), "gi");
        return regex;
    }

    function sea(msg, key) {
        var result = ""
        var str = (msg.content).toLowerCase();

        var regex = new RegExp(regExpEscape(key), "gi");

        result = str.match(regex);
        if (result) {
            return result[0];
        } else {
            return false;
        }
    }
    if (msg.content === '!h') {
        const exampleEmbed = new discord.MessageEmbed()
            .setTitle("Help Index")
            .setThumbnail('https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png')
            .setColor('#a0ff5c')
            .setDescription("Type " + "`!h ModuleName`" + " for all the commands in module")
            .addFields({ name: 'Find', value: '`finddex`', inline: true }, { name: 'RSS', value: '`get_rss`', inline: true }, { name: 'Remind', value: '`reminddex removdex`', inline: true })
            //  `/.anime .anime @nime /anime /.movanime .movanime /movanime movanime`
            .setFooter('@R0NN1E', 'https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png');
        msg.channel.send(exampleEmbed);
    } else if (msg.content === "!h Find" || msg.content === "!h find") {
        const exampleEmbed = new discord.MessageEmbed()
            .setTitle("Help Find")
            .setColor('#a0ff5c')
            .setThumbnail('https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png')
            .addFields({ name: 'Find', value: '`finddex name_of_manga`:Find the manga with name and gives back the link\n*Will only return max 4 results*' })
            .setFooter('@R0NN1E', 'https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png');
        msg.channel.send(exampleEmbed);
    } else if (msg.content === "!h Rss" || msg.content === "!h RSS" || msg.content === "!h rss") {
        const exampleEmbed = new discord.MessageEmbed()
            .setTitle("Help RSS")
            .setColor('#a0ff5c')
            .setThumbnail('https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png')
            .addFields({ name: 'RSS', value: '`get_rss name_of_manga`:Find the manga rss with name and gives back the link\n*Will only return max 4 results*' })
            .setFooter('@R0NN1E', 'https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png');
        msg.channel.send(exampleEmbed);
    } else if (msg.content === "!h Remind" || msg.content === "!h remind") {
        const exampleEmbed = new discord.MessageEmbed()
            .setTitle("Help Remind")
            .setColor('#a0ff5c')
            .setThumbnail('https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png')
            .addFields({ name: 'Remind', value: '`remindx link`:take the link of rss feed of the manga and updates every time it in the channel\n*Only admins can use this*\nREMOVE it by typing `removdx link` only by admins ' + '`.remindx link`:it sends the updates using DM\n CAn be used by anyone in the server\n REMOVE it by `.removdx link`' })
            .setFooter('@R0NN1E', 'https://www.kindpng.com/picc/m/78-781530_rikkisgirl-kawaii-anime-animegirl-pastel-cute-kink-anime.png');
        msg.channel.send(exampleEmbed);
    } else if (msg.content.startsWith('finddex') && (!(msg.author.bot))) {
        j = (msg.content).slice(8, );
        l = "^" + j
        k = sear(j);
        manga_all.find({ name: { $regex: l, $options: "i" } }).limit(4).exec(function(err, Data) {
            if (Data.length > 0) {
                list = []
                Data.forEach(element => {
                    list.push(element.source)
                });
                if (list.length > 1) {
                    sendList(msg.channel, getList);
                } else {
                    msg.channel.send(list[0])
                }
            } else {
                manga_all.find({ name: k }).limit(4).exec(function(err, Data) {
                    if (Data.length > 0) {
                        list = []
                        Data.forEach(element => {
                            list.push(element.source);
                        });
                        if (list.length > 1) {
                            sendList(msg.channel, getList);
                        } else {
                            msg.channel.send(list[0])
                        }
                    } else {
                        msg.channel.send("Nothing found");
                    }
                })
            }
        })
    } else if (msg.content.startsWith('.remindx') && (!(msg.author.bot))) {
        j = (msg.content).slice(9, );
        if (j.slice(8, 16) === "mangadex") {
            updatespm(client, msg, j);
        } else {
            msg.channel.send("not a Mangadex Rss link")
        }

    } else if (msg.content.startsWith('.removdx') && (!(msg.author.bot))) {
        j = (msg.content).slice(9, );
        if (j.slice(8, 16) === "mangadex") {
            removpm(client, msg, j);
        } else {
            msg.channel.send("not a Mangadex Rss link")
        }

    } else if (msg.content.startsWith('remindx') && (!(msg.author.bot))) {
        if (msg.member.permissions.has("ADMINISTRATOR")) {
            j = (msg.content).slice(8, );
            updates(client, msg, j);
        } else {
            msg.channel.send("you are not an admin")
        }

    } else if (msg.content.startsWith('removdx') && (!(msg.author.bot))) {
        if (msg.member.permissions.has("ADMINISTRATOR")) {
            j = (msg.content).slice(8, );
            remov(client, msg, j)
        }
    } else if (msg.content.startsWith('get_rss') && (!(msg.author.bot))) {
        j = (msg.content).slice(8, );
        l = "^" + j
        k = sear(j);
        manga_all.find({ name: { $regex: l, $options: "i" } }).limit(4).exec(function(err, Data) {
            if (Data.length > 0) {
                list = []
                Data.forEach(element => {
                    a = element.source;
                    b = "https://mangadex.org/rss/vrxK4scpU6TPezuR3qgVQkw7FnfyNHZX/manga_id/";
                    c = element.source.split("/")
                    d = b + c[4]
                    list.push(d)
                });
                if (list.length > 1) {
                    sendList(msg.channel, getList);
                } else {
                    msg.channel.send(list[0])
                }
            } else {
                manga_all.find({ name: k }).limit(4).exec(function(err, Data) {
                    if (Data.length > 0) {
                        list = []
                        Data.forEach(element => {
                            a = element.source;
                            b = "https://mangadex.org/rss/vrxK4scpU6TPezuR3qgVQkw7FnfyNHZX/manga_id/";
                            c = element.source.split("/")
                            d = b + c[4]
                            list.push(d)
                        });
                        if (list.length > 1) {
                            sendList(msg.channel, getList);
                        } else {
                            msg.channel.send(list[0])
                        }
                    } else {
                        msg.channel.send("Nothing Found")
                    }
                })
            }
        })
    }
})
client.on('ready', () => {
    client.user.setActivity("!h for help", '!h for help');
    console.log("bot connected");
});
client.login(token);
app.listen(process.env.PORT || 3000, function() {
    console.log("server started");
});