import { useNuxtApp } from 'nuxt/app'
import type { FetchOptions } from 'ofetch'

type RequestBody = BodyInit | Record<string, any> | null | undefined

export interface ApiResponse<T> {
    data: T
}

export type ApiFetchFunction = <T>(url: string, options?: FetchOptions) => Promise<ApiResponse<T>>

function call<T>(url: string, options: FetchOptions = {}) {
    return useNuxtApp().$apiFetch<T>(url, options)
}

export const apiFetch = {
    get<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return call<T>(url, { ...options, method: 'GET' })
    },
    post<T>(url: string, body?: RequestBody, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return call<T>(url, { ...options, method: 'POST', body })
    },
    put<T>(url: string, body?: RequestBody, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return call<T>(url, { ...options, method: 'PUT', body })
    },
    patch<T>(url: string, body?: RequestBody, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return call<T>(url, { ...options, method: 'PATCH', body })
    },
    delete<T>(url: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
        return call<T>(url, { ...options, method: 'DELETE' })
    },
}
