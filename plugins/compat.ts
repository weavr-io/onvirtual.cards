const SUPPRESSED_WARNINGS = [
    'ATTR_FALSE_VALUE',
    'GLOBAL_MOUNT',
    'GLOBAL_EXTEND',
    'GLOBAL_PROTOTYPE',
    'OPTIONS_BEFORE_DESTROY',
    'OPTIONS_DATA_MERGE',
    'COMPONENT_FUNCTIONAL',
    'COMPONENT_V_MODEL',
    'INSTANCE_LISTENERS',
    'INSTANCE_SCOPED_SLOTS',
    'INSTANCE_ATTRS_CLASS_STYLE',
    'INSTANCE_EVENT_EMITTER',
    'RENDER_FUNCTION',
    'WATCH_ARRAY',
]

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:created', () => {
        nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
            for (const warning of SUPPRESSED_WARNINGS) {
                if (msg.includes(warning)) return
            }
            console.warn(msg, instance, trace)
        }
    })
})
