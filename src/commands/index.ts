import { Commands } from '../typings'
import Ping from './ping'
import Test from './test'
import Slap from './slap'
import Fib from './fib'
import Inspire from './inspire'
import Urban from './urban'
import Help from './help'

const commands: Commands = {
  [Ping.name]: Ping,
  [Test.name]: Test,
  [Slap.name]: Slap,
  [Fib.name]: Fib,
  [Inspire.name]: Inspire,
  [Urban.name]: Urban,
  [Help.name]: Help
}

export default commands
