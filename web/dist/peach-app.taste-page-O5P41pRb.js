(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "9b65577e-8550-4492-95cf-43eb640447a0", e._sentryDebugIdIdentifier = "sentry-dbid-9b65577e-8550-4492-95cf-43eb640447a0");
	} catch {}
})();
import { ActivePoints as e, AnimatedItems as t, CHART_CARD as n, CHART_COLORS as r, CartesianLabelListContextProvider as i, CategoryTick as a, ChartBackground as o, ChartContainer as s, ChartHead as c, ChartLegend as l, ChartLegendContent as u, ChartTip as d, ChartTooltip as f, ChartTooltipContent as p, DefaultZIndexes as m, Dots as h, EvilBarChart as g, LabelListFromLabelProp as _, Layer as v, LoadingIndicator as y, PolarChart as b, PolarLabelContextProvider as x, PolarLabelFromLabelProp as S, RegisterGraphicalItemId as C, SetPolarGraphicalItem as ee, SetPolarLegendPayload as w, SetTooltipEntrySettings as T, Text as te, ZIndexLayer as E, adaptEventsOfChild as ne, addRadiusAxis as re, arrayTooltipSearcher as ie, categoryAxisWidth as ae, cn as oe, createSelector as D, defaultPolarChartProps as se, defaultPolarRadiusAxisProps as ce, fitLabel as le, getAxisTypeBasedOnLayout as ue, getBandSizeOfAxis as de, getClassNameFromUnknown as fe, getColorsCount as pe, getTooltipNameProp as me, getValueByDataKey as he, identity as ge, interpolate as _e, isArrayLike as ve, isCategoricalAxis as ye, isNullish as be, iteratee as xe, matchAnimationItems as Se, matchByIndex as Ce, noop as we, polarToCartesian as O, removeRadiusAxis as Te, resolveDefaultProps as Ee, selectAngleAxis as De, selectChartDataAndAlwaysIgnoreIndexes as Oe, selectChartLayout as ke, selectPolarViewBox as Ae, selectRadiusAxis as je, selectUnfilteredPolarItems as Me, svgPropertiesAndEvents as Ne, svgPropertiesNoEvents as k, svgPropertiesNoEventsFromUnknown as Pe, tone as Fe, useAnimationCallbacks as Ie, useAnimationStartSnapshot as Le, useAppDispatch as Re, useAppSelector as A, useIsPanorama as ze, usePolarChartLayout as Be } from "./peach-app.chart-tip-CRxYp6KT.js";
import { $542a13ca2fa5b484$export$5b6b19405a83ff9d as Ve, $b4f18e3395fe64d7$export$3d96ec278d3efce4 as He, $b4f18e3395fe64d7$export$3e41faf802a29e71 as Ue, $b4f18e3395fe64d7$export$b2539bed5023c21c as We, Button as j, ButtonLink as Ge, Disclosure as Ke, E3 as qe, EmptyState as M, FLOW_LABEL_X as Je, FLOW_VIEWBOX as Ye, Gg as Xe, IDLE_POLL_MS as Ze, Input as Qe, M6 as $e, MENU_ITEM as et, MENU_ITEM_INTERACTIVE as tt, MENU_POPOVER_SURFACE as nt, MenuDialog as rt, Note as N, OV as it, Progress as at, Rf as ot, SEGMENT as st, SEGMENTED_TRACK as ct, STAT_STRIP as lt, SegmentedTabList as ut, Select$1 as dt, SelectItem as ft, StatCard as pt, TASTE_REFRESH_KEY as mt, TASTE_WINDOWS as ht, TaskProgress as gt, Wt as _t, Xt as vt, _8 as yt, __toESM as bt, aB as xt, avatarInner as St, busyProps as P, cB as Ct, cardClass as F, clsx as I, configureTasteBrowser as wt, confirmModal as Tt, cx as Et, errorMessage as L, f1 as Dt, fetchTaste as Ot, fetchTasteJob as kt, firstGrapheme as At, flowGraph as jt, flowLabel as Mt, fmtSize as Nt, g4 as Pt, historySpan as Ft, importTasteExport as It, keepPreviousData as Lt, mM as Rt, pv as R, queryClient as z, r2 as zt, radarRows as Bt, rankDetail as Vt, rankShares as Ht, removeTasteSource as Ut, require_jsx_runtime as Wt, require_react as Gt, siteMarkUrl as Kt, startTasteRefresh as qt, statCardClass as Jt, tasteDate as Yt, tasteDimensions as Xt, tasteHours as Zt, tasteKey as B, tasteRefetchInterval as Qt, tasteTime as $t, topScores as en, uo as tn, useBackgroundJob as nn, useMutation as V, useQuery as rn } from "./peach-app.js";
import { Page as an } from "./peach-app.page-QAncjzM1.js";
import { LEGACY_AVATAR_IMG as on } from "./peach-app.legacy-avatar-NSITxLRS.js";
import { ActivityHeat as sn, BAR_DOMAIN as cn, ExpandableRanking as ln, PolarAngleAxis as un, Polygon as dn, barLabel as fn, selectPolarAxisScale as pn, selectPolarAxisTicks as H } from "./peach-app.expandable-ranking-dFA65P9N.js";
var mn = D([(e, t) => H(e, "angleAxis", t, !1)], (e) => {
	if (e) return e.map((e) => e.coordinate);
}), hn = D([(e, t) => H(e, "radiusAxis", t, !1)], (e) => {
	if (e) return e.map((e) => e.coordinate);
}), U = /* @__PURE__ */ bt(Gt()), gn = [
	"gridType",
	"radialLines",
	"angleAxisId",
	"radiusAxisId",
	"cx",
	"cy",
	"innerRadius",
	"outerRadius",
	"polarAngles",
	"polarRadius",
	"zIndex"
];
function _n(e, t) {
	if (e == null) return {};
	var n, r, i = vn(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function vn(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function W() {
	return W = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, W.apply(null, arguments);
}
function yn(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function bn(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? yn(Object(n), !0).forEach(function(t) {
			xn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : yn(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xn(e, t, n) {
	return (t = Sn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Sn(e) {
	var t = Cn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Cn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var wn = (e, t, n, r) => {
	var i = "";
	return r.forEach((r, a) => {
		var o = O(t, n, e, r);
		i += a ? `L ${o.x},${o.y}` : `M ${o.x},${o.y}`;
	}), i += "Z", i;
}, Tn = (e) => {
	var t = e.cx, n = e.cy, r = e.innerRadius, i = e.outerRadius, a = e.polarAngles, o = e.radialLines;
	if (!a || !a.length || !o) return null;
	var s = bn({}, k(e));
	return /*#__PURE__*/ U.createElement("g", { className: "recharts-polar-grid-angle" }, a.map((e) => {
		var a = O(t, n, r, e), o = O(t, n, i, e);
		return /*#__PURE__*/ U.createElement("line", W({ key: `line-${e}` }, s, {
			x1: a.x,
			y1: a.y,
			x2: o.x,
			y2: o.y
		}));
	}));
}, En = (e) => {
	var t = e.cx, n = e.cy, r = e.radius, i = bn({}, k(e));
	return /*#__PURE__*/ U.createElement("circle", W({}, i, {
		className: I("recharts-polar-grid-concentric-circle", e.className),
		cx: t,
		cy: n,
		r
	}));
}, Dn = (e) => {
	var t = e.radius, n = bn({}, k(e));
	return /*#__PURE__*/ U.createElement("path", W({}, n, {
		className: I("recharts-polar-grid-concentric-polygon", e.className),
		d: wn(t, e.cx, e.cy, e.polarAngles)
	}));
}, On = (e) => {
	var t = e.polarRadius, n = e.gridType;
	if (!t || !t.length) return null;
	var r = Math.max(...t), i = e.fill && e.fill !== "none";
	return /*#__PURE__*/ U.createElement("g", { className: "recharts-polar-grid-concentric" }, i && n === "circle" && /*#__PURE__*/ U.createElement(En, W({}, e, { radius: r })), i && n !== "circle" && /*#__PURE__*/ U.createElement(Dn, W({}, e, { radius: r })), t.map((t, r) => {
		var i = r;
		return n === "circle" ? /*#__PURE__*/ U.createElement(En, W({ key: i }, e, {
			fill: "none",
			radius: t
		})) : /*#__PURE__*/ U.createElement(Dn, W({ key: i }, e, {
			fill: "none",
			radius: t
		}));
	}));
}, kn = {
	angleAxisId: 0,
	radiusAxisId: 0,
	gridType: "polygon",
	radialLines: !0,
	zIndex: m.grid,
	stroke: "#ccc",
	strokeWidth: 1,
	fill: "none"
}, An = (e) => {
	var t = Ee(e, kn), n = t.gridType, r = t.radialLines, i = t.angleAxisId, a = t.radiusAxisId, o = t.cx, s = t.cy, c = t.innerRadius, l = t.outerRadius, u = t.polarAngles, d = t.polarRadius, f = t.zIndex, p = _n(t, gn), m = A(Ae), h = A((e) => mn(e, i)), g = A((e) => hn(e, a)), _ = Array.isArray(u) ? u : h, v = Array.isArray(d) ? d : g;
	if (_ == null || v == null) return null;
	var y = bn({
		cx: m?.cx ?? o ?? 0,
		cy: m?.cy ?? s ?? 0,
		innerRadius: m?.innerRadius ?? c ?? 0,
		outerRadius: m?.outerRadius ?? l ?? 0,
		polarAngles: _,
		polarRadius: v,
		zIndex: f
	}, p);
	return y.outerRadius <= 0 ? null : /*#__PURE__*/ U.createElement(E, { zIndex: y.zIndex }, /*#__PURE__*/ U.createElement("g", { className: "recharts-polar-grid" }, /*#__PURE__*/ U.createElement(On, W({
		gridType: n,
		radialLines: r
	}, y, {
		polarAngles: _,
		polarRadius: v
	})), /*#__PURE__*/ U.createElement(Tn, W({
		gridType: n,
		radialLines: r
	}, y, {
		polarAngles: _,
		polarRadius: v
	}))));
};
An.displayName = "PolarGrid";
// node_modules/es-toolkit/dist/compat/_internal/toArray.mjs
function jn(e) {
	return Array.isArray(e) ? e : Array.from(e);
}
// node_modules/es-toolkit/dist/compat/math/maxBy.mjs
function Mn(e, t = ge) {
	if (e == null) return;
	let n = jn(e);
	if (n.length === 0) return;
	let r = xe(t), i, a;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], o = r(t, e, n);
		o == null || Number.isNaN(o) || typeof o == "symbol" || (a === void 0 || o > a) && (a = o, i = t);
	}
	return i;
}
// node_modules/es-toolkit/dist/compat/math/minBy.mjs
function Nn(e, t = ge) {
	if (e == null) return;
	let n = jn(e);
	if (n.length === 0) return;
	let r = xe(t), i, a;
	for (let e = 0; e < n.length; e++) {
		let t = n[e], o = r(t, e, n);
		o == null || Number.isNaN(o) || typeof o == "symbol" || (a === void 0 || o < a) && (a = o, i = t);
	}
	return i;
}
// node_modules/recharts/es6/polar/PolarRadiusAxis.js
var Pn = ["type"], Fn = [
	"cx",
	"cy",
	"angle",
	"axisLine"
], In = [
	"angle",
	"tickFormatter",
	"stroke",
	"tick"
];
function G() {
	return G = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, G.apply(null, arguments);
}
function Ln(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function K(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Ln(Object(n), !0).forEach(function(t) {
			Rn(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ln(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Rn(e, t, n) {
	return (t = zn(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function zn(e) {
	var t = Bn(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Bn(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function Vn(e, t) {
	if (e == null) return {};
	var n, r, i = Hn(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Hn(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
var Un = "radiusAxis";
function Wn(e) {
	var t = Re(), n = Be(), r = (0, U.useMemo)(() => {
		var t = e.type, r = Vn(e, Pn), i = ue(n, "radiusAxis", t);
		if (i != null) return K(K({}, r), {}, { type: i });
	}, [e, n]);
	return (0, U.useEffect)(() => r == null ? we : (t(re(r)), () => {
		t(Te(r));
	}), [t, r]), null;
}
var Gn = (e, t, n, r) => {
	var i = e.coordinate;
	return O(n, r, i, t);
}, Kn = (e) => {
	var t;
	switch (e) {
		case "left":
			t = "end";
			break;
		case "right":
			t = "start";
			break;
		default: t = "middle";
	}
	return t;
}, qn = (e, t, n, r) => {
	var i = Mn(r, (e) => e.coordinate || 0);
	return {
		cx: t,
		cy: n,
		startAngle: e,
		endAngle: e,
		innerRadius: Nn(r, (e) => e.coordinate || 0)?.coordinate || 0,
		outerRadius: i?.coordinate || 0,
		clockWise: !1
	};
}, Jn = (e, t) => {
	var n = e.cx, r = e.cy, i = e.angle, a = e.axisLine, o = Vn(e, Fn), s = t.reduce((e, t) => [Math.min(e[0], t.coordinate), Math.max(e[1], t.coordinate)], [Infinity, -Infinity]), c = O(n, r, s[0], i), l = O(n, r, s[1], i), u = K(K(K({}, k(o)), {}, { fill: "none" }, k(a)), {}, {
		x1: c.x,
		y1: c.y,
		x2: l.x,
		y2: l.y
	});
	return /*#__PURE__*/ U.createElement("line", G({ className: "recharts-polar-radius-axis-line" }, u));
}, Yn = (e, t, n) => /*#__PURE__*/ U.isValidElement(e) ? /*#__PURE__*/ U.cloneElement(e, t) : typeof e == "function" ? e(t) : /*#__PURE__*/ U.createElement(te, G({}, t, { className: "recharts-polar-radius-axis-tick-value" }), n), Xn = (e, t) => {
	var n = e.angle, r = e.tickFormatter, i = e.stroke, a = e.tick, o = Vn(e, In), s = Kn(e.orientation), c = k(o), l = Pe(a), u = t.map((t, o) => {
		var u = Gn(t, e.angle, e.cx, e.cy), d = K(K(K(K({
			textAnchor: s,
			transform: `rotate(${90 - n}, ${u.x}, ${u.y})`
		}, c), {}, {
			stroke: "none",
			fill: i
		}, l), {}, { index: o }, u), {}, { payload: t });
		return /*#__PURE__*/ U.createElement(v, G({
			className: I("recharts-polar-radius-axis-tick", fe(a)),
			key: `tick-${t.coordinate}`
		}, ne(e, t, o)), Yn(a, d, r ? r(t.value, o) : t.value));
	});
	return /*#__PURE__*/ U.createElement(v, { className: "recharts-polar-radius-axis-ticks" }, u);
}, Zn = (e) => {
	var t = e.radiusAxisId, n = A(Ae), r = A((e) => pn(e, "radiusAxis", t)), i = A((e) => H(e, "radiusAxis", t, !1));
	if (n == null || !i || !i.length || r == null) return null;
	var a = K(K({}, e), {}, { scale: r }, n), o = a.tick, s = a.axisLine;
	return /*#__PURE__*/ U.createElement(E, { zIndex: a.zIndex }, /*#__PURE__*/ U.createElement(v, { className: I("recharts-polar-radius-axis", Un, a.className) }, s && Jn(a, i), o && Xn(a, i), /*#__PURE__*/ U.createElement(x, qn(a.angle, a.cx, a.cy, i), /*#__PURE__*/ U.createElement(S, { label: a.label }), a.children)));
};
function Qn(e) {
	var t = Ee(e, ce);
	return /*#__PURE__*/ U.createElement(U.Fragment, null, /*#__PURE__*/ U.createElement(Wn, {
		domain: t.domain,
		id: t.radiusAxisId,
		scale: t.scale,
		type: t.type,
		dataKey: t.dataKey,
		unit: void 0,
		name: t.name,
		allowDuplicatedCategory: t.allowDuplicatedCategory,
		allowDataOverflow: t.allowDataOverflow,
		reversed: t.reversed,
		includeHidden: t.includeHidden,
		allowDecimals: t.allowDecimals,
		niceTicks: t.niceTicks ?? "auto",
		ticks: t.ticks,
		tickCount: t.tickCount,
		tick: t.tick
	}), /*#__PURE__*/ U.createElement(Zn, t));
}
Qn.displayName = "PolarRadiusAxis";
// node_modules/es-toolkit/dist/array/last.mjs
function $n(e) {
	return e[e.length - 1];
}
// node_modules/es-toolkit/dist/compat/array/last.mjs
function er(e) {
	if (ve(e) && e.length !== 0) return $n(jn(e));
}
// node_modules/recharts/es6/state/selectors/radarSelectors.js
function tr(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function nr(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? tr(Object(n), !0).forEach(function(t) {
			rr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : tr(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function rr(e, t, n) {
	return (t = ir(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function ir(e) {
	var t = ar(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function ar(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var or = (e, t) => pn(e, "radiusAxis", t), sr = D([or], (e) => {
	if (e != null) return { scale: e };
}), cr = D([je, or], (e, t) => {
	if (e != null && t != null) return nr(nr({}, e), {}, { scale: t });
}), lr = (e, t, n, r) => H(e, "radiusAxis", t, r), ur = (e, t, n) => De(e, n), dr = (e, t, n) => pn(e, "angleAxis", n), fr = D([ur, dr], (e, t) => {
	if (e != null && t != null) return nr(nr({}, e), {}, { scale: t });
}), pr = (e, t, n, r) => H(e, "angleAxis", n, r), mr = D([
	ur,
	dr,
	Ae
], (e, t, n) => {
	if (n != null && t != null) return {
		scale: t,
		type: e.type,
		dataKey: e.dataKey,
		cx: n.cx,
		cy: n.cy
	};
}), hr = (e, t, n, r, i) => i, gr = D([
	ke,
	cr,
	lr,
	fr,
	pr
], (e, t, n, r, i) => ye(e, "radiusAxis") ? de(t, n, !1) : de(r, i, !1)), _r = D([Me, hr], (e, t) => {
	if (e != null) return e.find((e) => e.type === "radar" && t === e.id)?.dataKey;
}), vr = D([
	sr,
	mr,
	Oe,
	_r,
	gr
], (e, t, n, r, i) => {
	var a = n.chartData, o = n.dataStartIndex, s = n.dataEndIndex;
	if (e != null && t != null && a != null && i != null && r != null) return Ar({
		radiusAxis: e,
		angleAxis: t,
		displayedData: a.slice(o, s + 1),
		dataKey: r,
		bandSize: i
	});
}), yr = ["id"];
function q() {
	return q = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, q.apply(null, arguments);
}
function br(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function J(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? br(Object(n), !0).forEach(function(t) {
			xr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : br(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function xr(e, t, n) {
	return (t = Sr(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Sr(e) {
	var t = Cr(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Cr(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
function wr(e, t) {
	if (e == null) return {};
	var n, r, i = Tr(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Tr(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Er(e, t) {
	return e && e !== "none" ? e : t;
}
var Dr = (e) => {
	var t = e.dataKey, n = e.name, r = e.stroke, i = e.fill, a = e.legendType;
	return [{
		inactive: e.hide,
		dataKey: t,
		type: a,
		color: Er(r, i),
		value: me(n, t),
		payload: e
	}];
}, Or = /*#__PURE__*/ U.memo((e) => {
	var t = e.dataKey, n = e.stroke, r = e.strokeWidth, i = e.fill, a = e.name, o = e.hide, s = e.tooltipType, c = e.id, l = {
		dataDefinedOnItem: void 0,
		getPosition: we,
		settings: {
			stroke: n,
			strokeWidth: r,
			fill: i,
			nameKey: void 0,
			dataKey: t,
			name: me(a, t),
			hide: o,
			type: s,
			color: Er(n, i),
			unit: "",
			graphicalItemId: c
		}
	};
	return /*#__PURE__*/ U.createElement(T, { tooltipEntrySettings: l });
});
function kr(e) {
	var t = e.points, n = e.props, r = n.dot, i = n.dataKey;
	n.id;
	var a = wr(n, yr), o = k(a);
	return /*#__PURE__*/ U.createElement(h, {
		points: t,
		dot: r,
		className: "recharts-radar-dots",
		dotClassName: "recharts-radar-dot",
		dataKey: i,
		baseProps: o
	});
}
function Ar(e) {
	var t = e.radiusAxis, n = e.angleAxis, r = e.displayedData, i = e.dataKey, a = e.bandSize, o = n.cx, s = n.cy, c = !1, l = [], u = n.type === "number" ? 0 : a ?? 0;
	r.forEach((e, r) => {
		var a = he(e, n.dataKey, r), d = he(e, i), f = (n.scale.map(a) ?? 0) + u, p = Array.isArray(d) ? er(d) : d, m = be(p) ? 0 : t.scale.map(p) ?? 0;
		Array.isArray(d) && d.length >= 2 && (c = !0), l.push(J(J({}, O(o, s, m, f)), {}, {
			name: a,
			value: d,
			cx: o,
			cy: s,
			radius: m,
			angle: f,
			payload: e
		}));
	});
	var d = [];
	return c && l.forEach((e) => {
		if (Array.isArray(e.value)) {
			var n = e.value[0], r = be(n) ? 0 : t.scale.map(n) ?? 0;
			d.push(J(J({}, e), {}, { radius: r }, O(o, s, r, e.angle)));
		} else d.push(e);
	}), {
		points: l,
		isRange: c,
		baseLinePoints: d
	};
}
function jr(e) {
	var t = e.showLabels, n = e.points, r = e.children, a = n.map((e) => {
		var t = {
			x: e.x,
			y: e.y,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return J(J({}, t), {}, {
			value: e.value ?? "",
			payload: e.payload,
			parentViewBox: void 0,
			viewBox: t,
			fill: void 0
		});
	});
	return /*#__PURE__*/ U.createElement(i, { value: t ? a : void 0 }, r);
}
function Mr(e) {
	var t = e.points, n = e.baseLinePoints, r = e.props;
	if (t == null) return null;
	var i = r.shape, a = r.isRange, o = r.connectNulls, s = /*#__PURE__*/ U.isValidElement(i) ? /*#__PURE__*/ U.cloneElement(i, J(J({}, r), {}, { points: t })) : typeof i == "function" ? i(J(J({}, r), {}, { points: t })) : /*#__PURE__*/ U.createElement(dn, q({}, Ne(r), {
		onMouseEnter: (e) => {
			var t = r.onMouseEnter;
			t && t(r, e);
		},
		onMouseLeave: (e) => {
			var t = r.onMouseLeave;
			t && t(r, e);
		},
		points: t,
		baseLinePoints: a ? n : void 0,
		connectNulls: o
	}));
	return /*#__PURE__*/ U.createElement(v, { className: "recharts-radar-polygon" }, s, /*#__PURE__*/ U.createElement(kr, {
		props: r,
		points: t
	}));
}
var Nr = (e, t) => e == null ? [] : t === 1 ? e.flatMap((e) => e.status === "removed" ? [] : [e.next]) : e.flatMap((e) => e.status === "removed" ? [] : e.status === "matched" ? [J(J({}, e.next), {}, {
	x: _e(e.prev.x, e.next.x, t),
	y: _e(e.prev.y, e.next.y, t)
})] : [J(J({}, e.next), {}, {
	x: _e(e.next.cx, e.next.x, t),
	y: _e(e.next.cy, e.next.y, t)
})]);
function Pr(e) {
	var n = e.props, r = e.previousPointsRef, i = e.previousBaseLinePointsRef, a = n.points, o = n.baseLinePoints, s = n.isAnimationActive, c = n.animationBegin, l = n.animationDuration, u = n.animationEasing, d = n.animationMatchBy, f = n.animationInterpolateFn, p = n.onAnimationStart, m = n.onAnimationEnd, h = Le(n, i), g = h.startValue, v = Se(g ?? null, o, d), y = Ie(p, m), b = y.isAnimating, x = y.handleAnimationStart, S = y.handleAnimationEnd, C = Be();
	return C == null ? null : /*#__PURE__*/ U.createElement(jr, {
		showLabels: !b,
		points: a
	}, /*#__PURE__*/ U.createElement(t, {
		animationInput: n,
		animationIdPrefix: "recharts-radar-",
		items: a,
		previousItemsRef: r,
		isAnimationActive: s,
		animationBegin: c,
		animationDuration: l,
		animationEasing: u,
		onAnimationStart: x,
		onAnimationEnd: S,
		animationInterpolateFn: f,
		animationMatchBy: d,
		layout: C
	}, (e, t) => {
		var r = t === 1 ? o : f(v, t, C);
		return h.syncStepValue(r, t), /*#__PURE__*/ U.createElement(Mr, {
			points: e,
			baseLinePoints: r,
			props: n
		});
	}), /*#__PURE__*/ U.createElement(_, { label: n.label }), n.children);
}
function Fr(e) {
	var t = (0, U.useRef)(void 0), n = (0, U.useRef)(void 0);
	return /*#__PURE__*/ U.createElement(Pr, {
		props: e,
		previousPointsRef: t,
		previousBaseLinePointsRef: n
	});
}
var Ir = {
	activeDot: !0,
	angleAxisId: 0,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: Ce,
	animationInterpolateFn: Nr,
	dot: !1,
	hide: !1,
	isAnimationActive: "auto",
	label: !1,
	legendType: "rect",
	radiusAxisId: 0,
	zIndex: m.area
};
function Lr(t) {
	var n = t.hide, r = t.className, i = t.points;
	if (n) return null;
	var a = I("recharts-radar", r);
	return /*#__PURE__*/ U.createElement(E, { zIndex: t.zIndex }, /*#__PURE__*/ U.createElement(v, { className: a }, /*#__PURE__*/ U.createElement(Fr, t)), /*#__PURE__*/ U.createElement(e, {
		points: i,
		mainColor: Er(t.stroke, t.fill),
		itemDataKey: t.dataKey,
		activeDot: t.activeDot
	}));
}
function Rr(e) {
	var t = ze(), n = A((n) => vr(n, e.radiusAxisId, e.angleAxisId, t, e.id));
	return n?.points == null ? null : /*#__PURE__*/ U.createElement(Lr, q({}, e, {
		points: n?.points,
		baseLinePoints: n?.baseLinePoints,
		isRange: n?.isRange
	}));
}
function zr(e) {
	var t = Ee(e, Ir);
	return /*#__PURE__*/ U.createElement(C, {
		id: t.id,
		type: "radar"
	}, (e) => /*#__PURE__*/ U.createElement(U.Fragment, null, /*#__PURE__*/ U.createElement(ee, {
		type: "radar",
		id: e,
		data: void 0,
		dataKey: t.dataKey,
		hide: t.hide,
		angleAxisId: t.angleAxisId,
		radiusAxisId: t.radiusAxisId
	}), /*#__PURE__*/ U.createElement(w, { legendPayload: Dr(t) }), /*#__PURE__*/ U.createElement(Or, {
		dataKey: t.dataKey,
		stroke: t.stroke,
		strokeWidth: t.strokeWidth,
		fill: t.fill,
		name: t.name,
		hide: t.hide,
		tooltipType: t.tooltipType,
		id: e
	}), /*#__PURE__*/ U.createElement(Rr, q({}, t, { id: e }))));
}
zr.displayName = "Radar";
// node_modules/recharts/es6/chart/RadarChart.js
function Br(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Vr(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Br(Object(n), !0).forEach(function(t) {
			Hr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Br(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Hr(e, t, n) {
	return (t = Ur(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Ur(e) {
	var t = Wr(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Wr(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Gr = ["axis"], Kr = Vr(Vr({}, se), {}, {
	layout: "centric",
	startAngle: 90,
	endAngle: -270
}), qr = /*#__PURE__*/ (0, U.forwardRef)((e, t) => {
	var n = Ee(e, Kr);
	return /*#__PURE__*/ U.createElement(b, {
		chartName: "RadarChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: Gr,
		tooltipPayloadSearcher: ie,
		categoricalChartProps: n,
		ref: t
	});
}), Y = Wt(), Jr = U.memo(function({ cx: e, cy: t, dataKey: n, chartId: r, className: i, fillOpacity: a = 1, type: o = "default", maskId: s }) {
	let c = U.useId().replace(/:/g, ""), l = `url(#${r}-colors-${String(n)})`;
	if (e === void 0 || t === void 0) return null;
	switch (o) {
		case "border": return /* @__PURE__ */ (0, Y.jsx)(Xr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
		case "colored-border": return /* @__PURE__ */ (0, Y.jsx)(Zr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
		default: return /* @__PURE__ */ (0, Y.jsx)(Yr, {
			cx: e,
			cy: t,
			dotId: c,
			fillOpacity: a,
			gradientUrl: l,
			className: i,
			maskId: s
		});
	}
}), Yr = U.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, Y.jsxs)("g", {
	className: a,
	mask: o ? `url(#${o})` : void 0,
	children: [/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsx)("clipPath", {
		id: `dot-clip-${n}`,
		children: /* @__PURE__ */ (0, Y.jsx)("circle", {
			cx: e,
			cy: t,
			r: 3
		})
	}) }), /* @__PURE__ */ (0, Y.jsx)("rect", {
		x: "0",
		y: t - 3,
		width: "100%",
		height: 6,
		fill: i,
		fillOpacity: r,
		clipPath: `url(#dot-clip-${n})`
	})]
}));
Yr.displayName = "DefaultDot";
var Xr = U.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, Y.jsxs)("g", {
	className: oe(a, "text-background"),
	mask: o ? `url(#${o})` : void 0,
	children: [
		/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsx)("clipPath", {
			id: `dot-clip-${n}`,
			children: /* @__PURE__ */ (0, Y.jsx)("circle", {
				cx: e,
				cy: t,
				r: 6
			})
		}) }),
		/* @__PURE__ */ (0, Y.jsx)("circle", {
			cx: e,
			cy: t,
			r: 6,
			fill: "currentColor"
		}),
		/* @__PURE__ */ (0, Y.jsx)("rect", {
			x: "0",
			y: t - (6 - 5 / 2),
			width: "100%",
			height: 7,
			fill: i,
			fillOpacity: r,
			clipPath: `url(#dot-clip-inner-${n})`
		}),
		/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsx)("clipPath", {
			id: `dot-clip-inner-${n}`,
			children: /* @__PURE__ */ (0, Y.jsx)("circle", {
				cx: e,
				cy: t,
				r: 6 - 5 / 2
			})
		}) })
	]
}));
Xr.displayName = "PrimaryBorderDot";
var Zr = U.memo(({ cx: e, cy: t, dotId: n, fillOpacity: r, gradientUrl: i, className: a, maskId: o }) => /* @__PURE__ */ (0, Y.jsxs)("g", {
	className: oe(a, "text-background"),
	mask: o ? `url(#${o})` : void 0,
	children: [
		/* @__PURE__ */ (0, Y.jsx)("defs", { children: /* @__PURE__ */ (0, Y.jsx)("clipPath", {
			id: `dot-clip-${n}`,
			children: /* @__PURE__ */ (0, Y.jsx)("circle", {
				cx: e,
				cy: t,
				r: 3.5
			})
		}) }),
		/* @__PURE__ */ (0, Y.jsx)("rect", {
			x: "0",
			y: t - 3 - 1 / 2,
			width: "100%",
			height: 7,
			fill: i,
			fillOpacity: r,
			clipPath: `url(#dot-clip-${n})`
		}),
		/* @__PURE__ */ (0, Y.jsx)("circle", {
			cx: e,
			cy: t,
			r: 3 - 1 / 2,
			fill: "currentColor"
		})
	]
}));
Zr.displayName = "ColoredBorderDot";
// src/react/evilcharts/registry/charts/recharts-radar-chart.tsx
var Qr = 1, $r = .3, ei = 6, ti = 1500, ni = "value", ri = (0, U.createContext)(null);
function X() {
	let e = (0, U.use)(ri);
	if (!e) throw Error("Radar chart parts (<Radar />, <PolarAngleAxis />, …) must be used within <EvilRadarChart />");
	return e;
}
function Z({ config: e, data: t, children: n, className: r, chartProps: i, backgroundVariant: a, defaultSelectedDataKey: c = null, onSelectionChange: l, isLoading: u = !1, loadingPoints: d }) {
	let f = (0, U.useId)().replace(/:/g, ""), [p, m] = (0, U.useState)(c), h = yi(u, d), g = (0, U.useCallback)((e) => {
		m(e), l?.(e);
	}, [l]), _ = (0, U.useMemo)(() => ({
		config: e,
		isLoading: u,
		selectedDataKey: p,
		selectDataKey: g
	}), [
		e,
		u,
		p,
		g
	]);
	return /* @__PURE__ */ (0, Y.jsx)(ri, {
		value: _,
		children: /* @__PURE__ */ (0, Y.jsxs)(s, {
			className: r,
			config: e,
			children: [/* @__PURE__ */ (0, Y.jsx)(y, { isLoading: u }), /* @__PURE__ */ (0, Y.jsxs)(qr, {
				id: f,
				data: u ? h : t,
				...i,
				children: [
					a && /* @__PURE__ */ (0, Y.jsx)(o, { variant: a }),
					n,
					u && /* @__PURE__ */ (0, Y.jsx)(bi, {})
				]
			})]
		})
	});
}
function ii({ dataKey: e, variant: t = "filled", fillOpacity: n = $r, isGlowing: r = !1, isClickable: i = !1, children: a, radarProps: o }) {
	let { config: s, isLoading: c, selectedDataKey: l, selectDataKey: u } = X(), d = (0, U.useId)().replace(/:/g, "");
	if (c) return null;
	let f = i && l !== null && l !== e, p = {
		stroke: f ? .2 : 1,
		fill: f ? .1 : 1,
		dot: f ? .2 : 1
	}, m = t === "filled", { dot: h, activeDot: g } = fi(a, d, e, p.dot);
	return /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)(zr, {
		dataKey: e,
		stroke: `url(#${d}-radar-stroke-${e})`,
		strokeOpacity: p.stroke,
		strokeWidth: Qr,
		fill: m ? `url(#${d}-radar-fill-${e})` : "none",
		fillOpacity: m ? n * p.fill : 0,
		dot: h,
		activeDot: g,
		filter: r ? `url(#${d}-radar-glow-${e})` : void 0,
		className: "transition-opacity duration-200",
		style: i ? { cursor: "pointer" } : void 0,
		onClick: () => {
			i && u(l === e ? null : e);
		},
		...o
	}), /* @__PURE__ */ (0, Y.jsxs)("defs", { children: [
		/* @__PURE__ */ (0, Y.jsx)(mi, {
			id: d,
			dataKey: e,
			config: s
		}),
		/* @__PURE__ */ (0, Y.jsx)(hi, {
			id: d,
			dataKey: e,
			config: s
		}),
		m && /* @__PURE__ */ (0, Y.jsx)(gi, {
			id: d,
			dataKey: e,
			config: s
		}),
		r && /* @__PURE__ */ (0, Y.jsx)(_i, {
			id: d,
			dataKey: e
		})
	] })] });
}
var ai = () => null, oi = () => null;
function si({ gridType: e = "polygon", stroke: t = "currentColor", strokeOpacity: n = .2, strokeDasharray: r = "3 4", ...i }) {
	return /* @__PURE__ */ (0, Y.jsx)(An, {
		gridType: e,
		stroke: t,
		strokeOpacity: n,
		strokeDasharray: r,
		...i
	});
}
function ci({ tick: e = {
	fill: "currentColor",
	fontSize: 12
}, tickLine: t = !1, ...n }) {
	let { isLoading: r } = X();
	return r ? null : /* @__PURE__ */ (0, Y.jsx)(un, {
		tick: e,
		tickLine: t,
		...n
	});
}
function li({ tick: e = {
	fill: "currentColor",
	fontSize: 10
}, tickLine: t = !1, axisLine: n = !1, ...r }) {
	let { isLoading: i } = X();
	return i ? null : /* @__PURE__ */ (0, Y.jsx)(Qn, {
		tick: e,
		tickLine: t,
		axisLine: n,
		...r
	});
}
function ui({ variant: e, roundness: t, defaultIndex: n }) {
	let { isLoading: r, selectedDataKey: i } = X();
	return r ? null : /* @__PURE__ */ (0, Y.jsx)(f, {
		defaultIndex: n,
		cursor: !1,
		content: /* @__PURE__ */ (0, Y.jsx)(p, {
			selected: i,
			roundness: t,
			variant: e
		})
	});
}
function di({ variant: e, align: t = "center", verticalAlign: n = "bottom", isClickable: r = !1 }) {
	let { isLoading: i, selectedDataKey: a, selectDataKey: o } = X();
	return i ? null : /* @__PURE__ */ (0, Y.jsx)(l, {
		verticalAlign: n,
		align: t,
		content: /* @__PURE__ */ (0, Y.jsx)(u, {
			selected: a,
			onSelectChange: o,
			isClickable: r,
			variant: e
		})
	});
}
var fi = (e, t, n, r) => {
	let i = !1, a = !1;
	return U.Children.forEach(e, (e) => {
		if ((0, U.isValidElement)(e)) {
			if (e.type === ai) {
				let { variant: a } = e.props;
				i = /* @__PURE__ */ (0, Y.jsx)(Jr, {
					type: a,
					dataKey: n,
					chartId: t,
					fillOpacity: r
				});
			}
			if (e.type === oi) {
				let { variant: i } = e.props;
				a = /* @__PURE__ */ (0, Y.jsx)(Jr, {
					type: i,
					dataKey: n,
					chartId: t,
					fillOpacity: r
				});
			}
		}
	}), {
		dot: i,
		activeDot: a
	};
}, pi = ({ dataKey: e, colorsCount: t, opacities: n }) => t === 1 ? /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsx)("stop", {
	offset: "0%",
	stopColor: `var(--color-${e}-0)`,
	stopOpacity: n?.[0]
}), /* @__PURE__ */ (0, Y.jsx)("stop", {
	offset: "100%",
	stopColor: `var(--color-${e}-0)`,
	stopOpacity: n?.[n.length - 1]
})] }) : /* @__PURE__ */ (0, Y.jsx)(Y.Fragment, { children: Array.from({ length: t }, (r, i) => {
	let a = `${i / (t - 1) * 100}%`;
	return /* @__PURE__ */ (0, Y.jsx)("stop", {
		offset: a,
		stopColor: `var(--color-${e}-${i}, var(--color-${e}-0))`,
		stopOpacity: n?.[i]
	}, a);
}) }), mi = ({ id: e, dataKey: t, config: n }) => {
	let r = pe(n[t] ?? {});
	return /* @__PURE__ */ (0, Y.jsx)("linearGradient", {
		id: `${e}-colors-${t}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "0",
		children: /* @__PURE__ */ (0, Y.jsx)(pi, {
			dataKey: t,
			colorsCount: r
		})
	});
}, hi = ({ id: e, dataKey: t, config: n }) => {
	let r = pe(n[t] ?? {});
	return /* @__PURE__ */ (0, Y.jsx)("linearGradient", {
		id: `${e}-radar-stroke-${t}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "1",
		children: /* @__PURE__ */ (0, Y.jsx)(pi, {
			dataKey: t,
			colorsCount: r
		})
	});
}, gi = ({ id: e, dataKey: t, config: n }) => {
	let r = pe(n[t] ?? {}), i = r === 1 ? [.8, .3] : Array.from({ length: r }, (e, t) => t === 0 ? .8 : .3);
	return /* @__PURE__ */ (0, Y.jsx)("radialGradient", {
		id: `${e}-radar-fill-${t}`,
		cx: "50%",
		cy: "50%",
		r: "50%",
		children: /* @__PURE__ */ (0, Y.jsx)(pi, {
			dataKey: t,
			colorsCount: r,
			opacities: i
		})
	});
}, _i = ({ id: e, dataKey: t }) => /* @__PURE__ */ (0, Y.jsxs)("filter", {
	id: `${e}-radar-glow-${t}`,
	x: "-50%",
	y: "-50%",
	width: "200%",
	height: "200%",
	children: [
		/* @__PURE__ */ (0, Y.jsx)("feGaussianBlur", {
			in: "SourceGraphic",
			stdDeviation: "4",
			result: "blur"
		}),
		/* @__PURE__ */ (0, Y.jsx)("feColorMatrix", {
			in: "blur",
			type: "matrix",
			values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0",
			result: "glow"
		}),
		/* @__PURE__ */ (0, Y.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, Y.jsx)("feMergeNode", { in: "glow" }), /* @__PURE__ */ (0, Y.jsx)("feMergeNode", { in: "SourceGraphic" })] })
	]
}), vi = (e) => [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F"
].slice(0, e).map((e) => ({
	skill: e,
	[ni]: 30 + Math.random() * 70
}));
function yi(e, t = ei) {
	let [n, r] = (0, U.useState)(0);
	return (0, U.useEffect)(() => {
		if (!e) return;
		let t = setInterval(() => {
			r((e) => e + 1);
		}, ti);
		return () => clearInterval(t);
	}, [e]), (0, U.useMemo)(() => vi(t), [t, n]);
}
var bi = () => /* @__PURE__ */ (0, Y.jsx)(zr, {
	dataKey: ni,
	stroke: "currentColor",
	strokeOpacity: .3,
	strokeWidth: 2,
	fill: "currentColor",
	fillOpacity: .1,
	dot: !1,
	isAnimationActive: !0,
	animationDuration: ti,
	animationEasing: "ease-in-out"
});
Z.Radar = ii, Z.Dot = ai, Z.ActiveDot = oi, Z.PolarGrid = si, Z.PolarAngleAxis = ci, Z.PolarRadiusAxis = li, Z.Tooltip = ui, Z.Legend = di;
// src/react/taste/charts.tsx
function xi(e) {
	let { x: t = 0, cx: n, textAnchor: r, payload: i, ...a } = e, o = String(i?.value ?? ""), s = typeof n == "number" ? n * 2 : 0, c = s ? r === "start" ? s - t : r === "end" ? t : 2 * Math.min(t, s - t) : 56;
	return /* @__PURE__ */ (0, Y.jsxs)("g", { children: [/* @__PURE__ */ (0, Y.jsx)("title", { children: o }), /* @__PURE__ */ (0, Y.jsx)(te, {
		...a,
		x: t,
		textAnchor: r,
		fill: "currentColor",
		fontSize: 12,
		children: le(o, c - 4)
	})] });
}
var Si = [
	"stroke-chart-1",
	"stroke-chart-2",
	"stroke-chart-3",
	"stroke-chart-4",
	"stroke-chart-5",
	"stroke-chart-6"
], Ci = [
	"fill-chart-1",
	"fill-chart-2",
	"fill-chart-3",
	"fill-chart-4",
	"fill-chart-5",
	"fill-chart-6"
], wi = { value: {
	label: "标签出现次数",
	colors: Fe(r[3])
} }, Ti = [
	"min-h-24",
	"min-h-24",
	"min-h-24",
	"min-h-32",
	"min-h-40",
	"min-h-48",
	"min-h-52",
	"min-h-60",
	"min-h-64"
], Ei = 26, Di = { radius: wi.value }, Oi = (e, t) => Math.sqrt(e / t);
function ki({ rows: e, label: t }) {
	let n = Bt(e);
	if (!n.length) return null;
	let r = n[0].value, i = n.map((e) => ({
		...e,
		radius: Oi(e.value, r)
	}));
	return /* @__PURE__ */ (0, Y.jsx)("div", {
		role: "img",
		"aria-label": `${t}：${i.map((e) => e.name).join("，")}`,
		children: /* @__PURE__ */ (0, Y.jsxs)(Z, {
			data: i,
			config: Di,
			chartProps: { outerRadius: "58%" },
			className: "aspect-auto h-70 text-text-secondary",
			children: [
				/* @__PURE__ */ (0, Y.jsx)(Z.PolarGrid, {}),
				/* @__PURE__ */ (0, Y.jsx)(Z.PolarAngleAxis, {
					dataKey: "name",
					tick: /* @__PURE__ */ (0, Y.jsx)(xi, {})
				}),
				/* @__PURE__ */ (0, Y.jsx)(Z.PolarRadiusAxis, {
					domain: [0, 1],
					allowDecimals: !0,
					tick: !1
				}),
				/* @__PURE__ */ (0, Y.jsx)(Z.Radar, { dataKey: "radius" }),
				/* @__PURE__ */ (0, Y.jsx)(d, { valueKey: "value" })
			]
		})
	});
}
function Ai({ rows: e, label: t }) {
	let n = en(e, 8);
	return n.length ? /* @__PURE__ */ (0, Y.jsx)("section", {
		"aria-label": t,
		className: `flex grow flex-col ${Ti[n.length]}`,
		children: /* @__PURE__ */ (0, Y.jsxs)(g, {
			data: n,
			config: wi,
			layout: "horizontal",
			barRadius: 4,
			chartProps: {
				maxBarSize: Ei,
				margin: {
					top: 5,
					right: 56,
					bottom: 5,
					left: 5
				}
			},
			className: "aspect-auto text-text-secondary",
			children: [
				/* @__PURE__ */ (0, Y.jsx)(g.YAxis, {
					dataKey: "name",
					interval: 0,
					tick: /* @__PURE__ */ (0, Y.jsx)(a, { along: "y" }),
					width: ae(n.map((e) => e.name))
				}),
				/* @__PURE__ */ (0, Y.jsx)(g.XAxis, {
					hide: !0,
					domain: cn
				}),
				/* @__PURE__ */ (0, Y.jsx)(g.Bar, {
					dataKey: "value",
					enableHoverHighlight: !0,
					barProps: {
						dataKey: "value",
						label: fn("right")
					}
				}),
				/* @__PURE__ */ (0, Y.jsx)(d, {})
			]
		})
	}) : null;
}
function ji({ flows: e }) {
	let [t, r] = (0, U.useState)(null), i = jt(e);
	if (!i) return null;
	let a = t?.node ?? null, o = (e, n) => t ? a === null ? t.label === n : e.source === a || e.target === a : !0;
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: n,
		children: [
			/* @__PURE__ */ (0, Y.jsx)(c, {
				title: "创作者线索来源",
				figure: (t ? t.value : i.total).toLocaleString(),
				note: t ? t.label : "条线索"
			}),
			/* @__PURE__ */ (0, Y.jsx)("ol", {
				"aria-label": "来源网站与创作者线索",
				className: "flex flex-col sm:hidden",
				children: [...i.links].sort((e, t) => t.value - e.value).map((e) => /* @__PURE__ */ (0, Y.jsxs)("li", {
					className: "flex items-baseline justify-between gap-3 border-b border-separator-border py-2 text-body-2-regular text-text-primary last:border-b-0",
					children: [/* @__PURE__ */ (0, Y.jsx)("span", {
						className: "min-w-0 wrap-anywhere",
						children: e.label
					}), /* @__PURE__ */ (0, Y.jsx)("b", {
						className: "shrink-0 tabular-nums",
						children: e.value.toLocaleString()
					})]
				}, e.key))
			}),
			/* @__PURE__ */ (0, Y.jsx)("div", {
				className: "min-w-0 max-sm:hidden",
				children: /* @__PURE__ */ (0, Y.jsxs)("svg", {
					viewBox: `0 0 ${Ye.width} ${i.height}`,
					fill: "none",
					role: "img",
					"aria-label": "来源网站与创作者线索",
					className: "block h-auto w-full",
					onPointerLeave: () => r(null),
					children: [/* @__PURE__ */ (0, Y.jsx)("g", { children: i.links.map((e) => /* @__PURE__ */ (0, Y.jsx)("path", {
						d: e.d,
						strokeWidth: e.width,
						tabIndex: 0,
						role: "img",
						"aria-label": `${e.label}：${e.value} 条线索`,
						fillOpacity: 0,
						strokeOpacity: o(e, e.label) ? .55 : .08,
						className: `outline-none transition-opacity ${Si[e.color]}`,
						onPointerEnter: () => r({
							value: e.value,
							label: e.label,
							node: null
						}),
						onFocus: () => r({
							value: e.value,
							label: e.label,
							node: null
						}),
						onBlur: () => r(null)
					}, e.key)) }), /* @__PURE__ */ (0, Y.jsx)("g", { children: i.nodes.map((e) => /* @__PURE__ */ (0, Y.jsxs)("g", {
						tabIndex: 0,
						role: "img",
						"aria-label": `${e.name}：${e.value} 条线索`,
						className: "outline-none focus-visible:opacity-100",
						onPointerEnter: () => r({
							value: e.value,
							label: e.name,
							node: e.index
						}),
						onFocus: () => r({
							value: e.value,
							label: e.name,
							node: e.index
						}),
						onBlur: () => r(null),
						children: [/* @__PURE__ */ (0, Y.jsx)("rect", {
							x: e.x,
							y: e.y,
							width: 10,
							height: e.height,
							rx: 5,
							className: e.side === "source" ? Ci[e.color] : "fill-text-secondary"
						}), /* @__PURE__ */ (0, Y.jsxs)("text", {
							x: Je[e.side],
							y: e.y + e.height / 2,
							textAnchor: e.side === "source" ? "end" : "start",
							dominantBaseline: "middle",
							className: "fill-text-secondary text-caption-1-regular",
							children: [Mt(e.name), /* @__PURE__ */ (0, Y.jsx)("tspan", {
								x: Je[e.side],
								dy: 15,
								children: e.side === "source" ? e.value.toLocaleString() : `${e.share.toFixed(1)}%`
							})]
						})]
					}, e.id)) })]
				})
			}),
			/* @__PURE__ */ (0, Y.jsxs)("footer", {
				className: "flex justify-between gap-3 text-caption-1-regular text-text-secondary max-sm:hidden",
				children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: "来源网站" }), /* @__PURE__ */ (0, Y.jsx)("span", { children: "创作者 · 线索占比" })]
			})
		]
	});
}
var Mi = {
	version: 1,
	note: "浏览器品牌标识仅用于识别相应数据源；商标归各自所有者。",
	icons: [
		{
			id: "chrome",
			aliases: [
				"chrome",
				"Google Chrome",
				"谷歌浏览器"
			],
			file: "chrome.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/chrome/chrome_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "eccdfe9d867373e2da66eedfcaaab40cbcdf6a221b83d6ee1400895a3e4c8046",
			bytes: 3166
		},
		{
			id: "chrome-beta",
			aliases: ["chrome-beta", "chrome beta"],
			file: "chrome-beta.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/chrome-beta/chrome-beta_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "34d7c73511f666e282e6ffca64315b53c287402de0e594976574a20e9031434f",
			bytes: 3731
		},
		{
			id: "chrome-dev",
			aliases: ["chrome-dev", "chrome dev"],
			file: "chrome-dev.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/chrome-dev/chrome-dev_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "3cc498eae83afeefb6f3ab5d24f4edead0ce6597e3afb91e4dcdaff923bb5a0a",
			bytes: 3706
		},
		{
			id: "chrome-canary",
			aliases: ["chrome-canary", "chrome canary"],
			file: "chrome-canary.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/chrome-canary/chrome-canary_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "590d38919b0c3df5dffeb1d4cbe9a24b211920932bcc367778f4962270e0997c",
			bytes: 1858
		},
		{
			id: "chromium",
			aliases: ["chromium", "Chromium浏览器"],
			file: "chromium.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/chromium/chromium_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "9fc23dba1ec6765aee3e6c200ee1b77a7e4ac56a25dd5a89027d3b01f3389d21",
			bytes: 2035
		},
		{
			id: "edge",
			aliases: [
				"edge",
				"Microsoft Edge",
				"微软Edge"
			],
			file: "edge.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/edge/edge_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "a189a6054451f74073ba27c9e0ff35f46402263a2f883a74b9f6a89bb42b7975",
			bytes: 3574
		},
		{
			id: "edge-beta",
			aliases: ["edge-beta", "edge beta"],
			file: "edge-beta.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/edge-beta/edge-beta_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "074d4b135e89f1621d55a48831196b5c95b27084e15ffeee7bd3ef869a06e394",
			bytes: 3820
		},
		{
			id: "edge-dev",
			aliases: ["edge-dev", "edge dev"],
			file: "edge-dev.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/edge-dev/edge-dev_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "70df54bb62d68ae61f042b54bced912ba87f334675b625963fa82bba172e2501",
			bytes: 3671
		},
		{
			id: "edge-canary",
			aliases: ["edge-canary", "edge canary"],
			file: "edge-canary.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/edge-canary/edge-canary_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "b0ec80dc2b855f7dc6b4ecee8735c3a397d5803a7a4801011c545d765e5ac705",
			bytes: 3728
		},
		{
			id: "firefox",
			aliases: [
				"firefox",
				"Mozilla Firefox",
				"火狐浏览器"
			],
			file: "firefox.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/firefox/firefox_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "98c4837a6cdce28d66cd51ea1e13cf130a5ac7bd097579a6714ad8345c16d3c9",
			bytes: 3943
		},
		{
			id: "firefox-beta",
			aliases: ["firefox-beta", "firefox beta"],
			file: "firefox-beta.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/firefox-beta/firefox-beta_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "2f25600de1c538cdf5965541c1f4960ef0a0da76fc0030b5a36af8288b9dac94",
			bytes: 4365
		},
		{
			id: "firefox-developer-edition",
			aliases: [
				"firefox-developer-edition",
				"firefox developer edition",
				"Firefox Developer Edition",
				"Firefox Dev"
			],
			file: "firefox-developer-edition.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/firefox-developer-edition/firefox-developer-edition_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "482ee0acf9deccbaf0253801f0a2ded2798b33166e3696fc1ae97f15788a335c",
			bytes: 4463
		},
		{
			id: "firefox-nightly",
			aliases: ["firefox-nightly", "firefox nightly"],
			file: "firefox-nightly.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/firefox-nightly/firefox-nightly_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "4082cba90a03962cd7be1ef6a8e7b3915d8b8e5411f919fbeb4d4f62684aa4cb",
			bytes: 4124
		},
		{
			id: "brave",
			aliases: ["brave"],
			file: "brave.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/brave/brave_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "fc67ee59d32612dc08eac9461fae8840441e888cceae7c07465ebdbfa58c5d63",
			bytes: 2416
		},
		{
			id: "brave-beta",
			aliases: ["brave-beta", "brave beta"],
			file: "brave-beta.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/brave-beta/brave-beta_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "fb029b4501f68c803429385b496bee9c3ce16710f8f12f9bae9f7db74bce2e1a",
			bytes: 3085
		},
		{
			id: "brave-dev",
			aliases: ["brave-dev", "brave dev"],
			file: "brave-dev.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/brave-dev/brave-dev_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "1797ab7fc86b1952851082f1dbeb7ff6816525d2654cdc0e455f7dd6d109a0da",
			bytes: 3837
		},
		{
			id: "brave-nightly",
			aliases: ["brave-nightly", "brave nightly"],
			file: "brave-nightly.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/brave-nightly/brave-nightly_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "e2f0e7506642d7491521f10250d0ede60c2a1e89ea7fdb6f8a2a366189643de4",
			bytes: 3929
		},
		{
			id: "vivaldi",
			aliases: ["vivaldi"],
			file: "vivaldi.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/vivaldi/vivaldi_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "2cef8b72a605bfd4b3a665e88773ff6e915972db1e874fd3373f34d8e43c03d1",
			bytes: 2657
		},
		{
			id: "vivaldi-snapshot",
			aliases: ["vivaldi-snapshot", "vivaldi snapshot"],
			file: "vivaldi-snapshot.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/vivaldi-snapshot/vivaldi-snapshot_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "d7adcb47765e5982d50565a4db328c6656d19503252f49855ae891dc655df22e",
			bytes: 2286
		},
		{
			id: "opera",
			aliases: ["opera"],
			file: "opera.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera/opera_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "907f47f584ca0f83446680a2ce1b4dc4dc81ac2e2bec0090e5b4ac98ccade4d4",
			bytes: 2152
		},
		{
			id: "opera-beta",
			aliases: ["opera-beta", "opera beta"],
			file: "opera-beta.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera-beta/opera-beta_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "1a5164ba569241ac87ceb2878190a261d52a63e4218ee16290f6adde7fe1380e",
			bytes: 4225
		},
		{
			id: "opera-developer",
			aliases: ["opera-developer", "opera developer"],
			file: "opera-developer.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera-developer/opera-developer_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "b5f0fbb90b11daa64b1642beddb00ae73120f46184f6a31e83584a6d2c91efc2",
			bytes: 3854
		},
		{
			id: "opera-gx",
			aliases: ["opera-gx", "opera gx"],
			file: "opera-gx.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera-gx/opera-gx_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "d92a6e2dbecfdbc0e4986d6eabce5f7c75804699fe8a7b64fe0c0167617a7d0e",
			bytes: 1504
		},
		{
			id: "opera-neon",
			aliases: ["opera-neon", "opera neon"],
			file: "opera-neon.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera-neon/opera-neon_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "12d0a029aa3f3b5e70805bb2c39304efdb1db75e59e9ba89f05f880dc0b6aa1a",
			bytes: 3385
		},
		{
			id: "opera-mini",
			aliases: ["opera-mini", "opera mini"],
			file: "opera-mini.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/opera-mini/opera-mini_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "2509f1615ead4c8ddb25dfcc6024ba2e2b98f4da2a012a4039882597903646f9",
			bytes: 3009
		},
		{
			id: "safari",
			aliases: ["safari", "Apple Safari"],
			file: "safari.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/safari/safari_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "5a4608283c36615ebcfb0762f64cfe5706b03bfdcedc5810fe10ee883ca4fff0",
			bytes: 4497
		},
		{
			id: "safari-technology-preview",
			aliases: ["safari-technology-preview", "safari technology preview"],
			file: "safari-technology-preview.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/safari-technology-preview/safari-technology-preview_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "29a6403e566b4b53f125bcdb7381d86eb14558e84d7ff4eb9f74e559fd4d8c72",
			bytes: 4404
		},
		{
			id: "samsung-internet",
			aliases: [
				"samsung-internet",
				"samsung internet",
				"Samsung Internet Browser"
			],
			file: "samsung-internet.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/samsung-internet/samsung-internet_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "239c8d26b38cba9fa9468555a93637b29de64d2f0f2769ddd007d78c564288b0",
			bytes: 1814
		},
		{
			id: "tor",
			aliases: ["tor"],
			file: "tor.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/tor/tor_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "54bae0a77f813c2c9bf7594b52e98931630a450a5ea42dced26e0df3f432fe01",
			bytes: 3685
		},
		{
			id: "tor-alpha",
			aliases: ["tor-alpha", "tor alpha"],
			file: "tor-alpha.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/tor-alpha/tor-alpha_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "9b8b2dfae28ac7fcb452e25225ce337b954ab9c8dc7939364ed1219c9c42864a",
			bytes: 3643
		},
		{
			id: "yandex",
			aliases: ["yandex"],
			file: "yandex.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/yandex/yandex_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "803d73b46b135e783ef9984a35ffcb0b43f31cfe8d6be4a1371598ebdc549f89",
			bytes: 3139
		},
		{
			id: "uc",
			aliases: ["uc", "UC浏览器"],
			file: "uc.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/uc/uc_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "7bfd919258b12a5900a8d19eabe1a16a0f7f50eaebe872fb7f13f6929cdf4c1e",
			bytes: 2853
		},
		{
			id: "dolphin",
			aliases: ["dolphin"],
			file: "dolphin.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/dolphin/dolphin_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "2c796d4a3ac4303edc73e33c3a36d709fbaa644b701d98ca1460aa6679c19aa9",
			bytes: 2018
		},
		{
			id: "maxthon",
			aliases: [
				"maxthon",
				"傲游",
				"傲游浏览器"
			],
			file: "maxthon.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/maxthon/maxthon_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "f807f58b4a0550a5470a713a4737054c5d5ecebe61687c77e77b2bfab1c544c5",
			bytes: 1375
		},
		{
			id: "midori",
			aliases: ["midori"],
			file: "midori.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/midori/midori_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "b3149a3d9dcbe8158078f8c47a39e839c2609f2dbce574e6175d4ef7f381f0d4",
			bytes: 4288
		},
		{
			id: "falkon",
			aliases: ["falkon"],
			file: "falkon.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/falkon/falkon_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "93992beb736d43622ddc085b41955aea13a735c011928c56076b5ed5c74d694c",
			bytes: 4285
		},
		{
			id: "pale-moon",
			aliases: ["pale-moon", "pale moon"],
			file: "pale-moon.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/pale-moon/pale-moon_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "6ffacc33960787e0411897a33524bb03c78df9204cf7dbfc5f063f4b5e73d5e1",
			bytes: 4771
		},
		{
			id: "seamonkey",
			aliases: ["seamonkey"],
			file: "seamonkey.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/seamonkey/seamonkey_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "37dd8ccb6700d83b030614329253af2ac68c44084c887a2d5ca10ea91aa066a5",
			bytes: 4525
		},
		{
			id: "web",
			aliases: [
				"web",
				"Epiphany",
				"GNOME Web"
			],
			file: "web.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/web/web_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "3f149719ecd35cefa8dae87a699550fbfa44b4d2d3b4b4c90ade545c3b9754a8",
			bytes: 2678
		},
		{
			id: "qutebrowser",
			aliases: ["qutebrowser"],
			file: "qutebrowser.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/qutebrowser/qutebrowser_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "8134a7f55a2ca191361ba3ecc5219e3d707a945c7e91e38da310ee12ffeee3eb",
			bytes: 3818
		},
		{
			id: "epic",
			aliases: ["epic"],
			file: "epic.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/epic/epic_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "53dfd851e21ab4f0727891cb2e330503cc250c05216d825be016e84e98ea4dd4",
			bytes: 5534
		},
		{
			id: "icecat",
			aliases: ["icecat"],
			file: "icecat.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/icecat/icecat_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "828718a56d67123abe3526fd42835ffbbb05769791922c2a0564dae92762ecc9",
			bytes: 5700
		},
		{
			id: "basilisk",
			aliases: ["basilisk"],
			file: "basilisk.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/basilisk/basilisk_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "9a0b3f467fe972e7a3e805fcc4b719eccfb1bb1d29d9a9f3afec7cc9dc2349f3",
			bytes: 2331
		},
		{
			id: "avant",
			aliases: ["avant"],
			file: "avant.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/avant/avant_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "a4c66ad8bc25ce59f71713f7c93629cd17b989d886cb8beacf178730631b01a5",
			bytes: 4586
		},
		{
			id: "otter",
			aliases: ["otter"],
			file: "otter.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/otter/otter_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "8fea2736a78b36e8c9eabfd5c47e7b46f28209aa9f1e2a199a54cfeeac290812",
			bytes: 5220
		},
		{
			id: "netsurf",
			aliases: ["netsurf"],
			file: "netsurf.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/netsurf/netsurf_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "d57d4ff6fb7052d5228932da17955232ecc5051908cf6580d73c6db3d2b248bd",
			bytes: 4003
		},
		{
			id: "puffin",
			aliases: ["puffin"],
			file: "puffin.png",
			content_type: "image/png",
			source_url: "https://raw.githubusercontent.com/alrra/browser-logos/58881b84c4d73adc03c06fa2c275a7abee02d935/src/puffin/puffin_48x48.png",
			source_page: "https://github.com/alrra/browser-logos",
			revision: "58881b84c4d73adc03c06fa2c275a7abee02d935",
			license: "Logo and trademark belong to the browser owner",
			sha256: "e182c2f54a37e0e1ff6a9469f1cb65bb8299f9b5eaca162c29b7cb9f6cc79768",
			bytes: 3697
		},
		{
			id: "aside",
			aliases: ["aside", "Aside Browser"],
			file: "aside.png",
			content_type: "image/png",
			source_url: "https://aside.com/icon.png?icon.0lfc1q-r_ms2e.png",
			source_page: "https://aside.com/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "949971a69f8643358bd52875a02a53e60136a88790487c83e42a24cb39f0adea",
			bytes: 27423
		},
		{
			id: "zen",
			aliases: ["zen", "Zen Browser"],
			file: "zen.svg",
			content_type: "image/svg+xml",
			source_url: "https://zen-browser.app/favicon.svg",
			source_page: "https://zen-browser.app/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "090a9ce0283dc66359be584bd1db9227faf4f15fc666f261759852e2519c7c68",
			bytes: 531
		},
		{
			id: "qq",
			aliases: [
				"qq",
				"QQBrowser",
				"QQ浏览器"
			],
			file: "qq.ico",
			content_type: "image/x-icon",
			source_url: "https://browser.qq.com/favicon.ico",
			source_page: "https://browser.qq.com/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "0c4cfdc5683b15f0b3b1019db71edfa975cadccbd61ce2f340acbdc4b114dbed",
			bytes: 2047
		},
		{
			id: "360se",
			aliases: ["360se", "360安全浏览器"],
			file: "360se.png",
			content_type: "image/png",
			source_url: "https://p4.ssl.qhimg.com/t110b9a93016f838be146a5b14d.png",
			source_page: "https://browser.360.cn/se/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "3363c9c2dd239ab6ac3a59501bf609cc2a94664ab5a1b8f0f0a2bec21aaab34a",
			bytes: 2219
		},
		{
			id: "360chrome",
			aliases: ["360chrome", "360极速浏览器"],
			file: "360chrome.ico",
			content_type: "image/x-icon",
			source_url: "https://browser.360.cn/ee/favicon.ico",
			source_page: "https://browser.360.cn/ee/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "eb11e02318a389cf4b9e06a8ca66694d2d544fbe8bfd28555e2189727675bd8e",
			bytes: 5430
		},
		{
			id: "sogou",
			aliases: [
				"sogou",
				"搜狗",
				"搜狗浏览器",
				"Sogou Explorer"
			],
			file: "sogou.ico",
			content_type: "image/x-icon",
			source_url: "https://sogou.browser.qq.com/favicon.ico",
			source_page: "https://ie.sogou.com/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "d9b78205c61561e23594886cc7bd24a5842a36602384f059efe670455c40c74f",
			bytes: 5430
		},
		{
			id: "arc",
			aliases: ["arc"],
			file: "arc.png",
			content_type: "image/png",
			source_url: "https://arc.net/favicon.png",
			source_page: "https://arc.net/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "2e6881ee4ea7b22e3bdd97f2432b7ce5bb3e3d5bbbdb5457a4a4f8b69a43e7bd",
			bytes: 1586
		},
		{
			id: "librewolf",
			aliases: ["librewolf"],
			file: "librewolf.svg",
			content_type: "image/svg+xml",
			source_url: "https://librewolf.net/icon.svg",
			source_page: "https://librewolf.net/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "b85d68f1b5b47b9b2c3a3e6b5f5a0f887577e0eb6ee8387fb7b81f5f8e4017c4",
			bytes: 5916
		},
		{
			id: "floorp",
			aliases: ["floorp"],
			file: "floorp.svg",
			content_type: "image/svg+xml",
			source_url: "https://floorp.app/icon.svg?51b46abeef3fc9d9",
			source_page: "https://floorp.app/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "15cf85f15cd722524008cb621763eb8560561048df210cf3a6180732c254f49b",
			bytes: 2199
		},
		{
			id: "waterfox",
			aliases: ["waterfox"],
			file: "waterfox.svg",
			content_type: "image/svg+xml",
			source_url: "https://www.waterfox.com/favicons/favicon.svg",
			source_page: "https://www.waterfox.net/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "05294e9a22b85b32fa632657ac3c2258f56d37f30931ababc494fe8a4b86ea7a",
			bytes: 9266
		},
		{
			id: "duckduckgo",
			aliases: ["duckduckgo"],
			file: "duckduckgo.png",
			content_type: "image/png",
			source_url: "https://duckduckgo.com/static-assets/favicons/DDG-iOS-icon_152x152.png",
			source_page: "https://duckduckgo.com/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "f6e52a35e8854ebf14c9b8442302f6f7d5d0063f0215b7210edf4676d7fd7369",
			bytes: 3576
		},
		{
			id: "115",
			aliases: [
				"115",
				"115浏览器",
				"115 Browser"
			],
			file: "115.ico",
			content_type: "image/x-icon",
			source_url: "https://115.com/",
			source_page: "https://115.com/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "fba0c364bb745bef18683be03f08b086cb5e46498b8c1dbd32ecdee6624303fe",
			bytes: 63051,
			extraction: {
				method: "PE resource extraction",
				executable: "115chrome.exe",
				executable_sha256: "31d3c29ffade6eb30504173b299d396a42758b2093c442b2adebe83f03750ae9",
				resource_group: "IDR_MAINFRAME"
			}
		},
		{
			id: "360chromex",
			aliases: [
				"360chromex",
				"360极速X",
				"360极速浏览器X"
			],
			file: "360chrome.ico",
			content_type: "image/x-icon",
			source_url: "https://browser.360.cn/ee/favicon.ico",
			source_page: "https://browser.360.cn/ee/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "eb11e02318a389cf4b9e06a8ca66694d2d544fbe8bfd28555e2189727675bd8e",
			bytes: 5430
		},
		{
			id: "quark",
			aliases: [
				"quark",
				"夸克",
				"夸克浏览器"
			],
			file: "quark.png",
			content_type: "image/png",
			source_url: "https://gw.alicdn.com/imgextra/i3/O1CN018r2tKf28YP7ev0fPF_!!6000000007944-2-tps-48-48.png",
			source_page: "https://www.quark.cn/",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "824e079d7d987305f2a0d15de5b1dfe0dc8cb7131afe1dbdaf1ea3ae3dd2d740",
			bytes: 1210
		},
		{
			id: "2345",
			aliases: [
				"2345",
				"2345浏览器",
				"2345加速浏览器"
			],
			file: "2345.png",
			content_type: "image/png",
			source_url: "https://img.onlinedown.net/download/202306/190435-649ac2436780c.png",
			source_page: "https://www.onlinedown.net/soft/111609.htm",
			revision: "",
			license: "Logo and trademark belong to the browser owner",
			sha256: "4c7a1b786d1208c89e00027c46544debe27a6f684b859cfd116b4e796703d38e",
			bytes: 29648
		}
	]
}, Ni = (e) => e.normalize("NFKC").toLowerCase().replace(/[\s_-]/g, ""), Pi = new Map(Mi.icons.flatMap((e) => e.aliases.map((t) => [Ni(t), e.id])));
function Fi(e) {
	return Pi.get(Ni(e));
}
function Ii({ name: e }) {
	let [t, n] = (0, U.useState)(""), r = Fi(e);
	return r && t !== r ? /* @__PURE__ */ (0, Y.jsx)("img", {
		src: `/browser-icon/${r}`,
		width: 24,
		height: 24,
		alt: "",
		"aria-hidden": !0,
		loading: "lazy",
		className: "size-6 shrink-0 object-contain",
		onError: () => n(r)
	}) : /* @__PURE__ */ (0, Y.jsx)(qe, {
		"aria-hidden": !0,
		className: "size-5 shrink-0 text-foreground-icon-secondary"
	});
}
// src/react/taste/browser-sources.tsx
var Li = "flex min-w-0 items-center gap-3 rounded-xl bg-background-primary-default p-3";
function Ri({ browsers: e, sources: t, range: n, children: r }) {
	let [i, a] = (0, U.useState)(!1), [o, s] = (0, U.useState)(""), [c, l] = (0, U.useState)(""), u = V({
		mutationFn: (e) => wt(e, n),
		onSuccess: (e) => {
			z.setQueryData(B(n), e.dashboard), a(!1), s(""), l("");
		}
	});
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: `${F()} flex flex-col gap-4`,
		"aria-label": "数据源",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, Y.jsx)("h3", {
					className: "text-title-2-medium text-text-primary",
					children: "数据源"
				}), /* @__PURE__ */ (0, Y.jsx)(j, {
					variant: "secondary",
					onClick: () => a(!0),
					disabled: i,
					children: "添加浏览器"
				})]
			}),
			u.error ? /* @__PURE__ */ (0, Y.jsx)(N, {
				tone: "error",
				children: L(u.error)
			}) : null,
			i ? /* @__PURE__ */ (0, Y.jsxs)("form", {
				className: "flex flex-col gap-3",
				onSubmit: (e) => {
					e.preventDefault(), u.isPending || u.mutate({
						operation: "add",
						name: o,
						path: c
					});
				},
				children: [
					/* @__PURE__ */ (0, Y.jsx)(Qe, {
						label: "浏览器名称",
						value: o,
						onChange: s,
						maxLength: 80,
						isRequired: !0,
						isDisabled: u.isPending
					}),
					/* @__PURE__ */ (0, Y.jsx)(Qe, {
						label: "资料目录或历史文件",
						value: c,
						onChange: l,
						maxLength: 1024,
						isRequired: !0,
						isDisabled: u.isPending,
						hint: "请选择运行 Peach 的电脑上的浏览器资料。"
					}),
					/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, Y.jsx)(j, {
							variant: "ghost",
							disabled: u.isPending,
							onClick: () => {
								a(!1), u.reset();
							},
							children: "取消"
						}), /* @__PURE__ */ (0, Y.jsx)(j, {
							type: "submit",
							variant: "secondary",
							disabled: !o.trim() || !c.trim(),
							...P(u.isPending),
							children: "添加"
						})]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, Y.jsxs)("div", {
				className: "inline-grid w-full min-w-0 gap-2 sm:grid-cols-2",
				children: [r, e.map((e) => {
					let n = t.filter((t) => e.source_keys?.includes(t.source_key)), r = n.reduce((e, t) => e + (t.visits || 0), 0), i = n.reduce((e, t) => e + (t.bookmarks || 0), 0);
					return /* @__PURE__ */ (0, Y.jsxs)("div", {
						"data-taste-source": "browser",
						className: Li,
						children: [
							/* @__PURE__ */ (0, Y.jsx)("span", {
								className: "inline-grid size-8 shrink-0 place-items-center rounded-lg text-text-secondary",
								children: /* @__PURE__ */ (0, Y.jsx)(Ii, { name: e.name })
							}),
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								className: "flex min-w-0 grow flex-col gap-0.5",
								children: [
									/* @__PURE__ */ (0, Y.jsx)("b", {
										className: "text-body-2-medium break-words text-text-primary",
										children: e.name
									}),
									/* @__PURE__ */ (0, Y.jsx)("span", {
										className: "break-all text-caption-1-regular text-text-secondary",
										children: e.path
									}),
									/* @__PURE__ */ (0, Y.jsx)("span", {
										className: "text-caption-1-regular text-text-secondary",
										children: e.enabled ? e.available ? `历史与书签 · ${e.profiles} 个资料` : "资料目录不可用" : "已停止读取"
									}),
									n.length ? /* @__PURE__ */ (0, Y.jsxs)("span", {
										className: "text-caption-1-regular text-text-secondary",
										children: [
											r.toLocaleString(),
											" 条历史 · ",
											i.toLocaleString(),
											" 枚书签"
										]
									}) : null
								]
							}),
							/* @__PURE__ */ (0, Y.jsxs)("span", {
								className: "flex shrink-0 gap-1",
								children: [/* @__PURE__ */ (0, Y.jsx)(j, {
									variant: "secondary",
									size: "small",
									...P(u.isPending),
									iconOnly: !0,
									leadingIcon: e.enabled ? it : Xe,
									"aria-label": `${e.enabled ? "停止读取" : "启用"} ${e.name}`,
									onClick: () => {
										e.enabled ? Tt({
											title: `停止读取 ${e.name}`,
											body: "已导入的历史与书签仍用于口味分析。",
											confirmLabel: "停止读取",
											onConfirm: () => u.mutateAsync({
												operation: "disable",
												id: e.id
											})
										}) : u.mutate({
											operation: "enable",
											id: e.id
										});
									}
								}), /* @__PURE__ */ (0, Y.jsx)(j, {
									variant: "secondary",
									size: "small",
									iconOnly: !0,
									leadingIcon: $e,
									...P(u.isPending),
									"aria-label": `删除 ${e.name}`,
									onClick: () => {
										Tt({
											title: `删除 ${e.name}`,
											body: "移除该浏览器的读取配置和已导入历史、书签，浏览器原文件保留。可以通过添加浏览器重新接入。",
											confirmLabel: "删除浏览器来源",
											danger: !0,
											onConfirm: () => u.mutateAsync({
												operation: "delete_browser",
												id: e.id
											})
										});
									}
								})]
							})
						]
					}, e.id);
				})]
			})
		]
	});
}
// src/react/taste/taste-page.tsx
var zi = 10, Bi = Et(et, tt, "text-body-2-medium"), Q = `${F()} flex flex-col gap-4`, Vi = "rounded-xl bg-background-primary-default p-3", Hi = "读取运行 Peach 的这台电脑上的浏览历史与书签", Ui = "导入或读取浏览记录后，这里会列出记录来自哪些设备。", Wi = "馆藏中暂时没有与你浏览过的内容相符的标签。", Gi = "读取浏览记录后，这里会按类别汇总你浏览过的内容。", Ki = "这些标签出现在浏览记录中，Peach 的观看或评价记录中尚未出现这些标签", qi = "采集浏览记录后，这里会列出浏览过的标签。", Ji = "采集浏览记录后，这里会列出浏览过的创作者。", Yi = "采集浏览记录后，这里会列出常访问的网站。", Xi = "在 Peach 里播放或评价作品后，这里会列出对应的标签。", Zi = "在 Peach 里播放或评价作品后，这里会列出对应的创作者。", Qi = "在 Peach 里播放或评价作品后，这里会列出对应的女优。", $i = "在运行 Peach 的电脑上使用浏览器：点上面的「读取浏览器记录」。", ea = "记录在其他设备上：导出文件后，选择「导入历史文件」或「导入书签文件」。书签支持浏览器导出的 HTML 文件和 Chromium Bookmarks JSON 文件。", ta = "需要刷新时再次读取或导入；数据源可在页面底部移除。", na = "删除这个来源的已导入记录，原始文件保留。若浏览器仍启用，下次读取会再次导入。", ra = "peach-taste-guide-dismissed", ia = (0, U.createContext)(/* @__PURE__ */ (0, Y.jsx)(Ge, {
	size: "small",
	href: "/",
	children: "浏览馆藏"
}));
function aa() {
	return (0, U.useContext)(ia);
}
function $({ icon: e, term: t, figure: n, detail: r, detailTitle: i, accent: a }) {
	return /* @__PURE__ */ (0, Y.jsx)("div", {
		className: Jt(),
		children: /* @__PURE__ */ (0, Y.jsx)(pt, {
			label: t,
			icon: e,
			accent: a,
			figure: n,
			footer: /* @__PURE__ */ (0, Y.jsx)("span", {
				className: "block min-w-0 truncate",
				title: i || r,
				children: r ?? ""
			})
		})
	});
}
function oa({ name: e, domain: t }) {
	return /* @__PURE__ */ (0, Y.jsxs)("span", {
		className: "relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg bg-background-tertiary-default text-caption-1-medium text-text-secondary",
		children: [At(e).toUpperCase(), /* @__PURE__ */ (0, Y.jsx)("img", {
			src: Kt({ domain: t }),
			alt: "",
			loading: "lazy",
			width: 20,
			height: 20,
			onError: (e) => e.currentTarget.remove(),
			className: "absolute size-5 object-contain"
		})]
	});
}
function sa({ html: e }) {
	return /* @__PURE__ */ (0, Y.jsx)("span", {
		className: `relative inline-grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-background-tertiary-default text-caption-1-medium text-text-secondary ${on}`,
		dangerouslySetInnerHTML: { __html: e }
	});
}
function ca({ rows: e, kind: t, visual: n, empty: r, onSignal: i }) {
	if (!e.length) return /* @__PURE__ */ (0, Y.jsx)(M, {
		size: "compact",
		icon: R,
		title: "记录还不够",
		actions: /* @__PURE__ */ (0, Y.jsx)(aa, {}),
		children: r
	});
	let a = Ht(e);
	return /* @__PURE__ */ (0, Y.jsx)(ln, {
		previewCount: zi,
		className: "inline-grid w-full gap-x-7 gap-y-2 sm:grid-cols-2",
		children: e.map((e, r) => {
			let o = !!t && !!e.peach_items, s = String(e.source_domain || ""), c = /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [
				/* @__PURE__ */ (0, Y.jsx)("svg", {
					viewBox: "0 0 100 1",
					preserveAspectRatio: "none",
					"aria-hidden": !0,
					className: "absolute inset-0 -z-10 size-full overflow-hidden rounded-lg opacity-15",
					children: /* @__PURE__ */ (0, Y.jsx)("rect", {
						width: a[r],
						height: 1,
						className: "fill-chart-4"
					})
				}),
				/* @__PURE__ */ (0, Y.jsx)("span", {
					className: "w-6 shrink-0 text-caption-1-regular tabular-nums text-text-secondary",
					children: r + 1
				}),
				n === "domain" ? /* @__PURE__ */ (0, Y.jsx)(oa, {
					name: e.name,
					domain: e.name
				}) : null,
				n === "creator" && !e.entity_id && !e.has_avatar && s ? /* @__PURE__ */ (0, Y.jsx)(oa, {
					name: e.name,
					domain: s
				}) : null,
				n !== "none" && n !== "domain" && (e.entity_id || e.has_avatar || !s) ? /* @__PURE__ */ (0, Y.jsx)(sa, { html: St(e.name, e.entity_id ? {
					id: e.entity_id,
					has_image: !!e.has_image,
					image_version: e.image_version,
					avatar_focus: e.avatar_focus,
					avatar_stand_in: e.avatar_stand_in
				} : null, e.has_avatar ? e.representative_asset_id ?? null : null, n === "creator" ? "creator" : t || "performer") }) : null,
				/* @__PURE__ */ (0, Y.jsxs)("span", {
					className: "flex min-w-0 grow flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, Y.jsx)("b", {
						className: "min-w-0 text-body-medium break-words text-text-primary",
						children: e.name
					}), /* @__PURE__ */ (0, Y.jsx)("small", {
						className: "text-caption-1-regular text-text-secondary",
						children: Vt(e)
					})]
				}),
				o ? /* @__PURE__ */ (0, Y.jsx)(zt, {
					"aria-hidden": !0,
					className: "size-4 shrink-0 text-text-tertiary"
				}) : null
			] }), l = "relative isolate flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left";
			return /* @__PURE__ */ (0, Y.jsx)("li", {
				className: "min-w-0",
				children: o ? /* @__PURE__ */ (0, Y.jsx)("button", {
					type: "button",
					onClick: () => i(t, e.name),
					className: `${l} cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring`,
					children: c
				}) : /* @__PURE__ */ (0, Y.jsx)("div", {
					className: l,
					children: c
				})
			}, `${e.name}:${r}`);
		})
	});
}
function la({ label: e, panels: t, onSignal: n }) {
	return /* @__PURE__ */ (0, Y.jsxs)(We, {
		className: `${F({ padding: "none" })} flex flex-col`,
		children: [/* @__PURE__ */ (0, Y.jsx)("div", {
			className: "px-4 pt-3",
			children: /* @__PURE__ */ (0, Y.jsx)(ut, {
				"aria-label": e,
				className: ct,
				children: t.map((e) => /* @__PURE__ */ (0, Y.jsx)(Ue, {
					id: e.id,
					className: st,
					children: e.name
				}, e.id))
			})
		}), t.map((e) => /* @__PURE__ */ (0, Y.jsx)(He, {
			id: e.id,
			className: "px-4 pt-3.5 pb-4",
			children: /* @__PURE__ */ (0, Y.jsx)(ca, {
				...e.props,
				onSignal: n
			})
		}, e.id))]
	});
}
function ua({ data: e, onSignal: t, navigate: n }) {
	let r = e.analysis;
	if (!r?.headline) return null;
	let i = r.confidence || {}, a = [...(r.explore || []).map((e) => ({
		key: `tag:${e.tag}`,
		title: e.title,
		detail: e.detail,
		act: () => t("tag", e.tag)
	})), ...(r.next_steps || []).map((e) => ({
		key: `route:${e.route}`,
		title: e.title,
		detail: e.detail,
		act: () => n(e.route)
	}))];
	return /* @__PURE__ */ (0, Y.jsxs)("section", {
		className: Q,
		"aria-label": "口味总结",
		children: [
			/* @__PURE__ */ (0, Y.jsxs)("header", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, Y.jsx)("h3", {
						className: "text-title-2-medium text-text-primary",
						children: "口味总结"
					}),
					/* @__PURE__ */ (0, Y.jsx)("p", {
						className: "max-w-prose text-title-2-regular wrap-anywhere text-text-primary",
						children: r.headline
					}),
					/* @__PURE__ */ (0, Y.jsxs)("p", {
						className: "flex flex-wrap items-center gap-2 text-body-2-regular text-text-secondary",
						children: [/* @__PURE__ */ (0, Y.jsx)("i", {
							"aria-hidden": !0,
							className: `size-2 shrink-0 rounded-full ${i.level === "high" ? "bg-status-lime-text" : i.level === "medium" ? "bg-status-yellow-text" : "bg-text-tertiary"}`
						}), /* @__PURE__ */ (0, Y.jsx)("span", {
							className: "min-w-0 wrap-anywhere",
							children: i.label || "仍在学习"
						})]
					})
				]
			}),
			r.points?.length ? /* @__PURE__ */ (0, Y.jsx)("div", {
				className: "inline-grid w-full gap-3 sm:grid-cols-2",
				children: r.points.map((e) => /* @__PURE__ */ (0, Y.jsxs)("div", {
					className: `flex min-w-0 flex-col gap-1 ${Vi}`,
					children: [/* @__PURE__ */ (0, Y.jsx)("span", {
						className: "text-caption-1-regular text-text-secondary",
						children: e.label
					}), /* @__PURE__ */ (0, Y.jsx)("b", {
						className: "text-body-2-medium break-words text-text-primary",
						children: e.text
					})]
				}, e.label))
			}) : null,
			a.length ? /* @__PURE__ */ (0, Y.jsx)("div", {
				className: "flex flex-col gap-2",
				children: a.map((e) => /* @__PURE__ */ (0, Y.jsxs)("button", {
					type: "button",
					onClick: e.act,
					className: `flex w-full min-w-0 cursor-pointer items-center gap-3 ${Vi} text-left outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring`,
					children: [/* @__PURE__ */ (0, Y.jsxs)("span", {
						className: "flex min-w-0 grow flex-col gap-1",
						children: [/* @__PURE__ */ (0, Y.jsx)("b", {
							className: "text-body-2-medium wrap-anywhere text-text-primary",
							children: e.title
						}), /* @__PURE__ */ (0, Y.jsx)("small", {
							className: "text-caption-1-regular wrap-anywhere text-text-secondary",
							children: e.detail
						})]
					}), /* @__PURE__ */ (0, Y.jsx)(zt, {
						"aria-hidden": !0,
						className: "size-4 shrink-0 text-text-tertiary"
					})]
				}, e.key))
			}) : /* @__PURE__ */ (0, Y.jsx)(M, {
				size: "compact",
				icon: R,
				title: "还没有可探索的入口",
				actions: /* @__PURE__ */ (0, Y.jsx)(Ge, {
					size: "small",
					href: "/",
					children: "浏览馆藏"
				}),
				children: Wi
			})
		]
	});
}
function da({ onboarding: e, done: t }) {
	let [n, r] = (0, U.useState)(() => {
		try {
			return localStorage.getItem(ra) === "1";
		} catch {
			return !1;
		}
	});
	return t || n ? null : /* @__PURE__ */ (0, Y.jsx)("div", {
		className: F({
			padding: "none",
			className: "p-4"
		}),
		children: /* @__PURE__ */ (0, Y.jsxs)(Ke, {
			summary: "浏览器历史记录导入指南",
			defaultOpen: e,
			children: [
				/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: $i
				}),
				/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: ea
				}),
				/* @__PURE__ */ (0, Y.jsxs)("ul", {
					className: "flex list-disc flex-col gap-1 pl-5 text-body-2-regular text-text-secondary",
					children: [/* @__PURE__ */ (0, Y.jsxs)("li", { children: [
						"Chrome：在 ",
						/* @__PURE__ */ (0, Y.jsxs)("a", {
							href: "https://takeout.google.com/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-text-primary underline-offset-4 hover:underline",
							children: ["Google Takeout", /* @__PURE__ */ (0, Y.jsx)(_t, {
								"aria-hidden": !0,
								className: "size-(--icon-inline) shrink-0"
							})]
						}),
						" ",
						"选择 Chrome 历史记录，下载 ZIP 后直接导入。"
					] }), /* @__PURE__ */ (0, Y.jsxs)("li", { children: [
						"其他浏览器：用 ",
						/* @__PURE__ */ (0, Y.jsxs)("a", {
							href: "https://github.com/purarue/browserexport",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-text-primary underline-offset-4 hover:underline",
							children: ["browserexport", /* @__PURE__ */ (0, Y.jsx)(_t, {
								"aria-hidden": !0,
								className: "size-(--icon-inline) shrink-0"
							})]
						}),
						" ",
						"导出历史记录，再导入导出文件。"
					] })]
				}),
				/* @__PURE__ */ (0, Y.jsx)("p", {
					className: "text-body-2-regular text-text-secondary",
					children: ta
				}),
				/* @__PURE__ */ (0, Y.jsx)("span", {
					className: "self-start",
					children: /* @__PURE__ */ (0, Y.jsx)(j, {
						variant: "secondary",
						size: "small",
						onClick: () => {
							try {
								localStorage.setItem(ra, "1");
							} catch {}
							r(!0);
						},
						children: "跳过"
					})
				})
			]
		})
	});
}
function fa({ busy: e, onRefresh: t, onImport: n, onImportBookmarks: r }) {
	let i = (0, U.useRef)(null), [a, o] = (0, U.useState)(!1), s = (e) => {
		o(!1), e();
	};
	return /* @__PURE__ */ (0, Y.jsxs)(Y.Fragment, { children: [/* @__PURE__ */ (0, Y.jsxs)("span", {
		"data-guide-target": "history-import",
		"data-button-group": !0,
		"data-split-button": !0,
		"data-variant": "primary",
		children: [/* @__PURE__ */ (0, Y.jsx)(j, {
			leadingIcon: qe,
			title: Hi,
			onClick: t,
			...P(e),
			children: "读取浏览器记录"
		}), /* @__PURE__ */ (0, Y.jsx)(j, {
			ref: i,
			iconOnly: !0,
			leadingIcon: Dt,
			"aria-label": "更多取得浏览记录的方式",
			"aria-haspopup": "dialog",
			"aria-expanded": a,
			...P(e),
			onClick: () => {
				e || o(!0);
			}
		})]
	}), /* @__PURE__ */ (0, Y.jsx)(Ve, {
		triggerRef: i,
		isOpen: a,
		onOpenChange: o,
		placement: "bottom end",
		offset: 4,
		className: nt,
		children: /* @__PURE__ */ (0, Y.jsxs)(rt, {
			"aria-label": "更多取得浏览记录的方式",
			className: "flex w-52 flex-col gap-1 outline-none",
			children: [
				/* @__PURE__ */ (0, Y.jsxs)("button", {
					type: "button",
					className: Bi,
					onClick: () => s(t),
					children: [/* @__PURE__ */ (0, Y.jsx)(qe, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "读取浏览器记录"]
				}),
				/* @__PURE__ */ (0, Y.jsxs)("button", {
					type: "button",
					className: Bi,
					onClick: () => s(n),
					children: [/* @__PURE__ */ (0, Y.jsx)(ot, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "导入历史文件"]
				}),
				/* @__PURE__ */ (0, Y.jsxs)("button", {
					type: "button",
					className: Bi,
					onClick: () => s(r),
					children: [/* @__PURE__ */ (0, Y.jsx)(Pt, {
						"aria-hidden": !0,
						className: "size-4 shrink-0"
					}), "导入书签文件"]
				})
			]
		})
	})] });
}
function pa({ sources: e, browsers: t, window: n, toast: r, emptyActions: i }) {
	let a = V({
		mutationFn: (e) => Ut(e, n),
		onSuccess: (e) => {
			z.setQueryData(B(n), e.dashboard), r("已移除口味数据源");
		}
	});
	return /* @__PURE__ */ (0, Y.jsxs)(Ri, {
		browsers: t,
		sources: e,
		range: n,
		children: [a.error ? /* @__PURE__ */ (0, Y.jsx)("div", {
			className: "sm:col-span-2",
			children: /* @__PURE__ */ (0, Y.jsx)(N, {
				tone: "error",
				children: L(a.error)
			})
		}) : null, e.length ? /* @__PURE__ */ (0, Y.jsx)(Y.Fragment, { children: e.filter((e) => !t.some((t) => t.source_keys?.includes(e.source_key))).map((e) => /* @__PURE__ */ (0, Y.jsxs)("div", {
			"data-taste-source": "import",
			className: Li,
			children: [
				/* @__PURE__ */ (0, Y.jsx)("span", {
					className: "inline-grid size-8 shrink-0 place-items-center rounded-lg text-text-secondary",
					children: e.browser === "browserexport" ? /* @__PURE__ */ (0, Y.jsx)(ot, {
						"aria-hidden": !0,
						className: "size-4"
					}) : /* @__PURE__ */ (0, Y.jsx)(yt, {
						"aria-hidden": !0,
						className: "size-4"
					})
				}),
				/* @__PURE__ */ (0, Y.jsxs)("span", {
					className: "flex min-w-0 grow flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, Y.jsx)("b", {
						className: "min-w-0 text-body-2-medium break-words text-text-primary",
						children: e.profile
					}), /* @__PURE__ */ (0, Y.jsx)("small", {
						className: "min-w-0 text-caption-1-regular break-words text-text-secondary",
						children: `导入文件 · ${e.host} · ${Number(e.visits || e.bookmarks || 0).toLocaleString()} ${e.bookmarks ? "枚书签" : "条历史"}`
					})]
				}),
				/* @__PURE__ */ (0, Y.jsx)(j, {
					variant: "secondary",
					size: "small",
					"aria-label": `移除 ${e.profile}`,
					className: "shrink-0",
					iconOnly: !0,
					leadingIcon: $e,
					...P(a.isPending),
					onClick: () => {
						a.isPending || Tt({
							title: "移除口味数据源",
							body: na,
							confirmLabel: "移除口味数据源",
							onConfirm: () => a.mutateAsync(e.source_key)
						});
					}
				})
			]
		}, e.source_key)) }) : t.length ? null : /* @__PURE__ */ (0, Y.jsx)(M, {
			size: "compact",
			icon: yt,
			title: "还没有数据源",
			actions: i,
			children: Ui
		})]
	});
}
function ma(e) {
	let { onSignal: t, navigate: n, toast: r, onboarding: i } = e, [a, o] = (0, U.useState)("all"), [s, c] = (0, U.useState)("browser"), l = (0, U.useRef)(null), u = (0, U.useRef)(null), d = rn({
		queryKey: B(a),
		queryFn: ({ signal: e }) => Ot(a, e),
		placeholderData: Lt,
		refetchInterval: (e) => Qt(e.state.data)
	}), { job: f, running: p, outcome: m, start: h } = nn({
		queryKey: mt,
		queryFn: ({ signal: e }) => kt(e),
		start: () => qt(a),
		idlePollMs: Ze,
		onFinish: (e) => {
			e.status !== "failed" && (z.invalidateQueries({ queryKey: ["taste"] }), r(e.warnings?.length ? "部分浏览记录未取得" : "已更新口味分析"));
		}
	}), g = V({
		mutationFn: (e) => Ot(e, void 0, !0),
		onSuccess: (e, t) => {
			z.setQueryData(B(t), e);
		}
	}), _ = V({
		mutationFn: (e) => It(e),
		onSuccess: (e) => {
			z.setQueryData(B("all"), e.dashboard), o("all"), r("已导入口味数据");
		}
	}), v = (e) => {
		let t = e.currentTarget.files?.[0];
		e.currentTarget.value = "", t && !_.isPending && (_.reset(), _.mutate(t));
	}, y = () => {
		p || h.isPending || (h.reset(), h.mutate());
	}, b = d.data;
	if (!b) return /* @__PURE__ */ (0, Y.jsx)(an, { children: /* @__PURE__ */ (0, Y.jsx)(N, {
		tone: "error",
		title: "口味分析读取失败",
		children: d.error ? L(d.error) : "读取口味分析失败"
	}) });
	let x = b.summary || {}, S = b.coverage || {}, C = b.rankings || {}, ee = b.storage || {}, w = Xt(C.browser_categories || []), T = Bt(w).length > 0, te = b.gaps || [], E = S.tagged || 0, ne = S.identified || 0, re = h.error ? L(h.error) : _.error ? L(_.error) : g.error ? L(g.error) : m?.status === "failed" ? m.error || "读取未取得" : "", ie = /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex flex-wrap justify-center gap-2",
		children: [/* @__PURE__ */ (0, Y.jsx)(j, {
			variant: "secondary",
			...P(p || h.isPending || _.isPending),
			onClick: y,
			children: "读取浏览器记录"
		}), /* @__PURE__ */ (0, Y.jsx)(j, {
			variant: "secondary",
			...P(_.isPending),
			onClick: () => l.current?.click(),
			children: "导入历史文件"
		})]
	});
	return /* @__PURE__ */ (0, Y.jsx)(an, { children: /* @__PURE__ */ (0, Y.jsxs)(ia, {
		value: a === "all" ? s === "peach" ? /* @__PURE__ */ (0, Y.jsx)(Ge, {
			size: "small",
			variant: "secondary",
			href: "/",
			children: "浏览馆藏"
		}) : ie : /* @__PURE__ */ (0, Y.jsx)(j, {
			size: "small",
			variant: "secondary",
			onClick: () => o("all"),
			children: "查看全部时间"
		}),
		children: [
			/* @__PURE__ */ (0, Y.jsxs)(We, {
				selectedKey: s,
				onSelectionChange: (e) => c(String(e)),
				className: "flex flex-col gap-5",
				children: [
					/* @__PURE__ */ (0, Y.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, Y.jsxs)(ut, {
							"aria-label": "口味分析的数据来源",
							className: ct,
							children: [/* @__PURE__ */ (0, Y.jsx)(Ue, {
								id: "browser",
								className: st,
								children: "浏览器记录"
							}), /* @__PURE__ */ (0, Y.jsx)(Ue, {
								id: "peach",
								className: st,
								children: "Peach 观看与评价"
							})]
						}), /* @__PURE__ */ (0, Y.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, Y.jsx)(dt, {
									"aria-label": "分析范围",
									selectedKey: a,
									onSelectionChange: (e) => {
										e !== null && o(String(e));
									},
									children: ht.map(([e, t]) => /* @__PURE__ */ (0, Y.jsx)(ft, {
										id: e,
										children: t
									}, e))
								}),
								/* @__PURE__ */ (0, Y.jsx)(fa, {
									busy: p || h.isPending || _.isPending,
									onRefresh: y,
									onImport: () => l.current?.click(),
									onImportBookmarks: () => u.current?.click()
								}),
								/* @__PURE__ */ (0, Y.jsx)("input", {
									ref: l,
									type: "file",
									tabIndex: -1,
									"aria-hidden": !0,
									className: "hidden",
									onChange: v
								}),
								/* @__PURE__ */ (0, Y.jsx)("input", {
									ref: u,
									type: "file",
									tabIndex: -1,
									"aria-hidden": !0,
									className: "hidden",
									"data-bookmark-import": !0,
									onChange: v
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, Y.jsx)(da, {
						onboarding: i,
						done: !!(x.history_sources || b.updated_at)
					}),
					/* @__PURE__ */ (0, Y.jsxs)("div", {
						"aria-live": "polite",
						className: "flex flex-col gap-3 empty:hidden",
						children: [
							p ? /* @__PURE__ */ (0, Y.jsx)(gt, {
								label: f?.message || "正在读取浏览记录并更新口味分析",
								value: f?.checked,
								total: f?.total
							}) : null,
							_.isPending ? /* @__PURE__ */ (0, Y.jsx)(gt, { label: "正在导入口味数据" }) : null,
							b.stale && b.error ? /* @__PURE__ */ (0, Y.jsx)(N, {
								tone: "error",
								action: /* @__PURE__ */ (0, Y.jsx)(j, {
									variant: "secondary",
									size: "small",
									...P(g.isPending),
									onClick: () => g.mutate(a),
									children: "立即重试"
								}),
								children: `口味分析更新失败，当前显示 ${$t(b.computed_at)} 的结果。${b.error}`
							}) : b.stale ? /* @__PURE__ */ (0, Y.jsx)(gt, { label: `正在更新口味分析，当前显示 ${$t(b.computed_at)} 的结果` }) : null,
							re ? /* @__PURE__ */ (0, Y.jsx)(N, {
								tone: "error",
								children: re
							}) : null,
							m?.warnings?.length ? /* @__PURE__ */ (0, Y.jsx)(N, {
								tone: "warning",
								children: m.warnings.join("；")
							}) : null
						]
					}),
					/* @__PURE__ */ (0, Y.jsxs)(He, {
						id: "browser",
						className: "flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								className: lt,
								children: [
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 0,
										icon: tn,
										term: "浏览记录",
										figure: Number(x.history_visits || 0).toLocaleString(),
										detail: Ft(x),
										detailTitle: `${Yt(x.range_start)}—${Yt(x.range_end)}`
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 1,
										icon: Rt,
										term: "口味维度",
										figure: w.length.toLocaleString(),
										detail: w[0]?.name || "尚无主维度"
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 2,
										icon: R,
										term: "浏览线索",
										figure: te.length.toLocaleString()
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 3,
										icon: Pt,
										term: "浏览器书签",
										figure: Number(x.bookmarks || 0).toLocaleString(),
										detail: `${Number(ee.exports || 0).toLocaleString()} 份私有导出 · ${Nt(ee.bytes || 0)}`
									})
								]
							}),
							/* @__PURE__ */ (0, Y.jsxs)("section", {
								className: T ? `${Q} md:flex-row md:gap-6` : Q,
								"aria-label": "浏览器画像",
								children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
									className: T ? "flex shrink-0 flex-col gap-2 pb-5 md:w-80 md:pr-6 md:pb-0" : "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1",
									children: [
										/* @__PURE__ */ (0, Y.jsx)("span", {
											className: "text-caption-1-regular text-text-secondary",
											children: "浏览器画像"
										}),
										T ? /* @__PURE__ */ (0, Y.jsx)(ki, {
											rows: w,
											label: "主要口味维度"
										}) : null,
										/* @__PURE__ */ (0, Y.jsx)("small", {
											className: "text-caption-1-regular text-text-secondary",
											children: b.updated_at ? `更新于 ${Yt(b.updated_at)}` : "尚未采集浏览记录"
										})
									]
								}), /* @__PURE__ */ (0, Y.jsx)("div", {
									className: "flex min-w-0 grow flex-col",
									children: w.length ? /* @__PURE__ */ (0, Y.jsx)(Ai, {
										rows: w,
										label: "口味维度排名"
									}) : /* @__PURE__ */ (0, Y.jsx)(M, {
										size: "compact",
										icon: R,
										title: "暂无口味维度",
										actions: /* @__PURE__ */ (0, Y.jsx)(aa, {}),
										children: Gi
									})
								})]
							}),
							/* @__PURE__ */ (0, Y.jsx)(sn, {
								activity: b.activity,
								title: "浏览活跃时间",
								dailyTitle: "每日活跃",
								words: {
									unit: "口味网站访问",
									series: "访问",
									cellUnit: "次访问"
								},
								tone: 4,
								empty: "还没有可用于分析的口味网站访问记录。"
							}),
							/* @__PURE__ */ (0, Y.jsx)(ji, { flows: b.creator_flows }),
							/* @__PURE__ */ (0, Y.jsx)(la, {
								label: "浏览器口味维度",
								onSignal: t,
								panels: [
									{
										id: "tags",
										name: "标签",
										props: {
											rows: C.browser_tags || [],
											kind: "tag",
											visual: "none",
											empty: qi
										}
									},
									{
										id: "creators",
										name: "创作者",
										props: {
											rows: C.browser_creators || [],
											kind: "creator",
											visual: "creator",
											empty: Ji
										}
									},
									{
										id: "performers",
										name: "女优",
										props: {
											rows: C.browser_performers || [],
											kind: "performer",
											visual: "entity",
											empty: "还没有与已建档女优关联的浏览记录。"
										}
									},
									{
										id: "domains",
										name: "常访问网站",
										props: {
											rows: C.domains || [],
											kind: "",
											visual: "domain",
											empty: Yi
										}
									},
									{
										id: "gaps",
										name: "浏览线索",
										props: {
											rows: te,
											kind: "",
											visual: "none",
											empty: Ki
										}
									}
								]
							})
						]
					}),
					/* @__PURE__ */ (0, Y.jsxs)(He, {
						id: "peach",
						className: "flex flex-col gap-5",
						children: [
							/* @__PURE__ */ (0, Y.jsxs)("div", {
								className: lt,
								children: [
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 0,
										icon: vt,
										term: "Peach 看过",
										figure: Number(x.peach_items || 0).toLocaleString(),
										detail: Zt(x.peach_seconds || 0)
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 1,
										icon: xt,
										term: "喜欢",
										figure: Number(x.liked || 0).toLocaleString()
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 2,
										icon: Ct,
										term: "不合口味",
										figure: Number(x.disliked || 0).toLocaleString()
									}),
									/* @__PURE__ */ (0, Y.jsx)($, {
										accent: 3,
										icon: Rt,
										term: "有标签",
										figure: E.toLocaleString()
									})
								]
							}),
							/* @__PURE__ */ (0, Y.jsxs)("section", {
								className: `${Q} md:flex-row md:gap-6`,
								"aria-label": "Peach 观看",
								children: [/* @__PURE__ */ (0, Y.jsxs)("div", {
									className: "flex shrink-0 flex-col gap-0.5 pb-5 md:w-72 md:pr-6 md:pb-0",
									children: [
										/* @__PURE__ */ (0, Y.jsx)("span", {
											className: "text-caption-1-regular text-text-secondary",
											children: "Peach 观看"
										}),
										/* @__PURE__ */ (0, Y.jsx)("b", {
											className: "text-display-4-medium tabular-nums text-text-primary",
											children: Number(x.peach_items || 0).toLocaleString()
										}),
										/* @__PURE__ */ (0, Y.jsx)("span", {
											className: "text-body-2-regular text-text-secondary",
											children: "部作品有观看或评价记录"
										})
									]
								}), /* @__PURE__ */ (0, Y.jsxs)("div", {
									className: "flex min-w-0 grow flex-col",
									children: [/* @__PURE__ */ (0, Y.jsx)(ha, {
										term: "有标签",
										value: E,
										rest: S.untagged || 0
									}), /* @__PURE__ */ (0, Y.jsx)(ha, {
										term: "有身份",
										value: ne,
										rest: S.unidentified || 0
									})]
								})]
							}),
							/* @__PURE__ */ (0, Y.jsx)(la, {
								label: "Peach 口味维度",
								onSignal: t,
								panels: [
									{
										id: "tags",
										name: "标签",
										props: {
											rows: C.peach_tags || [],
											kind: "tag",
											visual: "none",
											empty: Xi
										}
									},
									{
										id: "creators",
										name: "创作者",
										props: {
											rows: C.peach_creators || [],
											kind: "creator",
											visual: "creator",
											empty: Zi
										}
									},
									{
										id: "performers",
										name: "女优",
										props: {
											rows: C.peach_performers || [],
											kind: "performer",
											visual: "entity",
											empty: Qi
										}
									}
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, Y.jsx)(ua, {
				data: b,
				onSignal: t,
				navigate: n
			}),
			/* @__PURE__ */ (0, Y.jsx)(pa, {
				sources: b.sources || [],
				browsers: b.browsers || [],
				window: a,
				toast: r,
				emptyActions: ie
			})
		]
	}) });
}
function ha({ term: e, value: t, rest: n }) {
	let r = Math.max(t + n, 1);
	return /* @__PURE__ */ (0, Y.jsxs)("div", {
		className: "flex flex-col gap-1.5 border-b border-separator-border py-3 last:border-b-0",
		children: [/* @__PURE__ */ (0, Y.jsxs)("p", {
			className: "flex items-baseline justify-between gap-3 text-body-2-regular text-text-primary",
			children: [/* @__PURE__ */ (0, Y.jsx)("span", { children: e }), /* @__PURE__ */ (0, Y.jsxs)("b", {
				className: "tabular-nums",
				children: [t.toLocaleString(), /* @__PURE__ */ (0, Y.jsx)("span", {
					className: "ml-1.5 text-caption-1-regular text-text-secondary",
					children: `${n.toLocaleString()} 项待补`
				})]
			})]
		}), /* @__PURE__ */ (0, Y.jsx)(at, {
			label: `${e}：${t.toLocaleString()} / ${r.toLocaleString()}`,
			value: t,
			max: r
		})]
	});
}
export { ra as TASTE_GUIDE_KEY, ma as TastePage };

//# debugId=9b65577e-8550-4492-95cf-43eb640447a0