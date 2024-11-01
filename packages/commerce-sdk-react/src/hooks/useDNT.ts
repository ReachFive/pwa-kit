/*
 * Copyright (c) 2024, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import useAuthContext from './useAuthContext'

interface useDntReturn {
    dntStatus: boolean | undefined
    dntPreference: boolean
    updateDNT: (preference: boolean | null) => Promise<void>
}

/**
 * Hook that returns
 * dntStatus - a boolean indicating the DNT user choice status. Used to determine
 *              if the consent tracking form should be rendered
 * dntPreference - a boolean indicating the current DNT preference to apply to 
 *              analytics layers. Takes defaultDnt into account when dntStatus is undefined.
 * updateDNT - a function that takes a DNT choice and creates the dw_dnt
 *              cookie and reauthorizes with SLAS
 * @group Helpers
 * @category DNT
 *
 */
const useDNT = (): useDntReturn => {
    const auth = useAuthContext()
    const dntStatus = auth.getDnt()
    const dntPreference = auth.getDntPreference()
    const updateDNT = async (preference: boolean | null) => {
        await auth.setDnt(preference)
    }

    return {dntStatus, dntPreference, updateDNT}
}

export default useDNT
