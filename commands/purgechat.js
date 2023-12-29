const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../utils/database')
const fetch = require('node-fetch')
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("purgechat")
        .setDescription("Purge chat channel's messages")
        .setDescriptionLocalizations({
            "en-US": "Purge chat channel's messages",
            "fi": "Puhdista keskustelukanavan viestit",
            "fr": "Purger les messages du canal de discussion",
            "de": "Löschen Sie die Nachrichten des Chatkanals",
            "it": "Elimina i messaggi del canale di chat",
            "nl": "Verwijder de berichten van het chatkanaal",
            "ru": "Удалить сообщения чат-канала",
            "pl": "Wyczyść wiadomości kanału czatu",
            "tr": "Sohbet kanalının mesajlarını temizle",
            "cs": "Vymažte zprávy chatovacího kanálu",
            "ja": "チャットチャネルのメッセージを削除する",
            "ko": "채팅 채널의 메시지 삭제",
        })
        .addStringOption((option) => 
        option
            .setName("name")
            .setDescription("Chat channel name")
            .setDescriptionLocalizations({
                "en-US": "Chat channel name",
                "fi": "Keskustelukanavan nimi",
                "fr": "Nom du canal de discussion",
                "de": "Name des Chatkanals",
                "it": "Nome del canale di chat",
                "nl": "Naam van het chatkanaal",
                "ru": "Имя чат-канала",
                "pl": "Nazwa kanału czatu",
                "tr": "Sohbet kanalı adı",
                "cs": "Název chatovacího kanálu",
                "ja": "チャットチャネル名",
                "ko": "채팅 채널 이름",
            })
            .setRequired(true)
        ),
    async execute(interaction) {
		let idfrom = null;
		let ephemeral = true;
		
		if(interaction.guild == null) {
			idfrom = interaction.user.id;
			ephemeral = false;
		}
		else {
			idfrom = interaction.guild.id;
		}
		
        let sellerkey = await db.get(`token_${idfrom}`)
        if(sellerkey === null) return interaction.editReply({ embeds: [new Discord.EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral})

        let name = interaction.options.getString("name")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=clearchannel&name=${name}`)
        .then(res => res.json())
        .then(json => {
			if (json.success) {
				interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral})
			} else {
                interaction.editReply({ embeds: [new Discord.EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/setseller\` command.`}]).setColor(Colors.Red).setTimestamp().setFooter({ text: "mazkdevf_bot Discord Bot" })], ephemeral: ephemeral})
            }
        })
    },
};