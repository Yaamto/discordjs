client.on('interactionCreate', (interaction) => {
  
    try {
        const userToMove = interaction.member
        // Vérifie si le message commence par le préfixe de commande, par exemple '!'
       
        // Vérifie si l'utilisateur a la permission de déplacer les membres dans les canaux vocaux
      if(interaction.commandName === 'shake'){
        // Vérifie si le message a été envoyé dans un canal vocal
        if (!interaction.member.voice.channel) {
            return interaction.reply('Vous devez être dans un canal vocal pour utiliser cette commande.');
        }

        // Récupère la mention de l'utilisateur à déplacer
   

        // Vérifie si l'utilisateur mentionné est présent dans le serveur
        if (!userToMove) {
            return interaction.reply('Utilisateur invalide.');
        }
        
        // Récupère le canal vocal spécifique dans lequel vous souhaitez déplacer l'utilisateur
        const targetChannelName = 'shaker'; // Nom du canal vocal cible
        const targetChannel = interaction.guild.channels.cache.find(channel => channel.name === targetChannelName);
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
        interaction.reply(`L'utilisateur ${userToMove} a été déplacé dans le canal vocal ${targetChannel} ${numberOfMoove} fois.}`);
    }
} catch (error) {
    interaction.reply(error.message);
}
});