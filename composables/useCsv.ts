import moment from 'moment'

export function useCsv() {
  function downloadBlobToCsv(blob) {
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'statement_' + moment().format('YYYYMMDDHHmmss') + '.csv')
    document.body.appendChild(link)
    link.click()
  }

  return { downloadBlobToCsv }
}
