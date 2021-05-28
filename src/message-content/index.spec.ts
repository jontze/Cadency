import { TextChannel, VoiceChannel } from "discord.js";
import { MoreVideoDetails } from "ytdl-core";
import { Video } from "ytsr";
import messageContent from ".";
import { ISong } from "../typings";

describe("Message content", () => {
  let dummySong: ISong;
  let dummyVideoInfo: MoreVideoDetails;

  beforeEach(() => {
    dummySong = {
      textChannel: {} as unknown as TextChannel,
      voiceChannel: {
        name: "TestName",
      } as unknown as VoiceChannel,
      info: {
        video_url: "www.test.test",
        title: "TestTitle",
      } as unknown as MoreVideoDetails,
    };
    dummyVideoInfo = {
      title: "TestTitle",
      video_url: "www.test.test",
    } as unknown as MoreVideoDetails;
  });

  it("should create addFirst song message", () => {
    expect.assertions(3);
    const msg = messageContent.song.addFirst(dummySong);
    expect(msg).toContain("TestName");
    expect(msg).toContain("TestTitle");
    expect(msg).toContain("www.test.test");
  });

  it("should create add song message", () => {
    expect.assertions(2);
    const msg = messageContent.song.add(dummySong);
    expect(msg).toContain("TestTitle");
    expect(msg).toContain("www.test.test");
  });

  it("should create show song message", () => {
    expect.assertions(1);
    const msg = messageContent.song.show(dummyVideoInfo);
    expect(msg).toContain("TestTitle");
  });

  it("should create showPlaylist song message", () => {
    expect.assertions(4);
    const embedMsg = messageContent.song.showPlaylist([dummyVideoInfo]);
    expect(embedMsg.color).toBeDefined();
    expect(embedMsg.title).toBe("Playlist");
    expect(embedMsg.fields[0]?.value).toContain("www.test.test");
    expect(embedMsg.fields[0]?.name).toContain("TestTitle");
  });

  it("should create fibFail command message", () => {
    expect.assertions(1);
    const dummyString = "number";
    const msg = messageContent.command.fibFail(dummyString);
    expect(msg).toContain(dummyString);
  });

  it("should create slapYourself command message", () => {
    expect.assertions(1);
    const dummyString = "author";
    const msg = messageContent.command.slapYourself(dummyString);
    expect(msg).toContain(dummyString);
  });

  it("should create slapBot command message", () => {
    expect.assertions(2);
    const dummyString = "author";
    const botId = "123";
    const msg = messageContent.command.slapBot(botId, dummyString);
    expect(msg).toContain(dummyString);
    expect(msg).toContain(botId);
  });

  it("should create slap command message", () => {
    expect.assertions(2);
    const authorString = "author";
    const targetString = "target";
    const msg = messageContent.command.slap(authorString, targetString);
    expect(msg).toContain(authorString);
    expect(msg).toContain(targetString);
  });

  it("should create helpDM command message", () => {
    expect.assertions(1);
    const authorString = "author";
    const msg = messageContent.command.helpDM(authorString);
    expect(msg).toContain(authorString);
  });

  it("should create help command message", () => {
    expect.assertions(3);
    const embedMsg = messageContent.command.help();
    expect(embedMsg.color).toBeDefined();
    expect(embedMsg.title).toBeDefined();
    expect(embedMsg.fields.length).toBe(15);
  });

  it("should create searchResults command message", () => {
    expect.assertions(4);
    const dummyVideoResult = {
      title: "TestTitle",
      description: "TestDesc",
    };
    const embedMsg = messageContent.command.searchResults([
      dummyVideoResult as unknown as Video,
    ]);
    expect(embedMsg.color).toBeDefined();
    expect(embedMsg.title).toBeDefined();
    expect(embedMsg.fields[0]?.value).toContain(dummyVideoResult.description);
    expect(embedMsg.fields[0]?.name).toContain(dummyVideoResult.title);
  });

  it("should create prefix bot message", () => {
    expect.assertions(2);
    const newPrefix = "#";
    const msg = messageContent.bot.prefix(newPrefix);
    expect(msg).toBeDefined();
    expect(msg).toContain("#");
  });
});
