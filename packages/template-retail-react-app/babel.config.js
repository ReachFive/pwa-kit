/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const baseConfig = require('@salesforce/pwa-kit-dev/configs/babel/babel-config')
console.log('2222222222222222', baseConfig)

module.exports = {
    ...baseConfig.default,
    plugins: [
        ...baseConfig.default.plugins,
        [
            'module-resolver',
            {
                'root': ['./'],
                'alias': {
                    '@salesforce/retail-react-app': './'
                }
            }
        ]

    ]
}
