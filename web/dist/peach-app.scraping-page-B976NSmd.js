(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "dcf1a69a-e7b5-42a2-a0d5-32aa12102162", e._sentryDebugIdIdentifier = "sentry-dbid-dcf1a69a-e7b5-42a2-a0d5-32aa12102162");
	} catch {}
})();
import { $fe21c36db05242bb$export$d7b12c4107be0d61 as e, AMANE_BRIDGE_CHECK_URL as t, AMANE_BRIDGE_KEY as n, AMANE_BRIDGE_REBUILD_URL as r, Button as i, COVER_JOB_KEY as a, CUSTOM_SOURCES_KEY as o, CUSTOM_SOURCES_URL as s, Checkbox as c, Disclosure as l, ErrorText as u, ExternalLink as d, Fact as f, FactList as p, FieldLabel as m, Footer as h, Help as g, Input as _, LinkButton as v, LoadingDots as y, METADATA_PREFERENCES_KEY as b, METADATA_PREFERENCES_URL as x, Note as S, Rows as ee, SCRAPING_CHECK_URL as te, SCRAPING_COVER_URL as C, SCRAPING_KEY as w, SCRAPING_SETTINGS_URL as ne, SEGMENT as re, SEGMENTED_TRACK as ie, Section as T, SegmentedRadioGroup as ae, Select$1 as oe, SelectField as E, SelectItem as se, SettingsRow as ce, Stack as D, StatusLabel as O, __toESM as k, apiSend as A, busyProps as j, checkText as le, confirmModal as M, errorMessage as N, esc as P, fetchAmaneBridge as F, fetchCoverJob as I, fetchCustomSources as L, fetchMetadataPreferences as R, fetchSources as z, i2 as ue, queryClient as B, require_jsx_runtime as V, require_react as H, spinnerHtml as de, useAction as U, useBackgroundJob as W, useMutation as G, useQuery as K, wireDragReorder as fe } from "./peach-app.js";
import { CodeBlock as pe } from "./peach-app.code-block-CyDva4Ms.js";
import { Page as q } from "./peach-app.page-QAncjzM1.js";
import { SiteMark as J } from "./peach-app.site-mark-D_VlIyJz.js";
import { ConnectionStatus as me } from "./peach-app.connection-status-DI6kgn3i.js";
// src/react/scraping/custom-sources.tsx
var Y = /* @__PURE__ */ k(H(), 1), X = V(), he = [
	["code", "番号"],
	["title", "标题"],
	["studio", "厂牌"],
	["series", "系列"],
	["release_date", "发行日期"],
	["performers", "演员（文本数组）"],
	["tags", "标签（文本数组）"]
], ge = [
	["censored", "有码"],
	["amateur", "素人"],
	["uncensored", "无码"],
	["fc2", "FC2"],
	["kmib", "韩国 MIB"],
	["other", "其他"],
	["unsure", "待核番号"],
	["unknown", "未知"]
], _e = () => ({
	name: "",
	endpoint: "",
	enabled: !1,
	fields: {
		code: "id",
		title: "title"
	},
	content_types: ["censored"]
});
function ve({ receipt: e }) {
	let [t, n] = (0, Y.useState)(null), r = K({
		queryKey: o,
		queryFn: ({ signal: e }) => L(e)
	}), a = U(), c = (e) => B.setQueryData(o, e), l = !!(r.isPending || r.error || r.data?.items.length || a.error), d = /* @__PURE__ */ (0, X.jsx)(i, {
		variant: "secondary",
		onClick: () => n(_e()),
		children: "添加来源"
	});
	return /* @__PURE__ */ (0, X.jsxs)(T, {
		title: "自定义元数据来源",
		children: [
			l ? /* @__PURE__ */ (0, X.jsxs)(D, { children: [
				r.isPending ? /* @__PURE__ */ (0, X.jsx)("div", {
					"aria-busy": "true",
					"data-skeleton": "",
					"aria-label": "读取自定义来源"
				}) : null,
				r.error ? /* @__PURE__ */ (0, X.jsx)(u, { children: N(r.error) }) : null,
				r.data?.items.map((t) => /* @__PURE__ */ (0, X.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, X.jsx)("span", {
							className: "min-w-0 flex-1",
							children: t.name
						}),
						/* @__PURE__ */ (0, X.jsx)(O, {
							tone: t.enabled ? "success" : "neutral",
							children: t.enabled ? "已启用" : "已停用"
						}),
						/* @__PURE__ */ (0, X.jsx)(i, {
							variant: "secondary",
							onClick: () => n(t),
							children: "编辑"
						}),
						/* @__PURE__ */ (0, X.jsx)(i, {
							variant: "secondary",
							...j(a.busy === t.id),
							onClick: () => void a.run(t.id, (e) => A(s, {
								...t,
								enabled: !t.enabled
							}, "POST", e), (n) => {
								c(n), e(t.enabled ? "已停用来源" : "已启用来源");
							}),
							children: t.enabled ? "停用" : "启用"
						}),
						/* @__PURE__ */ (0, X.jsx)(i, {
							variant: "danger",
							onClick: () => M({
								title: "删除自定义来源",
								body: `删除「${P(t.name)}」后，采集将不再查询这个来源。`,
								confirmLabel: "删除来源",
								danger: !0,
								onConfirm: async () => {
									c(await A(s, {
										action: "delete",
										id: t.id
									})), n(null), e("已删除来源");
								}
							}),
							children: "删除"
						})
					]
				}, t.id)),
				a.error ? /* @__PURE__ */ (0, X.jsx)(u, { children: a.error }) : null
			] }) : null,
			t ? null : l ? /* @__PURE__ */ (0, X.jsx)(h, { children: d }) : /* @__PURE__ */ (0, X.jsx)(D, { children: /* @__PURE__ */ (0, X.jsx)("div", {
				className: "flex justify-end",
				children: d
			}) }),
			t ? /* @__PURE__ */ (0, X.jsx)(ye, {
				initial: t,
				cancel: () => n(null),
				saved: (t) => {
					c(t), n(null), e("已保存来源");
				}
			}, t.id || "new") : null
		]
	});
}
function ye({ initial: e, cancel: t, saved: n }) {
	let [r, a] = (0, Y.useState)(e), [o, l] = (0, Y.useState)(""), [d, f] = (0, Y.useState)(""), p = (0, Y.useRef)(0), v = U(), y = (e) => {
		p.current++, a((t) => ({
			...t,
			...e
		})), f("");
	};
	return /* @__PURE__ */ (0, X.jsxs)("form", {
		"aria-label": "元数据来源配置",
		"aria-busy": v.busy === "preview",
		onSubmit: (e) => {
			e.preventDefault(), v.run("save", (e) => A(s, r, "POST", e), n);
		},
		children: [/* @__PURE__ */ (0, X.jsxs)(D, { children: [
			/* @__PURE__ */ (0, X.jsx)(_, {
				label: "来源名称",
				value: r.name,
				maxLength: 80,
				onChange: (e) => y({ name: e })
			}),
			/* @__PURE__ */ (0, X.jsx)(_, {
				label: "JSON 接口地址",
				value: r.endpoint,
				maxLength: 2048,
				placeholder: "https://example.com/api/movies/{code}",
				onChange: (e) => y({ endpoint: e })
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)(m, { children: "来源连接方式" }), /* @__PURE__ */ (0, X.jsx)(E, {
					id: "custom-source-network",
					label: "来源连接方式",
					epoch: 0,
					value: r.network || "direct",
					options: [["direct", "直连"], ["peach_proxy", "Peach 代理"]],
					onPick: (e) => y({ network: e })
				})]
			}),
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)(m, { children: "接口番号格式" }), /* @__PURE__ */ (0, X.jsx)(E, {
					id: "custom-source-code-format",
					label: "接口番号格式",
					epoch: 0,
					value: r.code_format || "original",
					options: [
						["original", "原样"],
						["lowercase", "小写"],
						["compact", "去掉连字符"],
						["underscore", "连字符转下划线"]
					],
					onPick: (e) => y({ code_format: e })
				})]
			}),
			/* @__PURE__ */ (0, X.jsx)(g, { children: "填写公开 JSON 接口和响应字段路径，例如 data.title。番号字段用于核对作品身份。" }),
			he.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(_, {
				label: `${t}字段路径`,
				value: r.fields[e] || "",
				onChange: (t) => {
					let n = { ...r.fields };
					t ? n[e] = t : delete n[e], y({ fields: n });
				}
			}, e)),
			/* @__PURE__ */ (0, X.jsx)("div", {
				className: "flex flex-wrap gap-3",
				role: "group",
				"aria-label": "适用内容类型",
				children: ge.map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(c, {
					isSelected: r.content_types.includes(e),
					onChange: (t) => y({ content_types: t ? [...r.content_types, e] : r.content_types.filter((t) => t !== e) }),
					children: t
				}, e))
			}),
			/* @__PURE__ */ (0, X.jsx)(c, {
				isSelected: r.enabled,
				onChange: (e) => y({ enabled: e }),
				children: "启用来源"
			}),
			/* @__PURE__ */ (0, X.jsx)(_, {
				label: "试查番号（回车查询）",
				value: o,
				onChange: (e) => {
					p.current++, l(e), f("");
				},
				onKeyDown: (e) => {
					if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
					e.preventDefault();
					let t = p.current;
					v.run("preview", (e) => A(s, {
						...r,
						code: o,
						action: "preview"
					}, "POST", e), (e) => {
						t === p.current && f(JSON.stringify(e.record, null, 2));
					}, (e) => {
						t === p.current && v.setError(N(e));
					});
				}
			}),
			v.busy === "preview" ? /* @__PURE__ */ (0, X.jsxs)(g, {
				role: "status",
				children: [/* @__PURE__ */ (0, X.jsx)("span", { dangerouslySetInnerHTML: { __html: de("正在试查来源") } }), "正在试查来源"]
			}) : null,
			d ? /* @__PURE__ */ (0, X.jsx)(pe, {
				code: d,
				language: "json",
				label: "元数据接口返回"
			}) : null,
			v.error ? /* @__PURE__ */ (0, X.jsx)(u, { children: v.error }) : null
		] }), /* @__PURE__ */ (0, X.jsxs)(h, { children: [/* @__PURE__ */ (0, X.jsx)(i, {
			variant: "secondary",
			type: "button",
			onClick: t,
			children: "取消"
		}), /* @__PURE__ */ (0, X.jsx)(i, {
			type: "submit",
			...j(v.busy === "save"),
			children: "保存来源"
		})] })]
	});
}
// src/react/scraping/metadata-preferences.tsx
var be = {
	censored: "有码",
	amateur: "素人",
	uncensored: "无码",
	fc2: "FC2",
	kmib: "韩国 MIB",
	unsure: "待核番号",
	unknown: "未知"
};
function xe({ receipt: e }) {
	let t = K({
		queryKey: b,
		queryFn: ({ signal: e }) => R(e)
	});
	return /* @__PURE__ */ (0, X.jsx)(T, {
		title: "资料来源顺序",
		children: t.data ? /* @__PURE__ */ (0, X.jsx)(Ce, {
			data: t.data,
			receipt: e
		}, JSON.stringify(t.data)) : /* @__PURE__ */ (0, X.jsx)(D, { children: t.error ? /* @__PURE__ */ (0, X.jsx)(u, { children: N(t.error) }) : /* @__PURE__ */ (0, X.jsx)("div", {
			"data-skeleton": "metadata-preferences",
			role: "status",
			"aria-label": "正在读取资料来源顺序",
			className: "h-12 skeleton-sheen"
		}) })
	});
}
function Se(e, t, n, r) {
	if (t === n || !e.includes(t) || !e.includes(n)) return e;
	let i = e.filter((e) => e !== t);
	return i.splice(i.indexOf(n) + Number(r), 0, t), i;
}
function Ce({ data: e, receipt: t }) {
	let [n, r] = (0, Y.useState)(e.user_agent), [a, o] = (0, Y.useState)(e.types.find((e) => e.id === "fc2")?.id || e.types[0]?.id || ""), [s, c] = (0, Y.useState)(Object.fromEntries(e.types.map((e) => [e.id, e.sources.map((e) => e.id)]))), l = U(), d = (0, Y.useRef)(null), f = (0, Y.useRef)(null), p = s[a] || [], m = a + p.join(","), v = (e, t, n) => c((r) => ({
		...r,
		[a]: Se(r[a] || [], e, t, n)
	}));
	(0, Y.useLayoutEffect)(() => {
		d.current && fe(d.current, {
			selector: "[data-source-order]",
			attribute: "data-source-order",
			onMove: v
		}), f.current &&= (d.current?.querySelector(`[data-source-order="${f.current}"]`)?.focus(), null);
	}, [m]);
	let y = new Map(e.types.flatMap((e) => e.sources.map((e) => [e.id, e.label])));
	return /* @__PURE__ */ (0, X.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault(), l.run("save", (e) => A(x, {
				routes: s,
				user_agent: n
			}, "POST", e), (e) => {
				B.setQueryData(b, e), t("已保存资料来源顺序");
			});
		},
		children: [/* @__PURE__ */ (0, X.jsxs)(D, { children: [
			/* @__PURE__ */ (0, X.jsx)(E, {
				id: "metadata-content-type",
				label: "影片类型",
				value: a,
				epoch: 0,
				options: e.types.map((e) => [e.id, be[e.id] || e.id]),
				onPick: o
			}),
			/* @__PURE__ */ (0, X.jsx)(g, { children: "拖动调整查询顺序。键盘聚焦来源后，按 Alt 与上下方向键移动。" }),
			/* @__PURE__ */ (0, X.jsx)("ol", {
				ref: d,
				"aria-label": "来源查询顺序",
				className: "flex min-w-0 flex-col gap-2",
				children: p.map((e, t) => /* @__PURE__ */ (0, X.jsxs)("li", {
					"data-source-order": e,
					tabIndex: 0,
					className: "flex min-w-0 items-center gap-2 rounded-sm border border-separator-border p-2 wrap-anywhere",
					onKeyDown: (n) => {
						if (!n.altKey || !["ArrowUp", "ArrowDown"].includes(n.key)) return;
						let r = p[t + (n.key === "ArrowUp" ? -1 : 1)];
						r && (n.preventDefault(), f.current = e, v(e, r, n.key === "ArrowDown"));
					},
					children: [
						t + 1,
						". ",
						y.get(e) || e
					]
				}, e))
			}, m),
			/* @__PURE__ */ (0, X.jsx)(_, {
				label: "HTTP User-Agent",
				value: n,
				maxLength: 512,
				onChange: r
			}),
			/* @__PURE__ */ (0, X.jsx)(g, { children: "用于 HTTP 资料来源；本机浏览器来源沿用浏览器实际身分。留空使用标准桌面 Chrome。" }),
			l.error ? /* @__PURE__ */ (0, X.jsx)(u, { children: l.error }) : null
		] }), /* @__PURE__ */ (0, X.jsx)(h, { children: /* @__PURE__ */ (0, X.jsx)(i, {
			type: "submit",
			variant: "primary",
			...j(!!l.busy),
			children: "保存来源设置"
		}) })]
	});
}
// src/react/scraping/scraping-page.tsx
var Z = [["peach", "Peach 代理"], ["direct", "直接连接"]];
function Q(e) {
	return Z.some(([t]) => t === e) || !e ? [...Z] : [...Z, [e, e]];
}
function $(e) {
	try {
		return new URL(e).host || e;
	} catch {
		return e;
	}
}
var we = [["paste", "粘贴 Cookie"], ["file", "导入文件"]];
function Te() {
	return /* @__PURE__ */ (0, X.jsx)(J, { source: "github" });
}
function Ee({ source: t, toast: n }) {
	let [r, a] = (0, Y.useState)(t.network), [o, s] = (0, Y.useState)(""), [c, l] = (0, Y.useState)(""), [f, p] = (0, Y.useState)(we[0][0]), [g, y] = (0, Y.useState)(""), [b, x] = (0, Y.useState)(""), C = (0, Y.useRef)(null);
	function E() {
		s(""), l(""), y(""), x(""), C.current && (C.current.value = "");
	}
	let k = G({
		mutationFn: (e) => A(ne, {
			source: t.source,
			network: r,
			cookie: o,
			cookies_text: c,
			revoke: e
		}),
		onSuccess: (e, t) => {
			B.setQueryData(w, (t) => t && {
				...t,
				sources: t.sources.map((t) => t.source === e.saved.source ? e.saved : t)
			}), E(), n(t ? "Cookie 已撤销" : "来源设置已保存");
		}
	}), M = G({ mutationFn: () => A(te, { source: t.source }) }), P = k.isPending || M.isPending, F = (e) => {
		e.preventDefault(), !P && (M.reset(), k.mutate(!1));
	}, I = () => {
		P || (M.reset(), k.mutate(!0));
	}, L = () => {
		P || (k.reset(), M.mutate());
	};
	async function R(e) {
		let t = e.currentTarget, n = t.files?.[0];
		if (l(""), x(""), !n) y("");
		else if (n.size > 262144) t.value = "", y(""), x("Cookie 文本超过 256 KiB");
		else try {
			let e = await n.text();
			l(e), y(n.name);
		} catch {
			x("Cookie 文件未读取，请重新选择");
		}
	}
	let z = b || (k.error ? N(k.error) : "") || (M.error ? N(M.error) : ""), V = M.data?.results ?? [], H = r === "peach" || t.accepts_cookie || t.browser || !!z || V.length > 0;
	return /* @__PURE__ */ (0, X.jsxs)(T, {
		title: t.label,
		onSubmit: F,
		aside: /* @__PURE__ */ (0, X.jsxs)("span", {
			className: "flex min-w-0 items-center gap-1",
			children: [/* @__PURE__ */ (0, X.jsx)(J, { source: t.source }), t.login ? /* @__PURE__ */ (0, X.jsx)(d, {
				href: t.login,
				children: $(t.login)
			}) : null]
		}),
		children: [
			/* @__PURE__ */ (0, X.jsx)(ee, { children: /* @__PURE__ */ (0, X.jsx)(ce, {
				label: "连接方式",
				children: /* @__PURE__ */ (0, X.jsx)(oe, {
					"aria-label": "连接方式",
					className: "w-44 min-w-0",
					selectedKey: r,
					onSelectionChange: (e) => {
						e !== null && a(String(e));
					},
					children: Q(r).map(([e, t]) => /* @__PURE__ */ (0, X.jsx)(se, {
						id: e,
						children: t
					}, e))
				})
			}) }),
			t.cooldown_until && t.cooldown_until > Date.now() / 1e3 ? /* @__PURE__ */ (0, X.jsx)(S, {
				tone: "warning",
				children: /* @__PURE__ */ (0, X.jsxs)("span", {
					className: "inline-flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, X.jsx)(O, {
						tone: "warning",
						children: "冷却中"
					}), /* @__PURE__ */ (0, X.jsxs)("span", { children: [
						"可在 ",
						(/* @__PURE__ */ new Date(t.cooldown_until * 1e3)).toLocaleString("zh-CN"),
						" 后重试。"
					] })]
				})
			}) : null,
			H ? /* @__PURE__ */ (0, X.jsxs)(D, {
				divided: !0,
				children: [
					r === "peach" ? /* @__PURE__ */ (0, X.jsx)("span", {
						className: "self-start",
						children: /* @__PURE__ */ (0, X.jsx)(v, {
							href: "/settings/library#peachProxy",
							size: "small",
							trailingIcon: ue,
							children: "配置 Peach 代理"
						})
					}) : null,
					t.browser ? /* @__PURE__ */ (0, X.jsx)("p", {
						className: "text-body-2-regular text-text-secondary",
						children: "人机验证由本机浏览器自动完成；需要点击时窗口会弹出。这台机器上不需要 Cookie。"
					}) : null,
					t.accepts_cookie && !t.browser ? /* @__PURE__ */ (0, X.jsxs)(X.Fragment, { children: [
						/* @__PURE__ */ (0, X.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, X.jsx)("span", {
								className: "self-start",
								children: /* @__PURE__ */ (0, X.jsx)(O, {
									tone: t.cookie_saved ? "success" : "neutral",
									children: t.cookie_saved ? "Cookie 已保存" : "Cookie 未配置"
								})
							}), /* @__PURE__ */ (0, X.jsx)("p", {
								className: "text-body-2-regular text-text-secondary",
								children: t.cookie_saved ? "登录有效性待验证。" : "需要登录时，任选一种方式提供 Cookie。"
							})]
						}),
						/* @__PURE__ */ (0, X.jsx)(ae, {
							"aria-label": "提供 Cookie 的方式（二选一）",
							value: f,
							onChange: (e) => {
								p(e), E();
							},
							className: ie,
							children: we.map(([t, n]) => /* @__PURE__ */ (0, X.jsx)(e, {
								value: t,
								className: re,
								children: n
							}, t))
						}),
						f === "paste" ? /* @__PURE__ */ (0, X.jsx)(_, {
							type: "password",
							label: "Cookie",
							autoComplete: "off",
							value: o,
							onChange: s
						}) : /* @__PURE__ */ (0, X.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, X.jsx)(m, { children: "Netscape Cookie 文件（.txt）" }),
								/* @__PURE__ */ (0, X.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [/* @__PURE__ */ (0, X.jsx)(i, {
										variant: "secondary",
										onClick: () => C.current?.click(),
										children: "选择文件"
									}), /* @__PURE__ */ (0, X.jsx)("span", {
										className: "min-w-0 text-body-2-regular break-all text-text-secondary",
										children: g || "未选择文件"
									})]
								}),
								/* @__PURE__ */ (0, X.jsx)("input", {
									ref: C,
									type: "file",
									accept: ".txt",
									tabIndex: -1,
									"aria-hidden": !0,
									className: "hidden",
									onChange: (e) => {
										R(e);
									}
								})
							]
						})
					] }) : null,
					z ? /* @__PURE__ */ (0, X.jsx)(u, { children: z }) : null,
					V.map((e) => /* @__PURE__ */ (0, X.jsx)(S, {
						tone: e.ok ? "success" : "error",
						children: /* @__PURE__ */ (0, X.jsxs)("span", {
							className: "flex flex-col items-start gap-1",
							children: [/* @__PURE__ */ (0, X.jsx)(me, {
								tone: e.ok ? "success" : "error",
								children: e.ok ? "可访问" : "连接失败"
							}), /* @__PURE__ */ (0, X.jsx)("span", { children: le(e, t.label) })]
						})
					}, e.label))
				]
			}) : null,
			/* @__PURE__ */ (0, X.jsxs)(h, { children: [
				t.accepts_cookie && t.cookie_saved ? /* @__PURE__ */ (0, X.jsx)(i, {
					variant: "secondary",
					onClick: I,
					...j(P),
					children: "撤销 Cookie"
				}) : null,
				/* @__PURE__ */ (0, X.jsx)(i, {
					variant: "secondary",
					onClick: L,
					...j(P),
					children: "检查连接"
				}),
				/* @__PURE__ */ (0, X.jsx)(i, {
					type: "submit",
					...j(P),
					children: "保存"
				})
			] })
		]
	});
}
function De({ toast: e }) {
	let [t, n] = (0, Y.useState)(""), { running: r, outcome: o, start: s } = W({
		queryKey: a,
		queryFn: ({ signal: e }) => I(e),
		start: () => A(C, { code: t }),
		onFinish: (t) => {
			t.status === "complete" && e(t.result || "封面采集完成");
		}
	}), c = (e) => {
		e.preventDefault(), !(r || s.isPending || !t.trim()) && s.mutate();
	}, l = s.error ? N(s.error) : o?.status === "failed" ? o.error || "采集未取得" : "";
	return /* @__PURE__ */ (0, X.jsx)(T, {
		title: "高清封面",
		onSubmit: c,
		children: /* @__PURE__ */ (0, X.jsxs)(D, { children: [
			/* @__PURE__ */ (0, X.jsxs)("div", {
				className: "flex flex-wrap items-end gap-2",
				children: [/* @__PURE__ */ (0, X.jsx)("div", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, X.jsx)(_, {
						"aria-label": "馆藏番号",
						isRequired: !0,
						isDisabled: r,
						value: t,
						onChange: n,
						placeholder: "输入馆藏番号，如 ABW-232"
					})
				}), /* @__PURE__ */ (0, X.jsx)(i, {
					type: "submit",
					disabled: !t.trim(),
					...j(r || s.isPending),
					children: "抓取封面"
				})]
			}),
			r ? /* @__PURE__ */ (0, X.jsx)(y, { label: "正在抓取封面" }) : null,
			l ? /* @__PURE__ */ (0, X.jsx)(S, {
				tone: "error",
				children: l
			}) : null,
			o?.status === "complete" ? /* @__PURE__ */ (0, X.jsx)(S, {
				tone: "success",
				children: o.result || "封面采集完成"
			}) : null
		] })
	});
}
function Oe({ toast: e }) {
	let { query: a, running: o, outcome: s, start: c } = W({
		queryKey: n,
		queryFn: ({ signal: e }) => F(e),
		start: () => A(r, {}),
		jobOf: (e) => e.job,
		withJob: (e, t) => e && {
			...e,
			job: t
		},
		onFinish: (t) => {
			t.status === "complete" && e(t.result || "amane 桥已重建");
		}
	}), u = G({ mutationFn: () => A(t, {}) }), m = a.data;
	if (!m) return a.error ? /* @__PURE__ */ (0, X.jsx)(T, {
		id: "amane",
		title: "amane",
		children: /* @__PURE__ */ (0, X.jsx)(D, { children: /* @__PURE__ */ (0, X.jsx)(S, {
			tone: "error",
			children: N(a.error)
		}) })
	}) : null;
	let _ = o || c.isPending || u.isPending, v = c.error ? N(c.error) : u.error ? N(u.error) : s?.status === "failed" ? s.error || "重建未完成" : "";
	return /* @__PURE__ */ (0, X.jsxs)(T, {
		id: "amane",
		title: "amane",
		aside: /* @__PURE__ */ (0, X.jsx)(d, {
			href: m.repository,
			leadingIcon: Te,
			children: m.repository
		}),
		children: [
			/* @__PURE__ */ (0, X.jsxs)(p, { children: [
				/* @__PURE__ */ (0, X.jsx)(f, {
					term: "已安装版本",
					children: m.installed_version || "未安装"
				}),
				/* @__PURE__ */ (0, X.jsx)(f, {
					term: "上游最新版本",
					children: u.data?.latest ?? "尚未检查"
				}),
				/* @__PURE__ */ (0, X.jsx)(f, {
					term: "运行环境",
					children: m.installed ? "已安装" : "未安装"
				}),
				/* @__PURE__ */ (0, X.jsxs)(f, {
					term: "内置站点",
					children: [m.sites.length.toLocaleString(), " 个"]
				})
			] }),
			/* @__PURE__ */ (0, X.jsxs)(D, {
				divided: !0,
				children: [
					m.sites.length ? /* @__PURE__ */ (0, X.jsx)(l, {
						summary: "查看内置站点",
						children: /* @__PURE__ */ (0, X.jsx)("p", {
							className: "text-body-2-regular text-text-secondary",
							children: m.sites.map((e) => e.label).join("、")
						})
					}) : null,
					m.problem ? /* @__PURE__ */ (0, X.jsx)(S, {
						tone: "error",
						children: m.problem
					}) : /* @__PURE__ */ (0, X.jsxs)(g, { children: [
						"amane（",
						m.license,
						"）提供这些内置站点的解析能力。首次需要时，Peach 会自动准备锁定的 ",
						m.version,
						" 版本；安装包内已有可用环境时直接使用。 手动安装也使用此版本，不随上游自动升级。"
					] }),
					o ? /* @__PURE__ */ (0, X.jsx)(y, { label: "正在重建运行环境" }) : null,
					v ? /* @__PURE__ */ (0, X.jsx)(S, {
						tone: "error",
						children: v
					}) : null,
					s?.status === "complete" ? /* @__PURE__ */ (0, X.jsx)(S, {
						tone: "success",
						children: s.result || "amane 桥已重建"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, X.jsxs)(h, { children: [/* @__PURE__ */ (0, X.jsx)(i, {
				variant: "secondary",
				onClick: () => {
					_ || u.mutate();
				},
				...j(u.isPending),
				children: "检查上游版本"
			}), /* @__PURE__ */ (0, X.jsx)(i, {
				disabled: !!m.problem,
				onClick: () => {
					_ || c.mutate();
				},
				...j(o || c.isPending),
				children: m.installed ? "重新安装" : "安装"
			})] })
		]
	});
}
function ke({ toast: e }) {
	let t = K({
		queryKey: w,
		queryFn: ({ signal: e }) => z(e)
	}), n = t.data;
	return n ? /* @__PURE__ */ (0, X.jsxs)(q, { children: [
		/* @__PURE__ */ (0, X.jsx)("p", {
			className: "text-body-2-regular text-text-secondary",
			children: "高清图片可能要经代理才能下载，先检查连接。"
		}),
		/* @__PURE__ */ (0, X.jsx)(De, { toast: e }),
		/* @__PURE__ */ (0, X.jsx)(ve, { receipt: e }),
		/* @__PURE__ */ (0, X.jsx)(xe, { receipt: e }),
		(n.sources || []).map((t) => /* @__PURE__ */ (0, X.jsx)(Ee, {
			source: t,
			toast: e
		}, t.source)),
		/* @__PURE__ */ (0, X.jsx)(Oe, { toast: e })
	] }) : /* @__PURE__ */ (0, X.jsx)(q, { children: /* @__PURE__ */ (0, X.jsx)(S, {
		tone: "error",
		title: "采集来源读取失败",
		children: t.error ? N(t.error) : "读取采集来源失败"
	}) });
}
export { ke as ScrapingPage, $ as linkHost, Q as networkOptions };

//# debugId=dcf1a69a-e7b5-42a2-a0d5-32aa12102162