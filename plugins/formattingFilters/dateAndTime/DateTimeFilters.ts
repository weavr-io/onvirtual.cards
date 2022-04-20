import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment'

Vue.use(VueMoment, { moment })

export class DateTimeFilters {
  formatMilliToDateTime(value) {
    if (value === null) {
      // since null == undefined
      return '-'
    }

    const _m = moment(parseInt(value))
    return _m.format('YYYY-MM-DD HH:mm')
  }

  formatMilliToDate(value) {
    if (value === null) {
      // since null == undefined
      return '-'
    }

    const _m = moment(parseInt(value))
    return _m.format('YYYY-MM-DD')
  }

  formatToDate(value) {
    if (value === null) {
      // since null == undefined
      return '-'
    }
    try {
      const _m = moment()
      _m.set({ year: value.year, month: value.month - 1, date: value.day })

      return _m.format('YYYY-MM-DD')
    } catch (e) {}
  }
}
