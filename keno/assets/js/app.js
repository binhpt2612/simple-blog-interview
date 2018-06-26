"use strict";
var UserBox = {
    template:
    '\n    <div class="userbox">\n\n      <div :class="[\'announcements-list\', list ? \'active\' : \'\']">\n        <div>\n          <a @click="hideList"><svg class="icon-close"><use xlink:href="#icon-close"></use></svg></a>\n          <h1>{{ $root.locale[\'ANNOUNCEMENT\'] }}</h1>\n          <ul>\n            <li v-for="message in announcements">\n                {{ message.detail }}\n            </li>\n          </ul>\n        </div>\n      </div>      \n\n      <div class="marquee" @click="showList">\n        <div id="marquee" :class="list ? \'\' : \'active\'">\n          <span v-for="message in announcements">\n              <i>{{ message.sort }}</i>\n              {{ message.detail }}\n          </span>\n        </div>\n        <div id="marquee-mobile">\n          <label>{{ $root.locale[\'ANNOUNCEMENT\'] }}:</label>\n          <span>{{ announcements.length }}</span>\n        </div>\n      </div>\n\n      <div class="user-data">\n\n        <label>{{ $root.locale[\'ACCOUNT\'] }}:</label> <span>{{ user.username }}</span>\n        &nbsp;\n        <label class="hide-for-small">{{ $root.locale[\'AVAILABLE_FUND\'] }}:</label>\n        <span :class="[\'fund\', $root.user.checking ? \'spinning\' : \'\']" @click="$root.checkBalance">\n          {{ user.curr }} {{ balance }}\n        </span>\n\n      </div>\n\n    </div>\n  ',
    props: ["user", "announcements"],
    watch: {},
    computed: {
        balance: function balance() {
            return display_numeric(this.user.balance, 0, !0);
        }
    },
    data: function data() {
        return { list: !1 };
    },
    methods: {
        showList: function showList() {
            this.list = !0;
        },
        hideList: function hideList() {
            this.list = !1;
        }
    },
    created: function created() { }
},
NumberInput = {
    template:
    '\n    <span :class="[id, \'number-input\']">\n      <a @click="reset"><svg class="icon-close"><use xlink:href="#icon-close"></use></svg></a>\n      <input type="text" v-model="intValue" :id="id" :placeholder="placeholder" autocomplete="off" tabindex="1" @keydown="isNumber">\n    </span>\n  ',
    props: ["value", "placeholder", "id"],
    watch: {
        value: function value(a) {
            this.intValue = display_numeric(a);
        },
        intValue: function intValue(a) {
            (this.intValue = display_numeric(a)), this.$emit("input", numeric(a));
        }
    },
    data: function data() {
        return { intValue: "" };
    },
    methods: {
        isNumber: function isNumber(a) {
            a = a ? a : window.event;
            var b = a.which ? a.which : a.keyCode;
            return 31 < b && (48 > b || 57 < b) && (96 > b || 105 < b) && 46 !== b
                ? void a.preventDefault()
                : !0;
        },
        reset: function reset() {
            (this.intValue = ""), this.$emit("input", ""), this.$emit("reset");
        }
    },
    created: function created() {
        this.intValue = this.value;
    }
},
Roadmap = {
    template:
    '\n    <div>\n\n      <div class="roadmap-types grid-x small-up-6">\n        <div class="cell" v-for="type in roadmap_types">\n          <span :title="$root.locale[$root.locale_code[\'tt_stat_\'+type]]" :class="roadmap_type == type ? \'selected\' : \'\'" @click="setType(type)">{{ $root.locale[$root.locale_code[\'stat_\'+type]] }}</span>\n        </div>\n      </div>\n\n      <div class="loading" v-if="!product.result.length">\n\n        <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ripple">\n          <circle cx="50" cy="50" r="27.8478" fill="none" stroke="#000" stroke-width="5">\n            <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n          </circle>\n          <circle cx="50" cy="50" r="5.18325" fill="none" stroke="#000" stroke-width="5">\n            <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n            <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n          </circle>\n        </svg>\n\n      </div>\n\n      <div v-if="product.stat" class="stats">\n        <span v-for="stat in stats[roadmap_type]">\n          {{ $root.locale[stat.type] }}\n          <span>{{ stat.percent }}%</span>\n        </span>\n      </div>\n\n      <div class="grid-roadmap">\n\n        <div class="rol" v-for="rol in processedResult[roadmap_type]">\n        \n          <span :class="draw.type" v-for="draw in rol">\n            \n            <span v-if="openPopperID != draw.drawID" @click="openPopper(draw.drawID)" :class="[\'type\', draw.type]" :title="$root.locale[\'DRAW_NO\'] + \' \' + draw.ssr.drawID + \'\\n\' + draw.ssr.resultTime + \'\\nSum: \' + draw.ssr.sum">\n              <template v-if="roadmap_type == \'kixbs\'">{{ draw.value }}</template>\n              <template v-else>{{ $root.locale[draw.type] }}</template>\n            </span>\n\n            <popper v-if="openPopperID == draw.drawID" :ref="\'popper\'+roadmap_type+draw.drawID" trigger="click" :options="popper_options" :boundaries-selector="\'#gmbox-\'+product.productID" force-show="true" @documentClick="closePopper(draw.drawID)" @hide="popperHide(draw.drawID)">\n\n              <div class="popper ssr">\n\n                <a class="close" @click="closePopper(draw.drawID)"><svg class="icon-close"><use xlink:href="#icon-close"></use></svg></a>\n\n                <b>{{ $root.locale[\'PRODUCT_\'+product.productID] }}</b><br>\n                {{ $root.locale[\'DRAW_NO\'] }} {{ draw.ssr.drawID }}<br>\n                {{ draw.ssr.resultTime }}\n\n\n                <span class="sum">{{ draw.ssr.sum }}</span>\n                <div class="numbers">\n                  <span v-for="number in draw.ssr.result" :class=" isUpNumber(number) ? \'up\' : \'down\'  ">\n                    {{ number }}\n                  </span>\n                </div>\n\n                <div class="winners">\n                  <template v-for="(winner, index) in draw.ssr.winners">\n                    <span>\n                      {{ $root.locale[$root.locale_code[winner]] }}\n                    </span>\n                    <span v-if="index == 1">\n                      {{ $root.locale[$root.locale_code[draw.ssr.kixbs]] }}\n                      {{ Math.abs(draw.ssr.kix) }}\n                    </span>\n                  </template>\n                </div>\n\n              </div>\n\n              <span @click="closePopper(draw.drawID)" :class="[\'type\', draw.type]" slot="reference" :title="$root.locale[\'DRAW_NO\'] + \' \' + draw.ssr.drawID + \'\\n\' + draw.ssr.resultTime + \'\\nSum: \' + draw.ssr.sum">\n                <template v-if="roadmap_type == \'kixbs\'">{{ draw.value }}</template>\n                <template v-else>{{ $root.locale[draw.type] }}</template>\n              </span>\n\n            </popper>\n\n          </span>\n\n        </div>\n\n      </div>\n\n    </div>\n  ',
    props: ["product", "roadmap_type"],
    components: { popper: VuePopper },
    data: function data() {
        return {
            roadmap_types: ["kbs", "koe", "kixbs", "kdt", "kud", "kfe"],
            popper_options: {
                placement: "bottom",
                hide: !0,
                modifiers: {
                    flip: { behavior: ["bottom", "top"] },
                    preventOverflow: { priority: ["left", "right"] }
                },
                removeOnDestroy: !0
            },
            openPopperID: ""
        };
    },
    watch: {},
    computed: {
        processedResult: function processedResult() {
            return roadmapResult(this.product);
        },
        stats: function stats() {
            var a = this.product.stat,
                b = {
                    kbs: [
                        { type: "bs_b", percent: a.stat_kbs_b },
                        { type: "bs_s", percent: a.stat_kbs_s }
                    ],
                    koe: [
                        { type: "oe_o", percent: a.stat_koe_o },
                        { type: "oe_e", percent: a.stat_koe_e }
                    ],
                    kixbs: [
                        { type: "ixbs_b", percent: a.stat_kix_b },
                        { type: "ixbs_d", percent: a.stat_kix_tie },
                        { type: "ixbs_s", percent: a.stat_kix_s }
                    ],
                    kfe: [
                        { type: "fe_g", percent: a.stat_kfe_g },
                        { type: "fe_wd", percent: a.stat_kfe_wd },
                        { type: "fe_wt", percent: a.stat_kfe_wt },
                        { type: "fe_f", percent: a.stat_kfe_f },
                        { type: "fe_ea", percent: a.stat_kfe_e }
                    ],
                    kdt: [
                        { type: "dt_dr", percent: a.stat_kdt_dr },
                        { type: "dt_dt", percent: a.stat_kdt_dt },
                        { type: "dt_ti", percent: a.stat_kdt_ti }
                    ],
                    kud: [
                        { type: "ud_u", percent: a.stat_kud_u },
                        { type: "ud_t", percent: a.stat_kud_tie },
                        { type: "ud_d", percent: a.stat_kud_d }
                    ]
                };
            return b;
        }
    },
    methods: {
        isUpNumber: function isUpNumber(a) {
            return ("mini-keno" == this.product.type && 20 < a) || !!(40 < a);
        },
        setType: function setType(a) {
            this.$emit("change", a);
        },
        openPopper: function openPopper(a) {
            this.openPopperID = a;
        },
        closePopper: function closePopper(a) {
            this.$refs["popper" + this.roadmap_type + a][0].doClose();
        },
        popperHide: function popperHide(a) {
            this.$refs["popper" + this.roadmap_type + a][0].doDestroy(),
                this.openPopperID == a && (this.openPopperID = "");
        }
    },
    mounted: function mounted() { },
    beforeDestroy: function beforeDestroy() {
        var a = this.$refs["popper" + this.roadmap_type + this.openPopperID][0];
        a && (a.doClose(), a.doDestroy());
    }
},
OddBox = {
    template:
    '\n    <div class="cell oddbox">\n\n      <a v-if="!openPopperFlag" @click="openPopper" :title="tooltip" :class="[\'odd\', product.previousResult[type] ? \'winner\' : \'\']">\n        <span class="odd">{{ odd }}</span>\n        <span :class="[\'stake\', has_stake ? \'active\' : \'\']">{{ has_stake }}</span>\n        {{ $root.locale[$root.locale_code[type]] }}\n      </a>\n\n      <popper v-if="openPopperFlag" ref="popper" trigger="click" :options="popper_options" :boundaries-selector="\'#gmbox-\'+product.productID" @show="beforePlaceBet" force-show="true" @documentClick="closePopper" @hide="popperHide">\n\n        <div class="popper">\n\n          <div class="popper-header">\n\n            <span class="counter">{{ $parent.displayCountDown }} <svg class="icon-clock"><use xlink:href="#icon-clock"></use></svg></span>\n\n            <b>{{ $root.locale[\'PRODUCT_\'+product.productID] }}</b><br>\n            {{ $root.locale[\'DRAW_NO\'] }} {{ product.drawID }}\n\n          </div>\n\n          <form @submit.prevent="placeBet">\n\n            <b>{{ $root.locale[$root.locale_code[type]] }}</b> @ <span class="bet-odds">{{ odd }}</span>\n\n            <div v-if="betting">\n              \n              <div class="result" v-if="placedResult">\n  \n                <span class="success" v-if="placedResult.errorCode==\'PLACE_SUCCESS\'">{{ $root.locale[placedResult.errorCode] }}</span>\n                <template v-else>\n                  <span class="failed">{{ $root.locale[placedResult.errorCode] }} [{{ placedResult.error }}]</span>\n                  <span class="hints" v-html="$root.locale[placedResult.hints]"></span>\n                </template>\n\n              </div>\n\n              <div class="loading" v-else>\n\n                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ripple">\n                  <circle cx="50" cy="50" r="27.8478" fill="none" stroke="#000" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                  </circle>\n                  <circle cx="50" cy="50" r="5.18325" fill="none" stroke="#000" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                  </circle>\n                </svg>\n\n              </div>\n\n            </div>\n\n\n            <div v-else>\n\n              <div>\n\n                <template v-if="typeID == 13">\n\n                  <div class="inputs index-game">\n                    <div class="title">\n                      <span class="range">{{ $root.locale[\'ixRange\'] }}</span>\n                      <span class="point">{{ $root.locale[\'ixBets\'] }}</span>\n                    </div>\n                    <number_input v-model="range" @reset="reset" :id="\'input-range-\'+product.drawID+\'-\'+detailID"></number_input>\n                    <number_input v-model="point" @reset="reset" :id="\'input-point-\'+product.drawID+\'-\'+detailID"></number_input>\n                    <button class="bet" type="submit">{{ $root.locale[\'BET\'] }}</button>\n                    <div class="remarks">{{ product.index_range.min + \' ~ \' + product.index_range.max }}</div>\n                  </div>\n\n                  <div class="quickbet grid-x small-up-4">\n                    \n                    <div class="cell" v-for="point in [10, 25, 50, 100, 250, 500, 1000]">\n                      <a @click="addPoint(point)">+{{ point }}</a>\n                    </div>\n\n                    <div class="cell">\n                      <a @click="setPoint(rules.maxbet)" class="max">Max</a>\n                    </div>\n\n                  </div>\n\n                </template>\n\n                <template v-else>\n\n                  <div class="inputs">\n                    <number_input v-model="stake" @reset="reset" :id="\'input-stake-\'+product.drawID+\'-\'+detailID"></number_input>\n                    <button class="bet" type="submit">{{ $root.locale[\'BET\'] }}</button>\n                  </div>\n\n                  <div class="quickbet grid-x small-up-4">\n                    \n                    <div class="cell" v-for="stake in [10, 25, 50, 100, 250, 500, 1000]">\n                      <a @click="addStake(stake)">+{{ stake }}</a>\n                    </div>\n\n                    <div class="cell">\n                      <a @click="setStake(rules.maxbet)" class="max">Max</a>\n                    </div>\n\n                  </div>\n\n                </template>\n\n              </div>\n\n              <div v-if="rules" class="summary">\n\n                <div class="error" v-if="error">\n                  {{ $root.locale[error] }}\n                </div>\n\n                <template v-if="typeID!=13">\n                  {{ $root.locale[\'PAYOUT\'] }}: <span class="summary_value">{{ payout }}</span><br>\n                </template>\n\n                <template v-else>\n                  {{ $root.locale[\'PREWIN\'] }}: <span class="summary_value">{{ prewin }}</span><br>\n                  {{ $root.locale[\'DEPOSIT\'] }}: <span class="summary_value">{{ deposit }}</span><br>\n                </template>\n\n                {{ $root.locale[\'MIN_TO\'] }}: <span class="summary_value">{{ minbet }}</span><br>\n                {{ $root.locale[\'MAX_TO\'] }}: <span class="summary_value">{{ maxbet }}</span><br>\n\n              </div>\n\n              <div class="loading" v-else>\n\n                <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ripple">\n                  <circle cx="50" cy="50" r="27.8478" fill="none" stroke="#000" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                  </circle>\n                  <circle cx="50" cy="50" r="5.18325" fill="none" stroke="#000" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                  </circle>\n                </svg>\n\n              </div>\n\n            </div>\n\n            <button v-if="placedResult" ref="ok_button" type="reset" @click="closePopper" class="ok-button">OK</button>\n            <button v-else-if="!betting" ref="cancel_button" type="reset" @click="closePopper" class="cancel-button">{{ $root.locale[\'CANCEL\'] }}</button>\n\n          </form>\n\n        </div>\n\n        <a @click="closePopper" :title="tooltip" :class="[\'odd\', product.previousResult[type] ? \'winner\' : \'\']" slot="reference">\n          <span class="odd">{{ odd }}</span>\n          <span :class="[\'stake\', has_stake ? \'active\' : \'\']">{{ has_stake }}</span>\n          {{ $root.locale[$root.locale_code[type]] }}\n        </a>\n\n      </popper>\n\n    </div>\n  ',
    props: ["product", "type", "tooltip"],
    components: { popper: VuePopper, number_input: NumberInput },
    data: function data() {
        return {
            stake: "",
            point: "",
            range: "",
            rules: null,
            betting: !1,
            error: null,
            placedResult: null,
            closePopperTimer: null,
            errorTimer: null,
            recomputed: 0,
            popper_options: {
                placement: "bottom",
                hide: !0,
                modifiers: {
                    flip: { behavior: ["bottom", "top"] },
                    preventOverflow: { priority: ["left", "right"] }
                },
                removeOnDestroy: !0
            },
            openPopperFlag: !1
        };
    },
    watch: {
        "product.drawID": function productDrawID() {
            this.$refs.popper && this.$refs.popper.doClose();
        },
        "product.status": function productStatus() {
            "start-betting" != this.product.status &&
                !this.betting &&
                this.$refs.popper &&
                this.$refs.popper.doClose();
        },
        stake: function stake() {
            this.preCheckStake();
        },
        point: function point() {
            this.preCheckPoint();
        },
        range: function range() {
            this.preCheckRange();
        },
        error: function error() {
            this.updatePopper();
        }
    },
    computed: {
        has_stake: function has_stake() {
            var a = this.product.betList
                ? this.product.betList + this.recomputed
                : 0 + this.recomputed,
                b = checkStakeRecord(
                    this.product.productID,
                    this.product.gID,
                    this.type
                );
            return display_numeric(b);
        },
        finalStake: function finalStake() {
            return 13 == this.typeID ? this.point * this.range : this.stake;
        },
        checkStake: function checkStake() {
            return 13 == this.typeID ? this.point : this.stake;
        },
        odd: function odd() {
            if (this.product.odds) return this.product.odds[this.type];
        },
        resetError: function resetError() {
            (this.error = null), clearTimeout(this.errorTimer);
        },
        typeID: function typeID() {
            return getGameTypeId(this.type);
        },
        detailID: function detailID() {
            return getGameTypeDetailId(this.type);
        },
        minbet: function minbet() {
            return display_numeric(this.rules.minbet, 0, !0);
        },
        maxbet: function maxbet() {
            return display_numeric(this.rules.maxbet, 0, !0);
        },
        payout: function payout() {
            return display_numeric(this.stake * this.odd, 2);
        },
        prewin: function prewin() {
            return display_numeric(this.point * this.range * this.odd, 2);
        },
        deposit: function deposit() {
            return display_numeric(this.point * this.range);
        }
    },
    methods: {
        addPoint: function addPoint(a) {
            (this.point = parseInt(this.point ? this.point : 0) + parseInt(a)),
                this.focusPoint();
        },
        setPoint: function setPoint(a) {
            (this.point = a), this.focusPoint();
        },
        addStake: function addStake(a) {
            (this.stake = parseInt(this.stake ? this.stake : 0) + parseInt(a)),
                this.focusStake();
        },
        setStake: function setStake(a) {
            (this.stake = a), this.focusStake();
        },
        setRange: function setRange(a) {
            (this.range = a), this.focusRange();
        },
        preCheckRange: function preCheckRange() {
            var b = this;
            this.range > this.product.index_range.max &&
                ((this.error = "ERROR_RANGE"),
                    setTimeout(function () {
                        b.setRange(b.product.index_range.max);
                    }, 20),
                    (this.errorTimer = setTimeout(function () {
                        b.error = null;
                    }, 3e3)));
        },
        preCheckPoint: function preCheckPoint() {
            var b = this;
            this.rules &&
                this.point > this.rules.maxbet &&
                ((this.error = "ERROR_MAX_TO"),
                    setTimeout(function () {
                        b.setPoint(b.rules.maxbet);
                    }, 20),
                    (this.errorTimer = setTimeout(function () {
                        b.error = null;
                    }, 3e3)));
        },
        preCheckStake: function preCheckStake() {
            var b = this;
            this.rules &&
                this.stake > this.rules.maxbet &&
                ((this.error = "ERROR_MAX_TO"),
                    setTimeout(function () {
                        b.setStake(b.rules.maxbet);
                    }, 20),
                    (this.errorTimer = setTimeout(function () {
                        b.error = null;
                    }, 3e3)));
        },
        checkError: function checkError() {
            var c = this;
            this.error = null;
            var a = !1,
                b = 3e3;
            return (
                clearTimeout(this.errorTimer),
                13 == this.typeID && this.range < this.product.index_range.min
                    ? ((this.error = "ERROR_RANGE"),
                        this.setRange(this.product.index_range.min),
                        (this.errorTimer = setTimeout(function () {
                            c.error = null;
                        }, b)),
                        (a = !0))
                    : 13 == this.typeID && this.range > this.product.index_range.max
                        ? ((this.error = "ERROR_RANGE"),
                            this.setRange(this.product.index_range.max),
                            (this.errorTimer = setTimeout(function () {
                                c.error = null;
                            }, b)),
                            (a = !0))
                        : 13 != this.typeID || this.finalStake
                            ? this.finalStake
                                ? 13 == this.typeID && this.checkStake < this.rules.minbet
                                    ? ((this.error = "ERROR_MIN_TO"),
                                        this.setPoint(this.rules.minbet),
                                        (this.errorTimer = setTimeout(function () {
                                            c.error = null;
                                        }, b)),
                                        (a = !0))
                                    : 13 == this.typeID && this.checkStake > this.rules.maxbet
                                        ? ((this.error = "ERROR_MAX_TO"),
                                            this.setPoint(this.rules.maxbet),
                                            (this.errorTimer = setTimeout(function () {
                                                c.error = null;
                                            }, b)),
                                            (a = !0))
                                        : this.checkStake < this.rules.minbet
                                            ? ((this.error = "ERROR_MIN_TO"),
                                                this.setStake(this.rules.minbet),
                                                (this.errorTimer = setTimeout(function () {
                                                    c.error = null;
                                                }, b)),
                                                (a = !0))
                                            : this.checkStake > this.rules.maxbet
                                                ? ((this.error = "ERROR_MAX_TO"),
                                                    this.setStake(this.rules.maxbet),
                                                    (this.errorTimer = setTimeout(function () {
                                                        c.error = null;
                                                    }, b)),
                                                    (a = !0))
                                                : this.finalStake > this.rules.balance &&
                                                ((this.error = "ERROR_XAMOUNT"),
                                                    (this.errorTimer = setTimeout(function () {
                                                        c.error = null;
                                                    }, b)),
                                                    (a = !0))
                                : ((this.error = "ERROR_TO"),
                                    this.setStake(this.rules.minbet),
                                    (this.errorTimer = setTimeout(function () {
                                        c.error = null;
                                    }, b)),
                                    (a = !0))
                            : ((this.error = "ERROR_TO"),
                                this.setPoint(this.rules.minbet),
                                (this.errorTimer = setTimeout(function () {
                                    c.error = null;
                                }, b)),
                                (a = !0)),
                a
            );
        },
        placeBet: function placeBet() {
            var g = this;
            if (this.rules && !1 == this.checkError()) {
                console.log('123123');
                (this.betting = !0), (this.placedResult = null);
                var a = new FormData();
                a.append("productID", this.product.productID),
                    a.append("gID", this.product.gID),
                    a.append("drawID", this.product.drawID),
                    a.append("resultTime", this.product.resultTime),
                    a.append("gameTypeID", this.typeID),
                    a.append("gameTypeDetailID", this.detailID),
                    a.append("odds", this.odd),
                    a.append("stake", parseFloat(this.finalStake)),
                    13 == this.typeID
                        ? (a.append("IndexPoint", parseFloat(this.point)),
                            a.append("IndexRange", parseFloat(this.range)))
                        : (a.append("IndexPoint", ""), a.append("IndexRange", ""));
                var b = this.product.productID,
                    c = this.product.gID,
                    d = this.type,
                    f = 13 == this.typeID ? this.point : this.stake;
                console.log(a);
                axios
                    .post(placeBetUrl, a)
                    .then(function (h) {
                        var j = h.data;
                        if (((g.placedResult = j), 0 == j.error))
                            g.$root.setBalance(g.placedResult.data.balance),
                                (g.placedResult.errorCode = "PLACE_SUCCESS"),
                                setStakeRecord(b, c, d, f),
                                setTimeout(function () {
                                    g.recomputed++;
                                }, 250);
                        else
                            switch (parseInt(j.error)) {
                                case 205:
                                    g.placedResult.errorCode = "ERROR_MAX_DR";
                                    break;
                                case 206:
                                    g.placedResult.errorCode = "ERROR_206";
                                    break;
                                case 211:
                                    g.placedResult.errorCode = "ERROR_GAME_UA";
                                    break;
                                case 300:
                                    g.placedResult.errorCode = "ERROR_MAX_DR";
                                    break;
                                case 1013:
                                    (g.placedResult.errorCode = "ERROR_MAX_KIX"),
                                        (g.placedResult.hints = "HINTS_MAX_KIX");
                                    break;
                                default:
                                    g.placedResult.errorCode = "PLACE_FAIL";
                            }
                        g.betting &&
                            g.$refs.popper &&
                            g.$refs.popper.showPopper &&
                            (setTimeout(function () {
                                g.$refs.ok_button.focus();
                            }, 25),
                                (g.closePopperTimer = setTimeout(function () {
                                    g.closePopper();
                                }, 5e3)),
                                g.updatePopper());
                    })
                    .catch(function () { }),
                    this.updatePopper();
            }
        },
        beforePlaceBet: function beforePlaceBet() {
            var a = this;
            (this.rules = null),
                (this.betting = !1),
                (this.placedResult = null),
                this.reset(),
                clearTimeout(this.closePopperTimer),
                clearTimeout(this.errorTimer),
                axios
                    .get(
                    apiCall(
                        beforeBetUrl +
                        "&gtDetailID=" +
                        this.detailID +
                        "&productID=" +
                        this.product.productID
                    )
                    )
                    .then(function (b) {
                        var c = b.data;
                        0 == c.error
                            ? ((a.rules = c.data), a.updatePopper())
                            : a.$root.forceLogout(1, c.error);
                    })
                    .catch(function () { }),
                setTimeout(function () {
                    13 == a.typeID ? a.focusRange() : a.focusStake();
                }, 25);
        },
        reset: function reset() {
            (this.stake = ""),
                (this.point = ""),
                (this.range = ""),
                (this.error = null);
        },
        openPopper: function openPopper() {
            "start-betting" == this.product.status &&
                this.odd &&
                0 != this.odd &&
                (this.openPopperFlag = !0);
        },
        closePopper: function closePopper() {
            this.$refs.popper.doClose();
        },
        updatePopper: function updatePopper() {
            this.$nextTick(function () {
                this.$refs.popper && this.$refs.popper.updatePopper();
            });
        },
        popperHide: function popperHide() {
            this.$refs.popper.doDestroy(),
                (this.openPopperFlag = !1),
                this.reset(),
                clearTimeout(this.closePopperTimer),
                clearTimeout(this.errorTimer);
        },
        focusStake: function focusStake() {
            document
                .getElementById(
                "input-stake-" + this.product.drawID + "-" + this.detailID
                )
                .focus();
        },
        focusRange: function focusRange() {
            document
                .getElementById(
                "input-range-" + this.product.drawID + "-" + this.detailID
                )
                .focus();
        },
        focusPoint: function focusPoint() {
            document
                .getElementById(
                "input-point-" + this.product.drawID + "-" + this.detailID
                )
                .focus();
        }
    },
    mounted: function mounted() { },
    beforeDestroy: function beforeDestroy() {
        this.$refs.popper &&
            (this.$refs.popper.doClose(), this.$refs.popper.doDestroy()),
            clearTimeout(this.closePopperTimer),
            clearTimeout(this.errorTimer);
    }
},
GameBox = {
    template:
    '\n    <div :id="\'gmbox-\'+product.productID" :class="[\'cell\', \'medium-6\', \'large-4\', product.enabled && showGame ? \'active\' : \'\']">\n\n      <div :class="[\'product\', product.status, $root.options.gameMode]">\n        \n        <div class="product-header">\n\n          \n          <div class="product-name">\n            <span class="avatar" @click.stop="" :style="\'background-image: url(\\\'assets/avatar/product-\'+product.productID+\'.jpg\\\')\'"></span>\n            <span class="name">{{ $root.locale[\'PRODUCT_\'+product.productID] }}</span> <a @click.stop="" :href="product.url" target="_blank" :title="$root.locale[\'OFFICIAL\']"><svg class="icon-link"><use xlink:href="#icon-link"></use></svg></a><br>\n            <template v-if="product.status==\'closed\'">{{ $root.locale[\'MARCLOSED\'] }}</template>\n            <template v-else>{{ $root.locale[\'DRAW_NO\'] }} {{ flippingDrawID }}</template>\n          </div>\n\n          <span :class="\'product-status \'+product.status">\n\n            <div :class="[\'counter \'+product.status, showCounter ? \'active\' : \'\']">\n              <span class="status-text">{{ $root.locale[$root.locale_code[product.status]] }}</span>\n              <template v-if="product.status!=\'waiting-result\'">{{ displayCountDown }} <svg class="icon-clock"><use xlink:href="#icon-clock"></use></svg></template>\n              <template v-else>\n                <svg class="loading lds-ripple" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">\n                  <circle cx="50" cy="50" r="27.8478" fill="none" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="-0.65s" repeatCount="indefinite"></animate>\n                  </circle>\n                  <circle cx="50" cy="50" r="5.18325" fill="none" stroke-width="5">\n                    <animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1.3" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                    <animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1.3" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite"></animate>\n                  </circle>\n                </svg>\n              </template>\n            </div>\n\n\n            <div :class="[\'flipping-numbers\', product.drawResult && product.status==\'open-result\' ? \'active\' : \'\']">\n\n              <span :class="[\'number\', number ? \'active\' : \'\']" v-for="number in flippingResult">\n                <span>{{ number }}</span>\n              </span>\n\n              <span class="sum">{{ product.previousResult.sum }}</span>\n\n            </div>\n\n\n            <div :class="[\'thumbnail\', product.status==\'open-result\' ? \'active\' : \'\']">\n              <div class="grid-x small-up-2">\n                <div :class="[\'cell\', product.previousResult.kb ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.ks ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-2">\n                <div :class="[\'cell\', product.previousResult.ko ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.ke ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-2">\n                <div :class="[\'cell\', product.previousResult.kixb ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kixs ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-3">\n                <div :class="[\'cell\', product.previousResult.kdr ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kdt ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kti ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-3">\n                <div :class="[\'cell\', product.previousResult.ku ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kt ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kd ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-4">\n                <div :class="[\'cell\', product.previousResult.kbo ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kso ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kbe ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kse ? \'winner\' : \'\']"></div>\n              </div>\n              <div class="grid-x small-up-5">\n                <div :class="[\'cell\', product.previousResult.kg ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kwd ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kwt ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kf ? \'winner\' : \'\']"></div>\n                <div :class="[\'cell\', product.previousResult.kea ? \'winner\' : \'\']"></div>\n              </div>\n            </div>\n\n\n          </span>\n\n        </div>\n\n\n        <div class="product-odds">\n\n          <span class="nextdraw" v-if="product.status==\'waiting-result\'">\n            <a @click="nextDraw">{{ $root.locale[\'NEXT_DRAW\'] }}</a>\n          </span>\n\n          <div class="odds">\n\n            <div :class="[\'grid-x\', \'small-up-2\', $root.options.gameMode != \'simple\' || roadmap_type == \'kbs\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="kb" :tooltip="showRange(product.type, \'kb\')"></oddbox>\n              <oddbox :product="product" type="ks" :tooltip="showRange(product.type, \'ks\')"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-2\', $root.options.gameMode != \'simple\' || roadmap_type == \'koe\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="ko"></oddbox>\n              <oddbox :product="product" type="ke"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-2\', $root.options.gameMode != \'simple\' || roadmap_type == \'kixbs\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="kixb" :tooltip="showRange(product.type, \'kixb\')"></oddbox>\n              <oddbox :product="product" type="kixs" :tooltip="showRange(product.type, \'kixs\')"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-3\', $root.options.gameMode != \'simple\' || roadmap_type == \'kdt\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="kdr"></oddbox>\n              <oddbox :product="product" type="kdt"></oddbox>\n              <oddbox :product="product" type="kti"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-3\', $root.options.gameMode != \'simple\' || roadmap_type == \'kud\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="ku"></oddbox>\n              <oddbox :product="product" type="kt"></oddbox>\n              <oddbox :product="product" type="kd"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-4\', $root.options.gameMode != \'simple\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="kbo"></oddbox>\n              <oddbox :product="product" type="kso"></oddbox>\n              <oddbox :product="product" type="kbe"></oddbox>\n              <oddbox :product="product" type="kse"></oddbox>\n            </div>\n\n            <div :class="[\'grid-x\', \'small-up-5\', $root.options.gameMode != \'simple\' || roadmap_type == \'kfe\' ? \'active\' : \'\']">\n              <oddbox :product="product" type="kg"  :tooltip="showRange(product.type, \'kg\')"></oddbox>\n              <oddbox :product="product" type="kwd" :tooltip="showRange(product.type, \'kwd\')"></oddbox>\n              <oddbox :product="product" type="kwt" :tooltip="showRange(product.type, \'kwt\')"></oddbox>\n              <oddbox :product="product" type="kf"  :tooltip="showRange(product.type, \'kf\')"></oddbox>\n              <oddbox :product="product" type="kea" :tooltip="showRange(product.type, \'kea\')"></oddbox>\n            </div>\n            \n          </div>\n\n        </div>\n\n\n        <div class="product-roadmap">\n          <roadmap :product="product" :roadmap_type="roadmap_type" v-if="product.status != \'closed\'" @change="roadmapTypeChanged"></roadmap>\n        </div>\n\n      </div>\n\n    </div>\n  ',
    props: ["product"],
    components: { oddbox: OddBox, roadmap: Roadmap },
    data: function data() {
        return {
            roadmap_type: "kbs",
            countDownTimer: null,
            drawResultTimer: null,
            flipResultTimer: null,
            nextDrawTimer: null,
            delayResultTimer: null,
            flippingDrawID: null,
            flippingResult: [],
            collapsed: !1
        };
    },
    watch: {
        "product.countDown": function productCountDown() {// dem nguoc thoi gian
            var a = this;
            "closed" != this.product.status &&
                (this.product.drawResult
                    ? (this.product.status = "open-result")
                    : (clearInterval(this.countDownTimer),
                        (this.countDownTimer = setInterval(function () {
                            a.product.countDown--;
                        }, 1e3)),
                        0 >= this.product.countDown
                            ? ((this.product.status = "waiting-result"),
                                0 == this.product.countDown && this.checkResult())
                            : 0 >= this.product.countDown - this.product.closeInterval &&
                            (this.product.status = "stop-betting")));
        },
        "product.gID": function productGID(a, b) {
            clearStakeRecord(this.product.productID, b);
        },
        "product.drawID": function productDrawID(a, b) {
            var c = this;
            clearTimeout(this.delayResultTimer),
                clearInterval(this.drawResultTimer),
                "closed" != this.product.status &&
                (this.flipDraw(0),
                    setTimeout(function () {
                        c.$parent.checkRoadmap(c.product, b);
                    }, 2e3));
        },
        "product.status": function productStatus(a) {
            "closed" == a &&
                (clearInterval(this.countDownTimer),
                    clearTimeout(this.delayResultTimer),
                    clearInterval(this.drawResultTimer),
                    clearTimeout(this.nextDrawTimer),
                    clearTimeout(this.flipResultTimer));
        },
        flippingResult: function flippingResult() {
            setWinner(this.product, this.flippingResult);
        }
    },
    computed: {
        showGame: function showGame() {
            var a = !0;
            return (
                "country" != this.product.category &&
                "country" == this.$root.options.gameCategory &&
                (a = !1),
                "rng" != this.product.category &&
                "rng" == this.$root.options.gameCategory &&
                (a = !1),
                "mini-keno" != this.product.category &&
                "mini-keno" == this.$root.options.gameCategory &&
                (a = !1),
                "closed" == this.product.status &&
                "open" == this.$root.options.gameCategory &&
                (a = !1),
                a
            );
        },
        resultCountDown: function resultCountDown() {
            return (
                new Date(this.product.resultTime) - new Date(this.product.serverTime)
            );
        },
        displayCountDown: function displayCountDown() {
            var a = this.product.countDown,
                b = Math.floor(a / 60),
                c = a - 60 * b;
            return 0 < a
                ? 0 < b
                    ? b + ":" + ([, , ,].join("0") + c).slice(-2)
                    : c
                : 0;
        },
        showCounter: function showCounter() {
            return (
                "start-betting" == this.product.status ||
                "stop-betting" == this.product.status ||
                "waiting-result" == this.product.status
            );
        }
    },
    methods: {
        roadmapTypeChanged: function roadmapTypeChanged(a) {
            this.roadmap_type = a;
        },
        showRange: (function (a) {
            function b() {
                return a.apply(this, arguments);
            }
            return (
                (b.toString = function () {
                    return a.toString();
                }),
                b
            );
        })(function (a, b) {
            return showRange(a, b);
        }),
        checkResult: function checkResult() {
            console.log('checkResult');
            var a = this;
            clearTimeout(this.delayResultTimer),
                clearInterval(this.drawResultTimer),
                (this.delayResultTimer = setTimeout(function () {
                    a.getResult(),
                        (a.drawResultTimer = setInterval(function () {
                            console.log(1);
                            a.getResult();
                        }, 3e3));
                }, this.product.dl));
        },
        getResult: function getResult() {
            var a = this;
            console.log(a.product);
            axios
                .get(
                apiCall(
                    singleResultUrl +
                    "?gID=" +
                    this.product.gID +
                    "&pID=" +
                    this.product.productID
                )
                )
                .then(function (b) {
                    var c = b.data;
                    0 == c.error &&
                        c.data.drawID &&
                        ((a.product.drawResult = c.data), a.showResult());
                })
                .catch(function () { });
        },
        showResult: function showResult() {
            clearTimeout(this.delayResultTimer),
                clearInterval(this.drawResultTimer),
                (this.product.status = "open-result");
            var a = resultArray(
                this.product.drawResult,
                "mini-keno" == this.product.type ? 10 : 20
            ),
                b = shuffleArray(a);
            (this.product.drawResult.sorted = a),
                (this.product.drawResult.shuffled = b),
                this.flipResult();
        },
        flipResult: function flipResult() {
            var j = this,
                h =
                    0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : 1;
            if (this.product.drawResult) {
                var a = this.product.drawResult.sorted.slice(0),
                    b = this.product.drawResult.shuffled.slice(0);
                b = b.slice(0, h);
                for (var f, d = a.length - 1; 0 <= d; d--)
                    (f = !!(0 <= b.indexOf(a[d]))), f || (a[d] = null);
                if (((this.flippingResult = a), h < a.length))
                    this.flipResultTimer = setTimeout(function () {
                        j.flipResult(h + 1);
                    }, 150);
                else {
                    var g = checkStakeRecordTotal(
                        this.product.productID,
                        this.product.gID
                    );
                    g && this.$root.checkBalance(),
                        (this.nextDrawTimer = setTimeout(function () {
                            j.nextDraw();
                        }, 2e3));
                }
            }
        },
        nextDraw: function nextDraw() {
            var a = this;
            "closed" != this.product.status &&
                (clearInterval(this.countDownTimer),
                    clearTimeout(this.delayResultTimer),
                    clearInterval(this.drawResultTimer),
                    clearTimeout(this.nextDrawTimer),
                    clearTimeout(this.flipResultTimer),
                    axios
                        .get(apiCall(nextDrawsUrl + "?pID=" + this.product.productID))
                        .then(function (b) {
                            var c = b.data;
                            console.log(c);
                            0 == c.error &&
                                ((a.product.drawResult = null),
                                    (a.product.status = "start-betting"),
                                    (a.product.gID = c.data.gID),
                                    (a.product.drawID = c.data.drawID),
                                    (a.product.closeInterval = c.data.closeInterval),
                                    (a.product.serverTime = c.data.serverTime),
                                    (a.product.resultTime = c.data.resultTime),
                                    (a.product.countDown = c.data.countDown),
                                    (a.product.dl = c.data.dl),
                                    (a.product.odds = c.data.odds));
                        })
                        .catch(function () { }));
        },
        flipDraw: function flipDraw() {
            var c = this,
                b =
                    0 < arguments.length && arguments[0] !== void 0 ? arguments[0] : 0,
                a = this.product.drawID;
            (this.flippingDrawID = a.slice(0, b)),
                b < a.length &&
                setTimeout(function () {
                    c.flipDraw(b + 1);
                }, 50);
        }
    },
    mounted: function mounted() { },
    beforeDestroy: function beforeDestroy() {
        clearInterval(this.countDownTimer),
            clearInterval(this.drawResultTimer),
            clearTimeout(this.flipResultTimer),
            clearTimeout(this.nextDrawTimer),
            clearTimeout(this.delayResultTimer);
    }
},
app = new Vue({
    el: "#app",
    data: {
        loading: !0,
        languages: languages,
        locale_id: locale_id,
        locale: locales[locale_id],
        locale_code: locale_code,
        all_products: all_products,
        current_time: "",
        apiUrl: apiUrl,
        placeBetUrl: placeBetUrl,
        customerUrl: customerUrl,
        customerBalanceUrl: customerBalanceUrl,
        drawsCheckUpdateUrl: drawsCheckUpdateUrl,
        singleResultUrl: singleResultUrl,
        nextDrawsUrl: nextDrawsUrl,
        beforeBetUrl: beforeBetUrl,
        roadmapUrl: roadmapUrl,
        custBetUrl: custBetUrl,
        annUrl: annUrl,
        forceLogoutUrl: forceLogoutUrl,
        betListUrl: betListUrl,
        statementUrl: statementUrl,
        resultUrl: resultUrl,
        howToPlayUrl: howToPlayUrl,
        timer: { checkUpdate: null, checkBalance: null, checkTime: null },
        user: { username: null, balance: null, curr: null, checking: !1 },
        announcements: [],
        options: { gameMode: "standard", gameCategory: "open" },
        initTime: null,
        idleTime: null
    },
    computed: {},
    components: { userbox: UserBox, gamebox: GameBox },
    methods: {
        checkTime: function checkTime() {
            var a = new Date();
            a.setTime(a.getTime() + 1e3 * a.getTimezoneOffset() + 480000);
            var b = a.getFullYear(),
                c = a.getMonth(),
                d = a.getDate(),
                f = a.getHours(),
                g = a.getMinutes(),
                h = a.getSeconds(),
                j = 12 > f ? "AM" : "PM",
                m = 10 > g ? "0" + g : g,
                n = 10 > h ? "0" + h : h,
                o;
            0 === c
                ? (o = "Jan")
                : 1 === c
                    ? (o = "Feb")
                    : 2 === c
                        ? (o = "Mar")
                        : 3 === c
                            ? (o = "Apr")
                            : 4 === c
                                ? (o = "May")
                                : 5 === c
                                    ? (o = "Jun")
                                    : 6 === c
                                        ? (o = "Jul")
                                        : 7 === c
                                            ? (o = "Aug")
                                            : 8 === c
                                                ? (o = "Sep")
                                                : 9 === c
                                                    ? (o = "Oct")
                                                    : 10 === c
                                                        ? (o = "Nov")
                                                        : 11 === c
                                                            ? (o = "Dec")
                                                            : void 0;
            this.current_time =
                (f % 12 || 12) +
                ":" +
                g +
                ":" +
                n +
                " " +
                j +
                " " +
                o +
                " " +
                d +
                ", " +
                b +
                " GMT +8";
        },
        checkUser: function checkUser() {
            var a = this;
            axios
                .get(apiCall(customerUrl))
                .then(function (b) {
                    var c = b.data;
                    0 == c.error
                        ? ((a.user.username = c.data.username),
                            (a.user.balance = isNaN(parseFloat(c.data.balance))
                                ? 0
                                : parseFloat(c.data.balance)),
                            (a.user.curr = c.data.curr),
                            a.checkBalance())
                        : a.$root.forceLogout(2, c.error);
                })
                .catch(function (b) {
                    a.$root.forceLogout(3, b);
                });
        },
        checkBalance: function checkBalance() {
            var a = this;
            clearInterval(this.timer.checkBalance),
                (this.user.checking = !0),
                axios
                    .get(apiCall(customerBalanceUrl))
                    .then(function (b) {
                        setTimeout(function () {
                            a.user.checking = !1;
                        }, 500);
                        var c = b.data;
                        0 == c.error
                            ? (a.user.balance = isNaN(parseFloat(c.data.balance))
                                ? 0
                                : parseFloat(c.data.balance))
                            : a.$root.forceLogout(4, c.error);
                    })
                    .catch(function (b) {
                        a.$root.forceLogout(5, b);
                    }),
                (this.timer.checkBalance = setInterval(function () {
                    a.checkBalance();
                }, checkBalanceTimer));
        },
        setBalance: function setBalance(a) {
            this.user.balance = isNaN(parseFloat(a)) ? 0 : parseFloat(a);
        },
        checkRoadmap: function checkRoadmap(a) {
            var c = this,
                b =
                    1 < arguments.length && arguments[1] !== void 0
                        ? arguments[1]
                        : null;
            "open-result" != a.status &&
                axios
                    .get(apiCall(roadmapUrl + "?pID=" + a.productID))
                    .then(function (d) {
                        var f = d.data;
                        if (0 != f.error) c.$root.forceLogout(6, f.error);
                        else if (((a.result = f.data), (a.stat = f.stat), b)) {
                            var g = f.data.map(function (j) {
                                return parseInt(j.drawID);
                            }),
                                h = g.indexOf(parseInt(b));
                            0 > h &&
                                setTimeout(function () {
                                    c.checkRoadmap(a, b);
                                }, 2e3);
                        }
                    })
                    .catch(function () { });
        },
        checkUpdate: function checkUpdate() { // tao ban choi
            var b = this,
                a = 0 < arguments.length && arguments[0] !== void 0 && arguments[0];
            clearInterval(this.timer.checkUpdate),
                axios
                    .get(apiCall(drawsCheckUpdateUrl))
                    .then(function (c) {
                        var d = c.data;
                        if (0 == d.error)
                            for (
                                var j,
                                f = d.data,
                                g = f.map(function (l) {
                                    return parseInt(l.productID);
                                }),
                                h = b.all_products.length - 1;
                                0 <= h;
                                h--
                            )
                                (j = g.indexOf(parseInt(b.all_products[h].productID))),
                                    0 <= j
                                        ? a ||
                                            "closed" == b.all_products[h].status ||
                                            (parseInt(b.all_products[h].countDown) <
                                                0 - maxWaitResultTimer / 1e3 &&
                                                "waiting-result" == b.all_products[h].status)
                                            ? ((b.all_products[h].drawResult = null),
                                                (b.all_products[h].status = "start-betting"),
                                                (b.all_products[h].gID = f[j].gID),
                                                (b.all_products[h].drawID = f[j].drawID),
                                                (b.all_products[h].closeInterval =
                                                    f[j].closeInterval),
                                                (b.all_products[h].serverTime = f[j].serverTime),
                                                (b.all_products[h].resultTime = f[j].resultTime),
                                                (b.all_products[h].countDown = f[j].countDown),
                                                (b.all_products[h].dl = f[j].dl),
                                                (b.all_products[h].odds = f[j].odds))
                                            : "start-betting" == b.all_products[h].status &&
                                            ((b.all_products[h].countDown = f[j].countDown),
                                                (b.all_products[h].odds = f[j].odds))
                                        : "open-result" == b.all_products[h].status ||
                                        ("waiting-result" == b.all_products[h].status &&
                                            parseInt(b.all_products[h].countDown) >
                                            0 - maxWaitResultTimer / 1e3) ||
                                        resetProduct(b.all_products[h]);
                        else b.$root.forceLogout(7, d.error);
                    })
                    .catch(function (c) {
                        b.$root.forceLogout(8, c);
                    });
                (this.timer.checkUpdate = setInterval(function () {
                    b.checkUpdate();
                }, checkUpdateTimer));
        },
        checkAnnouncement: function checkAnnouncement() {
            var b = this,
                a =
                    0 < arguments.length && arguments[0] !== void 0
                        ? arguments[0]
                        : null;
            a ? (this.locale_id = a) : (a = this.locale_id),
                axios
                    .get(apiCall(annUrl + "?lc=" + a))
                    .then(function (c) {
                        var d = c.data;
                        b.announcements = d.data;
                    })
                    .catch(function (c) {
                        b.$root.forceLogout(9, c);
                    });
        },
        checkBetList: function checkBetList() {
            var a = this;
            axios
                .get(apiCall(custBetUrl))
                .then(function (b) {
                    var c = b.data;
                    console.log(c );
                    if (0 == c.error) {
                        var d = c.data.map(function (g) {
                            return {
                                productID: parseInt(g.pID),
                                gID: parseInt(g.gID),
                                type: getGameTypeDetailCode(g.gameTypeDetailID),
                                stake: g.stake
                            };
                        });
                        sessionStorage.setItem("stake-records", JSON.stringify(d));
                        for (var f = 0; f < a.all_products.length; f++)
                            a.all_products[f].betList = 1;
                    } else {
                        a.$root.forceLogout(10, c.error);
                    }
                })
                .catch(function (b) {
                    a.$root.forceLogout(11, b);
                });
        },
        setLocale: function setLocale(a) {
            (this.locale = locales[a]), this.checkAnnouncement(a);
        },
        openWindow: function openWindow(a) {
            var b = a;
            b =
                0 < a.indexOf("?")
                    ? b + "&lc=" + this.locale_id
                    : b + "?lc=" + this.locale_id;
            var c = window.screen.width / 2 - (openWindowSize[0] / 2 + 10),
                d = window.screen.height / 2 - (openWindowSize[1] / 2 + 50),
                f = window.open(
                    b,
                    "kenowindow",
                    "height=" +
                    openWindowSize[1] +
                    ",width=" +
                    openWindowSize[0] +
                    ",top=" +
                    d +
                    ",left=" +
                    c +
                    ",toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,directories=no,status=no"
                );
            f.focus();
        },
        forceLogout: function forceLogout(a, b) {
            window.location.replace(forceLogoutUrl + "&c=" + a + "&e=" + b);
        },
        refreshPage: function refreshPage() {
            console.log("refreshPage"), this.checkUpdate(!0), this.checkBetList();
        }
    },
    created: function created() {
        var a = this;
        this.checkUser(),
            this.checkBetList(),
            (this.timer.checkTime = setInterval(function () {
                a.checkTime();
            }, 1e3));
    },
    mounted: function mounted() {
        var c = this;
        setTimeout(function () {
            var d = document.getElementById("products"),
                f = Sortable.create(d, {
                    handle: ".avatar",
                    ghostClass: "sortable-ghost",
                    chosenClass: "sortable-chosen",
                    dragClass: "sortable-drag",
                    onChoose: function onChoose() {
                        var g = document.getElementById("app");
                        g.click();
                    }
                });
        }, 2e3),
            this.checkUpdate(),
            this.checkAnnouncement();
        var a = new Date().getTime(),
            b = function () {
                var d = new Date().getTime();
                1.2e5 < d - a
                    ? window.location.reload()
                    : 5e3 < d - a && c.refreshPage(),
                    (a = d),
                    setTimeout(b, 1e3);
            };
        b();
    },
    beforeDestroy: function beforeDestroy() {
        clearInterval(this.timer.checkUpdate),
            clearInterval(this.timer.checkBalance),
            clearInterval(this.timer.checkTime);
    }
});
