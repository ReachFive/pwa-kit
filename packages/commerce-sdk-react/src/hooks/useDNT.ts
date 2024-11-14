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
 * Hook that returns
 * selectedDoNotTrackValue - a boolean indicating the DNT user choice status. Used to determine
 *              if the consent tracking form should be rendered
 * effectiveDoNotTrackValue - a boolean indicating the current DNT preference to apply to
 *              analytics layers. Takes defaultDnt into account when selectedDoNotTrackValue is undefined.
 *              If defaultDnt is undefined as well, then SDK default is used.
 * updateDNT - a function that takes a DNT choice and creates the dw_dnt
 *              cookie and reauthorizes with SLAS
 * @group Helpers
 * @category DNT
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

    return {selectedDoNotTrackValue, effectiveDoNotTrackValue, dntStatus, updateDNT}
}

export default useDNT
