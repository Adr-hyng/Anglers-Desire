export default {
  /**
   * Enables debug messages to content logs.
   */
  debug: true,
  /**
   * The amount of ticks in seconds that a fish will stay interested in a bait.
   */
  minInterestTimer: 10,
  /**
   * The amount of ticks in seconds that a fish will stay interested in a bait.
   */
  maxInterestTimer: 30,
  /**
   * The amount of time in seconds for finding a fish i.g 10 seconds
   */
  minFindingTimer: 10,
  /**
   * The amount of time in seconds for finding a fish.
   */
  maxFindingTimer: 30,
  /**
   * The amount of time in seconds for reeling in a fish before it flees.
   */
  minReelTimer: 2,
  /**
   * The amount of time in seconds for reeling in a fish before it flees.
   */
  maxReelTimer: 4,
  /**
   * Any Included family of entities that you can reel and get attracted to the fishing hook.
   */
  includedFamily: [],
  /**
   * Any Excluded family to ignore when fishing.
   */
  excludedFamily: [],
  /**
   * The value of 2 means the back of the player's looking direction.
   * Increase if you want the fish to be far away when reeled in.
   * Decrease if you want the fish to be in front of you.
   * Note: Preferably, the value should be 1 or 2.
   */
  backDestinationOffset: 1,
  /**
   * Number of radius of the fishing hook can attract fishes.
   */
  minRadius: 2,
  /**
   * Number of radius of the fishing hook can attract fishes.
   */
  maxRadius: 4,
  /**
   * Enable the watchdog terminate log. Makes sending the WatchDog Error either Message in-game or Creator's Log.
   */
  enableWatchDogTerminateLog: false,
  /**
   * Number of seconds before cancelling the fishing system.
   */
  expirationTimer: 600,
  /**
   * Random Depth chances for better fishes at the bottom of the sea. Total of 100%.
   * +2 blocks below = 45% Chance
   * +4 blocks below = 30% Chance
   * +7 blocks below = 15% Chance
   * +15 blocks below = 10% Chance
   */
  depthMultiplierRoll: {'5': 0.45, '8': 0.3, '11': 0.15, '15': 0.1},
  /**
   * Success rate you will guarantee to reel or catch any included mob in the water.
   */
  successRate: 60,
};

// version (do not change)
export const VERSION = "1.0.0";