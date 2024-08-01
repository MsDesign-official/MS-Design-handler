const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('statistics')
    .setDescription('Displays server statistics.'),
  async execute(interaction) {
    if (!interaction.guildId) {
      return interaction.reply({ content: 'Unable to retrieve server information.', ephemeral: true });
    }

    try {
      const owner = await interaction.client.users.fetch(interaction.guild.ownerId);

      const embed = new MessageEmbed()
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setColor("#2B2D31")
        .setTitle(`${interaction.guild.name} Server Statistics`)
        .addFields(
          { name: "👑 Owner", value: `<@${owner.id}>` || 'N/A', inline: true },
          { name: "👥 Members", value: `${interaction.guild.memberCount}`, inline: true },
          { name: "🤖 Bots", value: `${interaction.guild.members.cache.filter(m => m.user.bot).size}`, inline: true },
          { name: "📅 Created On", value: interaction.guild.createdAt.toLocaleDateString("en-US"), inline: true },
          { name: "🔖 Roles", value: `${interaction.guild.roles.cache.size}`, inline: true },
          { name: "✨ Boosters", value: interaction.guild.premiumSubscriptionCount >= 1 ? `${interaction.guild.premiumSubscriptionCount}` : 'No information', inline: true },
          { name: "😀 Emojis", value: interaction.guild.emojis.cache.size >= 1 ? `${interaction.guild.emojis.cache.size}` : 'No information', inline: true }
        )
        .setFooter('Server Statistics')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred while retrieving server information.', ephemeral: true });
    }
  },
};
