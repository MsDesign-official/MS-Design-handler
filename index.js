const { Client, Collection, Intents, MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, MessageMention } = require('discord.js');
const { clientID, guildID, token, Channel_id } = require('./config.json');
const fs = require('fs');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
  });

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');
  
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      client.commands.set(command.data.name, command);
    }
  }


const commands = client.commands.map(command => command.data.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientID, guildID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
  
    try {
      await command.execute(interaction, client, { clientID, guildID, token });
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
    }
  });

client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.get(Channel_id);
    
    if (!channel) return;

    const embed = new MessageEmbed()
        .setColor('#2B2D31')
        .setTitle('Welcome to the server! :wave:')
        .setDescription(`Hello <@${member.user.id}>! 🎉\n\nWelcome to the server! We are glad to have you here.`)
        .setThumbnail(member.user.displayAvatarURL()) // You can remove this and add .setThumbnail("Your Image URL")
        // Or you can add .setImage("Your Image URL")
        .setTimestamp();
    const message = await channel.send({ embeds: [embed] });
    
    await message.react('👋');
});


client.login(token);