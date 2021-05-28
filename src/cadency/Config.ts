import { ActivityType, PresenceStatusData } from "discord.js";
import {
  DEFAULT_ACTIVITY,
  DEFAULT_ACTIVITY_TYPE,
  DEFAULT_STATUS,
} from "./constants/Config.constants";

/**
 * Creates the configuration for the Cadency bot
 * @param  {string} token Discord bot token
 * @param  {string} activity Activity description
 * @param  {ActivityType} activityType Discord activity type
 * @param  {PresenceStatusData} status Discord online status
 * ```typescript
 * const cadency = new Cadency(new Config("<token>"))
 * ```
 */
export default class Config {
  constructor(
    public readonly token: string,
    public readonly activity: string = DEFAULT_ACTIVITY,
    public readonly activityType: ActivityType = DEFAULT_ACTIVITY_TYPE,
    public readonly status: PresenceStatusData = DEFAULT_STATUS
  ) {}
}
