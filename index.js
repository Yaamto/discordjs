const { Client, Events, GatewayIntentBits, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const dotenv = require('dotenv');
dotenv.config();


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages,GatewayIntentBits.MessageContent] });
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const recentlyJoinedUsers = new Set();

client.on('voiceStateUpdate', (oldState, newState) => {
  const { member } = newState;

  // Vérifie si l'utilisateur a rejoint un canal vocal
  if (newState.channel) {
    // Ajoute l'utilisateur à la liste des utilisateurs récemment joints
    recentlyJoinedUsers.add(member);
  } else {
    // Supprime l'utilisateur de la liste s'il quitte un canal vocal
    recentlyJoinedUsers.delete(member);
  }

});

client.on('interactionCreate', (interaction) => {

    try {
        const userToMove = interaction.member.guild.members.cache.get(interaction.options.get('user').value);
        const targetChannelName = 'shaker'; // Nom du canal vocal cible
        const targetChannel = interaction.guild.channels.cache.find(channel => channel.name === targetChannelName);
      if(interaction.commandName === 'shake'){
        // Vérifie si le message a été envoyé dans un canal vocal

        //get the interaction member in recentJoinedUsers
        const isUser = recentlyJoinedUsers.has(interaction.member);
        const user = interaction.member

        if (user.voice.channelId !== userToMove.voice.channelId) {
            return interaction.reply('Vous devez être dans le même canal vocal que l\'utilisateur que vous souhaitez déplacer pour utiliser cette commande.');
          }
        
        // if (interaction.member.voice.channelId !== userToMove.voice.channelId) {
        //     return interaction.reply('Vous devez être dans le canal vocal "shaker" pour utiliser cette commande.');;
        //   }
        // Récupère la mention de l'utilisateur à déplacer
   

        // Vérifie si l'utilisateur mentionné est présent dans le serveur
        if (!userToMove) {
            return interaction.reply('Utilisateur invalide.');
        }
        
        // Récupère le canal vocal spécifique dans lequel vous souhaitez déplacer l'utilisateur
        
     
        // Vérifie si le canal vocal cible existe et si c'est bien un canal vocal
        if (!targetChannel || targetChannel.type !== 2) {
            return interaction.reply('Canal vocal invalide.');
        }

        // Récupère le canal vocal actuel de l'utilisateur qui a envoyé la commande
        const currentChannel = interaction.member.voice.channel;
        
        // Déplace l'utilisateur vers le canal vocal cible
        for( let i = 0; i < 5; i++){
            userToMove.voice.setChannel(targetChannel)
            .then(() => {
            })
            .catch(error => {
                console.error('Erreur lors du déplacement de l\'utilisateur:', error);
                interaction.reply('Une erreur s\'est produite lors du déplacement de l\'utilisateur.');
            });
            userToMove.voice.setChannel(currentChannel)
            .then(() => {
            })
            .catch(error => {
                console.error('Erreur lors du déplacement de l\'utilisateur:', error);
                interaction.reply('Une erreur s\'est produite lors du déplacement de l\'utilisateur.');
            });
        }
        return interaction.reply(`L'utilisateur ${userToMove} a été déplacé dans le canal vocal ${targetChannel} par ${interaction.member}.`);
        
    }
} catch (error) {
    interaction.reply(error.message);
}
});
const main = async() => {
    const commands=[{
        name: 'shake',
        type: 2
    }]
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
        client.login(process.env.DISCORD_TOKEN);
     
    } catch (error) {
        console.error("there is an error : " + error);
    }
}
main()

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'


// Log in to Discord with your client's token

