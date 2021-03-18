import { Command } from "../typings";
import logger from "../logger";

function fib(n: number): number {
  const phi = (1 + Math.sqrt(5)) / 2;
  const asymp = Math.pow(phi, n) / Math.sqrt(5);
  return Math.round(asymp);
}

const Fib: Command = {
  name: "fib",
  description: "Calculate the nth Number in the Fibonacci Series",
  args: true,
  usage: "<n>",
  guildOnly: true,
  cooldown: 2,
  aliases: [],
  execute(message, args) {
    const inputNumber = parseFloat(args[0]);
    if (!isNaN(inputNumber)) {
      message.channel.send(fib(inputNumber)).catch((err) => logger.error(err));
    } else {
      message.channel
        .send(`Is \`${args[0]}\` really a valid number?`)
        .catch((err) => logger.error(err));
    }
  },
};

export default Fib;
