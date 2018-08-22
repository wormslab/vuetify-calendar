<template>
    <section>
        <v-btn @click="() => mode = mode === 'selection' ? 'normal' : 'selection'"></v-btn>
        <vuetify-calendar :mode="mode"
                        :today="today"
                        :current-month="currentMonth"
                        :selecting="selecting"
                        :selected="selected"
                        @selecting="_handleSelectingDate"
                        @selected="_handleSelectedDate"
                        @click-last-month="_handleClickLastMonth"
                        @click-next-month="_handleClickNextMonth"
        />
    </section>
</template>

<script>
    import moment from 'moment'
    import _ from 'underscore'
    export default {
        data () {
            return {
                mode: 'selection',
                today: moment().format('YYYY-MM-DD'),
                currentMonth: moment().format('YYYY-MM'),
                selecting: [],
                selected: [],

            }
        },
        methods: {
            _handleSelectingDate (period) {
                console.log(period)
                if (this.selected.includes(period[0])) {
                    this.mode = 'unselection'
                } else {
                this.mode = 'selection'
                }
                this.selecting = period
            },
            _handleSelectedDate (period) {
                if (this.mode === 'selection') {
                this.selected = _.uniq(this.selected.concat(period))
                } else if (this.mode === 'unselection') {
                this.selected = _.difference(this.selected, period)
                this.mode = 'selection'
                }
                this.selecting = []
            },
            _handleModeChange (mode) {
                this.mode = mode
                if (mode === 'normal') {
                this.selected = []
                this.selecting = []
                this.batchUpdate = false
                }
            },
            _handleClickLastMonth (month) {
                this.currentMonth = month
            },
            _handleClickNextMonth (month) {
                this.currentMonth = month
            }
        }
    }
</script>