module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      console.log(`Logged in as ${client.user.tag}!`);
      const updateStatus = () => {
        const totalServers = client.guilds.cache.size;
        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  
        client.user.setActivity(`serving ${totalMembers} users in ${totalServers} servers`, { type: 'WATCHING' });
      };
  
      updateStatus();
  
      setInterval(updateStatus, 15000);
    },
  };
  