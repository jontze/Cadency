import { Commands } from '../typings'
import Ping from './ping'
import Test from './test'
import Slap from './slap'
import Fib from './fib'

const commands: Commands = {
  [Ping.name]: Ping,
  [Test.name]: Test,
  [Slap.name]: Slap,
  [Fib.name]: Fib
}

export default commands
