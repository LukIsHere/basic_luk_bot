var conf = require("../basic_luk_bot.json")
var data = loaddata();
var fs = require("fs")
const { Client, Intents, TextChannel, Permissions, Invite, User} = require('discord.js');
var bot = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS
    ]
    
});
bot.once("ready", cos => {
    console.log("discord połączony");
    setInterval(() => {
        const guild = bot.guilds.cache.find(g=>g.id==897523042589225011);
        var usrc = guild.memberCount*1-2;
        guild.channels.cache.find(c=>c.id==950882164445175848).setName("Użytkownicy : "+usrc);
    }, 60000);
})
bot.on("messageCreate", msg =>  {
    console.log(msg.content);
    var m = msg.content
    if(msg.author.id!=950849416011608124){
        var cmd = msg.content.split(" ");
        switch (cmd[0])  {
            case "?name" :
                if(admin(msg.author.id))bot.user.setUsername(cmd[1]).catch(err => console.log(err));
                else msg.channel.send("nie możesz tego zrobić");
                
            break
            case "?avatar" :
                bot.users.fetch(msg.author.id).then((userg)=>{
                    msg.channel.send(userg.avatarURL({ dynamic: true , size: 2048 , format: "png" }))});
            break
            case "?clear" :
                if(admin(msg.author.id)){
                    msg.channel.bulkDelete(cmd[1]*1+1)
                    .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
                    .catch(err => msg.channel.send("nastąpił błąd"));
                  }
            break
            case "?help":
                msg.channel.send("obecnie dostępne komędy :")
                msg.channel.send("?avatar")
            break
            default :
                
        }
    }
        
})
const role = [
    ["wiadomość","rola","emoji"],
    [950734528035581972,950454975400665138,"✅"],
    [951798445105086474,953374459572666399,"bedrock"],
    [951798445105086474,953374376697421875,"java"],
    [951798445105086474,953374540631801946,"male"],
    [951798445105086474,953374589231198288,"female"],
    [951798445105086474,954883394620248104,"1️⃣"],
    [951798445105086474,954883489260515348,"2️⃣"],
    [951798445105086474,954883544881176576,"3️⃣"],
]
bot.on("guildBanAdd",ban => {
    console.log(ban);
    var user = ban.user.username;
    const channel = ban.guild.channels.cache.get('950874820017532931');
    channel.send(user+" dostał bana")
})
bot.on('guildMemberAdd', async member => {
    console.log("ktos")
    const channel = member.guild.channels.cache.get('950869853995139072');
    if (!channel) return;
    
    channel.send("<@"+member+">"+" właśnie wszedł mam nadzieje że zostanie naszym przyjacielem")
});
bot.on("messageReactionAdd", (react,user) => {
    
    role.forEach((info) => {
     if(react.message.id==info[0]&&react.emoji.name==info[2]) {
        const guild = react.message.guild;
        console.log(react.emoji.name);
        const memberWhoReacted = guild.members.cache.find(member => member.id == user.id);

        memberWhoReacted.roles.add(guild.roles.cache.find(rola => rola.id == info[1]));
    }   
    })
    
    
})
bot.on("messageReactionRemove", (react,user) => {
    
    role.forEach((info) => {
          if(react.message.id==info[0]&&react.emoji.name==info[2]) {
        console.log(react.emoji.name);
        const guild = react.message.guild;
        const memberWhoReacted = guild.members.cache.find(member => member.id == user.id);
        memberWhoReacted.roles.remove(guild.roles.cache.find(rola => rola.id == info[1]));
        }
       })
    
})
function admin(id){
    if(id==537649475494215690||id==537649475494215690) return true
    else return false
}
Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
}
bot.login(conf.dc)

//baza danych
function loaddata() {
    return JSON.parse(fs.readFileSync("../data.json","utf-8"))
}
function savedata(){
    fs.writeFileSync("../data.json",JSON.stringify(data),"utf-8")
}