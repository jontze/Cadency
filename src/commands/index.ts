import { Commands } from '../typings'
import Ping from './ping'
import Test from './test'
import Slap from './slap'
import Fib from './fib'
import Inspire from './inspire'
import Urban from './urban'
import Help from './help'
import Play from './play'
import Pause from './pause'
import Resume from './resume'
import Skip from './skip'
import Show from './show'
import Purge from './purge'
import Search from './search'
import Now from './now'

const commands: Commands = {
  [Ping.name]: Ping,
  [Test.name]: Test,
  [Slap.name]: Slap,
  [Fib.name]: Fib,
  [Inspire.name]: Inspire,
  [Urban.name]: Urban,
  [Help.name]: Help,
  [Play.name]: Play,
  [Pause.name]: Pause,
  [Resume.name]: Resume,
  [Skip.name]: Skip,
  [Show.name]: Show,
  [Purge.name]: Purge,
  [Search.name]: Search,
  [Now.name]: Now
}

export default commands
