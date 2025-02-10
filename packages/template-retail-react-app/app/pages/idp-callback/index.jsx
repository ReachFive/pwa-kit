/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {useCurrentCustomer} from '@salesforce/retail-react-app/app/hooks/use-current-customer'
import useNavigation from '@salesforce/retail-react-app/app/hooks/use-navigation'
import React, {useEffect, useState} from 'react'
import {FormattedMessage, useIntl} from 'react-intl'
import {Box, Text, VStack, Spinner} from '@salesforce/retail-react-app/app/components/shared/ui'
import Seo from '@salesforce/retail-react-app/app/components/seo'
import {AlertIcon} from '@salesforce/retail-react-app/app/components/icons'
import useIdpCallback from '@salesforce/retail-react-app/app/hooks/use-idp-callback'
import {useAccessToken} from '@salesforce/commerce-sdk-react'
import {useLocation} from 'react-router-dom'
import {getAppOrigin} from '@salesforce/pwa-kit-react-sdk/utils/url'
import {getConfig} from '@salesforce/pwa-kit-runtime/utils/ssr-config'
import {getReachFiveClientUI} from '../reach_five/helper'

const getCustomerInfo = async (organizationId, token) =>
    await (
        await fetch(
            `${getAppOrigin()}/mobify/proxy/api/shopper/auth/v1/organizations/${organizationId}/oauth2/userinfo?channel_id=RefArch`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    channel_id: 'RefArch'
                }
            }
        )
    ).json()

// This only work for get operation
// const fastCreateCustomerWithExternal = async (organizationId, token, info) => await fetch(`${getAppOrigin()}/mobify/proxy/api/customer/shopper-customers/v1/organizations/${organizationId}/customers/external-profile`, {
// const fastCreateCustomerWithExternal = async (organizationId, token, info) => await fetch(`${getAppOrigin()}/mobify/proxy/ocapi/s/ReafArch/dw/shop/v24_5/customer/external-profile`, {
// const fastCreateCustomerWithExternal = async (organizationId, token, info) => await fetch(`${getAppOrigin()}/mobify/proxy/ocapi/s/ReafArch/dw/shop/v24_5/customer/external-profile`, {
const fastCreateCustomerWithExternal = async (organizationId, token, info) =>
    await fetch(
        `${getAppOrigin()}/mobify/proxy/api/shopper-customers/v1/organizations/${organizationId}/customers/external-profile`,
        {
            method: 'POST',
            mode: 'no-cors',
            // redirect: "follow",
            credentials: 'include',
            headers: {
                // here we use client id and secret from slas because this is a server side call
                Authorization: `Bearer ${token}`,
                // 'Authorization': `Bearer ${localStorage.getItem('access_token_RefArch')}`,
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // channel_id: 'RefArch'
                authenticationProviderId: 'reach_five_slas', // did we use final provider ?
                externalId: info.externalId,
                email: info.email,
                siteId: 'RefArch'
            }
        }
    )

const IDPCallback = () => {
    const navigate = useNavigation()
    const location = useLocation()
    const [customerChecked, setCustomerChecked] = useState(false)
    const {data: customer} = useCurrentCustomer()
    const {formatMessage} = useIntl()
    const {getTokenWhenReady} = useAccessToken()
    const {organizationId} = getConfig().app.commerceAPI.parameters
    // const register = useAuthHelper(AuthHelpers.Register);
    // we can't use this because registerExternalProfile mutation not yet implemented
    // const register = useShopperCustomersMutation('registerExternalProfile');
    const {authenticationError} = useIdpCallback({
        labels: {
            missingParameters: formatMessage({
                defaultMessage: 'Missing parameters',
                id: 'idp.redirect.error.missing_parameters'
            })
        }
    })
    const query = new URLSearchParams(location.search)
    const code = query.get('code')
    const state = query.get('state')
    const usid = query.get('usid')

    useEffect(() => {
        if (customer?.isRegistered) {
            if (location?.state?.directedFrom) {
                navigate(location.state.directedFrom)
            } else {
                navigate('/account')
            }
        }
    }, [customer?.isRegistered, customerChecked])

    return (
        <Box data-testid="idp-callback" layerStyle="page">
            <Seo
                title={formatMessage({defaultMessage: 'Redirecting...', id: 'idp.redirect.title'})}
            />
            {authenticationError && (
                <VStack>
                    <AlertIcon boxSize={12} color="red.500" />
                    <Text
                        fontSize={{base: 'xx-large', md: 'xxx-large'}}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        <FormattedMessage
                            defaultMessage="Error logging in with identity provider"
                            id="idp.redirect.error"
                        />
                    </Text>
                    <Text fontSize="x-large">{authenticationError}</Text>
                </VStack>
            )}
            {!authenticationError && (
                <VStack>
                    <Spinner boxSize={12} />
                    <Text
                        fontSize={{base: 'xx-large', md: 'xxx-large'}}
                        fontWeight="bold"
                        textAlign="center"
                    >
                        <FormattedMessage defaultMessage="Authenticating" id="idp.redirect.title" />
                    </Text>
                    <Text fontSize="x-large">
                        <FormattedMessage
                            defaultMessage="Please hold..."
                            id="idp.redirect.message"
                        />
                    </Text>
                </VStack>
            )}
        </Box>
    )
}

IDPCallback.getTemplateName = () => 'idp-callback'

export default IDPCallback
