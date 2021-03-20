import moment from "moment";
import {Client, MessageEmbed, TextChannel, Intents} from "discord.js";

const intents = new Intents();
intents.add([3072]);
const discord = new Client({ws: {intents}});
discord.login(process.env.DISCORD_TOKEN);

interface IWhitelist {
	dob: string;
	displayName: string;
	status: string;
	minecraftuuid: string;
	whereHeard: string;
	moddedExperience: string;
	knownMembers: string;
	interestedServers: string;
	aboutUser: string;
	id: string;
}

export async function sendWhitelist(whitelist: IWhitelist) {
	if (!process.env.DISCORD_CHANNEL) {
		return;
	}

	const exampleEmbed = new MessageEmbed()
		.setColor("#aea1ea")
		.setTitle(`New Application for ${whitelist.displayName}`)
		.addFields({
			name: "Application ID",
			value: whitelist.id,
		})
		.addFields({
			name: "Minecraft Name",
			value: whitelist.displayName,
		})
		.addFields({
			name: "Date of Birth",
			value: moment(whitelist.dob).format("Mo MMMM YYYY"),
		})
		.addFields({
			name: "Where did you hear about Madhouse Miners?",
			value: whitelist.whereHeard,
		})
		.addFields({
			name: "What experience do you have with modded Minecraft?",
			value: whitelist.moddedExperience,
		})
		.addFields({
			name:
				"Do you know any other members of our community? If so, what is their minecraft name?",
			value: whitelist.knownMembers,
		})
		.addFields({
			name: "Which of our servers are you mainly interested in and why?",
			value: whitelist.interestedServers,
		})
		.addFields({
			name:
				"Tell us a bit about yourself (e.g. What mods are you mainly interest in, what style of building do you like to do?)",
			value: whitelist.aboutUser,
		})
		.setTimestamp();

	await (discord.channels.cache.get(
		process.env.DISCORD_CHANNEL
	) as TextChannel).send(exampleEmbed);
	await (discord.channels.cache.get(
		process.env.DISCORD_CHANNEL
	) as TextChannel).send(
		`You can respond to this application here.\n\nTo accept type \`\`\`!accept ${whitelist.id} [reason]\`\`\`\nTo request more information type \`\`\`!info ${whitelist.id} [reason]\`\`\`\nTo decline type \`\`\`!decline ${whitelist.id} [reason]\`\`\``
	);
}
