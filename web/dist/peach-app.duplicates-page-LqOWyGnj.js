(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "7b49c031-1417-486b-89a6-63d5d640dbab", e._sentryDebugIdIdentifier = "sentry-dbid-7b49c031-1417-486b-89a6-63d5d640dbab");
	} catch {}
})();
import { Button as e, Checkbox as t, CollectionSummary as n, DUPLICATES_KEY as r, EXACT_COPY as i, EXACT_TITLE as a, EmptyState as o, FilterGlass as s, GlassPill as c, LOC as l, MEDIA_SOURCE_ICONS as u, Note as d, SELECT_COPY as f, SourceMark as p, TRASH_KEY as m, __toESM as h, apiSend as g, batchOperate as _, busyProps as v, cardClass as y, confirmModal as b, errorMessage as x, fetchDuplicates as S, fmtDur as C, fmtSize as w, queryClient as T, require_jsx_runtime as E, require_react as D, spriteGlyph as O, useMutation as k, useQuery as A, victimBytes as j } from "./peach-app.js";
// src/react/duplicates/duplicates-page.tsx
var M = /* @__PURE__ */ h(D(), 1), N = E(), P = O("play"), F = O("file-stack"), I = y({
	padding: "none",
	radius: "surface",
	className: "mb-6 overflow-hidden dark:bg-background-primary-default"
}), L = "font-mono text-caption-1-regular leading-5 text-text-secondary", R = () => {
	T.invalidateQueries({ queryKey: r }), T.invalidateQueries({
		queryKey: m,
		exact: !0
	});
};
function z({ file: e, selected: n, toggle: r, openItem: i }) {
	let a = () => i(e.id);
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "duplicate-row items-center gap-3 border-t border-separator-border px-5 py-4 max-compact:p-4",
		children: [
			/* @__PURE__ */ (0, N.jsxs)("button", {
				type: "button",
				onClick: a,
				"aria-label": `预览 ${e.name}`,
				className: "relative row-span-2 inline-grid aspect-16/10 w-full cursor-pointer place-items-center overflow-hidden rounded-2lg bg-background-tertiary-default text-text-secondary",
				children: [/* @__PURE__ */ (0, N.jsx)(P, {
					"aria-hidden": !0,
					className: "size-6"
				}), /* @__PURE__ */ (0, N.jsx)("img", {
					src: `/thumb?id=${e.id}&c=4`,
					alt: "",
					loading: "lazy",
					onError: (e) => e.currentTarget.remove(),
					className: "absolute inset-0 size-full object-contain"
				})]
			}),
			/* @__PURE__ */ (0, N.jsxs)("div", {
				className: "flex min-w-0 flex-wrap items-center gap-3 max-duplicate-narrow:col-start-2 max-duplicate-narrow:-col-end-1",
				children: [/* @__PURE__ */ (0, N.jsx)(t, {
					"aria-label": `回收 ${e.name}`,
					isSelected: n,
					onChange: r,
					children: "移入回收站"
				}), /* @__PURE__ */ (0, N.jsx)("button", {
					type: "button",
					onClick: a,
					title: e.name,
					className: "min-w-0 cursor-pointer text-left wrap-anywhere text-body-regular hover:text-text-secondary",
					children: e.name
				})]
			}),
			/* @__PURE__ */ (0, N.jsxs)("span", {
				className: `${L} flex min-w-0 items-center gap-1.5`,
				children: [/* @__PURE__ */ (0, N.jsx)(p, { mark: u[e.location] || "database" }), /* @__PURE__ */ (0, N.jsx)("span", {
					className: "min-w-0 truncate",
					children: l[e.location] || e.location || e.drive
				})]
			}),
			/* @__PURE__ */ (0, N.jsx)("span", {
				className: L,
				children: w(e.size || 0)
			}),
			/* @__PURE__ */ (0, N.jsx)("span", {
				className: L,
				children: C(e.duration)
			}),
			/* @__PURE__ */ (0, N.jsx)("span", {
				className: `${L} col-start-2 -col-end-1 min-w-0 pt-0.5 wrap-anywhere max-duplicate-narrow:col-span-full`,
				children: e.path ?? ""
			})
		]
	});
}
function B({ openItem: t, toast: l, failure: u }) {
	let [p, m] = (0, M.useState)("exact"), [h, y] = (0, M.useState)(!1), [C, T] = (0, M.useState)(/* @__PURE__ */ new Set()), E = A({
		queryKey: p === "exact" && !h ? r : [
			...r,
			p,
			h
		],
		queryFn: ({ signal: e }) => S(e, p, h),
		refetchInterval: (e) => e.state.data?.job?.status === "running" && 1500
	}), D = k({
		mutationFn: ({ url: e, body: t }) => g(e, t),
		onSuccess: () => R()
	}), O = k({
		mutationFn: (e) => _(e, "dispose", p === "exact" ? "duplicate" : "manual"),
		onSuccess: (e, t) => {
			T(/* @__PURE__ */ new Set()), R(), l(`已把 ${t.length} 项移入回收站`, { undo: async () => {
				try {
					await _(t, "restore");
				} catch (e) {
					u("撤销移入回收站", e);
				} finally {
					R();
				}
			} });
		}
	}), P = E.data, B = (e, t) => {
		T(/* @__PURE__ */ new Set()), m(e), y(t);
	}, V = P?.groups ?? [], H = [...new Set(V.flatMap((e) => e.files.filter((e) => C.has(e.id)).map((e) => e.id)))], U = P?.job?.status === "running", W = () => {
		H.length && !O.isPending && b({
			title: "移入回收站",
			confirmLabel: "移入回收站",
			body: `将把选中的 ${H.length} 个文件的馆藏记录移入回收站，共 ${w(j(V, H))}。其余 ${V.reduce((e, t) => e + t.files.length, 0) - H.length} 个文件保留。原始文件保留在磁盘上；清空回收站才会永久删除。记录可从回收站还原。`,
			onConfirm: () => O.mutateAsync(H)
		});
	};
	return /* @__PURE__ */ (0, N.jsxs)("div", {
		className: "mx-auto w-full max-w-board pb-10.5",
		children: [
			/* @__PURE__ */ (0, N.jsx)(n, {
				label: p === "exact" ? "已确认重复" : "同番号版本",
				figure: `${P?.total.toLocaleString() || 0} 组`,
				pending: !P,
				detail: `${P?.files.toLocaleString() || 0} 个文件${p === "exact" ? ` · 可回收 ${w(P?.reclaimable || 0)}` : ""}`
			}),
			/* @__PURE__ */ (0, N.jsxs)(s, {
				title: "文件比较",
				children: [
					/* @__PURE__ */ (0, N.jsx)(c, {
						selected: p === "exact",
						onPress: () => B("exact", !1),
						children: "雜湊确认重复"
					}),
					/* @__PURE__ */ (0, N.jsx)(c, {
						selected: p === "versions",
						onPress: () => B("versions", !1),
						children: "同番号版本"
					}),
					/* @__PURE__ */ (0, N.jsx)(c, {
						selected: h,
						onPress: () => B(p, !h),
						children: h ? "返回待处理" : `已整组保留 ${P?.kept_total || 0} 组`
					})
				]
			}),
			/* @__PURE__ */ (0, N.jsx)("div", {
				className: "mb-5",
				children: /* @__PURE__ */ (0, N.jsxs)(d, {
					tone: "neutral",
					title: p === "exact" ? a : "同番号版本需逐项复核",
					children: [p === "exact" ? i : "同番号可能包含分卷、特典、字幕与不同剪辑版本。时长或容量接近也不代表内容相同。", f]
				})
			}),
			P ? /* @__PURE__ */ (0, N.jsxs)(N.Fragment, { children: [
				/* @__PURE__ */ (0, N.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center gap-3",
					children: [
						U ? /* @__PURE__ */ (0, N.jsx)(e, {
							variant: "secondary",
							size: "small",
							...v(D.isPending),
							onClick: () => D.mutate({
								url: "/api/duplicates/hash",
								body: { stop: !0 }
							}),
							children: "停止校验"
						}) : /* @__PURE__ */ (0, N.jsx)(e, {
							variant: "secondary",
							size: "small",
							disabled: !P.pending_files,
							onClick: () => {
								b({
									title: "校验完整文件",
									confirmLabel: "校验完整文件",
									body: `将完整读取 ${P?.pending_files || 0} 个同大小候选文件，约 ${w(P?.pending_bytes || 0)}。挂载网盘会产生下载流量。只计算 SHA256，不移动或删除文件；可停止并继续已完成的结果。`,
									onConfirm: () => D.mutateAsync({
										url: "/api/duplicates/hash",
										body: { confirm_full_read: !0 }
									})
								});
							},
							children: "校验完整文件"
						}),
						/* @__PURE__ */ (0, N.jsx)("span", {
							className: "text-caption-1-regular text-text-secondary",
							role: "status",
							children: U ? `已校验 ${P.job?.checked || 0}/${P.job?.total || 0} 个 · 已读取 ${w(P.job?.read_bytes || 0)}` : `待校验 ${P.pending_files || 0} 个 · 约 ${w(P.pending_bytes || 0)}`
						}),
						/* @__PURE__ */ (0, N.jsx)(e, {
							variant: "danger",
							size: "small",
							disabled: !H.length,
							...v(O.isPending),
							onClick: W,
							children: `将选中的 ${H.length} 项移入回收站`
						}),
						H.length ? /* @__PURE__ */ (0, N.jsx)(e, {
							variant: "secondary",
							size: "small",
							onClick: () => T(/* @__PURE__ */ new Set()),
							children: "取消勾选"
						}) : null
					]
				}),
				P.job?.failed ? /* @__PURE__ */ (0, N.jsx)(d, {
					tone: "neutral",
					title: "部分文件未完成校验",
					children: `${P.job.failed} 个文件未取得有效雜湊，可以重试完整校验。`
				}) : null,
				P.job?.status === "failed" ? /* @__PURE__ */ (0, N.jsx)(d, {
					tone: "error",
					title: "完整校验失败",
					children: P.job.error
				}) : null,
				V.map((n) => /* @__PURE__ */ (0, N.jsxs)("section", {
					"aria-label": n.code,
					className: I,
					children: [/* @__PURE__ */ (0, N.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 bg-background-tertiary-default p-5 max-compact:p-4 dark:bg-background-secondary-default",
						children: [
							/* @__PURE__ */ (0, N.jsx)("b", {
								className: "text-title-2-medium text-text-primary",
								children: n.code
							}),
							/* @__PURE__ */ (0, N.jsx)("span", {
								className: L,
								children: `${n.count} 个 · ${n.identical ? "SHA256 一致" : "内容未确认相同"}`
							}),
							n.cross_drive ? /* @__PURE__ */ (0, N.jsx)("span", {
								className: L,
								children: `跨盘 ${n.drives.join(" ")}`
							}) : null,
							/* @__PURE__ */ (0, N.jsx)(e, {
								variant: "secondary",
								size: "small",
								...v(D.isPending),
								onClick: () => D.mutate({
									url: "/api/duplicates/keep",
									body: {
										key: n.key,
										mode: p,
										keep: !h
									}
								}, { onSuccess: () => {
									T(/* @__PURE__ */ new Set()), l(h ? "已取消整组保留" : "已整组保留全部文件");
								} }),
								children: h ? "取消整组保留" : "整组保留"
							})
						]
					}), n.files.map((e) => /* @__PURE__ */ (0, N.jsx)(z, {
						file: e,
						selected: C.has(e.id),
						openItem: t,
						toggle: (t) => T((n) => {
							let r = new Set(n);
							return t ? r.add(e.id) : r.delete(e.id), r;
						})
					}, e.id))]
				}, n.key)),
				V.length ? null : /* @__PURE__ */ (0, N.jsx)(o, {
					icon: F,
					title: h ? "没有整组保留的文件" : p === "exact" ? "没有已确认的重复文件" : "没有同番号版本",
					children: p === "exact" ? "未完成校验不代表没有重复文件。可以校验同大小候选，或查看同番号版本。" : "同番号的各份文件会在这里列出供你比较。"
				}),
				P.has_more ? /* @__PURE__ */ (0, N.jsx)("p", {
					className: "text-caption-1-regular text-text-secondary",
					children: `显示前 ${V.length} 组，共 ${P.total} 组；处理后会补上其余组。`
				}) : null
			] }) : E.error ? /* @__PURE__ */ (0, N.jsx)(d, {
				tone: "error",
				title: "文件比较读取失败",
				children: x(E.error)
			}) : /* @__PURE__ */ (0, N.jsx)("p", {
				role: "status",
				children: "正在读取文件比较…"
			}),
			D.isError || O.isError ? /* @__PURE__ */ (0, N.jsx)(d, {
				tone: "error",
				title: "操作失败",
				children: x(D.error || O.error)
			}) : null
		]
	});
}
export { B as DuplicatesPage };

//# debugId=7b49c031-1417-486b-89a6-63d5d640dbab