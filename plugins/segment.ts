export interface Segment {
  track(event: string, properties: any): void
  reset(): void
  identify(userId?: string, traits?: any): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $segment: Segment
  }
}
