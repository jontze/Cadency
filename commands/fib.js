function fib(n) {
  if (n <= 0) {
      return 1;
  } else if (n == 1) {
      return 1
  } else {
      return fib(n-1)+fib(n-2);
  }
}

module.exports = {
  name: "fib",
  description: "Calculate the nth Number in the Fibonacci Series",
  args: true,
  usage: "<n>",
  guildOnly: true,
  execute(message, args) {
    if (args[0]) {
      return message.channel.send(fib(args[0]));
    }
  },
};
