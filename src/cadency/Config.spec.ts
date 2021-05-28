import Config from "./Config";
import {
  DEFAULT_ACTIVITY,
  DEFAULT_ACTIVITY_TYPE,
  DEFAULT_STATUS,
} from "./constants/Config.constants";

describe("Config class", () => {
  it("should initialize only with token and default valus", () => {
    const token = "1234";
    const config = new Config(token);
    expect(config).toBeDefined();
    expect(config.token).toBe(token);
    expect(config.activity).toBe(DEFAULT_ACTIVITY);
    expect(config.activityType).toBe(DEFAULT_ACTIVITY_TYPE);
    expect(config.status).toBe(DEFAULT_STATUS);
  });

  it("should initialize with token and custom values", () => {
    const token = "1234";
    const activity = "Hello World";
    const activityType = "PLAYING";
    const status = "dnd";
    const config = new Config("1234", activity, activityType, status);
    expect(config).toBeDefined();
    expect(config.token).toBe("1234");
    expect(config.activity).toBe(activity);
    expect(config.activityType).toBe(activityType);
    expect(config.status).toBe(status);
  });
});
