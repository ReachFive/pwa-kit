import { getConfig } from "@salesforce/pwa-kit-runtime/utils/ssr-config";
import { getAppOrigin } from "@salesforce/pwa-kit-react-sdk/utils/url";

let client = {
    core: null,
    ui: null
};

const makeClient = (createClient) => {
    const config = getConfig();
    console.log('config:', config.app.idp);
    return createClient({
        // Required parameters
        // domain: `${getAppOrigin()}/mobify/proxy/reach5`,
        domain: config.app.idp.domain,
        clientId: config.app.idp.clientId,
        // Optional parameter
        language: 'en',
        locale: 'en'
    })
};

export const getClient = async (clientType) => {
    switch (clientType) {
        case 'ui': {
            const {
                createClient,
            } = await import('@reachfive/identity-ui');
            client.core = makeClient(createClient);
            return client.core;
        }
        case 'core':
        default: {
            const {
                createClient,
            } = await import('@reachfive/identity-core');
            client.ui = makeClient(createClient);
            return client.ui;
        }
    }
};

export const getReachFiveClient = async () => {
    return await getClient('core');
};

export const getReachFiveClientUI = async () => {
    return await getClient('ui');
};