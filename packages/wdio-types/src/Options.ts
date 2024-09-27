import type { Hooks, ServiceEntry } from './Services.js'
import type { ReporterEntry } from './Reporters.js'

export type WebDriverLogTypes = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'
export type SupportedProtocols = 'webdriver' | './protocol-stub.js'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'HEAD' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'trace'

export interface RequestLibResponse {
    statusCode: number
    body?: any
    rawBody?: Buffer
}

export interface ShardOptions {
    /**
     * Total number of shards
     */
    total: number
    /**
     * Shard index to start from (starts with index 1)
     */
    current: number
}

/**
 * WebdriverIO allows to connect to different WebDriver endpoints by capability
 * so these connection options need to be part of capabilities
 */
export interface Connection {
    /**
     * Protocol to use when communicating with the Selenium standalone server (or driver).
     *
     * @default 'http'
     */
    protocol?: string
    /**
     * Host of your WebDriver server.
     *
     * @default 'localhost'
     */
    hostname?: string
    /**
     * Port your WebDriver server is on.
     */
    port?: number
    /**
     * Path to WebDriver endpoint or grid server.
     *
     * @default '/'
     */
    path?: string
    /**
     * Query paramaters that are propagated to the driver server.
     */
    queryParams?: {
        [name: string]: string
    }
    /**
     * Your cloud service username (only works for [Sauce Labs](https://saucelabs.com),
     * [Browserstack](https://www.browserstack.com), [TestingBot](https://testingbot.com) or
     * [LambdaTest](https://www.lambdatest.com) accounts). If set, WebdriverIO will
     * automatically set connection options for you. If you don't use a cloud provider this
     * can be used to authenticate any other WebDriver backend.
     */
    user?: string
    /**
     * Your cloud service access key or secret key (only works for
     * [Sauce Labs](https://saucelabs.com), [Browserstack](https://www.browserstack.com),
     * [TestingBot](https://testingbot.com) or [LambdaTest](https://www.lambdatest.com) accounts).
     * If set, WebdriverIO will automatically set connection options for you. If you don't use
     * a cloud provider this can be used to authenticate any other WebDriver backend.
     */
    key?: string
}

export interface WebDriver extends Connection {
    /**
     * Level of logging verbosity.
     *
     * @default 'info'
     */
    logLevel?: WebDriverLogTypes
    /**
     * Set specific log levels per logger
     * use 'silent' level to disable logger
     */
    logLevels?: Record<string, WebDriverLogTypes>
    /**
     * Timeout for any WebDriver request to a driver or grid.
     *
     * @default 120000
     */
    connectionRetryTimeout?: number
    /**
     * Count of request retries to the Selenium server.
     *
     * @default 3
     */
    connectionRetryCount?: number
    /**
     * Specify custom headers to pass into every request.
     */
    headers?: {
        [name: string]: string
    }
    /**
     * Function intercepting [HTTP request options](https://github.com/sindresorhus/got#options) before a WebDriver request is made.
     */
    transformRequest?: (requestOptions: RequestInit) => RequestInit
    /**
     * Function intercepting HTTP response objects after a WebDriver response has arrived.
     */
    transformResponse?: (response: RequestLibResponse, requestOptions: RequestInit) => RequestLibResponse

    /**
     * Appium direct connect options (see: https://appiumpro.com/editions/86-connecting-directly-to-appium-hosts-in-distributed-environments)
     */
    enableDirectConnect?: boolean;

    /**
     * Whether it requires SSL certificates to be valid in HTTP/s requests
     * for an environment which cannot get process environment well.
     *
     * @default true
     */
    strictSSL?: boolean

    /**
     * Directory to store all testrunner log files (including reporter logs and `wdio` logs).
     * If not set, all logs are streamed to `stdout`. Since most reporters are made to log to
     * `stdout`, it is recommended to only use this option for specific reporters where it
     * makes more sense to push report into a file (like the `junit` reporter, for example).
     *
     * When running in standalone mode, the only log generated by WebdriverIO will be
     * the `wdio` log.
     */
    outputDir?: string
    /**
     * The path to the root of the cache directory. This directory is used to store all drivers that are downloaded
     * when attempting to start a session.
     */
    cacheDir?: string
}

export type SauceRegions = 'us' | 'eu' | 'us-west-1' | 'us-east-4' | 'eu-central-1' | 'staging'

export interface WebdriverIO extends WebDriver, Pick<Hooks, 'onReload' | 'beforeCommand' | 'afterCommand'> {
    /**
     * @private
     */
    automationProtocol?: SupportedProtocols
    /**
     * If running on Sauce Labs, you can choose to run tests between different data centers:
     * US or EU. To change your region to EU, add region: 'eu' to your config.
     */
    region?: SauceRegions
    /**
     * Shorten url command calls by setting a base URL.
     */
    baseUrl?: string
    /**
     * Default timeout for all `waitFor*` commands. (Note the lowercase f in the option name.)
     * This timeout only affects commands starting with `waitFor*` and their default wait time.
     * @default 5000
     */
    waitforTimeout?: number
    /**
     * Default interval for all `waitFor*` commands to check if an expected state (e.g.,
     * visibility) has been changed.
     */
    waitforInterval?: number
}

export interface Testrunner extends Hooks, WebdriverIO, WebdriverIO.HookFunctionExtension {
    /**
     * Type of runner
     * - local: every spec file group is spawned in its own local process
     *   running an independant browser session
     * - browser: all spec files are run within the browser
     */
    runner?: 'local' | 'browser' | ['browser', WebdriverIO.BrowserRunnerOptions] | ['local', never]
    /**
     * Project root directory path.
     */
    rootDir?: string
    /**
     * Define specs for test execution. You can either specify a glob
     * pattern to match multiple files at once or wrap a glob or set of
     * paths into an array to run them within a single worker process.
     */
    specs?: (string | string[])[]
    /**
     * Exclude specs from test execution.
     */
    exclude?: string[]
    /**
     * An object describing various of suites, which you can then specify
     * with the --suite option on the wdio CLI.
     */
    suites?: Record<string, (string |string[])[] | string[][]>
    /**
     * Maximum number of total parallel running workers.
     */
    maxInstances?: number
    /**
     * Maximum number of total parallel running workers per capability.
     */
    maxInstancesPerCapability?: number
    /**
     * Inserts WebdriverIO's globals (e.g. `browser`, `$` and `$$`) into the
     * global environment. If you set to `false`, you should import from
     * `@wdio/globals`, e.g.:
     *
     * ```ts
     * import { browser, $, $$, expect } from '@wdio/globals'
     * ```
     *
     * Note: WebdriverIO doesn't handle injection of test framework specific
     * globals.
     *
     * @default true
     */
    injectGlobals?: boolean
    /**
     * If you want your test run to stop after a specific number of test failures, use bail.
     * (It defaults to 0, which runs all tests no matter what.) Note: Please be aware that
     * when using a third party test runner (such as Mocha), additional configuration might
     * be required.
     */
    bail?: number
    /**
     * Set to true if you want to update your snapshots.
     */
    updateSnapshots?: 'all' | 'new' | 'none'
    /**
     * Overrides default snapshot path. For example, to store snapshots next to test files.
     * @default __snapshots__ stores snapshot files in __snapshots__ directory next to the test file.
     */
    resolveSnapshotPath?: (testPath: string, snapExtension: string) => string
    /**
     * The number of retry attempts for an entire specfile when it fails as a whole.
     */
    specFileRetries?: number
    /**
     * Delay in seconds between the spec file retry attempts
     */
    specFileRetriesDelay?: number
    /**
     * Whether or not retried spec files should be retried immediately or deferred to the end of the queue
     */
    specFileRetriesDeferred?: boolean
    /**
     * Choose the log output view.
     * If set to "false" logs from different test files will be printed in real-time.
     * Please note that this may result in the mixing of log outputs from different Test Specs when running in parallel.
     * If set to "true" log outputs will be grouped by test files and printed only when the test is completed.
     * By default, it is set to "false" so logs are printed in real-time.
     *
     * @default false
     */
    groupLogsByTestSpec?: boolean,
    /**
     * Services take over a specific job you don't want to take care of. They enhance
     * your test setup with almost no effort.
     */
    services?: ServiceEntry[]
    /**
     * Defines the test framework to be used by the WDIO testrunner.
     */
    framework?: string
    /**
     * List of reporters to use. A reporter can be either a string, or an array of
     * `['reporterName', { <reporter options> }]` where the first element is a string
     * with the reporter name and the second element an object with reporter options.
     */
    reporters?: ReporterEntry[]
    /**
     * Determines in which interval the reporter should check if they are synchronised
     * if they report their logs asynchronously (e.g. if logs are streamed to a 3rd
     * party vendor).
     */
    reporterSyncInterval?: number
    /**
     * Determines the maximum time reporters have to finish uploading all their logs
     * until an error is being thrown by the testrunner.
     */
    reporterSyncTimeout?: number
    /**
     * Node arguments to specify when launching child processes.
     */
    execArgv?: string[]
    /**
     * A set of environment variables to be injected into the worker process.
     */
    runnerEnv?: Record<string, any>
    /**
     * Files to watch when running `wdio` with the `--watch` flag.
     */
    filesToWatch?: string[]
    /**
     * List of cucumber features with line numbers (when using [cucumber framework](https://webdriver.io/docs/frameworks.html#using-cucumber)).
     * @default []
     */
    cucumberFeaturesWithLineNumbers?: string[]
    /**
     * flags
     */
    watch?: boolean
    /**
     * Shard tests and execute only the selected shard. Specify in the one-based form like `{ total: 5, current: 2 }`.
     */
    shard?: ShardOptions
    /**
     * framework options
     */
    mochaOpts?: WebdriverIO.MochaOpts
    jasmineOpts?: WebdriverIO.JasmineOpts
    cucumberOpts?: WebdriverIO.CucumberOpts
    /**
     * TSX custom TSConfig path
     */
    tsConfigPath?: string
}

export interface TSConfigPathsOptions {
    baseUrl: string
    paths: Record<string, string[]>
    mainFields?: string[]
    addMatchAll?: boolean
}

export type Definition<T> = {
    [k in keyof T]: {
        type: 'string' | 'number' | 'object' | 'boolean' | 'function'
        default?: T[k]
        required?: boolean
        validate?: (option: T[k], keysToKeep?: (keyof T)[]) => void
        match?: RegExp
    }
}

export interface RunnerStart {
    cid: string
    specs: string[]
    config: Testrunner
    isMultiremote: boolean
    instanceOptions: Record<string, WebdriverIO>
    sessionId: string
    capabilities: WebdriverIO.Capabilities
    retry?: number
    failures?: number
    retries?: number
}

export interface RunnerEnd {
    failures: number
    cid: string
    retries: number
}
