import { Component, Vue } from 'nuxt-property-decorator'
import { DateTime } from 'luxon'

@Component
export default class FiltersMixin extends Vue {
    public monthsFilter(_start: number) {
        const _out: { value: { start: number; end: number }; text: string }[] = []

        let _pointer = DateTime.fromMillis(_start)

        const _today = DateTime.now()
        while (_pointer < _today && !_pointer.hasSame(_today, 'month')) {
            const _readableText = _pointer.toFormat('MMMM yyyy')

            _out.push({
                value: {
                    start: _pointer.startOf('month').toMillis(),
                    end: _pointer.endOf('month').toMillis(),
                },
                text: _readableText,
            })

            _pointer = _pointer.plus({ months: 1 })
        }

        _out.push({
            value: {
                start: DateTime.now().startOf('month').toMillis(),
                end: DateTime.now().endOf('month').toMillis(),
            },
            text: 'this month',
        })
        return _out.reverse()
    }
}
