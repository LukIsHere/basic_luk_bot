import fs from "fs"
var conf = JSON.parse(fs.readFileSync("../basic_luk_bot.json","utf-8"))
//var data = loaddata();
var mottol = "";
import { Client, Intents} from "discord.js"
import youtubeNotifs from "youtube-notifs";
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
        const guild = bot.guilds.cache.find(g=>g.id==962661196086009946);
        var usrc = guild.memberCount*1-4;
        guild.channels.cache.find(c=>c.id==962959092467531796).setName("📊użytkownicy : "+usrc);
        /*fetch("https://luktvpl.github.io/json/motta.json").then(r => r.json().then(m=>{
                    var mtu = m.m;
                    var now = new Date();
                    var start = new Date(now.getFullYear(), 0, 0);
                    var diff = now - start;
                    var oneDay = 1000 * 60 * 60 * 24;
                    var day = Math.floor(diff / oneDay);
                    var use = day%mtu.length
                    mottol = mtu[use];
                }).catch(wtf=>console.log(wtf))).catch(wtf=>console.log(wtf))*/
    }, 60000);
    //yt
    
    var ytNotifs = new youtubeNotifs.Notifier("./yt.json",30)
     // args: new video check interval in seconds, data file path
    ytNotifs.on("newVid", (obj) => { // obj is an object containing video info
        bot.guilds.fetch("962661196086009946").then(g=>{
            g.channels.cache.get("962966226164940840").send("@everyone "+obj.channel.name+" właśnie opublikował nowy film!\n"+obj.vid.url)
        })
        console.log(obj);
    })
    ytNotifs.on("error", (err) => {
        console.error(err);
    });
    ytNotifs.subscribe(["UCvnYWyDpNGYS5U31J0BBakA", "UC56jZvKTddM2OJMZeAWiYBg","UCpz-9Ev8oLtrtZqWG4QaiEg","UCSmdhlfXRI4M6fvt9GVUadw"])
    ytNotifs.start()
})
bot.on("messageCreate", msg =>  {
    console.log(msg.content);
    var m = msg.content
    if(msg.author.id!=950849416011608124){
        var con = msg.content
        var cmd = msg.content.split(" ");
            if(msg.channel.id==962961240790020166){
                msg.channel.messages.fetch({limit:2}).then(msgs=>{
                    var ln = msgs.last().content
                    if(ln*1+1!=con)msg.delete()
                })}
                if(msg.channel.id==962961271962091530){
                console.log("ok")
                msg.channel.messages.fetch({limit:2}).then(msgs=>{
                    var ln = msgs.last().content
                    var lc  = ln.slice(-1)
                    console.log(lc)
                    if(lc!=con.charAt(0))msg.delete()
                })}
            if(msg.channel.id==962968324923330610||admin(msg.author.id)) {
            console.log("ok")
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
            case "?motto":
                msg.channel.send(mottol)
            break
            case "?help":
                msg.channel.send("obecnie dostępne komędy : \n ?avatar - pokazuje avatar \n ?motto - motto dnia")
            break
            default :    
            
            
            
            }  
            
            }
            
            
        
        
        
    }
        
})
const role = [
    ["wiadomość","rola","emoji"],
    [962969964548079647,962955354264707093,"✅"],
    [966581023884345384,962956044236124170,"bedrock"],
    [966581023884345384,962956093355597854,"java"],
    [966581591411404850,962956197521145876,"male"],
    [966581591411404850,962956152545628200,"female"]
]
bot.on("messageReactionAdd", (react,user) => {
    
    role.forEach((info) => {
     if(react.message.id==info[0]&&react.emoji.name==info[2]) {
        const guild = react.message.guild;
        console.log(react.emoji.name);
        const memberWhoReacted = guild.members.cache.find(member => member.id == user.id);

        memberWhoReacted.roles.add(guild.roles.cache.find(rola => rola.id == info[1])).catch(err=>console.log(err))
    }   
    })
    
    
})
bot.on("messageReactionRemove", (react,user) => {
    
    role.forEach((info) => {
          if(react.message.id==info[0]&&react.emoji.name==info[2]) {
        console.log(react.emoji.name);
        const guild = react.message.guild;
        const memberWhoReacted = guild.members.cache.find(member => member.id == user.id);
        memberWhoReacted.roles.remove(guild.roles.cache.find(rola => rola.id == info[1])).catch(err=>console.log(err))
        }
       })
    
})
function admin(id){
    if(id==537649475494215690||id==537649475494215690) return true
    else return false
}

bot.login(conf.dc)