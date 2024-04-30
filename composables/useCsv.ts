import { DateTime } from 'luxon'

export const useCsv = () => {
    function downloadBlobToCsv(blob) {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute(
            'download',
            'statement_' + DateTime.now().toFormat('yyyyMMddHHmmss') + '.csv',
        )
        document.body.appendChild(link)
        link.click()
    }

    return { downloadBlobToCsv }
}
