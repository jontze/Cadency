import { Commands } from '../typings'
import Ping from './ping'
import Test from './test'
import Slap from './slap'

const commands: Commands = {
  [Ping.name]: Ping,
  [Test.name]: Test,
  [Slap.name]: Slap
}

export default commands
