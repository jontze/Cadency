import { Commands } from '../typings'
import Ping from './ping'
import Test from './test'

const commands: Commands = {
  [Ping.name]: Ping,
  [Test.name]: Test
}

export default commands
