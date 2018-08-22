<template>
  <section class="vuetify-calendar-container">
    <section class="d-flex align-center justify-center pa-3">
      <div class="prev-month-icon">
        <v-btn class="ma-0" fab icon small @click="_handleClickLastMonth"><v-icon>keyboard_arrow_left</v-icon></v-btn>
      </div>
      <div class="title font-weight-bold text-sm-center">{{displayMonth}}</div>
      <div class="next-month-icon">
        <v-btn class="ma-0" fab icon small @click="_handleClickNextMonth"><v-icon>keyboard_arrow_right</v-icon></v-btn>
      </div>
    </section>
    <section class="grid">
      <div v-for="(day, index) in monthAry" :key="index"
               :class="dayClass(day, index)"
               @click="_handleClickDate(day)"
               @mousedown="_handleMouseDown(day)"
               @mouseover="_handleMouseOver(day)"
               @mouseup="_handleMouseUp(day)"
      >
        <div class="day-content-container">
          <slot name="date-header" :row="day">
            <div class="date-number no-select ml-1">{{day.date.format('DD')}}</div>
          </slot>
          <div class="date-content">
            <slot name="date" :row="day"></slot>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import _ from "underscore";
import moment from "moment";

function dayPad(v) {
  v = String(v);
  if (v.length === 1) {
    v = `0${v}`;
  }
  return v;
}

const WEEK_SIZE = 7;
// const weekAbbr = [ '일', '월', '화', '수', '목', '금', '토' ]

export default {
  data() {
    return {
      pressed: false,
      pressFrom: "",
      pressTo: ""
    };
  },
  props: {
    mode: {
      type: String,
      default: "normal"
    },
    today: {
      type: String,
      default: moment().format("YYYY-MM-DD")
    },
    currentMonth: {
      type: String,
      default() {
        return moment(this.today).format("YYYY-MM");
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    selecting: {
      type: Array,
      default() {
        return [];
      }
    },
    selected: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    dayClass(day, index) {
      return {
        "day-content": true,
        today: day.date.isSame(moment(this.today)),
        first: index % 7 === 0,
        last: index / 7 === 1,
        'first-week': index < 7,
        'last-week': index >= this.monthAry.length - 7,
        selected: this.selected.includes(day.date.format("YYYY-MM-DD")),
        selecting:
          this.mode === "selection" &&
          this.selecting.includes(day.date.format("YYYY-MM-DD")),
        unselecting:
          this.mode === "unselection" &&
          this.selecting.includes(day.date.format("YYYY-MM-DD"))
      };
    },
    _handleClickDate(day) {
      this.$emit("date-click", day);
    },
    _handleMouseDown(day) {
      if (this.mode === "selection" || this.mode === "unselection") {
        this.pressed = true;
        this.pressFrom = moment(day.date);
        this.pressTo = moment(day.date);
        this.$emit("selecting", [this.pressFrom]);
      }
    },
    _handleMouseOver(day) {
      if (
        (this.mode === "selection" || this.mode === "unselection") &&
        this.pressed
      ) {
        this.pressTo = moment(day.date);
        const from = moment(this.pressFrom);
        const to = moment(this.pressTo).add(1, "day");
        const selecting = [];
        while (from.isBefore(to)) {
          selecting.push(from.format("YYYY-MM-DD"));
          from.add(1, "day");
        }
        this.$emit("selecting", selecting);
      }
    },
    _handleMouseUp(day) {
      if (this.mode === "selection" || this.mode === "unselection") {
        this.pressed = false;
        if (day && day.date) {
          this.pressTo = moment(day.date);
        }
        const from = moment(this.pressFrom);
        const to = moment(this.pressTo).add(1, "day");
        const selecting = [];
        while (from.isBefore(to)) {
          selecting.push(from.format("YYYY-MM-DD"));
          from.add(1, "day");
        }
        this.$emit("selecting", selecting);
        this.$emit("selected", selecting);
      }
    },
    _handleClickLastMonth() {
      this.$emit("click-last-month", this.lastMonth);
    },
    _handleClickNextMonth() {
      this.$emit("click-next-month", this.nextMonth);
    }
  },
  computed: {
    displayMonth() {
      return moment(this.currentMonth).format("YYYY년 MM월");
    },
    lastMonth() {
      return moment(this.currentMonth)
        .add(-1, "month")
        .format("YYYY-MM");
    },
    nextMonth() {
      return moment(this.currentMonth)
        .add(1, "month")
        .format("YYYY-MM");
    },
    monthAry() {
      const currentMonth = this.currentMonth;
      const lastMonth = this.lastMonth;
      const nextMonth = this.nextMonth;
      const firstDayOfWeek = +moment(currentMonth).format("e");
      const lastDayOfWeek = +moment(nextMonth)
        .add(-1, "day")
        .format("e");

      const lastMonthSize = +moment(currentMonth)
        .add(-1, "day")
        .format("DD");
      const currentMonthSize = +moment(nextMonth)
        .add(-1, "day")
        .format("DD");

      const firstPad = _.range(
        lastMonthSize - firstDayOfWeek + 1,
        lastMonthSize + 1
      );
      const lastPad = _.range(1, WEEK_SIZE - lastDayOfWeek);

      const lastMonthAry = firstPad.map(v => ({
        monthPosition: "last",
        date: moment(`${lastMonth}-${dayPad(v)}`)
      }));
      const currentMonthAry = _.range(1, currentMonthSize + 1).map(v => ({
        monthPosition: "current",
        date: moment(`${currentMonth}-${dayPad(v)}`)
      }));
      const nextMonthAry = lastPad.map(v => ({
        monthPosition: "next",
        date: moment(`${nextMonth}-${dayPad(v)}`)
      }));
      return lastMonthAry.concat(currentMonthAry).concat(nextMonthAry);
    }
  }
};
</script>

<style scoped>
.vuetify-calendar-container {
  background-color: #fff;
}
.next-month-icon {
  text-align: right;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  grid-gap: 0;
}

.grid::before {
  content: "";
  width: 0;
  padding-bottom: 100%;
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.grid > *:first-child {
  grid-row: 1 / 1;
  grid-column: 1 / 1;
}

.day-content-container {
  height: 100%;
  display: flex;
  flex-flow: column;
}
.day-content-container > .date-header {
  flex: 0 0 21px;
}

.day-content-container > .date-content {
  flex: 1 1 0;
}

.date-content {
  position: relative;
  height: 100%;
}

.day-content {
  border-right: 1px #E0E0E0 solid;
  border-bottom: 1px #E0E0E0 solid;
}
.day-content.first {
  border-left: 1px #E0E0E0 solid;
}
.day-content.first-week {
  border-top: 1px #E0E0E0 solid;
}
.day-content.today {
  background-color: #FCF7DF;
}
.day-content.selected {
  background-color: #b6d6e5;
}
.day-content.selecting {
  background-color: #F4F3F4;
}
.day-content.unselecting {
  background-color: #FFF;
}
.no-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  }  
</style>
