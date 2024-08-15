export default {
    debug: true,
    minInterestTimer: 10,
    maxInterestTimer: 30,
    minFindingTimer: 10,
    maxFindingTimer: 30,
    minReelTimer: 2,
    maxReelTimer: 4,
    includedFamily: [],
    excludedFamily: [],
    backDestinationOffset: 1,
    minRadius: 2,
    maxRadius: 4,
    enableWatchDogTerminateLog: false,
    expirationTimer: 600,
    depthMultiplierRoll: { '5': 0.45, '8': 0.3, '11': 0.15, '15': 0.1 },
    successRate: 60,
};
export const VERSION = "1.0.0";
