module.exports = [
"[project]/node_modules/compare-versions/lib/esm/utils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareSegments",
    ()=>compareSegments,
    "semver",
    ()=>semver,
    "validateAndParse",
    ()=>validateAndParse
]);
const semver = /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
const validateAndParse = (version)=>{
    if (typeof version !== 'string') {
        throw new TypeError('Invalid argument expected string');
    }
    const match = version.match(semver);
    if (!match) {
        throw new Error(`Invalid argument not valid semver ('${version}' received)`);
    }
    match.shift();
    return match;
};
const isWildcard = (s)=>s === '*' || s === 'x' || s === 'X';
const tryParse = (v)=>{
    const n = parseInt(v, 10);
    return isNaN(n) ? v : n;
};
const forceType = (a, b)=>typeof a !== typeof b ? [
        String(a),
        String(b)
    ] : [
        a,
        b
    ];
const compareStrings = (a, b)=>{
    if (isWildcard(a) || isWildcard(b)) return 0;
    const [ap, bp] = forceType(tryParse(a), tryParse(b));
    if (ap > bp) return 1;
    if (ap < bp) return -1;
    return 0;
};
const compareSegments = (a, b)=>{
    for(let i = 0; i < Math.max(a.length, b.length); i++){
        const r = compareStrings(a[i] || '0', b[i] || '0');
        if (r !== 0) return r;
    }
    return 0;
}; //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/compare-versions/lib/esm/compareVersions.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compareVersions",
    ()=>compareVersions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/compare-versions/lib/esm/utils.js [app-route] (ecmascript)");
;
const compareVersions = (v1, v2)=>{
    // validate input and split into segments
    const n1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateAndParse"])(v1);
    const n2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateAndParse"])(v2);
    // pop off the patch
    const p1 = n1.pop();
    const p2 = n2.pop();
    // validate numbers
    const r = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareSegments"])(n1, n2);
    if (r !== 0) return r;
    // validate pre-release
    if (p1 && p2) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareSegments"])(p1.split('.'), p2.split('.'));
    } else if (p1 || p2) {
        return p1 ? -1 : 1;
    }
    return 0;
}; //# sourceMappingURL=compareVersions.js.map
}),
"[project]/node_modules/compare-versions/lib/esm/compare.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compare",
    ()=>compare
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/compare-versions/lib/esm/compareVersions.js [app-route] (ecmascript)");
;
const compare = (v1, v2, operator)=>{
    // validate input operator
    assertValidOperator(operator);
    // since result of compareVersions can only be -1 or 0 or 1
    // a simple map can be used to replace switch
    const res = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$compare$2d$versions$2f$lib$2f$esm$2f$compareVersions$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareVersions"])(v1, v2);
    return operatorResMap[operator].includes(res);
};
const operatorResMap = {
    '>': [
        1
    ],
    '>=': [
        0,
        1
    ],
    '=': [
        0
    ],
    '<=': [
        -1,
        0
    ],
    '<': [
        -1
    ],
    '!=': [
        -1,
        1
    ]
};
const allowedOperators = Object.keys(operatorResMap);
const assertValidOperator = (op)=>{
    if (typeof op !== 'string') {
        throw new TypeError(`Invalid operator type, expected string but got ${typeof op}`);
    }
    if (allowedOperators.indexOf(op) === -1) {
        throw new Error(`Invalid operator, expected one of ${allowedOperators.join('|')}`);
    }
}; //# sourceMappingURL=compare.js.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/graphql-client/constants.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BOUNDARY_HEADER_REGEX",
    ()=>BOUNDARY_HEADER_REGEX,
    "CLIENT",
    ()=>CLIENT,
    "CONTENT_TYPES",
    ()=>CONTENT_TYPES,
    "DEFAULT_CLIENT_VERSION",
    ()=>DEFAULT_CLIENT_VERSION,
    "DEFAULT_SDK_VARIANT",
    ()=>DEFAULT_SDK_VARIANT,
    "DEFER_OPERATION_REGEX",
    ()=>DEFER_OPERATION_REGEX,
    "GQL_API_ERROR",
    ()=>GQL_API_ERROR,
    "HEADER_SEPARATOR",
    ()=>HEADER_SEPARATOR,
    "MAX_RETRIES",
    ()=>MAX_RETRIES,
    "MIN_RETRIES",
    ()=>MIN_RETRIES,
    "NEWLINE_SEPARATOR",
    ()=>NEWLINE_SEPARATOR,
    "NO_DATA_OR_ERRORS_ERROR",
    ()=>NO_DATA_OR_ERRORS_ERROR,
    "RETRIABLE_STATUS_CODES",
    ()=>RETRIABLE_STATUS_CODES,
    "RETRY_WAIT_TIME",
    ()=>RETRY_WAIT_TIME,
    "SDK_VARIANT_HEADER",
    ()=>SDK_VARIANT_HEADER,
    "SDK_VERSION_HEADER",
    ()=>SDK_VERSION_HEADER,
    "UNEXPECTED_CONTENT_TYPE_ERROR",
    ()=>UNEXPECTED_CONTENT_TYPE_ERROR
]);
const CLIENT = 'GraphQL Client';
const MIN_RETRIES = 0;
const MAX_RETRIES = 3;
const GQL_API_ERROR = "An error occurred while fetching from the API. Review 'graphQLErrors' for details.";
const UNEXPECTED_CONTENT_TYPE_ERROR = 'Response returned unexpected Content-Type:';
const NO_DATA_OR_ERRORS_ERROR = 'An unknown error has occurred. The API did not return a data object or any errors in its response.';
const CONTENT_TYPES = {
    json: 'application/json',
    multipart: 'multipart/mixed'
};
const SDK_VARIANT_HEADER = 'X-SDK-Variant';
const SDK_VERSION_HEADER = 'X-SDK-Version';
const DEFAULT_SDK_VARIANT = 'shopify-graphql-client';
// This is value is replaced with package.json version during rollup build process
const DEFAULT_CLIENT_VERSION = '1.4.1';
const RETRY_WAIT_TIME = 1000;
const RETRIABLE_STATUS_CODES = [
    429,
    503
];
const DEFER_OPERATION_REGEX = /@(defer)\b/i;
const NEWLINE_SEPARATOR = '\r\n';
const BOUNDARY_HEADER_REGEX = /boundary="?([^=";]+)"?/i;
const HEADER_SEPARATOR = NEWLINE_SEPARATOR + NEWLINE_SEPARATOR;
;
 //# sourceMappingURL=constants.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildCombinedDataObject",
    ()=>buildCombinedDataObject,
    "buildDataObjectByPath",
    ()=>buildDataObjectByPath,
    "combineErrors",
    ()=>combineErrors,
    "formatErrorMessage",
    ()=>formatErrorMessage,
    "getErrorCause",
    ()=>getErrorCause,
    "getErrorMessage",
    ()=>getErrorMessage,
    "getKeyValueIfValid",
    ()=>getKeyValueIfValid,
    "validateRetries",
    ()=>validateRetries
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/constants.mjs [app-route] (ecmascript)");
;
function formatErrorMessage(message, client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]) {
    return message.startsWith(`${client}`) ? message : `${client}: ${message}`;
}
function getErrorMessage(error) {
    return error instanceof Error ? error.message : JSON.stringify(error);
}
function getErrorCause(error) {
    return error instanceof Error && error.cause ? error.cause : undefined;
}
function combineErrors(dataArray) {
    return dataArray.flatMap(({ errors })=>{
        return errors ?? [];
    });
}
function validateRetries({ client, retries }) {
    if (retries !== undefined && (typeof retries !== 'number' || retries < __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_RETRIES"] || retries > __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_RETRIES"])) {
        throw new Error(`${client}: The provided "retries" value (${retries}) is invalid - it cannot be less than ${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MIN_RETRIES"]} or greater than ${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MAX_RETRIES"]}`);
    }
}
function getKeyValueIfValid(key, value) {
    return value && (typeof value !== 'object' || Array.isArray(value) || typeof value === 'object' && Object.keys(value).length > 0) ? {
        [key]: value
    } : {};
}
function buildDataObjectByPath(path, data) {
    if (path.length === 0) {
        return data;
    }
    const key = path.pop();
    const newData = {
        [key]: data
    };
    if (path.length === 0) {
        return newData;
    }
    return buildDataObjectByPath(path, newData);
}
function combineObjects(baseObject, newObject) {
    return Object.keys(newObject || {}).reduce((acc, key)=>{
        if ((typeof newObject[key] === 'object' || Array.isArray(newObject[key])) && baseObject[key]) {
            acc[key] = combineObjects(baseObject[key], newObject[key]);
            return acc;
        }
        acc[key] = newObject[key];
        return acc;
    }, Array.isArray(baseObject) ? [
        ...baseObject
    ] : {
        ...baseObject
    });
}
function buildCombinedDataObject([initialDatum, ...remainingData]) {
    return remainingData.reduce(combineObjects, {
        ...initialDatum
    });
}
;
 //# sourceMappingURL=utilities.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateHttpFetch",
    ()=>generateHttpFetch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs [app-route] (ecmascript)");
;
;
function generateHttpFetch({ clientLogger, customFetchApi = fetch, client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"], defaultRetryWaitTime = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RETRY_WAIT_TIME"], retriableCodes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RETRIABLE_STATUS_CODES"] }) {
    const httpFetch = async (requestParams, count, maxRetries)=>{
        const nextCount = count + 1;
        const maxTries = maxRetries + 1;
        let response;
        try {
            response = await customFetchApi(...requestParams);
            clientLogger({
                type: 'HTTP-Response',
                content: {
                    requestParams,
                    response
                }
            });
            if (!response.ok && retriableCodes.includes(response.status) && nextCount <= maxTries) {
                throw new Error();
            }
            const deprecationNotice = response?.headers.get('X-Shopify-API-Deprecated-Reason') || '';
            if (deprecationNotice) {
                clientLogger({
                    type: 'HTTP-Response-GraphQL-Deprecation-Notice',
                    content: {
                        requestParams,
                        deprecationNotice
                    }
                });
            }
            return response;
        } catch (error) {
            if (nextCount <= maxTries) {
                const retryAfter = response?.headers.get('Retry-After');
                await sleep(retryAfter ? parseInt(retryAfter, 10) : defaultRetryWaitTime);
                clientLogger({
                    type: 'HTTP-Retry',
                    content: {
                        requestParams,
                        lastResponse: response,
                        retryAttempt: count,
                        maxRetries
                    }
                });
                return httpFetch(requestParams, nextCount, maxRetries);
            }
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])(`${maxRetries > 0 ? `Attempted maximum number of ${maxRetries} network retries. Last message - ` : ''}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error)}`, client));
        }
    };
    return httpFetch;
}
async function sleep(waitTime) {
    return new Promise((resolve)=>setTimeout(resolve, waitTime));
}
;
 //# sourceMappingURL=http-fetch.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createGraphQLClient",
    ()=>createGraphQLClient,
    "generateClientLogger",
    ()=>generateClientLogger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$http$2d$fetch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs [app-route] (ecmascript)");
;
;
;
function createGraphQLClient({ headers, url, customFetchApi = fetch, retries = 0, logger }) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRetries"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        retries
    });
    const config = {
        headers,
        url,
        retries
    };
    const clientLogger = generateClientLogger(logger);
    const httpFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$http$2d$fetch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateHttpFetch"])({
        customFetchApi,
        clientLogger,
        defaultRetryWaitTime: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RETRY_WAIT_TIME"]
    });
    const fetchFn = generateFetch(httpFetch, config);
    const request = generateRequest(fetchFn);
    const requestStream = generateRequestStream(fetchFn);
    return {
        config,
        fetch: fetchFn,
        request,
        requestStream
    };
}
function generateClientLogger(logger) {
    return (logContent)=>{
        if (logger) {
            logger(logContent);
        }
    };
}
async function processJSONResponse(response) {
    const { errors, data, extensions } = await response.json();
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('data', data),
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('extensions', extensions),
        headers: response.headers,
        ...errors || !data ? {
            errors: {
                networkStatusCode: response.status,
                message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])(errors ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GQL_API_ERROR"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NO_DATA_OR_ERRORS_ERROR"]),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('graphQLErrors', errors),
                response
            }
        } : {}
    };
}
function generateFetch(httpFetch, { url, headers, retries }) {
    return async (operation, options = {})=>{
        const { variables, headers: overrideHeaders, url: overrideUrl, retries: overrideRetries, keepalive, signal } = options;
        const body = JSON.stringify({
            query: operation,
            variables
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRetries"])({
            client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
            retries: overrideRetries
        });
        const flatHeaders = Object.entries({
            ...headers,
            ...overrideHeaders
        }).reduce((headers, [key, value])=>{
            headers[key] = Array.isArray(value) ? value.join(', ') : value.toString();
            return headers;
        }, {});
        if (!flatHeaders[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VARIANT_HEADER"]] && !flatHeaders[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VERSION_HEADER"]]) {
            flatHeaders[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VARIANT_HEADER"]] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SDK_VARIANT"];
            flatHeaders[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VERSION_HEADER"]] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CLIENT_VERSION"];
        }
        const fetchParams = [
            overrideUrl ?? url,
            {
                method: 'POST',
                headers: flatHeaders,
                body,
                signal,
                keepalive
            }
        ];
        return httpFetch(fetchParams, 1, overrideRetries ?? retries);
    };
}
function generateRequest(fetchFn) {
    return async (...props)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFER_OPERATION_REGEX"].test(props[0])) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])('This operation will result in a streamable response - use requestStream() instead.'));
        }
        let response = null;
        try {
            response = await fetchFn(...props);
            const { status, statusText } = response;
            const contentType = response.headers.get('content-type') || '';
            if (!response.ok) {
                return {
                    errors: {
                        networkStatusCode: status,
                        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])(statusText),
                        response
                    }
                };
            }
            if (!contentType.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT_TYPES"].json)) {
                return {
                    errors: {
                        networkStatusCode: status,
                        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNEXPECTED_CONTENT_TYPE_ERROR"]} ${contentType}`),
                        response
                    }
                };
            }
            return await processJSONResponse(response);
        } catch (error) {
            return {
                errors: {
                    message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error),
                    ...response == null ? {} : {
                        networkStatusCode: response.status,
                        response
                    }
                }
            };
        }
    };
}
async function* getStreamBodyIterator(response) {
    const decoder = new TextDecoder();
    // Response body is an async iterator
    if (response.body[Symbol.asyncIterator]) {
        for await (const chunk of response.body){
            yield decoder.decode(chunk);
        }
    } else {
        const reader = response.body.getReader();
        let readResult;
        try {
            while(!(readResult = await reader.read()).done){
                yield decoder.decode(readResult.value);
            }
        } finally{
            reader.cancel();
        }
    }
}
function readStreamChunk(streamBodyIterator, boundary) {
    return {
        async *[Symbol.asyncIterator] () {
            try {
                let buffer = '';
                for await (const textChunk of streamBodyIterator){
                    buffer += textChunk;
                    if (buffer.indexOf(boundary) > -1) {
                        const lastBoundaryIndex = buffer.lastIndexOf(boundary);
                        const fullResponses = buffer.slice(0, lastBoundaryIndex);
                        const chunkBodies = fullResponses.split(boundary).filter((chunk)=>chunk.trim().length > 0).map((chunk)=>{
                            const body = chunk.slice(chunk.indexOf(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HEADER_SEPARATOR"]) + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HEADER_SEPARATOR"].length).trim();
                            return body;
                        });
                        if (chunkBodies.length > 0) {
                            yield chunkBodies;
                        }
                        buffer = buffer.slice(lastBoundaryIndex + boundary.length);
                        if (buffer.trim() === `--`) {
                            buffer = '';
                        }
                    }
                }
            } catch (error) {
                throw new Error(`Error occured while processing stream payload - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error)}`);
            }
        }
    };
}
function createJsonResponseAsyncIterator(response) {
    return {
        async *[Symbol.asyncIterator] () {
            const processedResponse = await processJSONResponse(response);
            yield {
                ...processedResponse,
                hasNext: false
            };
        }
    };
}
function getResponseDataFromChunkBodies(chunkBodies) {
    return chunkBodies.map((value)=>{
        try {
            return JSON.parse(value);
        } catch (error) {
            throw new Error(`Error in parsing multipart response - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error)}`);
        }
    }).map((payload)=>{
        const { data, incremental, hasNext, extensions, errors } = payload;
        // initial data chunk
        if (!incremental) {
            return {
                data: data || {},
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('errors', errors),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('extensions', extensions),
                hasNext
            };
        }
        // subsequent data chunks
        const incrementalArray = incremental.map(({ data, path, errors })=>{
            return {
                data: data && path ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildDataObjectByPath"])(path, data) : {},
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('errors', errors)
            };
        });
        return {
            data: incrementalArray.length === 1 ? incrementalArray[0].data : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCombinedDataObject"])([
                ...incrementalArray.map(({ data })=>data)
            ]),
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('errors', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["combineErrors"])(incrementalArray)),
            hasNext
        };
    });
}
function validateResponseData(responseErrors, combinedData) {
    if (responseErrors.length > 0) {
        throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GQL_API_ERROR"], {
            cause: {
                graphQLErrors: responseErrors
            }
        });
    }
    if (Object.keys(combinedData).length === 0) {
        throw new Error(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NO_DATA_OR_ERRORS_ERROR"]);
    }
}
function createMultipartResponseAsyncInterator(response, responseContentType) {
    const boundaryHeader = (responseContentType ?? '').match(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BOUNDARY_HEADER_REGEX"]);
    const boundary = `--${boundaryHeader ? boundaryHeader[1] : '-'}`;
    if (!response.body?.getReader && !response.body?.[Symbol.asyncIterator]) {
        throw new Error('API multipart response did not return an iterable body', {
            cause: response
        });
    }
    const streamBodyIterator = getStreamBodyIterator(response);
    let combinedData = {};
    let responseExtensions;
    return {
        async *[Symbol.asyncIterator] () {
            try {
                let streamHasNext = true;
                for await (const chunkBodies of readStreamChunk(streamBodyIterator, boundary)){
                    const responseData = getResponseDataFromChunkBodies(chunkBodies);
                    responseExtensions = responseData.find((datum)=>datum.extensions)?.extensions ?? responseExtensions;
                    const responseErrors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["combineErrors"])(responseData);
                    combinedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildCombinedDataObject"])([
                        combinedData,
                        ...responseData.map(({ data })=>data)
                    ]);
                    streamHasNext = responseData.slice(-1)[0].hasNext;
                    validateResponseData(responseErrors, combinedData);
                    yield {
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('data', combinedData),
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('extensions', responseExtensions),
                        hasNext: streamHasNext
                    };
                }
                if (streamHasNext) {
                    throw new Error(`Response stream terminated unexpectedly`);
                }
            } catch (error) {
                const cause = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorCause"])(error);
                yield {
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('data', combinedData),
                    ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('extensions', responseExtensions),
                    errors: {
                        message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error)),
                        networkStatusCode: response.status,
                        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('graphQLErrors', cause?.graphQLErrors),
                        response
                    },
                    hasNext: false
                };
            }
        }
    };
}
function generateRequestStream(fetchFn) {
    return async (...props)=>{
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFER_OPERATION_REGEX"].test(props[0])) {
            throw new Error((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])('This operation does not result in a streamable response - use request() instead.'));
        }
        try {
            const response = await fetchFn(...props);
            const { statusText } = response;
            if (!response.ok) {
                throw new Error(statusText, {
                    cause: response
                });
            }
            const responseContentType = response.headers.get('content-type') || '';
            switch(true){
                case responseContentType.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT_TYPES"].json):
                    return createJsonResponseAsyncIterator(response);
                case responseContentType.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CONTENT_TYPES"].multipart):
                    return createMultipartResponseAsyncInterator(response, responseContentType);
                default:
                    throw new Error(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNEXPECTED_CONTENT_TYPE_ERROR"]} ${responseContentType}`, {
                        cause: response
                    });
            }
        } catch (error) {
            return {
                async *[Symbol.asyncIterator] () {
                    const response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorCause"])(error);
                    yield {
                        errors: {
                            message: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["formatErrorMessage"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getErrorMessage"])(error)),
                            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('networkStatusCode', response?.status),
                            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getKeyValueIfValid"])('response', response)
                        },
                        hasNext: false
                    };
                }
            };
        }
    };
}
;
 //# sourceMappingURL=graphql-client.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateApiVersion",
    ()=>validateApiVersion,
    "validateDomainAndGetStoreUrl",
    ()=>validateDomainAndGetStoreUrl
]);
function validateDomainAndGetStoreUrl({ client, storeDomain }) {
    try {
        if (!storeDomain || typeof storeDomain !== 'string') {
            throw new Error();
        }
        const trimmedDomain = storeDomain.trim();
        const protocolUrl = trimmedDomain.match(/^https?:/) ? trimmedDomain : `https://${trimmedDomain}`;
        const url = new URL(protocolUrl);
        url.protocol = 'https';
        return url.origin;
    } catch (error) {
        throw new Error(`${client}: a valid store domain ("${storeDomain}") must be provided`, {
            cause: error
        });
    }
}
function validateApiVersion({ client, currentSupportedApiVersions, apiVersion, logger }) {
    const versionError = `${client}: the provided apiVersion ("${apiVersion}")`;
    const supportedVersion = `Currently supported API versions: ${currentSupportedApiVersions.join(', ')}`;
    if (!apiVersion || typeof apiVersion !== 'string') {
        throw new Error(`${versionError} is invalid. ${supportedVersion}`);
    }
    const trimmedApiVersion = apiVersion.trim();
    if (!currentSupportedApiVersions.includes(trimmedApiVersion)) {
        if (logger) {
            logger({
                type: 'Unsupported_Api_Version',
                content: {
                    apiVersion,
                    supportedApiVersions: currentSupportedApiVersions
                }
            });
        } else {
            console.warn(`${versionError} is likely deprecated or not supported. ${supportedVersion}`);
        }
    }
}
;
 //# sourceMappingURL=validations.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentApiVersion",
    ()=>getCurrentApiVersion,
    "getCurrentSupportedApiVersions",
    ()=>getCurrentSupportedApiVersions
]);
function getQuarterMonth(quarter) {
    const month = quarter * 3 - 2;
    return month === 10 ? month : `0${month}`;
}
function getPrevousVersion(year, quarter, nQuarter) {
    const versionQuarter = quarter - nQuarter;
    if (versionQuarter <= 0) {
        return `${year - 1}-${getQuarterMonth(versionQuarter + 4)}`;
    }
    return `${year}-${getQuarterMonth(versionQuarter)}`;
}
function getCurrentApiVersion() {
    const date = new Date();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();
    const quarter = Math.floor(month / 3 + 1);
    return {
        year,
        quarter,
        version: `${year}-${getQuarterMonth(quarter)}`
    };
}
function getCurrentSupportedApiVersions() {
    const { year, quarter, version: currentVersion } = getCurrentApiVersion();
    const nextVersion = quarter === 4 ? `${year + 1}-01` : `${year}-${getQuarterMonth(quarter + 1)}`;
    return [
        getPrevousVersion(year, quarter, 3),
        getPrevousVersion(year, quarter, 2),
        getPrevousVersion(year, quarter, 1),
        currentVersion,
        nextVersion,
        'unstable'
    ];
}
;
 //# sourceMappingURL=api-versions.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/utilities.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateGetGQLClientParams",
    ()=>generateGetGQLClientParams,
    "generateGetHeaders",
    ()=>generateGetHeaders
]);
function generateGetHeaders(config) {
    return (customHeaders)=>{
        return {
            ...customHeaders ?? {},
            ...config.headers
        };
    };
}
function generateGetGQLClientParams({ getHeaders, getApiUrl }) {
    return (operation, options)=>{
        const props = [
            operation
        ];
        if (options && Object.keys(options).length > 0) {
            const { variables, apiVersion: propApiVersion, headers, retries, signal } = options;
            props.push({
                ...variables ? {
                    variables
                } : {},
                ...headers ? {
                    headers: getHeaders(headers)
                } : {},
                ...propApiVersion ? {
                    url: getApiUrl(propApiVersion)
                } : {},
                ...retries ? {
                    retries
                } : {},
                ...signal ? {
                    signal
                } : {}
            });
        }
        return props;
    };
}
;
 //# sourceMappingURL=utilities.mjs.map
}),
"[project]/node_modules/@shopify/graphql-client/dist/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$graphql$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$http$2d$fetch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/utilities.mjs [app-route] (ecmascript)"); //# sourceMappingURL=index.mjs.map
;
;
;
;
;
;
}),
"[project]/node_modules/@shopify/admin-api-client/dist/constants.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCESS_TOKEN_HEADER",
    ()=>ACCESS_TOKEN_HEADER,
    "CLIENT",
    ()=>CLIENT,
    "DEFAULT_CLIENT_VERSION",
    ()=>DEFAULT_CLIENT_VERSION,
    "DEFAULT_CONTENT_TYPE",
    ()=>DEFAULT_CONTENT_TYPE,
    "DEFAULT_RETRY_WAIT_TIME",
    ()=>DEFAULT_RETRY_WAIT_TIME,
    "RETRIABLE_STATUS_CODES",
    ()=>RETRIABLE_STATUS_CODES
]);
const DEFAULT_CONTENT_TYPE = 'application/json';
// This is value is replaced with package.json version during rollup build process
const DEFAULT_CLIENT_VERSION = '1.1.1';
const ACCESS_TOKEN_HEADER = 'X-Shopify-Access-Token';
const CLIENT = 'Admin API Client';
const RETRIABLE_STATUS_CODES = [
    429,
    500,
    503
];
const DEFAULT_RETRY_WAIT_TIME = 1000;
;
 //# sourceMappingURL=constants.mjs.map
}),
"[project]/node_modules/@shopify/admin-api-client/dist/validations.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validateRequiredAccessToken",
    ()=>validateRequiredAccessToken,
    "validateServerSideUsage",
    ()=>validateServerSideUsage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/constants.mjs [app-route] (ecmascript)");
;
function validateRequiredAccessToken(accessToken) {
    if (!accessToken) {
        throw new Error(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]}: an access token must be provided`);
    }
}
function validateServerSideUsage(isTesting = false) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
;
 //# sourceMappingURL=validations.mjs.map
}),
"[project]/node_modules/@shopify/admin-api-client/dist/graphql/client.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminApiClient",
    ()=>createAdminApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$graphql$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/utilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/validations.mjs [app-route] (ecmascript)");
;
;
;
function createAdminApiClient({ storeDomain, apiVersion, accessToken, userAgentPrefix, retries = 0, customFetchApi, logger, isTesting }) {
    const currentSupportedApiVersions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentSupportedApiVersions"])();
    const storeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateDomainAndGetStoreUrl"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        storeDomain
    });
    const baseApiVersionValidationParams = {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        currentSupportedApiVersions,
        logger
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateServerSideUsage"])(isTesting);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        currentSupportedApiVersions,
        apiVersion,
        logger
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRequiredAccessToken"])(accessToken);
    const apiUrlFormatter = generateApiUrlFormatter(storeUrl, apiVersion, baseApiVersionValidationParams);
    const config = {
        storeDomain: storeUrl,
        apiVersion,
        accessToken,
        headers: {
            'Content-Type': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            Accept: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN_HEADER"]]: accessToken,
            'User-Agent': `${userAgentPrefix ? `${userAgentPrefix} | ` : ''}${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]} v${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CLIENT_VERSION"]}`
        },
        apiUrl: apiUrlFormatter(),
        userAgentPrefix
    };
    const graphqlClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$graphql$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGraphQLClient"])({
        headers: config.headers,
        url: config.apiUrl,
        retries,
        customFetchApi,
        logger
    });
    const getHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGetHeaders"])(config);
    const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);
    const getGQLClientParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGetGQLClientParams"])({
        getHeaders,
        getApiUrl
    });
    const client = {
        config,
        getHeaders,
        getApiUrl,
        fetch: (...props)=>{
            return graphqlClient.fetch(...getGQLClientParams(...props));
        },
        request: (...props)=>{
            return graphqlClient.request(...getGQLClientParams(...props));
        }
    };
    return Object.freeze(client);
}
function generateApiUrlFormatter(storeUrl, defaultApiVersion, baseApiVersionValidationParams) {
    return (apiVersion)=>{
        if (apiVersion) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
                ...baseApiVersionValidationParams,
                apiVersion
            });
        }
        const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
        return `${storeUrl}/admin/api/${urlApiVersion}/graphql.json`;
    };
}
function generateGetApiUrl(config, apiUrlFormatter) {
    return (propApiVersion)=>{
        return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
    };
}
;
 //# sourceMappingURL=client.mjs.map
}),
"[project]/node_modules/@shopify/admin-api-client/dist/rest/types.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Method",
    ()=>Method
]);
var Method;
(function(Method) {
    Method["Get"] = "GET";
    Method["Post"] = "POST";
    Method["Put"] = "PUT";
    Method["Delete"] = "DELETE";
})(Method || (Method = {}));
;
 //# sourceMappingURL=types.mjs.map
}),
"[project]/node_modules/@shopify/admin-api-client/dist/rest/client.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminRestApiClient",
    ()=>createAdminRestApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/utilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$http$2d$fetch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/http-fetch.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/validations.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/rest/types.mjs [app-route] (ecmascript)");
;
;
;
;
function createAdminRestApiClient({ storeDomain, apiVersion, accessToken, userAgentPrefix, logger, customFetchApi = fetch, retries: clientRetries = 0, scheme = 'https', defaultRetryTime = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_RETRY_WAIT_TIME"], formatPaths = true, isTesting }) {
    const currentSupportedApiVersions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentSupportedApiVersions"])();
    const storeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateDomainAndGetStoreUrl"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        storeDomain
    }).replace('https://', `${scheme}://`);
    const baseApiVersionValidationParams = {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        currentSupportedApiVersions,
        logger
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateServerSideUsage"])(isTesting);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        currentSupportedApiVersions,
        apiVersion,
        logger
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRequiredAccessToken"])(accessToken);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRetries"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        retries: clientRetries
    });
    const apiUrlFormatter = generateApiUrlFormatter(storeUrl, apiVersion, baseApiVersionValidationParams, formatPaths);
    const clientLogger = generateClientLogger(logger);
    const httpFetch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$http$2d$fetch$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateHttpFetch"])({
        customFetchApi,
        clientLogger,
        defaultRetryWaitTime: defaultRetryTime,
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        retriableCodes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RETRIABLE_STATUS_CODES"]
    });
    const request = async (path, { method, data, headers: requestHeadersObj, searchParams, retries = 0, apiVersion })=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRetries"])({
            client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
            retries
        });
        const url = apiUrlFormatter(path, searchParams ?? {}, apiVersion);
        const requestHeaders = normalizedHeaders(requestHeadersObj ?? {});
        const userAgent = [
            ...requestHeaders['user-agent'] ? [
                requestHeaders['user-agent']
            ] : [],
            ...userAgentPrefix ? [
                userAgentPrefix
            ] : [],
            `${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]} v${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CLIENT_VERSION"]}`
        ].join(' | ');
        const headers = normalizedHeaders({
            'Content-Type': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            ...requestHeaders,
            Accept: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ACCESS_TOKEN_HEADER"]]: accessToken,
            'User-Agent': userAgent
        });
        const body = data && typeof data !== 'string' ? JSON.stringify(data) : data;
        return httpFetch([
            url,
            {
                method,
                headers,
                ...body ? {
                    body
                } : undefined
            }
        ], 1, retries ?? clientRetries);
    };
    return {
        get: (path, options)=>request(path, {
                method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Method"].Get,
                ...options
            }),
        put: (path, options)=>request(path, {
                method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Method"].Put,
                ...options
            }),
        post: (path, options)=>request(path, {
                method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Method"].Post,
                ...options
            }),
        delete: (path, options)=>request(path, {
                method: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Method"].Delete,
                ...options
            })
    };
}
function generateApiUrlFormatter(storeUrl, defaultApiVersion, baseApiVersionValidationParams, formatPaths = true) {
    return (path, searchParams, apiVersion)=>{
        if (apiVersion) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
                ...baseApiVersionValidationParams,
                apiVersion
            });
        }
        function convertValue(params, key, value) {
            if (Array.isArray(value)) {
                value.forEach((arrayValue)=>convertValue(params, `${key}[]`, arrayValue));
                return;
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([objKey, objValue])=>convertValue(params, `${key}[${objKey}]`, objValue));
                return;
            }
            params.append(key, String(value));
        }
        const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
        let cleanPath = path.replace(/^\//, '');
        if (formatPaths) {
            if (!cleanPath.startsWith('admin')) {
                cleanPath = `admin/api/${urlApiVersion}/${cleanPath}`;
            }
            if (!cleanPath.endsWith('.json')) {
                cleanPath = `${cleanPath}.json`;
            }
        }
        const params = new URLSearchParams();
        if (searchParams) {
            for (const [key, value] of Object.entries(searchParams)){
                convertValue(params, key, value);
            }
        }
        const queryString = params.toString() ? `?${params.toString()}` : '';
        return `${storeUrl}/${cleanPath}${queryString}`;
    };
}
function generateClientLogger(logger) {
    return (logContent)=>{
        if (logger) {
            logger(logContent);
        }
    };
}
function normalizedHeaders(headersObj) {
    const normalizedHeaders = {};
    for (const [key, value] of Object.entries(headersObj)){
        normalizedHeaders[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : String(value);
    }
    return normalizedHeaders;
}
;
 //# sourceMappingURL=client.mjs.map
}),
"[project]/node_modules/@shopify/admin-api-client/dist/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$graphql$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/graphql/client.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$admin$2d$api$2d$client$2f$dist$2f$rest$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/admin-api-client/dist/rest/client.mjs [app-route] (ecmascript)"); //# sourceMappingURL=index.mjs.map
;
;
}),
"[project]/node_modules/lossless-json/lib/esm/config.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Get and/or set configuration options
 * @deprecated There is no config anymore
 */ __turbopack_context__.s([
    "config",
    ()=>config
]);
function config(_options) {
    // Backward compatibility warning for v1.x
    throw new Error('config is deprecated, support for circularRefs is removed from the library. ' + 'If you encounter circular references in your data structures, ' + 'please rethink your datastructures: ' + 'better prevent circular references in the first place.');
} //# sourceMappingURL=config.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/utils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Test whether a string contains an integer number
 */ __turbopack_context__.s([
    "UnsafeNumberReason",
    ()=>UnsafeNumberReason,
    "compareNumber",
    ()=>compareNumber,
    "countSignificantDigits",
    ()=>countSignificantDigits,
    "extractSignificantDigits",
    ()=>extractSignificantDigits,
    "getUnsafeNumberReason",
    ()=>getUnsafeNumberReason,
    "isInteger",
    ()=>isInteger,
    "isNumber",
    ()=>isNumber,
    "isSafeNumber",
    ()=>isSafeNumber,
    "splitNumber",
    ()=>splitNumber,
    "toSafeNumberOrThrow",
    ()=>toSafeNumberOrThrow
]);
function isInteger(value) {
    return INTEGER_REGEX.test(value);
}
const INTEGER_REGEX = /^-?[0-9]+$/;
function isNumber(value) {
    return NUMBER_REGEX.test(value);
}
const NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
function isSafeNumber(value, config) {
    if (isInteger(value)) {
        return Number.isSafeInteger(Number.parseInt(value, 10));
    }
    const num = Number.parseFloat(value);
    const parsed = String(num);
    if (value === parsed) {
        return true;
    }
    const valueDigits = extractSignificantDigits(value);
    const parsedDigits = extractSignificantDigits(parsed);
    if (valueDigits === parsedDigits) {
        return true;
    }
    if (config?.approx === true) {
        // A value is approximately equal when:
        // 1. it is a floating point number, not an integer
        // 2. it has at least 14 digits
        // 3. the first 14 digits are equal
        const requiredDigits = 14;
        if (!isInteger(value) && parsedDigits.length >= requiredDigits && valueDigits.startsWith(parsedDigits.substring(0, requiredDigits))) {
            return true;
        }
    }
    return false;
}
let UnsafeNumberReason = /*#__PURE__*/ function(UnsafeNumberReason) {
    UnsafeNumberReason["underflow"] = "underflow";
    UnsafeNumberReason["overflow"] = "overflow";
    UnsafeNumberReason["truncate_integer"] = "truncate_integer";
    UnsafeNumberReason["truncate_float"] = "truncate_float";
    return UnsafeNumberReason;
}({});
function getUnsafeNumberReason(value) {
    if (isSafeNumber(value, {
        approx: false
    })) {
        return undefined;
    }
    if (isInteger(value)) {
        return UnsafeNumberReason.truncate_integer;
    }
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) {
        return UnsafeNumberReason.overflow;
    }
    if (num === 0) {
        return UnsafeNumberReason.underflow;
    }
    return UnsafeNumberReason.truncate_float;
}
function toSafeNumberOrThrow(value, config) {
    const number = Number.parseFloat(value);
    const unsafeReason = getUnsafeNumberReason(value);
    if (config?.approx === true ? unsafeReason && unsafeReason !== UnsafeNumberReason.truncate_float : unsafeReason) {
        const unsafeReasonText = unsafeReason?.replace(/_\w+$/, '');
        throw new Error(`Cannot safely convert to number: the value '${value}' would ${unsafeReasonText} and become ${number}`);
    }
    return number;
}
function splitNumber(value) {
    const match = value.match(/^(-?)(\d+\.?\d*)([eE]([+-]?\d+))?$/);
    if (!match) {
        throw new SyntaxError(`Invalid number: ${value}`);
    }
    const sign = match[1];
    const digitsStr = match[2];
    let exponent = match[4] !== undefined ? Number.parseInt(match[4], 10) : 0;
    const dot = digitsStr.indexOf('.');
    exponent += dot !== -1 ? dot - 1 : digitsStr.length - 1;
    const digits = digitsStr.replace('.', '') // remove the dot (must be removed before removing leading zeros)
    .replace(/^0*/, (zeros)=>{
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length;
        return '';
    }).replace(/0*$/, ''); // remove trailing zeros
    return digits.length > 0 ? {
        sign,
        digits,
        exponent
    } : {
        sign,
        digits: '0',
        exponent: exponent + 1
    };
}
function compareNumber(a, b) {
    if (a === b) {
        return 0;
    }
    const aa = splitNumber(a);
    const bb = splitNumber(b);
    const sign = aa.sign === '-' ? -1 : 1;
    if (aa.sign !== bb.sign) {
        if (aa.digits === '0' && bb.digits === '0') {
            return 0;
        }
        return sign;
    }
    if (aa.exponent !== bb.exponent) {
        return aa.exponent > bb.exponent ? sign : aa.exponent < bb.exponent ? -sign : 0;
    }
    return aa.digits > bb.digits ? sign : aa.digits < bb.digits ? -sign : 0;
}
function countSignificantDigits(value) {
    const { start, end } = getSignificantDigitRange(value);
    const dot = value.indexOf('.');
    if (dot === -1 || dot < start || dot > end) {
        return end - start;
    }
    return end - start - 1;
}
function extractSignificantDigits(value) {
    const { start, end } = getSignificantDigitRange(value);
    const digits = value.substring(start, end);
    const dot = digits.indexOf('.');
    if (dot === -1) {
        return digits;
    }
    return digits.substring(0, dot) + digits.substring(dot + 1);
}
/**
 * Returns the range (start to end) of the significant digits of a value.
 * Note that this range _may_ contain the decimal dot.
 *
 * For example:
 *
 *     getSignificantDigitRange('0.0325900') // { start: 3, end: 7 }
 *     getSignificantDigitRange('2.0300')    // { start: 0, end: 3 }
 *     getSignificantDigitRange('0.0')       // { start: 3, end: 3 }
 *
 */ function getSignificantDigitRange(value) {
    let start = 0;
    if (value[0] === '-') {
        start++;
    }
    while(value[start] === '0' || value[start] === '.'){
        start++;
    }
    let end = value.lastIndexOf('e');
    if (end === -1) {
        end = value.lastIndexOf('E');
    }
    if (end === -1) {
        end = value.length;
    }
    while((value[end - 1] === '0' || value[end - 1] === '.') && end > start){
        end--;
    }
    return {
        start,
        end
    };
} //# sourceMappingURL=utils.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/LosslessNumber.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LosslessNumber",
    ()=>LosslessNumber,
    "compareLosslessNumber",
    ()=>compareLosslessNumber,
    "isLosslessNumber",
    ()=>isLosslessNumber,
    "toLosslessNumber",
    ()=>toLosslessNumber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/utils.js [app-route] (ecmascript)");
;
class LosslessNumber {
    // numeric value as string
    // type information
    isLosslessNumber = true;
    constructor(value){
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNumber"])(value)) {
            throw new Error(`Invalid number (value: "${value}")`);
        }
        this.value = value;
    }
    /**
   * Get the value of the LosslessNumber as number or bigint.
   *
   * - a number is returned for safe numbers and decimal values that only lose some insignificant digits
   * - a bigint is returned for big integer numbers
   * - an Error is thrown for values that will overflow or underflow
   *
   * Note that you can implement your own strategy for conversion by just getting the value as string
   * via .toString(), and using util functions like isInteger, isSafeNumber, getUnsafeNumberReason,
   * and toSafeNumberOrThrow to convert it to a numeric value.
   */ valueOf() {
        const unsafeReason = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getUnsafeNumberReason"])(this.value);
        // safe or truncate_float
        if (unsafeReason === undefined || unsafeReason === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UnsafeNumberReason"].truncate_float) {
            return Number.parseFloat(this.value);
        }
        // truncate_integer
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInteger"])(this.value)) {
            return BigInt(this.value);
        }
        // overflow or underflow
        throw new Error(`Cannot safely convert to number: the value '${this.value}' would ${unsafeReason} and become ${Number.parseFloat(this.value)}`);
    }
    /**
   * Get the value of the LosslessNumber as string.
   */ toString() {
        return this.value;
    }
}
function isLosslessNumber(value) {
    // @ts-expect-error
    return value && typeof value === 'object' && value.isLosslessNumber || false;
}
function toLosslessNumber(value) {
    const maxDigits = 15;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["countSignificantDigits"])(String(value)) > maxDigits) {
        throw new Error(`Invalid number: contains more than 15 digits and is most likely truncated and unsafe by itself (value: ${value})`);
    }
    if (Number.isNaN(value)) {
        throw new Error('Invalid number: NaN');
    }
    if (!Number.isFinite(value)) {
        throw new Error(`Invalid number: ${value}`);
    }
    return new LosslessNumber(String(value));
}
function compareLosslessNumber(a, b) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compareNumber"])(a.value, b.value);
} //# sourceMappingURL=LosslessNumber.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/numberParsers.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseLosslessNumber",
    ()=>parseLosslessNumber,
    "parseNumberAndBigInt",
    ()=>parseNumberAndBigInt
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$LosslessNumber$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/LosslessNumber.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/utils.js [app-route] (ecmascript)");
;
;
function parseLosslessNumber(value) {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$LosslessNumber$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LosslessNumber"](value);
}
function parseNumberAndBigInt(value) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInteger"])(value) ? BigInt(value) : Number.parseFloat(value);
} //# sourceMappingURL=numberParsers.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/revive.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "revive",
    ()=>revive
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$LosslessNumber$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/LosslessNumber.js [app-route] (ecmascript)");
;
function revive(json, reviver) {
    return reviveValue({
        '': json
    }, '', json, reviver);
}
/**
 * Revive a value
 */ function reviveValue(context, key, value, reviver) {
    if (Array.isArray(value)) {
        return reviver.call(context, key, reviveArray(value, reviver));
    }
    if (value && typeof value === 'object' && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$LosslessNumber$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isLosslessNumber"])(value)) {
        // note the special case for LosslessNumber,
        // we don't want to iterate over the internals of a LosslessNumber
        return reviver.call(context, key, reviveObject(value, reviver));
    }
    return reviver.call(context, key, value);
}
/**
 * Revive the properties of an object
 */ function reviveObject(object, reviver) {
    for (const key of Object.keys(object)){
        const value = reviveValue(object, key, object[key], reviver);
        if (value !== undefined) {
            object[key] = value;
        } else {
            delete object[key];
        }
    }
    return object;
}
/**
 * Revive the properties of an Array
 */ function reviveArray(array, reviver) {
    for(let i = 0; i < array.length; i++){
        array[i] = reviveValue(array, String(i), array[i], reviver);
    }
    return array;
} //# sourceMappingURL=revive.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/parse.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "codeLowercaseA",
    ()=>codeLowercaseA,
    "codeLowercaseE",
    ()=>codeLowercaseE,
    "codeLowercaseF",
    ()=>codeLowercaseF,
    "codeUppercaseA",
    ()=>codeUppercaseA,
    "codeUppercaseE",
    ()=>codeUppercaseE,
    "codeUppercaseF",
    ()=>codeUppercaseF,
    "isDeepEqual",
    ()=>isDeepEqual,
    "isValidStringCharacter",
    ()=>isValidStringCharacter,
    "parse",
    ()=>parse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$numberParsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/numberParsers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$revive$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/revive.js [app-route] (ecmascript)");
;
;
function parse(text, reviver, options) {
    const optionsObj = typeof options === 'function' ? {
        parseNumber: options
    } : options;
    const parseNumber = optionsObj?.parseNumber ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$numberParsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseLosslessNumber"];
    const onDuplicateKey = optionsObj?.onDuplicateKey ?? throwDuplicateKey;
    let i = 0;
    const value = parseValue();
    expectValue(value);
    expectEndOfInput();
    return reviver ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$revive$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["revive"])(value, reviver) : value;
    //TURBOPACK unreachable
    ;
    function parseObject() {
        if (text.charCodeAt(i) === codeOpeningBrace) {
            i++;
            skipWhitespace();
            const object = {};
            let initial = true;
            while(i < text.length && text.charCodeAt(i) !== codeClosingBrace){
                if (!initial) {
                    eatComma();
                    skipWhitespace();
                } else {
                    initial = false;
                }
                const start = i;
                const key = parseString();
                if (key === undefined) {
                    throwObjectKeyExpected();
                    return; // To make TS happy
                }
                skipWhitespace();
                eatColon();
                const value = parseValue();
                if (value === undefined) {
                    throwObjectValueExpected();
                    return; // To make TS happy
                }
                // handle duplicate keys
                // biome-ignore lint/suspicious/noPrototypeBuiltins: TODO: replace with hasOwn one day, when browser support is high enough
                if (Object.prototype.hasOwnProperty.call(object, key) && !isDeepEqual(value, object[key])) {
                    // Note that we could also test `if(key in object) {...}`
                    // or `if (object[key] !== 'undefined') {...}`, but that is slower.
                    const returnedValue = onDuplicateKey({
                        key,
                        position: start + 1,
                        oldValue: object[key],
                        newValue: value
                    });
                    if (returnedValue !== undefined) {
                        object[key] = returnedValue;
                    }
                } else {
                    object[key] = value;
                }
            }
            if (text.charCodeAt(i) !== codeClosingBrace) {
                throwObjectKeyOrEndExpected();
            }
            i++;
            return object;
        }
    }
    function parseArray() {
        if (text.charCodeAt(i) === codeOpeningBracket) {
            i++;
            skipWhitespace();
            const array = [];
            let initial = true;
            while(i < text.length && text.charCodeAt(i) !== codeClosingBracket){
                if (!initial) {
                    eatComma();
                } else {
                    initial = false;
                }
                const value = parseValue();
                expectArrayItem(value);
                array.push(value);
            }
            if (text.charCodeAt(i) !== codeClosingBracket) {
                throwArrayItemOrEndExpected();
            }
            i++;
            return array;
        }
    }
    function parseValue() {
        skipWhitespace();
        const value = parseString() ?? parseNumeric() ?? parseObject() ?? parseArray() ?? parseKeyword('true', true) ?? parseKeyword('false', false) ?? parseKeyword('null', null);
        skipWhitespace();
        return value;
    }
    function parseKeyword(name, value) {
        if (text.slice(i, i + name.length) === name) {
            i += name.length;
            return value;
        }
    }
    function skipWhitespace() {
        while(isWhitespace(text.charCodeAt(i))){
            i++;
        }
    }
    function parseString() {
        if (text.charCodeAt(i) === codeDoubleQuote) {
            i++;
            let result = '';
            while(i < text.length && text.charCodeAt(i) !== codeDoubleQuote){
                if (text.charCodeAt(i) === codeBackslash) {
                    const char = text[i + 1];
                    const escapeChar = escapeCharacters[char];
                    if (escapeChar !== undefined) {
                        result += escapeChar;
                        i++;
                    } else if (char === 'u') {
                        if (isHex(text.charCodeAt(i + 2)) && isHex(text.charCodeAt(i + 3)) && isHex(text.charCodeAt(i + 4)) && isHex(text.charCodeAt(i + 5))) {
                            result += String.fromCharCode(Number.parseInt(text.slice(i + 2, i + 6), 16));
                            i += 5;
                        } else {
                            throwInvalidUnicodeCharacter(i);
                        }
                    } else {
                        throwInvalidEscapeCharacter(i);
                    }
                } else {
                    if (isValidStringCharacter(text.charCodeAt(i))) {
                        result += text[i];
                    } else {
                        throwInvalidCharacter(text[i]);
                    }
                }
                i++;
            }
            expectEndOfString();
            i++;
            return result;
        }
    }
    function parseNumeric() {
        const start = i;
        if (text.charCodeAt(i) === codeMinus) {
            i++;
            expectDigit(start);
        }
        if (text.charCodeAt(i) === codeZero) {
            i++;
        } else if (isNonZeroDigit(text.charCodeAt(i))) {
            i++;
            while(isDigit(text.charCodeAt(i))){
                i++;
            }
        }
        if (text.charCodeAt(i) === codeDot) {
            i++;
            expectDigit(start);
            while(isDigit(text.charCodeAt(i))){
                i++;
            }
        }
        if (text.charCodeAt(i) === codeLowercaseE || text.charCodeAt(i) === codeUppercaseE) {
            i++;
            if (text.charCodeAt(i) === codeMinus || text.charCodeAt(i) === codePlus) {
                i++;
            }
            expectDigit(start);
            while(isDigit(text.charCodeAt(i))){
                i++;
            }
        }
        if (i > start) {
            return parseNumber(text.slice(start, i));
        }
    }
    function eatComma() {
        if (text.charCodeAt(i) !== codeComma) {
            throw new SyntaxError(`Comma ',' expected after value ${gotAt()}`);
        }
        i++;
    }
    function eatColon() {
        if (text.charCodeAt(i) !== codeColon) {
            throw new SyntaxError(`Colon ':' expected after property name ${gotAt()}`);
        }
        i++;
    }
    function expectValue(value) {
        if (value === undefined) {
            throw new SyntaxError(`JSON value expected ${gotAt()}`);
        }
    }
    function expectArrayItem(value) {
        if (value === undefined) {
            throw new SyntaxError(`Array item expected ${gotAt()}`);
        }
    }
    function expectEndOfInput() {
        if (i < text.length) {
            throw new SyntaxError(`Expected end of input ${gotAt()}`);
        }
    }
    function expectDigit(start) {
        if (!isDigit(text.charCodeAt(i))) {
            const numSoFar = text.slice(start, i);
            throw new SyntaxError(`Invalid number '${numSoFar}', expecting a digit ${gotAt()}`);
        }
    }
    function expectEndOfString() {
        if (text.charCodeAt(i) !== codeDoubleQuote) {
            throw new SyntaxError(`End of string '"' expected ${gotAt()}`);
        }
    }
    function throwObjectKeyExpected() {
        throw new SyntaxError(`Quoted object key expected ${gotAt()}`);
    }
    function throwDuplicateKey(_ref) {
        let { key, position } = _ref;
        throw new SyntaxError(`Duplicate key '${key}' encountered at position ${position}`);
    }
    function throwObjectKeyOrEndExpected() {
        throw new SyntaxError(`Quoted object key or end of object '}' expected ${gotAt()}`);
    }
    function throwArrayItemOrEndExpected() {
        throw new SyntaxError(`Array item or end of array ']' expected ${gotAt()}`);
    }
    function throwInvalidCharacter(char) {
        throw new SyntaxError(`Invalid character '${char}' ${pos()}`);
    }
    function throwInvalidEscapeCharacter(start) {
        const chars = text.slice(start, start + 2);
        throw new SyntaxError(`Invalid escape character '${chars}' ${pos()}`);
    }
    function throwObjectValueExpected() {
        throw new SyntaxError(`Object value expected after ':' ${pos()}`);
    }
    function throwInvalidUnicodeCharacter(start) {
        const chars = text.slice(start, start + 6);
        throw new SyntaxError(`Invalid unicode character '${chars}' ${pos()}`);
    }
    // zero based character position
    function pos() {
        return `at position ${i}`;
    }
    function got() {
        return i < text.length ? `but got '${text[i]}'` : 'but reached end of input';
    }
    function gotAt() {
        return `${got()} ${pos()}`;
    }
}
function isWhitespace(code) {
    return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
}
function isHex(code) {
    return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
}
function isDigit(code) {
    return code >= codeZero && code <= codeNine;
}
function isNonZeroDigit(code) {
    return code >= codeOne && code <= codeNine;
}
function isValidStringCharacter(code) {
    return code >= 0x20 && code <= 0x10ffff;
}
function isDeepEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((item, index)=>isDeepEqual(item, b[index]));
    }
    if (isObject(a) && isObject(b)) {
        const keys = [
            ...new Set([
                ...Object.keys(a),
                ...Object.keys(b)
            ])
        ];
        return keys.every((key)=>isDeepEqual(a[key], b[key]));
    }
    return false;
}
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
// map with all escape characters
const escapeCharacters = {
    '"': '"',
    '\\': '\\',
    '/': '/',
    b: '\b',
    f: '\f',
    n: '\n',
    r: '\r',
    t: '\t'
};
const codeBackslash = 0x5c; // "\"
const codeOpeningBrace = 0x7b; // "{"
const codeClosingBrace = 0x7d; // "}"
const codeOpeningBracket = 0x5b; // "["
const codeClosingBracket = 0x5d; // "]"
const codeSpace = 0x20; // " "
const codeNewline = 0xa; // "\n"
const codeTab = 0x9; // "\t"
const codeReturn = 0xd; // "\r"
const codeDoubleQuote = 0x0022; // "
const codePlus = 0x2b; // "+"
const codeMinus = 0x2d; // "-"
const codeZero = 0x30;
const codeOne = 0x31;
const codeNine = 0x39;
const codeComma = 0x2c; // ","
const codeDot = 0x2e; // "." (dot, period)
const codeColon = 0x3a; // ":"
const codeUppercaseA = 0x41; // "A"
const codeLowercaseA = 0x61; // "a"
const codeUppercaseE = 0x45; // "E"
const codeLowercaseE = 0x65; // "e"
const codeUppercaseF = 0x46; // "F"
const codeLowercaseF = 0x66; // "f"
 //# sourceMappingURL=parse.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/reviveDate.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Revive a string containing an ISO 8601 date string into a JavaScript `Date` object
 */ __turbopack_context__.s([
    "reviveDate",
    ()=>reviveDate
]);
function reviveDate(_key, value) {
    return typeof value === 'string' && isoDateRegex.test(value) ? new Date(value) : value;
}
// Matches strings like "2022-08-25T09:39:19.288Z"
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/; //# sourceMappingURL=reviveDate.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/stringify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "stringify",
    ()=>stringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/utils.js [app-route] (ecmascript)");
;
function stringify(value, replacer, space, numberStringifiers) {
    const resolvedSpace = resolveSpace(space);
    const replacedValue = typeof replacer === 'function' ? replacer.call({
        '': value
    }, '', value) : value;
    return stringifyValue(replacedValue, '');
    //TURBOPACK unreachable
    ;
    /**
   * Stringify a value
   */ function stringifyValue(value, indent) {
        if (Array.isArray(numberStringifiers)) {
            const stringifier = numberStringifiers.find((item)=>item.test(value));
            if (stringifier) {
                const str = stringifier.stringify(value);
                if (typeof str !== 'string' || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNumber"])(str)) {
                    throw new Error(`Invalid JSON number: output of a number stringifier must be a string containing a JSON number (output: ${str})`);
                }
                return str;
            }
        }
        // boolean, null, number, string, or date
        if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string' || value === null || value instanceof Date || value instanceof Boolean || value instanceof Number || value instanceof String) {
            return JSON.stringify(value);
        }
        // lossless number, the secret ingredient :)
        // @ts-expect-error
        if (value?.isLosslessNumber) {
            return value.toString();
        }
        // BigInt
        if (typeof value === 'bigint') {
            return value.toString();
        }
        // Array
        if (Array.isArray(value)) {
            return stringifyArray(value, indent);
        }
        // Object (test lastly!)
        if (value && typeof value === 'object') {
            return stringifyObject(value, indent);
        }
        return undefined;
    }
    /**
   * Stringify an array
   */ function stringifyArray(array, indent) {
        if (array.length === 0) {
            return '[]';
        }
        const childIndent = resolvedSpace ? indent + resolvedSpace : undefined;
        let str = resolvedSpace ? '[\n' : '[';
        for(let i = 0; i < array.length; i++){
            const item = typeof replacer === 'function' ? replacer.call(array, String(i), array[i]) : array[i];
            if (resolvedSpace) {
                str += childIndent;
            }
            if (typeof item !== 'undefined' && typeof item !== 'function') {
                str += stringifyValue(item, childIndent);
            } else {
                str += 'null';
            }
            if (i < array.length - 1) {
                str += resolvedSpace ? ',\n' : ',';
            }
        }
        str += resolvedSpace ? `\n${indent}]` : ']';
        return str;
    }
    /**
   * Stringify an object
   */ function stringifyObject(object, indent) {
        if (typeof object.toJSON === 'function') {
            return stringify(object.toJSON(), replacer, space, undefined);
        }
        const keys = Array.isArray(replacer) ? replacer.map(String) : Object.keys(object);
        if (keys.length === 0) {
            return '{}';
        }
        const childIndent = resolvedSpace ? indent + resolvedSpace : undefined;
        let first = true;
        let str = resolvedSpace ? '{\n' : '{';
        for (const key of keys){
            const value = typeof replacer === 'function' ? replacer.call(object, key, object[key]) : object[key];
            if (includeProperty(key, value)) {
                if (first) {
                    first = false;
                } else {
                    str += resolvedSpace ? ',\n' : ',';
                }
                const keyStr = JSON.stringify(key);
                str += resolvedSpace ? `${childIndent + keyStr}: ` : `${keyStr}:`;
                str += stringifyValue(value, childIndent);
            }
        }
        str += resolvedSpace ? `\n${indent}}` : '}';
        return str;
    }
    /**
   * Test whether to include a property in a stringified object or not.
   */ function includeProperty(_key, value) {
        return typeof value !== 'undefined' && typeof value !== 'function' && typeof value !== 'symbol';
    }
}
/**
 * Resolve a JSON stringify space:
 * replace a number with a string containing that number of spaces
 */ function resolveSpace(space) {
    if (typeof space === 'number') {
        return ' '.repeat(space);
    }
    if (typeof space === 'string' && space !== '') {
        return space;
    }
    return undefined;
} //# sourceMappingURL=stringify.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/types.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
 //# sourceMappingURL=types.js.map
}),
"[project]/node_modules/lossless-json/lib/esm/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$LosslessNumber$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/LosslessNumber.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$numberParsers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/numberParsers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$parse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/parse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$reviveDate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/reviveDate.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$stringify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/stringify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$types$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/types.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lossless$2d$json$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lossless-json/lib/esm/utils.js [app-route] (ecmascript)"); //# sourceMappingURL=index.js.map
;
;
;
;
;
;
;
;
}),
"[project]/node_modules/@shopify/storefront-api-client/dist/constants.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIENT",
    ()=>CLIENT,
    "DEFAULT_CLIENT_VERSION",
    ()=>DEFAULT_CLIENT_VERSION,
    "DEFAULT_CONTENT_TYPE",
    ()=>DEFAULT_CONTENT_TYPE,
    "DEFAULT_SDK_VARIANT",
    ()=>DEFAULT_SDK_VARIANT,
    "PRIVATE_ACCESS_TOKEN_HEADER",
    ()=>PRIVATE_ACCESS_TOKEN_HEADER,
    "PUBLIC_ACCESS_TOKEN_HEADER",
    ()=>PUBLIC_ACCESS_TOKEN_HEADER,
    "SDK_VARIANT_HEADER",
    ()=>SDK_VARIANT_HEADER,
    "SDK_VARIANT_SOURCE_HEADER",
    ()=>SDK_VARIANT_SOURCE_HEADER,
    "SDK_VERSION_HEADER",
    ()=>SDK_VERSION_HEADER
]);
const DEFAULT_CONTENT_TYPE = 'application/json';
const DEFAULT_SDK_VARIANT = 'storefront-api-client';
// This is value is replaced with package.json version during rollup build process
const DEFAULT_CLIENT_VERSION = '1.0.9';
const PUBLIC_ACCESS_TOKEN_HEADER = 'X-Shopify-Storefront-Access-Token';
const PRIVATE_ACCESS_TOKEN_HEADER = 'Shopify-Storefront-Private-Token';
const SDK_VARIANT_HEADER = 'X-SDK-Variant';
const SDK_VERSION_HEADER = 'X-SDK-Version';
const SDK_VARIANT_SOURCE_HEADER = 'X-SDK-Variant-Source';
const CLIENT = 'Storefront API Client';
;
 //# sourceMappingURL=constants.mjs.map
}),
"[project]/node_modules/@shopify/storefront-api-client/dist/validations.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validatePrivateAccessTokenUsage",
    ()=>validatePrivateAccessTokenUsage,
    "validateRequiredAccessTokens",
    ()=>validateRequiredAccessTokens
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/storefront-api-client/dist/constants.mjs [app-route] (ecmascript)");
;
function validatePrivateAccessTokenUsage(privateAccessToken) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function validateRequiredAccessTokens(publicAccessToken, privateAccessToken) {
    if (!publicAccessToken && !privateAccessToken) {
        throw new Error(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]}: a public or private access token must be provided`);
    }
    if (publicAccessToken && privateAccessToken) {
        throw new Error(`${__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"]}: only provide either a public or private access token`);
    }
}
;
 //# sourceMappingURL=validations.mjs.map
}),
"[project]/node_modules/@shopify/storefront-api-client/dist/storefront-api-client.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStorefrontApiClient",
    ()=>createStorefrontApiClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/api-versions.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/validations.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$graphql$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/graphql-client/graphql-client.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/graphql-client/dist/api-client-utilities/utilities.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/storefront-api-client/dist/constants.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/storefront-api-client/dist/validations.mjs [app-route] (ecmascript)");
;
;
;
function createStorefrontApiClient({ storeDomain, apiVersion, publicAccessToken, privateAccessToken, clientName, retries = 0, customFetchApi, logger }) {
    const currentSupportedApiVersions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$api$2d$versions$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentSupportedApiVersions"])();
    const storeUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateDomainAndGetStoreUrl"])({
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        storeDomain
    });
    const baseApiVersionValidationParams = {
        client: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CLIENT"],
        currentSupportedApiVersions,
        logger
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
        ...baseApiVersionValidationParams,
        apiVersion
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateRequiredAccessTokens"])(publicAccessToken, privateAccessToken);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validatePrivateAccessTokenUsage"])(privateAccessToken);
    const apiUrlFormatter = generateApiUrlFormatter(storeUrl, apiVersion, baseApiVersionValidationParams);
    const config = {
        storeDomain: storeUrl,
        apiVersion,
        ...publicAccessToken ? {
            publicAccessToken
        } : {
            privateAccessToken: privateAccessToken
        },
        headers: {
            'Content-Type': __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            Accept: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTENT_TYPE"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VARIANT_HEADER"]]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SDK_VARIANT"],
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VERSION_HEADER"]]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CLIENT_VERSION"],
            ...clientName ? {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SDK_VARIANT_SOURCE_HEADER"]]: clientName
            } : {},
            ...publicAccessToken ? {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PUBLIC_ACCESS_TOKEN_HEADER"]]: publicAccessToken
            } : {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$constants$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PRIVATE_ACCESS_TOKEN_HEADER"]]: privateAccessToken
            }
        },
        apiUrl: apiUrlFormatter(),
        clientName
    };
    const graphqlClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$graphql$2d$client$2f$graphql$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createGraphQLClient"])({
        headers: config.headers,
        url: config.apiUrl,
        retries,
        customFetchApi,
        logger
    });
    const getHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGetHeaders"])(config);
    const getApiUrl = generateGetApiUrl(config, apiUrlFormatter);
    const getGQLClientParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$utilities$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateGetGQLClientParams"])({
        getHeaders,
        getApiUrl
    });
    const client = {
        config,
        getHeaders,
        getApiUrl,
        fetch: (...props)=>{
            return graphqlClient.fetch(...getGQLClientParams(...props));
        },
        request: (...props)=>{
            return graphqlClient.request(...getGQLClientParams(...props));
        },
        requestStream: (...props)=>{
            return graphqlClient.requestStream(...getGQLClientParams(...props));
        }
    };
    return Object.freeze(client);
}
function generateApiUrlFormatter(storeUrl, defaultApiVersion, baseApiVersionValidationParams) {
    return (apiVersion)=>{
        if (apiVersion) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$graphql$2d$client$2f$dist$2f$api$2d$client$2d$utilities$2f$validations$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateApiVersion"])({
                ...baseApiVersionValidationParams,
                apiVersion
            });
        }
        const urlApiVersion = (apiVersion ?? defaultApiVersion).trim();
        return `${storeUrl}/api/${urlApiVersion}/graphql.json`;
    };
}
function generateGetApiUrl(config, apiUrlFormatter) {
    return (propApiVersion)=>{
        return propApiVersion ? apiUrlFormatter(propApiVersion) : config.apiUrl;
    };
}
;
 //# sourceMappingURL=storefront-api-client.mjs.map
}),
"[project]/node_modules/@shopify/storefront-api-client/dist/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$storefront$2d$api$2d$client$2f$dist$2f$storefront$2d$api$2d$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/storefront-api-client/dist/storefront-api-client.mjs [app-route] (ecmascript)"); //# sourceMappingURL=index.mjs.map
;
}),
"[project]/node_modules/isbot/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createIsbot",
    ()=>createIsbot,
    "createIsbotFromList",
    ()=>createIsbotFromList,
    "getPattern",
    ()=>getPattern,
    "isbot",
    ()=>isbot,
    "isbotMatch",
    ()=>isbotMatch,
    "isbotMatches",
    ()=>isbotMatches,
    "isbotNaive",
    ()=>isbotNaive,
    "isbotPattern",
    ()=>isbotPattern,
    "isbotPatterns",
    ()=>isbotPatterns,
    "list",
    ()=>list
]);
// src/patterns.json
var patterns_default = [
    " daum[ /]",
    " deusu/",
    "(?:^|[^g])news(?!sapphire)",
    "(?<! (?:channel/|google/))google(?!(app|/google| pixel))",
    "(?<! cu)bots?(?:\\b|_)",
    "(?<!(?:lib))http",
    "(?<![hg]m)score",
    "(?<!cam)scan",
    "24x7",
    "@[a-z][\\w-]+\\.",
    "\\(\\)",
    "\\.com\\b",
    "\\b\\w+\\.ai",
    "\\bmanus-user/",
    "\\bort/",
    "\\bperl\\b",
    "\\bsecurityheaders\\b",
    "\\btime/",
    "\\|",
    "^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)",
    "^[^ ]{50,}$",
    "^\\d+\\b",
    "^\\W",
    "^\\w*search\\b",
    "^\\w+/[\\w\\(\\)]*$",
    "^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$",
    "^active",
    "^ad muncher",
    "^amaya",
    "^apache/",
    "^avsdevicesdk/",
    "^azure",
    "^biglotron",
    "^bot",
    "^bw/",
    "^clamav[ /]",
    "^client/",
    "^cobweb/",
    "^custom",
    "^ddg[_-]android",
    "^discourse",
    "^dispatch/\\d",
    "^downcast/",
    "^duckduckgo",
    "^email",
    "^facebook",
    "^getright/",
    "^gozilla/",
    "^hobbit",
    "^hotzonu",
    "^hwcdn/",
    "^igetter/",
    "^jeode/",
    "^jetty/",
    "^jigsaw",
    "^microsoft bits",
    "^movabletype",
    "^mozilla/\\d\\.\\d\\s[\\w\\.-]+$",
    "^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$",
    "^navermailapp",
    "^netsurf",
    "^offline",
    "^openai/",
    "^owler",
    "^php",
    "^postman",
    "^python",
    "^rank",
    "^read",
    "^reed",
    "^rest",
    "^rss",
    "^snapchat",
    "^space bison",
    "^svn",
    "^swcd ",
    "^taringa",
    "^thumbor/",
    "^track",
    "^w3c",
    "^webbandit/",
    "^webcopier",
    "^wget",
    "^whatsapp",
    "^wordpress",
    "^xenu link sleuth",
    "^yahoo",
    "^yandex",
    "^zdm/\\d",
    "^zoom marketplace/",
    "advisor",
    "agent\\b",
    "analyzer",
    "archive",
    "ask jeeves/teoma",
    "audit",
    "bit\\.ly/",
    "bluecoat drtr",
    "browsex",
    "burpcollaborator",
    "capture",
    "catch",
    "check\\b",
    "checker",
    "chrome-lighthouse",
    "chromeframe",
    "classifier",
    "cloudflare",
    "convertify",
    "crawl",
    "cypress/",
    "dareboost",
    "datanyze",
    "dejaclick",
    "detect",
    "dmbrowser",
    "download",
    "exaleadcloudview",
    "feed",
    "fetcher",
    "firephp",
    "functionize",
    "grab",
    "headless",
    "httrack",
    "hubspot marketing grader",
    "ibisbrowser",
    "infrawatch",
    "insight",
    "inspect",
    "iplabel",
    "java(?!;)",
    "library",
    "linkcheck",
    "mail\\.ru/",
    "manager",
    "measure",
    "neustar wpm",
    "node\\b",
    "nutch",
    "offbyone",
    "onetrust",
    "optimize",
    "pageburst",
    "pagespeed",
    "parser",
    "phantomjs",
    "pingdom",
    "powermarks",
    "preview",
    "proxy",
    "ptst[ /]\\d",
    "retriever",
    "rexx;",
    "rigor",
    "rss\\b",
    "scrape",
    "server",
    "sogou",
    "sparkler/",
    "speedcurve",
    "spider",
    "splash",
    "statuscake",
    "supercleaner",
    "synapse",
    "synthetic",
    "tools",
    "torrent",
    "transcoder",
    "url",
    "validator",
    "virtuoso",
    "wappalyzer",
    "webglance",
    "webkit2png",
    "whatcms/",
    "xtate/"
];
// src/pattern.ts
var fullPattern = " daum[ /]| deusu/|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|(?<!cam)scan|24x7|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\b\\w+\\.ai|\\bmanus-user/|\\bort/|\\bperl\\b|\\bsecurityheaders\\b|\\btime/|\\||^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\W|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^\\w+/\\d\\.\\d\\s\\([\\w@]+\\)$|^active|^ad muncher|^amaya|^apache/|^avsdevicesdk/|^azure|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/\\d\\.\\d\\s[\\w\\.-]+$|^mozilla/\\d\\.\\d\\s\\(compatible;?(?:\\s[\\w\\d-.]+\\/\\d+\\.\\d+)?\\)$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|advisor|agent\\b|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|exaleadcloudview|feed|fetcher|firephp|functionize|grab|headless|httrack|hubspot marketing grader|ibisbrowser|infrawatch|insight|inspect|iplabel|java(?!;)|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node\\b|nutch|offbyone|onetrust|optimize|pageburst|pagespeed|parser|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|retriever|rexx;|rigor|rss\\b|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|xtate/";
// src/index.ts
var naivePattern = /bot|crawl|http|lighthouse|scan|search|spider/i;
var pattern;
function getPattern() {
    if (pattern instanceof RegExp) {
        return pattern;
    }
    try {
        pattern = new RegExp(fullPattern, "i");
    } catch (error) {
        pattern = naivePattern;
    }
    return pattern;
}
var list = patterns_default;
var isbotNaive = (userAgent)=>Boolean(userAgent) && naivePattern.test(userAgent);
function isbot(userAgent) {
    return Boolean(userAgent) && getPattern().test(userAgent);
}
var createIsbot = (customPattern)=>(userAgent)=>Boolean(userAgent) && customPattern.test(userAgent);
var createIsbotFromList = (list2)=>{
    const pattern2 = new RegExp(list2.join("|"), "i");
    return (userAgent)=>Boolean(userAgent) && pattern2.test(userAgent);
};
var isbotMatch = (userAgent)=>{
    var _a, _b;
    return (_b = (_a = userAgent == null ? void 0 : userAgent.match(getPattern())) == null ? void 0 : _a[0]) != null ? _b : null;
};
var isbotMatches = (userAgent)=>list.map((part)=>{
        var _a;
        return (_a = userAgent == null ? void 0 : userAgent.match(new RegExp(part, "i"))) == null ? void 0 : _a[0];
    }).filter(Boolean);
var isbotPattern = (userAgent)=>{
    var _a;
    return userAgent ? (_a = list.find((pattern2)=>new RegExp(pattern2, "i").test(userAgent))) != null ? _a : null : null;
};
var isbotPatterns = (userAgent)=>userAgent ? list.filter((pattern2)=>new RegExp(pattern2, "i").test(userAgent)) : [];
;
}),
"[project]/node_modules/jose/dist/node/esm/runtime/digest.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const digest = (algorithm, data)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])(algorithm).update(data).digest();
const __TURBOPACK__default__export__ = digest;
}),
"[project]/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "concat",
    ()=>concat,
    "concatKdf",
    ()=>concatKdf,
    "decoder",
    ()=>decoder,
    "encoder",
    ()=>encoder,
    "lengthAndInput",
    ()=>lengthAndInput,
    "p2s",
    ()=>p2s,
    "uint32be",
    ()=>uint32be,
    "uint64be",
    ()=>uint64be
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/digest.js [app-route] (ecmascript)");
;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    for (const buffer of buffers){
        buf.set(buffer, i);
        i += buffer.length;
    }
    return buf;
}
function p2s(alg, p2sInput) {
    return concat(encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])('sha256', buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/base64url.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decode",
    ()=>decode,
    "decodeBase64",
    ()=>decodeBase64,
    "encode",
    ()=>encode,
    "encodeBase64",
    ()=>encodeBase64
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
;
;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(encoded);
    }
    return encoded;
}
const encode = (input)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input).toString('base64url');
const decodeBase64 = (input)=>new Uint8Array(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input, 'base64'));
const encodeBase64 = (input)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(input).toString('base64');
;
const decode = (input)=>new Uint8Array(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(normalize(input), 'base64url'));
}),
"[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JOSEAlgNotAllowed",
    ()=>JOSEAlgNotAllowed,
    "JOSEError",
    ()=>JOSEError,
    "JOSENotSupported",
    ()=>JOSENotSupported,
    "JWEDecryptionFailed",
    ()=>JWEDecryptionFailed,
    "JWEInvalid",
    ()=>JWEInvalid,
    "JWKInvalid",
    ()=>JWKInvalid,
    "JWKSInvalid",
    ()=>JWKSInvalid,
    "JWKSMultipleMatchingKeys",
    ()=>JWKSMultipleMatchingKeys,
    "JWKSNoMatchingKey",
    ()=>JWKSNoMatchingKey,
    "JWKSTimeout",
    ()=>JWKSTimeout,
    "JWSInvalid",
    ()=>JWSInvalid,
    "JWSSignatureVerificationFailed",
    ()=>JWSSignatureVerificationFailed,
    "JWTClaimValidationFailed",
    ()=>JWTClaimValidationFailed,
    "JWTExpired",
    ()=>JWTExpired,
    "JWTInvalid",
    ()=>JWTInvalid
]);
class JOSEError extends Error {
    static code = 'ERR_JOSE_GENERIC';
    code = 'ERR_JOSE_GENERIC';
    constructor(message, options){
        super(message, options);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    code = 'ERR_JWT_CLAIM_VALIDATION_FAILED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JWTExpired extends JOSEError {
    static code = 'ERR_JWT_EXPIRED';
    code = 'ERR_JWT_EXPIRED';
    claim;
    reason;
    payload;
    constructor(message, payload, claim = 'unspecified', reason = 'unspecified'){
        super(message, {
            cause: {
                claim,
                reason,
                payload
            }
        });
        this.claim = claim;
        this.reason = reason;
        this.payload = payload;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    static code = 'ERR_JOSE_ALG_NOT_ALLOWED';
    code = 'ERR_JOSE_ALG_NOT_ALLOWED';
}
class JOSENotSupported extends JOSEError {
    static code = 'ERR_JOSE_NOT_SUPPORTED';
    code = 'ERR_JOSE_NOT_SUPPORTED';
}
class JWEDecryptionFailed extends JOSEError {
    static code = 'ERR_JWE_DECRYPTION_FAILED';
    code = 'ERR_JWE_DECRYPTION_FAILED';
    constructor(message = 'decryption operation failed', options){
        super(message, options);
    }
}
class JWEInvalid extends JOSEError {
    static code = 'ERR_JWE_INVALID';
    code = 'ERR_JWE_INVALID';
}
class JWSInvalid extends JOSEError {
    static code = 'ERR_JWS_INVALID';
    code = 'ERR_JWS_INVALID';
}
class JWTInvalid extends JOSEError {
    static code = 'ERR_JWT_INVALID';
    code = 'ERR_JWT_INVALID';
}
class JWKInvalid extends JOSEError {
    static code = 'ERR_JWK_INVALID';
    code = 'ERR_JWK_INVALID';
}
class JWKSInvalid extends JOSEError {
    static code = 'ERR_JWKS_INVALID';
    code = 'ERR_JWKS_INVALID';
}
class JWKSNoMatchingKey extends JOSEError {
    static code = 'ERR_JWKS_NO_MATCHING_KEY';
    code = 'ERR_JWKS_NO_MATCHING_KEY';
    constructor(message = 'no applicable key found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSMultipleMatchingKeys extends JOSEError {
    [Symbol.asyncIterator];
    static code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    code = 'ERR_JWKS_MULTIPLE_MATCHING_KEYS';
    constructor(message = 'multiple matching keys found in the JSON Web Key Set', options){
        super(message, options);
    }
}
class JWKSTimeout extends JOSEError {
    static code = 'ERR_JWKS_TIMEOUT';
    code = 'ERR_JWKS_TIMEOUT';
    constructor(message = 'request timed out', options){
        super(message, options);
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    static code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    code = 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED';
    constructor(message = 'signature verification failed', options){
        super(message, options);
    }
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/dsa_digest.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>dsaDigest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
;
function dsaDigest(alg) {
    switch(alg){
        case 'PS256':
        case 'RS256':
        case 'ES256':
        case 'ES256K':
            return 'sha256';
        case 'PS384':
        case 'RS384':
        case 'ES384':
            return 'sha384';
        case 'PS512':
        case 'RS512':
        case 'ES512':
            return 'sha512';
        case 'Ed25519':
        case 'EdDSA':
            return undefined;
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/webcrypto.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "isCryptoKey",
    ()=>isCryptoKey
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
;
;
const webcrypto = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["webcrypto"];
const __TURBOPACK__default__export__ = webcrypto;
const isCryptoKey = (key)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["types"].isCryptoKey(key);
}),
"[project]/node_modules/jose/dist/node/esm/runtime/is_key_object.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
;
const __TURBOPACK__default__export__ = (obj)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["types"].isKeyObject(obj);
}),
"[project]/node_modules/jose/dist/node/esm/lib/invalid_key_input.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "withAlg",
    ()=>withAlg
]);
function message(msg, actual, ...types) {
    types = types.filter(Boolean);
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(', ')}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === 'function' && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === 'object' && actual != null) {
        if (actual.constructor?.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
const __TURBOPACK__default__export__ = (actual, ...types)=>{
    return message('Key must be ', actual, ...types);
};
function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/is_key_like.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "types",
    ()=>types
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/webcrypto.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_object.js [app-route] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (key)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCryptoKey"])(key);
const types = [
    'KeyObject'
];
if (globalThis.CryptoKey || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]?.CryptoKey) {
    types.push('CryptoKey');
}
;
}),
"[project]/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isObject
]);
function isObjectLike(value) {
    return typeof value === 'object' && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== '[object Object]') {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
}),
"[project]/node_modules/jose/dist/node/esm/lib/is_jwk.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isJWK",
    ()=>isJWK,
    "isPrivateJWK",
    ()=>isPrivateJWK,
    "isPublicJWK",
    ()=>isPublicJWK,
    "isSecretJWK",
    ()=>isSecretJWK
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)");
;
function isJWK(key) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key) && typeof key.kty === 'string';
}
function isPrivateJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'string';
}
function isPublicJWK(key) {
    return key.kty !== 'oct' && typeof key.d === 'undefined';
}
function isSecretJWK(key) {
    return isJWK(key) && key.kty === 'oct' && typeof key.k === 'string';
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/get_named_curve.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "weakMap",
    ()=>weakMap
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/webcrypto.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/invalid_key_input.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_like.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_jwk.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
const weakMap = new WeakMap();
const namedCurveToJOSE = (namedCurve)=>{
    switch(namedCurve){
        case 'prime256v1':
            return 'P-256';
        case 'secp384r1':
            return 'P-384';
        case 'secp521r1':
            return 'P-521';
        case 'secp256k1':
            return 'secp256k1';
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported key curve for this operation');
    }
};
const getNamedCurve = (kee, raw)=>{
    let key;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCryptoKey"])(kee)) {
        key = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"].from(kee);
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(kee)) {
        key = kee;
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"])(kee)) {
        return kee.crv;
    } else {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(kee, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"]));
    }
    if (key.type === 'secret') {
        throw new TypeError('only "private" or "public" type keys can be used for this operation');
    }
    switch(key.asymmetricKeyType){
        case 'ed25519':
        case 'ed448':
            return `Ed${key.asymmetricKeyType.slice(2)}`;
        case 'x25519':
        case 'x448':
            return `X${key.asymmetricKeyType.slice(1)}`;
        case 'ec':
            {
                const namedCurve = key.asymmetricKeyDetails.namedCurve;
                if (raw) {
                    return namedCurve;
                }
                return namedCurveToJOSE(namedCurve);
            }
        default:
            throw new TypeError('Invalid asymmetric key type for this operation');
    }
};
const __TURBOPACK__default__export__ = getNamedCurve;
}),
"[project]/node_modules/jose/dist/node/esm/runtime/check_key_length.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const __TURBOPACK__default__export__ = (key, alg)=>{
    let modulusLength;
    try {
        if (key instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"]) {
            modulusLength = key.asymmetricKeyDetails?.modulusLength;
        } else {
            modulusLength = Buffer.from(key.n, 'base64url').byteLength << 3;
        }
    } catch  {}
    if (typeof modulusLength !== 'number' || modulusLength < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
};
}),
"[project]/node_modules/jose/dist/node/esm/runtime/node_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>keyForCrypto
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_named_curve$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/get_named_curve.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$check_key_length$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/check_key_length.js [app-route] (ecmascript)");
;
;
;
;
const ecCurveAlgMap = new Map([
    [
        'ES256',
        'P-256'
    ],
    [
        'ES256K',
        'secp256k1'
    ],
    [
        'ES384',
        'P-384'
    ],
    [
        'ES512',
        'P-521'
    ]
]);
function keyForCrypto(alg, key) {
    let asymmetricKeyType;
    let asymmetricKeyDetails;
    let isJWK;
    if (key instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"]) {
        asymmetricKeyType = key.asymmetricKeyType;
        asymmetricKeyDetails = key.asymmetricKeyDetails;
    } else {
        isJWK = true;
        switch(key.kty){
            case 'RSA':
                asymmetricKeyType = 'rsa';
                break;
            case 'EC':
                asymmetricKeyType = 'ec';
                break;
            case 'OKP':
                {
                    if (key.crv === 'Ed25519') {
                        asymmetricKeyType = 'ed25519';
                        break;
                    }
                    if (key.crv === 'Ed448') {
                        asymmetricKeyType = 'ed448';
                        break;
                    }
                    throw new TypeError('Invalid key for this operation, its crv must be Ed25519 or Ed448');
                }
            default:
                throw new TypeError('Invalid key for this operation, its kty must be RSA, OKP, or EC');
        }
    }
    let options;
    switch(alg){
        case 'Ed25519':
            if (asymmetricKeyType !== 'ed25519') {
                throw new TypeError(`Invalid key for this operation, its asymmetricKeyType must be ed25519`);
            }
            break;
        case 'EdDSA':
            if (![
                'ed25519',
                'ed448'
            ].includes(asymmetricKeyType)) {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448');
            }
            break;
        case 'RS256':
        case 'RS384':
        case 'RS512':
            if (asymmetricKeyType !== 'rsa') {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$check_key_length$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key, alg);
            break;
        case 'PS256':
        case 'PS384':
        case 'PS512':
            if (asymmetricKeyType === 'rsa-pss') {
                const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = asymmetricKeyDetails;
                const length = parseInt(alg.slice(-3), 10);
                if (hashAlgorithm !== undefined && (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${alg}`);
                }
                if (saltLength !== undefined && saltLength > length >> 3) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${alg}`);
                }
            } else if (asymmetricKeyType !== 'rsa') {
                throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss');
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$check_key_length$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key, alg);
            options = {
                padding: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["constants"].RSA_PKCS1_PSS_PADDING,
                saltLength: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["constants"].RSA_PSS_SALTLEN_DIGEST
            };
            break;
        case 'ES256':
        case 'ES256K':
        case 'ES384':
        case 'ES512':
            {
                if (asymmetricKeyType !== 'ec') {
                    throw new TypeError('Invalid key for this operation, its asymmetricKeyType must be ec');
                }
                const actual = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_named_curve$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key);
                const expected = ecCurveAlgMap.get(alg);
                if (actual !== expected) {
                    throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
                }
                options = {
                    dsaEncoding: 'ieee-p1363'
                };
                break;
            }
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    if (isJWK) {
        return {
            format: 'jwk',
            key,
            ...options
        };
    }
    return options ? {
        ...options,
        key
    } : key;
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/hmac_digest.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>hmacDigest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
;
function hmacDigest(alg) {
    switch(alg){
        case 'HS256':
            return 'sha256';
        case 'HS384':
            return 'sha384';
        case 'HS512':
            return 'sha512';
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
}),
"[project]/node_modules/jose/dist/node/esm/lib/crypto_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkEncCryptoKey",
    ()=>checkEncCryptoKey,
    "checkSigCryptoKey",
    ()=>checkSigCryptoKey
]);
function unusable(name, prop = 'algorithm.name') {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
}
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
    switch(alg){
        case 'ES256':
            return 'P-256';
        case 'ES384':
            return 'P-384';
        case 'ES512':
            return 'P-521';
        default:
            throw new Error('unreachable');
    }
}
function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected)=>key.usages.includes(expected))) {
        let msg = 'CryptoKey does not support this operation, its usages must include ';
        if (usages.length > 2) {
            const last = usages.pop();
            msg += `one of ${usages.join(', ')}, or ${last}.`;
        } else if (usages.length === 2) {
            msg += `one of ${usages[0]} or ${usages[1]}.`;
        } else {
            msg += `${usages[0]}.`;
        }
        throw new TypeError(msg);
    }
}
function checkSigCryptoKey(key, alg, ...usages) {
    switch(alg){
        case 'HS256':
        case 'HS384':
        case 'HS512':
            {
                if (!isAlgorithm(key.algorithm, 'HMAC')) throw unusable('HMAC');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'RS256':
        case 'RS384':
        case 'RS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSASSA-PKCS1-v1_5')) throw unusable('RSASSA-PKCS1-v1_5');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'PS256':
        case 'PS384':
        case 'PS512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-PSS')) throw unusable('RSA-PSS');
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        case 'EdDSA':
            {
                if (key.algorithm.name !== 'Ed25519' && key.algorithm.name !== 'Ed448') {
                    throw unusable('Ed25519 or Ed448');
                }
                break;
            }
        case 'Ed25519':
            {
                if (!isAlgorithm(key.algorithm, 'Ed25519')) throw unusable('Ed25519');
                break;
            }
        case 'ES256':
        case 'ES384':
        case 'ES512':
            {
                if (!isAlgorithm(key.algorithm, 'ECDSA')) throw unusable('ECDSA');
                const expected = getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, 'algorithm.namedCurve');
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usages);
}
function checkEncCryptoKey(key, alg, ...usages) {
    switch(alg){
        case 'A128GCM':
        case 'A192GCM':
        case 'A256GCM':
            {
                if (!isAlgorithm(key.algorithm, 'AES-GCM')) throw unusable('AES-GCM');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'A128KW':
        case 'A192KW':
        case 'A256KW':
            {
                if (!isAlgorithm(key.algorithm, 'AES-KW')) throw unusable('AES-KW');
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, 'algorithm.length');
                break;
            }
        case 'ECDH':
            {
                switch(key.algorithm.name){
                    case 'ECDH':
                    case 'X25519':
                    case 'X448':
                        break;
                    default:
                        throw unusable('ECDH, X25519, or X448');
                }
                break;
            }
        case 'PBES2-HS256+A128KW':
        case 'PBES2-HS384+A192KW':
        case 'PBES2-HS512+A256KW':
            if (!isAlgorithm(key.algorithm, 'PBKDF2')) throw unusable('PBKDF2');
            break;
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            {
                if (!isAlgorithm(key.algorithm, 'RSA-OAEP')) throw unusable('RSA-OAEP');
                const expected = parseInt(alg.slice(9), 10) || 1;
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, 'algorithm.hash');
                break;
            }
        default:
            throw new TypeError('CryptoKey does not support this operation');
    }
    checkUsage(key, usages);
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/get_sign_verify_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>getSignVerifyKey
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/webcrypto.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/crypto_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/invalid_key_input.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_like.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_jwk.js [app-route] (ecmascript)");
;
;
;
;
;
;
function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"]));
        }
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createSecretKey"])(key);
    }
    if (key instanceof __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"]) {
        return key;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$crypto_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkSigCryptoKey"])(key, alg, usage);
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"].from(key);
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        if (alg.startsWith('HS')) {
            return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createSecretKey"])(Buffer.from(key.k, 'base64url'));
        }
        return key;
    }
    throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"], 'Uint8Array', 'JSON Web Key'));
}
}),
"[project]/node_modules/jose/dist/node/esm/runtime/sign.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$dsa_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/dsa_digest.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$hmac_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/hmac_digest.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$node_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/node_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/get_sign_verify_key.js [app-route] (ecmascript)");
;
;
;
;
;
;
const oneShotSign = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["sign"]);
const sign = async (alg, key, data)=>{
    const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, key, 'sign');
    if (alg.startsWith('HS')) {
        const hmac = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHmac"]((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$hmac_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg), k);
        hmac.update(data);
        return hmac.digest();
    }
    return oneShotSign((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$dsa_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg), data, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$node_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, k));
};
const __TURBOPACK__default__export__ = sign;
}),
"[project]/node_modules/jose/dist/node/esm/runtime/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$dsa_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/dsa_digest.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$node_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/node_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/get_sign_verify_key.js [app-route] (ecmascript)");
;
;
;
;
;
;
const oneShotVerify = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["verify"]);
const verify = async (alg, key, signature, data)=>{
    const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$get_sign_verify_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, key, 'verify');
    if (alg.startsWith('HS')) {
        const expected = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, k, data);
        const actual = signature;
        try {
            return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["timingSafeEqual"](actual, expected);
        } catch  {
            return false;
        }
    }
    const algorithm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$dsa_digest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg);
    const keyInput = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$node_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, k);
    try {
        return await oneShotVerify(algorithm, data, keyInput, signature);
    } catch  {
        return false;
    }
};
const __TURBOPACK__default__export__ = verify;
}),
"[project]/node_modules/jose/dist/node/esm/lib/is_disjoint.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const isDisjoint = (...headers)=>{
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
};
const __TURBOPACK__default__export__ = isDisjoint;
}),
"[project]/node_modules/jose/dist/node/esm/lib/check_key_type.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkKeyTypeWithJwk",
    ()=>checkKeyTypeWithJwk,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/invalid_key_input.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_like.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_jwk.js [app-route] (ecmascript)");
;
;
;
const tag = (key)=>key?.[Symbol.toStringTag];
const jwkMatchesOp = (alg, key, usage)=>{
    if (key.use !== undefined && key.use !== 'sig') {
        throw new TypeError('Invalid key for this operation, when present its use must be sig');
    }
    if (key.key_ops !== undefined && key.key_ops.includes?.(usage) !== true) {
        throw new TypeError(`Invalid key for this operation, when present its key_ops must include ${usage}`);
    }
    if (key.alg !== undefined && key.alg !== alg) {
        throw new TypeError(`Invalid key for this operation, when present its alg must be ${alg}`);
    }
    return true;
};
const symmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (key instanceof Uint8Array) return;
    if (allowJwk && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isSecretJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
        throw new TypeError(`JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present`);
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"], 'Uint8Array', allowJwk ? 'JSON Web Key' : null));
    }
    if (key.type !== 'secret') {
        throw new TypeError(`${tag(key)} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage, allowJwk)=>{
    if (allowJwk && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"](key)) {
        switch(usage){
            case 'sign':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrivateJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a private JWK`);
            case 'verify':
                if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPublicJWK"](key) && jwkMatchesOp(alg, key, usage)) return;
                throw new TypeError(`JSON Web Key for this operation be a public JWK`);
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key)) {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAlg"])(alg, key, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"], allowJwk ? 'JSON Web Key' : null));
    }
    if (key.type === 'secret') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === 'sign' && key.type === 'public') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === 'decrypt' && key.type === 'public') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === 'verify' && key.type === 'private') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === 'encrypt' && key.type === 'private') {
        throw new TypeError(`${tag(key)} instances for asymmetric algorithm encryption must be of type "public"`);
    }
};
function checkKeyType(allowJwk, alg, key, usage) {
    const symmetric = alg.startsWith('HS') || alg === 'dir' || alg.startsWith('PBES2') || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
        symmetricTypeCheck(alg, key, usage, allowJwk);
    } else {
        asymmetricTypeCheck(alg, key, usage, allowJwk);
    }
}
const __TURBOPACK__default__export__ = checkKeyType.bind(undefined, false);
const checkKeyTypeWithJwk = checkKeyType.bind(undefined, true);
}),
"[project]/node_modules/jose/dist/node/esm/lib/validate_crit.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
;
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader?.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== 'string' || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"](`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        }
        if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
const __TURBOPACK__default__export__ = validateCrit;
}),
"[project]/node_modules/jose/dist/node/esm/lib/validate_algorithms.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const validateAlgorithms = (option, algorithms)=>{
    if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some((s)=>typeof s !== 'string'))) {
        throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
        return undefined;
    }
    return new Set(algorithms);
};
const __TURBOPACK__default__export__ = validateAlgorithms;
}),
"[project]/node_modules/jose/dist/node/esm/runtime/asn1.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fromPKCS8",
    ()=>fromPKCS8,
    "fromSPKI",
    ()=>fromSPKI,
    "fromX509",
    ()=>fromX509,
    "toPKCS8",
    ()=>toPKCS8,
    "toSPKI",
    ()=>toSPKI
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/webcrypto.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/invalid_key_input.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/is_key_like.js [app-route] (ecmascript)");
;
;
;
;
;
;
const genericExport = (keyType, keyFormat, key)=>{
    let keyObject;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$webcrypto$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isCryptoKey"])(key)) {
        if (!key.extractable) {
            throw new TypeError('CryptoKey is not extractable');
        }
        keyObject = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["KeyObject"].from(key);
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key)) {
        keyObject = key;
    } else {
        throw new TypeError((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$invalid_key_input$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(key, ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$is_key_like$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["types"]));
    }
    if (keyObject.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({
        format: 'pem',
        type: keyFormat
    });
};
const toSPKI = (key)=>{
    return genericExport('public', 'spki', key);
};
const toPKCS8 = (key)=>{
    return genericExport('private', 'pkcs8', key);
};
const fromPKCS8 = (pem)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createPrivateKey"])({
        key: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''), 'base64'),
        type: 'pkcs8',
        format: 'der'
    });
const fromSPKI = (pem)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createPublicKey"])({
        key: __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ''), 'base64'),
        type: 'spki',
        format: 'der'
    });
const fromX509 = (pem)=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createPublicKey"])({
        key: pem,
        type: 'spki',
        format: 'pem'
    });
}),
"[project]/node_modules/jose/dist/node/esm/runtime/jwk_to_key.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const parse = (key)=>{
    if (key.d) {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createPrivateKey"])({
            format: 'jwk',
            key
        });
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createPublicKey"])({
        format: 'jwk',
        key
    });
};
const __TURBOPACK__default__export__ = parse;
}),
"[project]/node_modules/jose/dist/node/esm/key/import.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "importJWK",
    ()=>importJWK,
    "importPKCS8",
    ()=>importPKCS8,
    "importSPKI",
    ()=>importSPKI,
    "importX509",
    ()=>importX509
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$asn1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/asn1.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/jwk_to_key.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)");
;
;
;
;
;
async function importSPKI(spki, alg, options) {
    if (typeof spki !== 'string' || spki.indexOf('-----BEGIN PUBLIC KEY-----') !== 0) {
        throw new TypeError('"spki" must be SPKI formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$asn1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromSPKI"])(spki, alg, options);
}
async function importX509(x509, alg, options) {
    if (typeof x509 !== 'string' || x509.indexOf('-----BEGIN CERTIFICATE-----') !== 0) {
        throw new TypeError('"x509" must be X.509 formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$asn1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromX509"])(x509, alg, options);
}
async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== 'string' || pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0) {
        throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$asn1$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromPKCS8"])(pkcs8, alg, options);
}
async function importJWK(jwk, alg) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(jwk)) {
        throw new TypeError('JWK must be an object');
    }
    alg ||= jwk.alg;
    switch(jwk.kty){
        case 'oct':
            if (typeof jwk.k !== 'string' || !jwk.k) {
                throw new TypeError('missing "k" (Key Value) Parameter value');
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(jwk.k);
        case 'RSA':
            if ('oth' in jwk && jwk.oth !== undefined) {
                throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"]('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            }
        case 'EC':
        case 'OKP':
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$jwk_to_key$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
                ...jwk,
                alg
            });
        default:
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSENotSupported"]('Unsupported "kty" (Key Type) Parameter value');
    }
}
}),
"[project]/node_modules/jose/dist/node/esm/jws/flattened/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flattenedVerify",
    ()=>flattenedVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/base64url.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/runtime/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_disjoint.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/check_key_type.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/validate_crit.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/validate_algorithms.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_jwk.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/key/import.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
async function flattenedVerify(jws, key, options) {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(jws)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Flattened JWS must be an object');
    }
    if (jws.protected === undefined && jws.header === undefined) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== undefined && typeof jws.protected !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected Header incorrect type');
    }
    if (jws.payload === undefined) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload missing');
    }
    if (typeof jws.signature !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Signature missing or incorrect type');
    }
    if (jws.header !== undefined && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(jws.header)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Unprotected Header incorrect type');
    }
    let parsedProt = {};
    if (jws.protected) {
        try {
            const protectedHeader = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(jws.protected);
            parsedProt = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(protectedHeader));
        } catch  {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected Header is invalid');
        }
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_disjoint$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(parsedProt, jws.header)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Protected and JWS Unprotected Header Parameter names must be disjoint');
    }
    const joseHeader = {
        ...parsedProt,
        ...jws.header
    };
    const extensions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$validate_crit$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"], new Map([
        [
            'b64',
            true
        ]
    ]), options?.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has('b64')) {
        b64 = parsedProt.b64;
        if (typeof b64 !== 'boolean') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
    }
    const { alg } = joseHeader;
    if (typeof alg !== 'string' || !alg) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$validate_algorithms$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])('algorithms', options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JOSEAlgNotAllowed"]('"alg" (Algorithm) Header Parameter value not allowed');
    }
    if (b64) {
        if (typeof jws.payload !== 'string') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload must be a string');
        }
    } else if (typeof jws.payload !== 'string' && !(jws.payload instanceof Uint8Array)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('JWS Payload must be a string or an Uint8Array instance');
    }
    let resolvedKey = false;
    if (typeof key === 'function') {
        key = await key(parsedProt, jws);
        resolvedKey = true;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkKeyTypeWithJwk"])(alg, key, 'verify');
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_jwk$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isJWK"])(key)) {
            key = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$key$2f$import$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["importJWK"])(key, alg);
        }
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$check_key_type$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkKeyTypeWithJwk"])(alg, key, 'verify');
    }
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["concat"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(jws.protected ?? ''), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode('.'), typeof jws.payload === 'string' ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(jws.payload) : jws.payload);
    let signature;
    try {
        signature = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(jws.signature);
    } catch  {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Failed to base64url decode the signature');
    }
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(alg, key, signature, data);
    if (!verified) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSSignatureVerificationFailed"]();
    }
    let payload;
    if (b64) {
        try {
            payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$runtime$2f$base64url$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decode"])(jws.payload);
        } catch  {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Failed to base64url decode the payload');
        }
    } else if (typeof jws.payload === 'string') {
        payload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encoder"].encode(jws.payload);
    } else {
        payload = jws.payload;
    }
    const result = {
        payload
    };
    if (jws.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key
        };
    }
    return result;
}
}),
"[project]/node_modules/jose/dist/node/esm/jws/compact/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "compactVerify",
    ()=>compactVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jws/flattened/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
;
;
;
async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(jws);
    }
    if (typeof jws !== 'string') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Compact JWS must be a string or Uint8Array');
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split('.');
    if (length !== 3) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWSInvalid"]('Invalid Compact JWS');
    }
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jws$2f$flattened$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flattenedVerify"])({
        payload,
        protected: protectedHeader,
        signature
    }, key, options);
    const result = {
        payload: verified.payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === 'function') {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
}),
"[project]/node_modules/jose/dist/node/esm/lib/epoch.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const __TURBOPACK__default__export__ = (date)=>Math.floor(date.getTime() / 1000);
}),
"[project]/node_modules/jose/dist/node/esm/lib/secs.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i;
const __TURBOPACK__default__export__ = (str)=>{
    const matched = REGEX.exec(str);
    if (!matched || matched[4] && matched[1]) {
        throw new TypeError('Invalid time period format');
    }
    const value = parseFloat(matched[2]);
    const unit = matched[3].toLowerCase();
    let numericDate;
    switch(unit){
        case 'sec':
        case 'secs':
        case 'second':
        case 'seconds':
        case 's':
            numericDate = Math.round(value);
            break;
        case 'minute':
        case 'minutes':
        case 'min':
        case 'mins':
        case 'm':
            numericDate = Math.round(value * minute);
            break;
        case 'hour':
        case 'hours':
        case 'hr':
        case 'hrs':
        case 'h':
            numericDate = Math.round(value * hour);
            break;
        case 'day':
        case 'days':
        case 'd':
            numericDate = Math.round(value * day);
            break;
        case 'week':
        case 'weeks':
        case 'w':
            numericDate = Math.round(value * week);
            break;
        default:
            numericDate = Math.round(value * year);
            break;
    }
    if (matched[1] === '-' || matched[4] === 'ago') {
        return -numericDate;
    }
    return numericDate;
};
}),
"[project]/node_modules/jose/dist/node/esm/lib/jwt_claims_set.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/buffer_utils.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$epoch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/epoch.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$secs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/secs.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/is_object.js [app-route] (ecmascript)");
;
;
;
;
;
const normalizeTyp = (value)=>value.toLowerCase().replace(/^application\//, '');
const checkAudiencePresence = (audPayload, audOption)=>{
    if (typeof audPayload === 'string') {
        return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
        return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
};
const __TURBOPACK__default__export__ = (protectedHeader, encodedPayload, options = {})=>{
    let payload;
    try {
        payload = JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$buffer_utils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decoder"].decode(encodedPayload));
    } catch  {}
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$is_object$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(payload)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWT Claims Set must be a top-level JSON object');
    }
    const { typ } = options;
    if (typ && (typeof protectedHeader.typ !== 'string' || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "typ" JWT header value', payload, 'typ', 'check_failed');
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    const presenceCheck = [
        ...requiredClaims
    ];
    if (maxTokenAge !== undefined) presenceCheck.push('iat');
    if (audience !== undefined) presenceCheck.push('aud');
    if (subject !== undefined) presenceCheck.push('sub');
    if (issuer !== undefined) presenceCheck.push('iss');
    for (const claim of new Set(presenceCheck.reverse())){
        if (!(claim in payload)) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"](`missing required "${claim}" claim`, payload, claim, 'missing');
        }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [
        issuer
    ]).includes(payload.iss)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "iss" claim value', payload, 'iss', 'check_failed');
    }
    if (subject && payload.sub !== subject) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "sub" claim value', payload, 'sub', 'check_failed');
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === 'string' ? [
        audience
    ] : audience)) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('unexpected "aud" claim value', payload, 'aud', 'check_failed');
    }
    let tolerance;
    switch(typeof options.clockTolerance){
        case 'string':
            tolerance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$secs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(options.clockTolerance);
            break;
        case 'number':
            tolerance = options.clockTolerance;
            break;
        case 'undefined':
            tolerance = 0;
            break;
        default:
            throw new TypeError('Invalid clockTolerance option type');
    }
    const { currentDate } = options;
    const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$epoch$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(currentDate || new Date());
    if ((payload.iat !== undefined || maxTokenAge) && typeof payload.iat !== 'number') {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"iat" claim must be a number', payload, 'iat', 'invalid');
    }
    if (payload.nbf !== undefined) {
        if (typeof payload.nbf !== 'number') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"nbf" claim must be a number', payload, 'nbf', 'invalid');
        }
        if (payload.nbf > now + tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"nbf" claim timestamp check failed', payload, 'nbf', 'check_failed');
        }
    }
    if (payload.exp !== undefined) {
        if (typeof payload.exp !== 'number') {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"exp" claim must be a number', payload, 'exp', 'invalid');
        }
        if (payload.exp <= now - tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTExpired"]('"exp" claim timestamp check failed', payload, 'exp', 'check_failed');
        }
    }
    if (maxTokenAge) {
        const age = now - payload.iat;
        const max = typeof maxTokenAge === 'number' ? maxTokenAge : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$secs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(maxTokenAge);
        if (age - tolerance > max) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTExpired"]('"iat" claim timestamp check failed (too far in the past)', payload, 'iat', 'check_failed');
        }
        if (age < 0 - tolerance) {
            throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTClaimValidationFailed"]('"iat" claim timestamp check failed (it should be in the past)', payload, 'iat', 'check_failed');
        }
    }
    return payload;
};
}),
"[project]/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "jwtVerify",
    ()=>jwtVerify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jws/compact/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/lib/jwt_claims_set.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/util/errors.js [app-route] (ecmascript)");
;
;
;
async function jwtVerify(jwt, key, options) {
    const verified = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jws$2f$compact$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compactVerify"])(jwt, key, options);
    if (verified.protectedHeader.crit?.includes('b64') && verified.protectedHeader.b64 === false) {
        throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$util$2f$errors$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JWTInvalid"]('JWTs MUST NOT use unencoded payload');
    }
    const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$lib$2f$jwt_claims_set$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(verified.protectedHeader, verified.payload, options);
    const result = {
        payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === 'function') {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client-2c3a283f134fdcb6", () => require("@prisma/client-2c3a283f134fdcb6"));

module.exports = mod;
}),
"[project]/node_modules/@shopify/shopify-app-session-storage-prisma/dist/esm/prisma.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MissingSessionStorageError",
    ()=>MissingSessionStorageError,
    "MissingSessionTableError",
    ()=>MissingSessionTableError,
    "PrismaSessionStorage",
    ()=>PrismaSessionStorage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$session$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@shopify/shopify-api/dist/esm/lib/session/session.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
;
const UNIQUE_KEY_CONSTRAINT_ERROR_CODE = 'P2002';
class PrismaSessionStorage {
    prisma;
    ready;
    tableName = 'session';
    connectionRetries = 2;
    connectionRetryIntervalMs = 5000;
    constructor(prisma, { tableName, connectionRetries, connectionRetryIntervalMs } = {}){
        this.prisma = prisma;
        if (tableName) {
            this.tableName = tableName;
        }
        if (connectionRetries !== undefined) {
            this.connectionRetries = connectionRetries;
        }
        if (connectionRetryIntervalMs !== undefined) {
            this.connectionRetryIntervalMs = connectionRetryIntervalMs;
        }
        if (this.getSessionTable() === undefined) {
            throw new Error(`PrismaClient does not have a ${this.tableName} table`);
        }
        this.ready = this.pollForTable().then(()=>true).catch((cause)=>{
            throw new MissingSessionTableError(`Prisma ${this.tableName} table does not exist. This could happen for a few reasons, see https://github.com/Shopify/shopify-app-js/tree/main/packages/apps/session-storage/shopify-app-session-storage-prisma#troubleshooting for more information`, cause);
        });
    }
    async storeSession(session) {
        await this.ensureReady();
        const data = this.sessionToRow(session);
        try {
            await this.getSessionTable().upsert({
                where: {
                    id: session.id
                },
                update: data,
                create: data
            });
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["Prisma"].PrismaClientKnownRequestError && error.code === UNIQUE_KEY_CONSTRAINT_ERROR_CODE) {
                console.log('Caught PrismaClientKnownRequestError P2002 - Unique Key Key Constraint, retrying upsert.');
                await this.getSessionTable().upsert({
                    where: {
                        id: session.id
                    },
                    update: data,
                    create: data
                });
                return true;
            }
            throw error;
        }
        return true;
    }
    async loadSession(id) {
        await this.ensureReady();
        const row = await this.getSessionTable().findUnique({
            where: {
                id
            }
        });
        if (!row) {
            return undefined;
        }
        return this.rowToSession(row);
    }
    async deleteSession(id) {
        await this.ensureReady();
        try {
            await this.getSessionTable().delete({
                where: {
                    id
                }
            });
        } catch  {
            return true;
        }
        return true;
    }
    async deleteSessions(ids) {
        await this.ensureReady();
        await this.getSessionTable().deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        return true;
    }
    async findSessionsByShop(shop) {
        await this.ensureReady();
        const sessions = await this.getSessionTable().findMany({
            where: {
                shop
            },
            take: 25,
            orderBy: [
                {
                    expires: 'desc'
                }
            ]
        });
        return sessions.map((session)=>this.rowToSession(session));
    }
    async isReady() {
        try {
            await this.pollForTable();
            this.ready = Promise.resolve(true);
        } catch (_error) {
            this.ready = Promise.resolve(false);
        }
        return this.ready;
    }
    async ensureReady() {
        if (!await this.ready) throw new MissingSessionStorageError('Prisma session storage is not ready. Use the `isReady` method to poll for the table.');
    }
    async pollForTable() {
        for(let i = 0; i < this.connectionRetries; i++){
            try {
                await this.getSessionTable().count();
                return;
            } catch (error) {
                console.log(`Error obtaining session table: ${error}`);
            }
            await sleep(this.connectionRetryIntervalMs);
        }
        throw Error(`The table \`${this.tableName}\` does not exist in the current database.`);
    }
    sessionToRow(session) {
        const sessionParams = session.toObject();
        return {
            id: session.id,
            shop: session.shop,
            state: session.state,
            isOnline: session.isOnline,
            scope: session.scope || null,
            expires: session.expires || null,
            accessToken: session.accessToken || '',
            userId: sessionParams.onlineAccessInfo?.associated_user.id || null,
            firstName: sessionParams.onlineAccessInfo?.associated_user.first_name || null,
            lastName: sessionParams.onlineAccessInfo?.associated_user.last_name || null,
            email: sessionParams.onlineAccessInfo?.associated_user.email || null,
            accountOwner: sessionParams.onlineAccessInfo?.associated_user.account_owner || false,
            locale: sessionParams.onlineAccessInfo?.associated_user.locale || null,
            collaborator: sessionParams.onlineAccessInfo?.associated_user.collaborator || false,
            emailVerified: sessionParams.onlineAccessInfo?.associated_user.email_verified || false,
            refreshToken: sessionParams.refreshToken || null,
            refreshTokenExpires: sessionParams.refreshTokenExpires || null
        };
    }
    rowToSession(row) {
        const sessionParams = {
            id: row.id,
            shop: row.shop,
            state: row.state,
            isOnline: row.isOnline,
            userId: String(row.userId),
            firstName: String(row.firstName),
            lastName: String(row.lastName),
            email: String(row.email),
            locale: String(row.locale)
        };
        if (row.accountOwner !== null) {
            sessionParams.accountOwner = row.accountOwner;
        }
        if (row.collaborator !== null) {
            sessionParams.collaborator = row.collaborator;
        }
        if (row.emailVerified !== null) {
            sessionParams.emailVerified = row.emailVerified;
        }
        if (row.expires) {
            sessionParams.expires = row.expires.getTime();
        }
        if (row.scope) {
            sessionParams.scope = row.scope;
        }
        if (row.accessToken) {
            sessionParams.accessToken = row.accessToken;
        }
        if (row.refreshToken) {
            sessionParams.refreshToken = row.refreshToken;
        }
        if (row.refreshTokenExpires) {
            sessionParams.refreshTokenExpires = row.refreshTokenExpires.getTime();
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$shopify$2f$shopify$2d$api$2f$dist$2f$esm$2f$lib$2f$session$2f$session$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Session"].fromPropertyArray(Object.entries(sessionParams), true);
    }
    getSessionTable() {
        return this.prisma[this.tableName];
    }
}
class MissingSessionTableError extends Error {
    cause;
    constructor(message, cause){
        super(message);
        this.cause = cause;
    }
}
class MissingSessionStorageError extends Error {
    constructor(message){
        super(message);
    }
}
async function sleep(ms) {
    return new Promise((resolve)=>setTimeout(resolve, ms));
}
;
 //# sourceMappingURL=prisma.mjs.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__376aa635._.js.map