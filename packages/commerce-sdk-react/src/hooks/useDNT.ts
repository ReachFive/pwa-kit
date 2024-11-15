/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import useAuthContext from './useAuthContext'

interface useDntReturn {
    selectedDoNotTrackValue: boolean | undefined
    dntStatus: boolean | undefined
    effectiveDoNotTrackValue: boolean | undefined
    updateDNT: (preference: boolean | null) => Promise<void>
}

/**
 * @group Helpers
 * @category DNT
 *
 * @returns {Object} - The returned object containing DNT states and function to update preference
 * @property {boolean | undefined} dntStatus @deprecated - DNT user preference. Used to determine
 *              if the consent tracking form should be rendered
 * **Deprecated since version 3.1.0 Use selectedDoNotTrackValue instead.**
 * @property {boolean} selectedDoNotTrackValue - DNT user preference. Used to determine
 *              if the consent tracking form should be rendered
 * @property {boolean} effectiveDoNotTrackValue - effective DNT value to apply to
 *              analytics layers. Takes defaultDnt into account when selectedDoNotTrackValue is undefined.
 *              If defaultDnt is undefined as well, then SDK default is used.
 * @property {function} updateDNT - takes a DNT choice and creates the dw_dnt
 *              cookie and reauthorizes with SLAS
 *
 */
const useDNT = (): useDntReturn => {
    const auth = useAuthContext()
    const selectedDoNotTrackValue = auth.getDnt()
    const effectiveDoNotTrackValue = auth.getDnt({
        includeDefaults: true
    })
    const updateDNT = async (preference: boolean | null) => {
        await auth.setDnt(preference)
    }
    const dntStatus = selectedDoNotTrackValue

    return {
        selectedDoNotTrackValue,
        effectiveDoNotTrackValue,
        /** @deprecated - Deprecated since version 3.1.0. Use selectedDoNotTrackValue instead. */
        dntStatus,
        updateDNT
    }
}

export default useDNT
