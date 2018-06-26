"use strict";
var checkUpdateTimer = 10000,
    checkBalanceTimer = 30000,
    maxWaitResultTimer = 120000,
    game_types = [
        { code: "kb", gameTypeDetailID: 1, gameTypeID: 1 },
        { code: "ks", gameTypeDetailID: 2, gameTypeID: 1 },
        { code: "ko", gameTypeDetailID: 3, gameTypeID: 2 },
        { code: "ke", gameTypeDetailID: 4, gameTypeID: 2 },
        { code: "ku", gameTypeDetailID: 5, gameTypeID: 3 },
        { code: "kt", gameTypeDetailID: 6, gameTypeID: 3 },
        { code: "kd", gameTypeDetailID: 7, gameTypeID: 3 },
        { code: "kbo", gameTypeDetailID: 11, gameTypeID: 5 },
        { code: "kbe", gameTypeDetailID: 12, gameTypeID: 5 },
        { code: "kso", gameTypeDetailID: 13, gameTypeID: 5 },
        { code: "kse", gameTypeDetailID: 14, gameTypeID: 5 },
        { code: "kg", gameTypeDetailID: 15, gameTypeID: 6 },
        { code: "kwd", gameTypeDetailID: 16, gameTypeID: 6 },
        { code: "kwt", gameTypeDetailID: 17, gameTypeID: 6 },
        { code: "kf", gameTypeDetailID: 18, gameTypeID: 6 },
        { code: "kea", gameTypeDetailID: 19, gameTypeID: 6 },
        { code: "kdr", gameTypeDetailID: 22, gameTypeID: 8 },
        { code: "kdt", gameTypeDetailID: 23, gameTypeID: 8 },
        { code: "kti", gameTypeDetailID: 24, gameTypeID: 8 },
        { code: "kixb", gameTypeDetailID: 33, gameTypeID: 13 },
        { code: "kixs", gameTypeDetailID: 34, gameTypeID: 13 }
    ];
function getGameTypeId(c) {
    for (var f = 0; f < game_types.length; ++f)
        if (game_types[f].code == c) {
            break;
        }
    return game_types[f].gameTypeID;
}
function getGameTypeDetailId(c) {
    for (var f = 0; f < game_types.length; ++f)
        if (game_types[f].code == c) {
            break;
        }
    return game_types[f].gameTypeDetailID;
}
function getGameTypeDetailCode(c) {
    for (var f = 0; f < game_types.length; ++f)
        if (game_types[f].gameTypeDetailID == c) {
            break;
        }
    return game_types[f].code;
}
function initProduct(c) {
    return {
        productID: c.productID,
        gID: null,
        drawID: null,
        closeInterval: null,
        serverTime: null,
        resultTime: null,
        countDown: null,
        odds: null,
        result: [],
        stat: null,
        drawResult: null,
        enabled: c.enabled,
        category: c.category,
        type: c.type,
        index_range: c.index_range,
        url: c.url,
        ready: !0,
        status: "closed",
        previousResult: {
            kb: !1,
            ks: !1,
            ko: !1,
            ke: !1,
            kixb: !1,
            kixd: !1,
            kixs: !1,
            ku: !1,
            kt: !1,
            kd: !1,
            kdr: !1,
            kdt: !1,
            kti: !1,
            kg: !1,
            kwd: !1,
            kwt: !1,
            kf: !1,
            kea: !1,
            kbo: !1,
            kso: !1,
            kbe: !1,
            kse: !1,
            sum: null
        }
    };
}
function resetProduct(c) {
    (c.status = "closed"),
        (c.drawResult = null),
        (c.gID = null),
        (c.drawID = null),
        (c.closeInterval = null),
        (c.serverTime = null),
        (c.resultTime = null),
        (c.countDown = null),
        (c.odds = null);
}
for (
    var _iterator = Object.keys(all_products),
    _isArray = Array.isArray(_iterator),
    _i = 0,
    _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
    ;

) {
    var _ref;
    if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
    } else {
        if (((_i = _iterator.next()), _i.done)) break;
        _ref = _i.value;
    }
    var key = _ref;
    all_products[key] = initProduct(all_products[key]);
}
function shuffleArray(c) {
    var f,
        g,
        e = c.length;
    for (
        c = c.map(function (h) {
            return parseInt(h);
        });
        0 !== e;

    )
        (g = Math.floor(Math.random() * e)),
            (e -= 1),
            (f = c[e]),
            (c[e] = c[g]),
            (c[g] = f);
    return c;
}
function resultArray(c, e) {
    for (var f = [], g = 1; g <= e; g++) f.push(c["r" + g]);
    return f;
}
function numeric(c) {
    return (
        (c += ""),
        (c = c.replace(/,/g, "")),
        (c = parseFloat(c).toFixed(2)),
        (c = parseFloat(c)),
        isNaN(c) ? "" : c
    );
}
function display_numeric(c) {
    var j = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0,
        l = 2 < arguments.length && void 0 !== arguments[2] && arguments[2];
    if (((c = numeric(c)), "" === c)) return "";
    if (!l && 0 == c) return "";
    for (
        var e = c.toString().split("."), f = /(-?\d+)(\d{3})/, g = e[0];
        f.test(g);

    )
        g = g.replace(f, "$1,$2");
    if (0 < j) {
        for (var h = 1 < e.length ? e[1].substr(0, j) : ""; j > h.length;)
            h += "0";
        return g + "." + h;
    }
    return g;
}
function drawSSR(c, e) {
    return {
        drawID: parseInt(c.drawID),
        resultTime: c.resultTime,
        sum: c.sum,
        winners: [
            getGameTypeDetailCode(c.kbs),
            getGameTypeDetailCode(c.koe),
            getGameTypeDetailCode(c.kdt),
            getGameTypeDetailCode(c.kud),
            getGameTypeDetailCode(c.kfe)
        ],
        kixbs: 0 < c.kix ? "kixb" : 0 > c.kix ? "kixs" : "kixd",
        kix: c.kix,
        result: resultArray(c, "mini-keno" == e ? 10 : 20)
    };
}
function chunkArray(c) {
    for (
        var e = c.slice(0).reverse(), f = [], g = [], h = null, j = 0;
        j < e.length;
        j++
    )
        h == e[j].type && 6 > g.length
            ? g.push(e[j])
            : (g.length && (f.push(g), (g = [])), (h = e[j].type), g.push(e[j])),
            j == e.length - 1 && f.push(g);
    var l = f.reverse();
    return (l = l.slice(0, 18)), (l = l.reverse()), l;
}
function roadmapResult(c) {
    var e = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: getGameTypeDetailCode(m.kbs),
            ssr: drawSSR(m, c.type)
        };
    });
    e = chunkArray(e);
    var f = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: 0 < m.kix ? "kixb" : 0 > m.kix ? "kixs" : "kixd",
            value: Math.abs(m.kix),
            ssr: drawSSR(m, c.type)
        };
    });
    f = chunkArray(f);
    var g = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: getGameTypeDetailCode(m.koe),
            ssr: drawSSR(m, c.type)
        };
    });
    g = chunkArray(g);
    var h = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: getGameTypeDetailCode(m.kdt),
            ssr: drawSSR(m, c.type)
        };
    });
    h = chunkArray(h);
    var j = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: getGameTypeDetailCode(m.kud),
            ssr: drawSSR(m, c.type)
        };
    });
    j = chunkArray(j);
    var l = c.result.map(function (m) {
        return {
            drawID: parseInt(m.drawID),
            type: getGameTypeDetailCode(m.kfe),
            ssr: drawSSR(m, c.type)
        };
    });
    return (
        (l = chunkArray(l)), { kbs: e, kixbs: f, koe: g, kdt: h, kud: j, kfe: l }
    );
}
function getUrlParam(c) {
    for (
        var g,
        e = window.location.href
            .slice(window.location.href.indexOf("?") + 1)
            .split("&"),
        f = 0;
        f < e.length;
        f++
    )
        if (((g = e[f].split("=")), g[0] == c)) return g[1];
    return !1;
}
var locale_id = getUrlParam("lc") ? getUrlParam("lc") : 0,
    locale = locales[locale_id],
    locale_code = {
        kb: "bs_b",
        ks: "bs_s",
        ko: "oe_o",
        ke: "oe_e",
        ku: "ud_u",
        kt: "ud_t",
        kd: "ud_d",
        kbo: "bsoe_bo",
        kbe: "bsoe_be",
        kso: "bsoe_so",
        kse: "bsoe_se",
        kg: "fe_g",
        kwd: "fe_wd",
        kwt: "fe_wt",
        kf: "fe_f",
        kea: "fe_ea",
        kdr: "dt_dr",
        kdt: "dt_dt",
        kti: "dt_ti",
        kixb: "ixbs_b",
        kixd: "ixbs_d",
        kixs: "ixbs_s",
        stat_kbs: "STAT_BS",
        stat_koe: "STAT_OE",
        stat_kud: "STAT_UD",
        stat_kfe: "STAT_FE",
        stat_kdt: "STAT_DT",
        stat_kixbs: "STAT_IX",
        tt_stat_kbs: "STAT_BS_TT",
        tt_stat_koe: "STAT_OE_TT",
        tt_stat_kud: "STAT_UD_TT",
        tt_stat_kfe: "STAT_FE_TT",
        tt_stat_kdt: "STAT_DT_TT",
        tt_stat_kixbs: "STAT_IX_TT",
        "start-betting": "STATUS_START_BET",
        "stop-betting": "STATUS_STOP_BET",
        "waiting-result": "STATUS_WAIT",
        "open-result": "STATUS_RESULT",
        closed: "MARCLOSED",
        ixBets: "ixBets",
        ixRange: "ixRange"
    },
    keno_range = {
        keno: {
            ks: { from: 210, to: 810 },
            kb: { from: 811, to: 1410 },
            kg: { from: 210, to: 695 },
            kwd: { from: 696, to: 763 },
            kwt: { from: 764, to: 855 },
            kf: { from: 856, to: 923 },
            kea: { from: 924, to: 1410 },
            kixs: { from: 210, to: 809 },
            kixb: { from: 811, to: 1410 }
        },
        "mini-keno": {
            ks: { from: 55, to: 205 },
            kb: { from: 206, to: 355 },
            kg: { from: 55, to: 163 },
            kwd: { from: 164, to: 187 },
            kwt: { from: 188, to: 222 },
            kf: { from: 223, to: 246 },
            kea: { from: 247, to: 355 },
            kixs: { from: 55, to: 204 },
            kixb: { from: 206, to: 355 }
        }
    };
function showRange(c, e) {
    var f = keno_range[c][e];
    return f.from + "~" + f.to;
}
function checkStakeRecord(c, e, f) {
    for (
        var g = sessionStorage.getItem("stake-records")
            ? JSON.parse(sessionStorage.getItem("stake-records"))
            : [],
        h = 0,
        j = 0;
        j < g.length;
        j++
    )
        parseInt(g[j].productID) == parseInt(c) &&
            parseInt(g[j].gID) == parseInt(e) &&
            g[j].type == f &&
            (h += parseInt(g[j].stake));
    return h;
}
function checkStakeRecordTotal(c, e) {
    for (
        var f = sessionStorage.getItem("stake-records")
            ? JSON.parse(sessionStorage.getItem("stake-records"))
            : [],
        g = 0,
        h = f.length - 1;
        0 <= h;
        h--
    )
        parseInt(f[h].productID) == parseInt(c) &&
            parseInt(f[h].gID) == parseInt(e) &&
            (g += parseInt(f[h].stake));
    return g;
}
function clearStakeRecord() {
    var f = sessionStorage.getItem("stake-records")
        ? JSON.parse(sessionStorage.getItem("stake-records"))
        : [];
    (f = f.slice(0, 500)),
        sessionStorage.setItem("stake-records", JSON.stringify(f));
}
function setStakeRecord(c, e, f, g) {
    var h = {
        productID: parseInt(c),
        gID: parseInt(e),
        type: f,
        stake: parseInt(g)
    },
        j = sessionStorage.getItem("stake-records")
            ? JSON.parse(sessionStorage.getItem("stake-records"))
            : [];
    j.push(h), sessionStorage.setItem("stake-records", JSON.stringify(j));
}
function setWinner(c, e) {
    var f = e.reduce(function (p, q) {
        return p + q;
    }, 0),
        g = "mini-keno" == c.type;
    (c.previousResult.sum = f),
        (c.previousResult.kb = f > keno_range[c.type].ks.to),
        (c.previousResult.ks = f <= keno_range[c.type].ks.to),
        (c.previousResult.ko = 0 != f % 2),
        (c.previousResult.ke = 0 == f % 2),
        (c.previousResult.kbo = c.previousResult.kb && c.previousResult.ko),
        (c.previousResult.kso = c.previousResult.ks && c.previousResult.ko),
        (c.previousResult.kbe = c.previousResult.kb && c.previousResult.ke),
        (c.previousResult.kse = c.previousResult.ks && c.previousResult.ke),
        (c.previousResult.kixb = f > keno_range[c.type].ks.to),
        (c.previousResult.kixd = f == keno_range[c.type].ks.to),
        (c.previousResult.kixs = f < keno_range[c.type].ks.to);
    var h = f % 10,
        j = (f % 100 - h) / 10;
    (c.previousResult.kti = h > j),
        (c.previousResult.kdt = h == j),
        (c.previousResult.kdr = h < j);
    var l = g ? 20 : 40,
        m = g ? 5 : 10,
        n = e.filter(function (p) {
            return p <= l;
        }).length,
        o = e.length - n;
    (c.previousResult.ku = n > o && n > m),
        (c.previousResult.kd = o > n && o > m),
        (c.previousResult.kt = !c.previousResult.ku && !c.previousResult.kd),
        (c.previousResult.kg =
            f >= keno_range[c.type].kg.from && f <= keno_range[c.type].kg.to),
        (c.previousResult.kwd =
            f >= keno_range[c.type].kwd.from && f <= keno_range[c.type].kwd.to),
        (c.previousResult.kwt =
            f >= keno_range[c.type].kwt.from && f <= keno_range[c.type].kwt.to),
        (c.previousResult.kf =
            f >= keno_range[c.type].kf.from && f <= keno_range[c.type].kf.to),
        (c.previousResult.kea =
            f >= keno_range[c.type].kea.from && f <= keno_range[c.type].kea.to);
}
function apiCall(c) {
    var e = new Date();
    return (
        (c += -1 === c.indexOf("?") ? "?" : "&"),
        apiUrl + c + "timestamp=" + e.getTime()
    );
}
function slideToLeft(c, e) {
    Velocity(
        c,
        { translateX: [-c.scrollWidth - e, c.offsetWidth + e] },
        {
            duration: 20 * c.scrollWidth,
            easing: "linear",
            complete: slideToLeft.bind(this, c, e)
        }
    );
}
