import React, { useEffect, useState } from 'react';
import { useCurrentCustomer } from '@salesforce/retail-react-app/app/hooks/use-current-customer'
import useNavigation from "@salesforce/retail-react-app/app/hooks/use-navigation";
import { useAccessToken } from '@salesforce/commerce-sdk-react'
import { AuthHelpers, useAuthHelper } from '@salesforce/commerce-sdk-react'
import { getReachFiveClientUI } from './helper';
import { getAppOrigin } from "@salesforce/pwa-kit-react-sdk/utils/url";
import { getConfig } from "@salesforce/pwa-kit-runtime/utils/ssr-config";

const onClient = typeof window !== 'undefined';

export const Auth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigation();
    const logout = useAuthHelper(AuthHelpers.Logout)
    const { data: customer } = useCurrentCustomer();
    const { getTokenWhenReady } = useAccessToken();
    
    const handleLogout = async () => {
        const client = await getReachFiveClientUI();
        await client.core.logout();
        await logout.mutateAsync();
        setAuthenticated(false);
        navigate('/');
    }

    useEffect(() => {
        try {
            const getSdk = async () => {
                const client = await getReachFiveClientUI();
                const info = await client.core.getSessionInfo();
                if (info?.isAuthenticated) {
                    setAuthenticated(true);
                    setUserData(info);
                } else {
                    console.log('Show social login...');
                    // wheras show social login, call authorize with idp
                    // const socialLogin = (async () => await client.showSocialLogin({
                    const socialLogin = (async () => await client.showAuth({
                        container: 'social-login-container',
                        auth: {
                            redirectUri: `${window.location.origin}/idp-callback`,
                        },
                        allowLogin: true,
                        allowWebAuthnSignup: true,
                        allowWebAuthnLogin: true,
                    }))();
                }
            }
            if (onClient) {
                getSdk();
            }
        } catch (error) {
            console.error(error)
        }
    }, [onClient]);

    let userInfo = 'userData not found';
    let customerInfo = 'customer not found';
    try {
        userInfo = JSON.stringify(userData, null, 2);
        customerInfo = JSON.stringify(customer, null, 2);
    } catch (error) {
        console.error(error)
    }

    return <>
        {authenticated ?
            <div>Authenticated - getUserInfo
                <br /> ReachFiveUserInfo: {userInfo}
                <br /> PWA User: {customerInfo}
            </div> :
            <>
                <br />Social login:
                <br /> <div id="social-login-container"></div>
            </>}
        <br /> <button type="submit" onClick={handleLogout}>Logout</button>

    </>;
};

export default Auth;