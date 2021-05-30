import Fib from "../../commands/fib";
import Help from "../../commands/help";
import Inspire from "../../commands/inspire";
import Now from "../../commands/now";
import Pause from "../../commands/pause";
import Ping from "../../commands/ping";
import Play from "../../commands/play";
import Prefix from "../../commands/prefix";
import Purge from "../../commands/purge";
import Resume from "../../commands/resume";
import Search from "../../commands/search";
import Show from "../../commands/show";
import Skip from "../../commands/skip";
import Slap from "../../commands/slap";
import Urban from "../../commands/urban";
import { COMMAND, CommandLoaderType } from "../../typings";

/**
 * Static Class that holds all commands as properties by the Command enum.
 * If a command is not a property in this class. The bot will not find it.
 */
export default class CommandLoader implements CommandLoaderType {
  public static readonly [COMMAND.FIB] = Fib;
  public static readonly [COMMAND.HELP] = Help;
  public static readonly [COMMAND.INSPIRE] = Inspire;
  public static readonly [COMMAND.NOW] = Now;
  public static readonly [COMMAND.PAUSE] = Pause;
  public static readonly [COMMAND.PING] = Ping;
  public static readonly [COMMAND.PLAY] = Play;
  public static readonly [COMMAND.PURGE] = Purge;
  public static readonly [COMMAND.RESUME] = Resume;
  public static readonly [COMMAND.SEARCH] = Search;
  public static readonly [COMMAND.SHOW] = Show;
  public static readonly [COMMAND.SKIP] = Skip;
  public static readonly [COMMAND.SLAP] = Slap;
  public static readonly [COMMAND.URBAN] = Urban;
  public static readonly [COMMAND.PREFIX] = Prefix;
}
