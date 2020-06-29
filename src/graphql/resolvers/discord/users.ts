import * as discord from "discord.js";

interface IDiscordUsersParams {
  statuses: string[];
}

interface DiscordUser {
  id: string;
  avatar_url: string;
  avatar_url_jpg: string;
  name: string;
  playing: string | null;
  status: string;
}

let users: DiscordUser[] = [];
async function updateLocalCache() {
  const client = new discord.Client();
  await client.login(process.env.DISCORD_TOKEN);
  const guild = await client.guilds.cache.get("184175241335930880");
  const members = await guild!.members
    .fetch({
      withPresences: true,
    })
    .then((d) =>
      d.filter((user) => {
        return user.presence.status !== "offline";
      })
    );

  let a = members.array();
  users = [];
  for (let m of a) {
    const u = await client.users.fetch(m.id);

    users.push({
      id: m.id,
      name: m.displayName,
      playing: m.presence.activities[0]
        ? m.presence.activities[0].state || m.presence.activities[0].name
        : null,
      status: m.presence.status.toUpperCase(),
      avatar_url: u.avatarURL({ size: 16 }) || "",
      avatar_url_jpg: u.avatarURL({ size: 16, format: "jpg" }) || "",
    });
  }
}
setInterval(updateLocalCache, 60000);
updateLocalCache();

export default async () => {
  return users;
};
