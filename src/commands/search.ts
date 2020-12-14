
import { MessageEmbed } from 'discord.js'
import { Command, QueueSong } from '../typings'
import * as music from '../utils/music'
import logger from '../logger'

const Search: Command = {
  name: 'search',
  description: 'Search a video on YouTube by the given query.',
  args: true,
  cooldown: 10,
  usage: '<search-query>',
  aliases: [],
  guildOnly: true,
  execute (message, args) {
    const voiceChannelUser = message.member?.voice.channel

    if (music.validateVoiceChannel(message)) {
      // Search YouTube by args
      music.searchQuery(args).then((videoTop10) => {
        if (videoTop10 === undefined) {
          message.channel.send('Upps, the shit just hit the fan! :poop: :dash:').catch(err => logger.error(err))
        } else {
          // Create Top10 results Message
          const embed = new MessageEmbed()
          embed.setColor('#db6923')
          embed.setTitle('Top 10 search results')
          embed.setFooter('React with a number to choose your song.')
          for (let i = 0; i < videoTop10.length; i++) {
            const videoEntry = videoTop10[i]
            embed.addField(`${music.searchReactions[i]}. ${videoEntry.title}`, `${videoEntry.description ?? '_empty description_'}`)
          }
          // Send Message and handle reactions
          message.channel.send(embed)
            .then(async (embedMessage) => {
              // Remove List after 70 seconds
              setTimeout(() => {
                embedMessage.delete().catch(err => logger.error(err))
              }, 70000)
              try {
                // Wait for a valid reaction
                const awaitedReactions = await embedMessage.awaitReactions(music.filterSearchReactions, { max: 1, time: 60000, errors: ['time'] })
                const emojiIndex = music.searchReactions.indexOf(awaitedReactions.first()?.emoji.name ?? '')
                if (emojiIndex >= 0) {
                  // Delete Search-result Message, request song info and play or add to queue
                  await embedMessage.delete()
                  const videoInfo = await music.requestSongInfo(message, [videoTop10[emojiIndex].url])
                  if (videoInfo === undefined) {
                    await message.channel.send('Invalid Youtube-Link!')
                  } else {
                    const serverQueue: QueueSong = {
                      textChannel: message.channel,
                      voiceChannel: voiceChannelUser,
                      connection: null,
                      songs: [],
                      volume: 5,
                      playing: false
                    }
                    serverQueue.songs.push(videoInfo)
                    message.client.emit('addSong', serverQueue, voiceChannelUser?.guild.id, message)
                  }
                } else {
                  await message.channel.send('I don\'t know what to do with this reaction!')
                }
              } catch (err) {
                logger.error(err)
              }
            })
            .catch(err => logger.error(err))
        }
      }).catch(err => logger.error(err))
    }
  }
}

export default Search
