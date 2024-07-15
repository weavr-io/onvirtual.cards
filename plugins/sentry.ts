import * as Sentry from '@sentry/browser'
import { browserTracingIntegration } from '@sentry/vue'
import { Integration, IntegrationFn } from '@sentry/types'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(({ $config, app }) => {
    const { router } = app

    let integrations: (Integration | IntegrationFn)[] = []

    const BASE_INTEGRATIONS: Integration[] = [
        Sentry.browserTracingIntegration(),
        Sentry.breadcrumbsIntegration({
            dom: true,
            fetch: true,
            history: true,
            xhr: true,
        }),
        Sentry.browserProfilingIntegration(),
    ]

    const LAZY_INTEGRATIONS = ['httpClientIntegration', 'browserProfilingIntegration']

    // Lazy-load integrations
    Promise.all(
        LAZY_INTEGRATIONS.map(async (integrationName) => {
            try {
                return await Sentry.lazyLoadIntegration(integrationName as any)
            } catch (error) {
                console.warn(`Failed to load integration: ${integrationName}`, error)
            }
        }),
    ).then((loadedIntegrations) => {
        integrations = [
            ...BASE_INTEGRATIONS,
            ...loadedIntegrations.filter(
                (integration): integration is IntegrationFn => integration !== null,
            ),
        ]
    })

    integrations.push(browserTracingIntegration({ router }))

    Sentry.init({
        dsn: $config.sentry.dsn,
        integrations,
        tracesSampleRate: $config.sentry.traceSampleRate,
        profilesSampleRate: $config.sentry.profilesSampleRate,
    })
})
