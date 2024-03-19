import { Component, Vue } from 'nuxt-property-decorator'
import moment from 'moment'

@Component
export default class FiltersMixin extends Vue {
    public monthsFilter(_start: number) {
        const _out: { value: { start: number; end: number }; text: string }[] = []

        let _pointer = moment(_start)

        const _today = moment()
        while (_pointer.isBefore(_today) && !_pointer.isSame(_today, 'month')) {
            const _readableText = _pointer.format('MMMM Y')

            _out.push({
                value: {
                    start: _pointer.startOf('month').valueOf(),
                    end: _pointer.endOf('month').valueOf(),
                },
                text: _readableText,
            })

            _pointer = _pointer.add(1, 'month')
        }

        _out.push({
            value: {
                start: moment().startOf('month').valueOf(),
                end: moment().endOf('month').valueOf(),
            },
            text: 'this month',
        })

        return _out.reverse()
    }
}
