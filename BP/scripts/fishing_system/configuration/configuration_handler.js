import Configuration from "./server_configuration";
export let SERVER_CONFIGURATION = {
    ...Configuration
};
const originalServerConfiguration = JSON.parse(JSON.stringify(Configuration));
export const resetServerConfiguration = () => SERVER_CONFIGURATION = originalServerConfiguration;
export const getServerConfiguration = () => SERVER_CONFIGURATION;
export const setServerConfiguration = (newConfig) => SERVER_CONFIGURATION = newConfig;
