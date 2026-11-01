(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "6b8d56f0-ee85-4f37-be73-02bf9038ae04", e._sentryDebugIdIdentifier = "sentry-dbid-6b8d56f0-ee85-4f37-be73-02bf9038ae04");
	} catch {}
})();
import { Button as e, CLEANUP_ENTRY as t, CLEANUP_ENTRY_GRID as n, CLEANUP_HASH_REDIRECTS as r, CLEANUP_TOOLS as i, Chip as a, DIRECTORY_TEMPLATE_ERROR as o, DUPLICATES_KEY as s, Fieldset as c, FieldsetTitle as l, IDLE_REPAIR as u, IconButton as d, IndexSearch as f, Input as p, JUNK_KEY as m, LINKS_KEY as h, LINK_CHECK_KEY as g, LINK_KINDS as _, LINK_PRUNE_KEY as ee, LOC as v, LibraryProcessingCard as y, MEDIA_REPAIR_KEY as b, MEDIA_REPAIR_URL as x, MEDIA_SOURCES_KEY as S, MEDIA_SOURCE_ICONS as C, Note as w, ORGANIZE_KEY as T, ORPHAN_RECORDS_KEY as E, PERFORMER_DELETE_KEY as D, PLAIN_STAT_STRIP as O, PlainStat as k, Progress as te, QUALITY_GOALS_KEY as A, REPAIR_CARD_TEXT as j, REPAIR_LIBRARIES_KEY as ne, RESOURCE_APPLY_KEY as M, RESOURCE_SCAN_KEY as re, RESULT_PANEL as ie, RESULT_SECTION as N, REVIEW_COUNTS_KEY as P, SOURCE_LABELS as F, SectionHeading as I, Select as ae, SelectItem as oe, SourceMark as se, StatusLabel as ce, TRASH_KEY as L, TaskProgress as R, Wt as le, __toESM as ue, apiSend as z, applyConfirmText as de, applyLeftovers as fe, applyPlanText as pe, applyText as me, attachOrphan as B, baseName as he, busyProps as V, candidateText as H, checkLine as ge, confirmModal as U, cx as _e, deletePerformerVideos as ve, entityDisplayName as ye, entityFaceImg as be, entityPath as xe, errorMessage as W, esc as Se, fetchDeletePerformers as Ce, fetchDeletePlan as we, fetchDuplicates as Te, fetchJunkSummary as Ee, fetchLinkCheck as De, fetchLinkPrune as Oe, fetchLinkStats as ke, fetchMediaRepair as Ae, fetchMediaSources as je, fetchOrganize as Me, fetchOrganizeExample as Ne, fetchOrphanRecords as Pe, fetchQualityGoals as Fe, fetchRepairLibraries as Ie, fetchResourceApply as Le, fetchResourceScan as Re, fetchReviewCounts as ze, fetchTrashSummary as Be, firstGrapheme as Ve, fmtSize as G, hasChanges as He, hasResourceRoots as Ue, junkBreakdown as We, missingToolText as Ge, nameFallback as Ke, organizeOutcome as qe, pickOrganizeFolder as Je, plainStatClass as K, planSummary as Ye, previewOrganize as Xe, pruneText as Ze, purgeCount as Qe, purgeOrphan as $e, queryClient as q, recordsText as et, rememberTemplates as tt, require_jsx_runtime as nt, require_react as rt, reviewSummary as it, scanLine as at, shellNavigate as ot, sourceMeta as st, spriteGlyph as J, startLinkCheck as ct, startLinkPrune as lt, startOrganize as ut, startResourceApply as dt, startResourceScan as ft, statusLine as pt, useAction as mt, useBackgroundJob as Y, useEntityNames as ht, useMutation as gt, useQuery as X, withOrganizeJob as _t } from "./peach-app.js";
import { Page as vt } from "./peach-app.page-QAncjzM1.js";
import { ErrorExcerpt as yt } from "./peach-app.error-excerpt-B8v2xEIP.js";
import { DataTable as bt } from "./peach-app.data-table-C3qANjHs.js";
import { SiteMark as xt } from "./peach-app.site-mark-D_VlIyJz.js";
import { LEGACY_AVATAR_IMG as St } from "./peach-app.legacy-avatar-NSITxLRS.js";
import { FolderSearchIcon as Ct } from "./peach-app.folder-rows-BWBfTyUD.js";
import { ConnectionStatus as wt } from "./peach-app.connection-status-DI6kgn3i.js";
// src/react/data-cleanup/cleanup-entry-card.tsx
var Z = /* @__PURE__ */ ue(rt(), 1), Q = nt(), Tt = J("chevron-right");
function Et({ label: e, icon: n, summary: r, detail: i, state: a, attributes: o, onOpen: s }) {
	return /* @__PURE__ */ (0, Q.jsxs)("button", {
		type: "button",
		...o,
		className: t.face,
		onClick: s,
		"data-entry-state": a,
		"aria-busy": a === "loading" || void 0,
		children: [
			/* @__PURE__ */ (0, Q.jsx)("span", {
				"aria-hidden": !0,
				className: t.icon,
				children: /* @__PURE__ */ (0, Q.jsx)(n, {
					"aria-hidden": !0,
					className: "size-5"
				})
			}),
			/* @__PURE__ */ (0, Q.jsxs)("span", {
				className: t.body,
				children: [
					/* @__PURE__ */ (0, Q.jsx)("span", {
						className: t.title,
						children: e
					}),
					/* @__PURE__ */ (0, Q.jsx)("span", {
						className: _e(t.summary, a === "error" && "text-text-error-primary"),
						children: r
					}),
					i ? /* @__PURE__ */ (0, Q.jsx)("span", {
						className: t.detail,
						children: i
					}) : null
				]
			}),
			/* @__PURE__ */ (0, Q.jsx)(Tt, {
				"aria-hidden": !0,
				className: t.arrow
			})
		]
	});
}
// src/react/media-repair/media-repair-card.tsx
var Dt = (e) => C[e] || e, Ot = (e) => q.setQueryData(b, e);
function kt({ toast: t = () => {} }) {
	let n = Y({
		queryKey: b,
		queryFn: ({ signal: e }) => Ae(e),
		start: (e) => z(x, {
			library: e,
			restart: !0
		}),
		onFinish: (e) => {
			e.status === "complete" && !e.failed && !e.missing_tool && t(e.repaired ? `已修复 ${e.repaired.toLocaleString()} 部视频` : "已检查媒体库，没有需要修复的视频");
		}
	}), r = X({
		queryKey: ne,
		queryFn: ({ signal: e }) => Ie(e)
	}), [i, a] = (0, Z.useState)(""), o = mt(), s = n.job ?? u, d = r.data ?? [], f = s.status === "running", p = d.find((e) => e.id === (f ? s.library : i)) ?? d.find((e) => e.id === s.library) ?? d[0], m = () => {
		p && U({
			title: `修复媒体库「${p.name}」`,
			body: "缺时间戳表的片子另存一份修好的头，原文件不动；缺索引的片子重建后替换原文件，坏原件改名成同目录的隐藏文件（.文件名.peach-original）留着。" + (p.metered ? "这个库在计费来源上，每修一部都要把片子完整拉一遍。" : ""),
			confirmLabel: "修复媒体库",
			onConfirm: async () => {
				await n.start.mutateAsync(p.id);
			}
		});
	}, h = () => void o.run("stop", (e) => z(x, { stop: !0 }, "POST", e), Ot), g = n.outcome, _ = pt(f ? s : g ?? u), ee = o.error || g?.error || (n.query.error ? "读不到媒体修复的状态" : "");
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, Q.jsx)(c, {
			layout: "split",
			label: "媒体修复",
			footer: /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(ae, {
				"aria-label": "媒体库",
				prefix: "媒体库",
				className: "w-48",
				selectedKey: p?.id ?? null,
				isDisabled: f || !d.length,
				onSelectionChange: (e) => {
					e !== null && a(String(e));
				},
				children: d.map((e) => /* @__PURE__ */ (0, Q.jsxs)(oe, {
					id: e.id,
					textValue: e.name,
					children: [/* @__PURE__ */ (0, Q.jsx)(se, { mark: Dt(e.icon) }), e.name]
				}, e.id))
			}), f ? /* @__PURE__ */ (0, Q.jsx)(e, {
				onClick: h,
				...V(o.busy === "stop"),
				children: "停止"
			}) : /* @__PURE__ */ (0, Q.jsx)(e, {
				onClick: m,
				disabled: !p,
				children: "开始修复"
			})] }),
			children: /* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, Q.jsx)(l, { children: "媒体修复" }),
					/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "text-body-2-regular text-text-secondary",
						children: j
					}),
					f && s.total ? /* @__PURE__ */ (0, Q.jsx)(te, {
						label: "修复进度",
						value: s.checked,
						max: s.total
					}) : null,
					_ ? /* @__PURE__ */ (0, Q.jsx)("p", {
						role: "status",
						className: "text-caption-1-regular text-text-secondary",
						children: _
					}) : null
				]
			})
		}), /* @__PURE__ */ (0, Q.jsxs)("div", {
			"aria-live": "polite",
			className: "flex flex-col gap-4 empty:hidden",
			children: [g?.status === "complete" && g.missing_tool ? /* @__PURE__ */ (0, Q.jsx)(w, {
				tone: "warning",
				title: "缺少 untrunc",
				action: /* @__PURE__ */ (0, Q.jsx)(e, {
					variant: "ghost",
					size: "small",
					onClick: n.dismiss,
					children: "关闭提示"
				}),
				children: Ge(g)
			}) : null, ee ? /* @__PURE__ */ (0, Q.jsx)(w, {
				tone: "error",
				children: ee
			}) : null]
		})]
	});
}
// src/react/data-cleanup/link-check-icon.tsx
function At({ className: e }) {
	return /* @__PURE__ */ (0, Q.jsxs)("svg", {
		"aria-hidden": !0,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: 2,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: e,
		"data-link-check-icon": "",
		children: [
			/* @__PURE__ */ (0, Q.jsx)("path", { d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71" }),
			/* @__PURE__ */ (0, Q.jsx)("path", { d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" }),
			/* @__PURE__ */ (0, Q.jsxs)("g", {
				"data-link-check-rays": "",
				children: [
					/* @__PURE__ */ (0, Q.jsx)("path", { d: "M8 2v3" }),
					/* @__PURE__ */ (0, Q.jsx)("path", { d: "M2 8h3" }),
					/* @__PURE__ */ (0, Q.jsx)("path", { d: "M16 19v3" }),
					/* @__PURE__ */ (0, Q.jsx)("path", { d: "M19 16h3" })
				]
			})
		]
	});
}
// src/react/data-cleanup/link-manager.tsx
var jt = J("rotate-cw"), Mt = "站点返回 404 或 410，确认这个地址不存在。", Nt = "站点拒绝程序访问或一次临时故障都会落在这里。链接保留，可勾选后单独重试。", Pt = "删除前会逐条重验一次；此操作不可撤销。", Ft = "暂时无法读取进度，正在重新连接…", It = (e) => Number(e || 0).toLocaleString();
function Lt({ label: e, value: t, note: n }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-0.5",
		children: [
			/* @__PURE__ */ (0, Q.jsx)("span", {
				className: "text-caption-1-regular leading-5 text-text-secondary",
				children: e
			}),
			/* @__PURE__ */ (0, Q.jsx)("b", {
				className: "text-title-2-semibold font-bold leading-5 tabular-nums text-text-primary",
				children: t
			}),
			n ? /* @__PURE__ */ (0, Q.jsx)("small", {
				className: "text-caption-1-regular leading-5 text-text-secondary",
				children: n
			}) : null
		]
	});
}
function Rt({ title: e, items: t, hint: n, picked: r, onPick: i, children: a, footer: o, confirmed: s = !1 }) {
	return t.length ? /* @__PURE__ */ (0, Q.jsx)("div", {
		className: N,
		"data-link-results": s ? "gone" : "unclear",
		children: /* @__PURE__ */ (0, Q.jsx)(bt, {
			label: e,
			items: t,
			columns: [
				{
					id: "entity",
					label: "Peach 资料",
					width: 180,
					min: 128,
					value: (e) => e.entity,
					render: (e) => /* @__PURE__ */ (0, Q.jsxs)("a", {
						className: "flex min-w-24 items-center gap-2 text-text-secondary hover:text-text-primary hover:underline",
						href: e.entity_id && e.entity_kind ? xe(e.entity_kind, e.entity, e.entity_id) : void 0,
						"data-link-identity": "",
						children: [/* @__PURE__ */ (0, Q.jsx)("span", {
							"data-link-avatar": "",
							className: `relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-quaternary-default text-caption-1-medium text-text-primary ${St}`,
							"aria-hidden": !0,
							dangerouslySetInnerHTML: { __html: `<span>${Se(Ve(e.entity))}</span>` + be({
								kind: e.entity_kind,
								id: e.entity_id,
								hasImage: e.face?.has_image,
								version: e.face?.image_version,
								focus: e.face?.avatar_focus,
								thumb: !0,
								mark: e.entity_kind === "studio" || e.entity_kind === "agency" ? e.id : null
							}) }
						}), /* @__PURE__ */ (0, Q.jsx)("span", {
							className: "min-w-0 wrap-anywhere",
							children: e.entity
						})]
					})
				},
				{
					id: "kind",
					label: "类型",
					width: 128,
					value: (e) => _[e.link_kind] || e.link_kind,
					render: (e) => _[e.link_kind] || e.link_kind
				},
				{
					id: "label",
					label: "链接名称",
					min: 128,
					value: (e) => e.label || "",
					render: (e) => /* @__PURE__ */ (0, Q.jsx)("span", {
						className: "flex min-w-24 items-center gap-2",
						"data-link-name": "",
						children: /* @__PURE__ */ (0, Q.jsx)("span", {
							className: "min-w-0 wrap-anywhere",
							children: e.label || new URL(e.url).hostname
						})
					})
				},
				{
					id: "note",
					label: "结果",
					width: 320,
					min: 192,
					value: (e) => e.note,
					render: (e) => /* @__PURE__ */ (0, Q.jsx)("div", {
						className: "min-w-0 w-full",
						"data-link-result": s ? "gone" : "unclear",
						children: /^(?:HTTP\s+)?[1-5]\d{2}$/.test(e.note.trim()) ? /* @__PURE__ */ (0, Q.jsx)(ce, {
							tone: s || /^(?:HTTP\s+)?5\d{2}$/.test(e.note.trim()) ? "error" : "warning",
							"data-link-code": "",
							children: e.note.trim()
						}) : /* @__PURE__ */ (0, Q.jsxs)("div", {
							className: "flex flex-col items-start gap-1",
							children: [/* @__PURE__ */ (0, Q.jsx)(ce, {
								tone: s ? "error" : "warning",
								children: s ? "地址已失效" : "未取得结论"
							}), /* @__PURE__ */ (0, Q.jsx)(yt, {
								text: e.note,
								className: "tabular-nums text-text-secondary"
							})]
						})
					})
				},
				{
					id: "url",
					label: "地址",
					width: 360,
					min: 180,
					value: (e) => e.url,
					render: (e) => /* @__PURE__ */ (0, Q.jsxs)("a", {
						href: e.url,
						target: "_blank",
						rel: "noopener noreferrer",
						title: e.url,
						"data-link-address": "",
						className: "flex min-w-0 items-center gap-1 text-text-secondary hover:text-text-primary",
						children: [
							/* @__PURE__ */ (0, Q.jsx)(xt, { linkId: e.id }),
							/* @__PURE__ */ (0, Q.jsx)("span", {
								"data-middle-truncate": !0,
								className: "min-w-0 truncate",
								children: e.url
							}),
							/* @__PURE__ */ (0, Q.jsx)(le, {
								"aria-hidden": !0,
								className: "size-(--icon-inline) shrink-0"
							})
						]
					})
				}
			],
			rowId: (e) => String(e.id),
			description: n,
			unit: "条链接",
			panel: !1,
			footerActions: o,
			rowLabel: (e) => `${e.entity} 的${e.label || e.url}`,
			selected: r.map(String),
			onSelected: (e) => i(e.map(Number)),
			actions: () => a
		})
	}) : null;
}
function zt() {
	let t = X({
		queryKey: h,
		queryFn: ({ signal: e }) => ke(e)
	}), [n, r] = (0, Z.useState)([]), [i, o] = (0, Z.useState)([]), s = Y({
		queryKey: ee,
		queryFn: ({ signal: e }) => Oe(e),
		start: lt,
		onFinish: () => {
			q.invalidateQueries({
				queryKey: h,
				exact: !0
			}), q.invalidateQueries({
				queryKey: g,
				exact: !0
			});
		}
	}), u = Y({
		queryKey: g,
		queryFn: ({ signal: e }) => De(e),
		start: ct,
		onStarted: () => {
			s.dismiss(), r([]), o([]);
		}
	}), d = u.job, f = d?.check_id ?? "";
	(0, Z.useEffect)(() => {
		r([]), o([]);
	}, [f]);
	let p = u.running || u.start.isPending, m = s.running || s.start.isPending, v = d?.status === "complete", y = d?.gone ?? [], b = d?.unclear ?? [], x = v ? b : [], S = y.filter((e) => i.includes(e.id)).map((e) => e.id), C = x.filter((e) => n.includes(e.id)).map((e) => e.id), T = t.data, E = (T?.top_hosts ?? []).slice(0, 3), D = (e) => {
		p || e && !e.length || u.start.mutate(e ? {
			retry: e,
			checkId: f
		} : {});
	}, O = (e) => {
		!m && y.length && U({
			title: "删除失效链接",
			body: `将删除 ${e?.length ?? y.length} 条失效链接。删除前会再次检查，删除后无法恢复。`,
			confirmLabel: "删除失效链接",
			danger: !0,
			onConfirm: () => s.start.mutateAsync({
				checkId: f,
				ids: e
			})
		});
	}, k = s.outcome, te = u.start.error ?? s.start.error, A = null, j = null;
	if (k?.status === "failed") j = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "链接清理未完成",
		children: k.error || "请查看任务记录，核对已处理的链接。"
	});
	else if (k && !y.length && !b.length) j = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "success",
		title: "完成",
		children: Ze(k)
	});
	else if (te) j = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "检查失败",
		children: W(te)
	});
	else if (u.query.isError && d) j = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "neutral",
		title: "任务状态",
		children: Ft
	});
	else if (d?.status === "failed") j = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "检查失败",
		children: d.error || "检查失败"
	});
	else if (d && d.status !== "idle") {
		A = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [d.status === "running" ? /* @__PURE__ */ (0, Q.jsx)(R, {
			embedded: !0,
			label: ge(d),
			value: Math.min(d.checked || 0, d.total || 0),
			total: d.total
		}) : null, m ? /* @__PURE__ */ (0, Q.jsx)(R, {
			embedded: !0,
			label: s.job?.message || "正在重验并删除失效链接",
			value: Math.min(s.job?.checked || 0, s.job?.total || 0),
			total: s.job?.total
		}) : null] });
		let t = `立即重试所选（${C.length}）`;
		j = v || y.length || b.length ? /* @__PURE__ */ (0, Q.jsxs)("div", {
			className: ie,
			children: [
				k?.status === "complete" ? /* @__PURE__ */ (0, Q.jsx)(w, {
					tone: "success",
					title: "完成",
					children: Ze(k)
				}) : null,
				/* @__PURE__ */ (0, Q.jsx)(Rt, {
					title: "地址已失效",
					items: y,
					hint: Mt,
					picked: i,
					onPick: o,
					confirmed: !0,
					footer: v && y.length ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "mr-auto min-w-0 text-caption-1-regular text-text-secondary",
						children: Pt
					}), /* @__PURE__ */ (0, Q.jsx)(e, {
						variant: "danger",
						...V(m),
						onClick: () => O(),
						children: `删除 ${y.length} 条失效链接`
					})] }) : null,
					children: /* @__PURE__ */ (0, Q.jsx)(e, {
						variant: "danger",
						size: "small",
						disabled: !v || !S.length,
						...V(m),
						onClick: () => O(S),
						children: `删除所选（${S.length}）`
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(Rt, {
					title: "本次未访问成功",
					items: b,
					hint: Nt,
					picked: n,
					onPick: r,
					footer: x.length ? /* @__PURE__ */ (0, Q.jsx)(e, {
						variant: "primary",
						leadingIcon: jt,
						...V(p),
						onClick: () => D(x.map((e) => e.id)),
						children: `立即重试全部（${x.length}）`
					}) : null,
					children: x.length ? /* @__PURE__ */ (0, Q.jsx)(Q.Fragment, { children: /* @__PURE__ */ (0, Q.jsx)(e, {
						variant: "secondary",
						leadingIcon: jt,
						disabled: !C.length,
						...V(p),
						onClick: () => D(C),
						children: t
					}) }) : null
				}),
				v && !y.length && !b.length ? /* @__PURE__ */ (0, Q.jsx)("p", {
					className: `${N} text-body-regular text-notification-success-foreground`,
					children: "全部链接均可访问。"
				}) : null
			]
		}) : null;
	}
	return /* @__PURE__ */ (0, Q.jsxs)("section", {
		id: "link-manager",
		"aria-labelledby": "link-manager-title",
		className: "flex scroll-mt-20 flex-col gap-4",
		children: [/* @__PURE__ */ (0, Q.jsxs)(c, {
			layout: "stack",
			labelledBy: "link-manager-title",
			footer: /* @__PURE__ */ (0, Q.jsx)(e, {
				"data-link-check": "",
				leadingIcon: At,
				...V(p),
				onClick: () => D(),
				children: p ? "检查中" : v ? "重新检查" : "检查死链"
			}),
			children: [
				/* @__PURE__ */ (0, Q.jsx)(l, {
					id: "link-manager-title",
					gap: "small",
					children: "链接管理"
				}),
				t.isError ? /* @__PURE__ */ (0, Q.jsx)(w, {
					tone: "error",
					title: "链接统计读取失败",
					children: W(t.error)
				}) : T ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "link-stat-grid mt-4 gap-x-8 gap-y-3",
					children: [/* @__PURE__ */ (0, Q.jsx)(Lt, {
						label: "链接总数",
						value: It(T.total),
						note: `分布在 ${It(T.entities)} 个女优、厂牌与系列`
					}), Object.entries(T.by_kind ?? {}).map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(Lt, {
						label: _[e] || e,
						value: It(t)
					}, e))]
				}), E.length ? /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "mt-4 flex min-w-0 flex-col gap-0.5",
					children: [/* @__PURE__ */ (0, Q.jsx)("span", {
						className: "text-caption-1-regular text-text-secondary",
						children: "主要站点"
					}), /* @__PURE__ */ (0, Q.jsx)("div", {
						className: "flex min-w-0 flex-wrap gap-x-5 gap-y-2",
						children: E.map(([e, t]) => /* @__PURE__ */ (0, Q.jsxs)("span", {
							"data-top-host": "",
							className: "inline-flex min-w-0 max-w-full items-center gap-1.5",
							children: [/* @__PURE__ */ (0, Q.jsxs)("a", {
								href: `https://${e}`,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex min-w-0 items-center gap-1.5 text-body-2-medium text-text-primary",
								children: [
									/* @__PURE__ */ (0, Q.jsx)(xt, { linkId: T.top_host_link_ids?.[e] }),
									/* @__PURE__ */ (0, Q.jsx)("span", {
										className: "min-w-0 wrap-anywhere",
										children: e
									}),
									/* @__PURE__ */ (0, Q.jsx)(le, {
										"aria-hidden": !0,
										className: "size-(--icon-inline) shrink-0"
									})
								]
							}), /* @__PURE__ */ (0, Q.jsx)(a, {
								variant: "caption",
								color: "neutral",
								children: /* @__PURE__ */ (0, Q.jsx)("span", {
									className: "tabular-nums",
									children: It(t)
								})
							})]
						}, e))
					})]
				}) : null] }) : null,
				/* @__PURE__ */ (0, Q.jsx)("div", {
					"aria-live": "polite",
					className: "mt-4 flex flex-col gap-3 empty:hidden",
					children: A
				})
			]
		}), /* @__PURE__ */ (0, Q.jsx)("div", {
			"aria-live": "polite",
			className: "empty:hidden",
			children: j
		})]
	});
}
// src/react/data-cleanup/organize-card.tsx
var Bt = (e, t) => `将整理「${e}」${t ? `的「${t}」及其子目录` : "上的文件名与目录"}，清理特殊符号与乱码，并按已填模板改名或移动。目标已存在的行会整行跳过。这一批可以从「回滚上一批」整批退回。`, Vt = "将把上一批整理动过的文件退回整理前的名字与位置，数据库路径跟着退回。退回后这一批不再出现在这里。", Ht = 8;
function Ut({ plan: e }) {
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("ol", {
		className: "mt-2 flex min-w-0 flex-col gap-1",
		children: e.rows.slice(0, Ht).map((e) => /* @__PURE__ */ (0, Q.jsxs)("li", {
			className: "flex min-w-0 items-center gap-2 text-caption-1-regular text-text-secondary",
			children: [
				/* @__PURE__ */ (0, Q.jsx)("span", {
					"data-middle-truncate": !0,
					title: e.current_path,
					className: "min-w-0 truncate",
					children: he(e.current_path)
				}),
				/* @__PURE__ */ (0, Q.jsx)("span", {
					"aria-hidden": !0,
					children: "→"
				}),
				/* @__PURE__ */ (0, Q.jsx)("span", {
					"data-middle-truncate": !0,
					title: e.target_path,
					className: "min-w-0 truncate text-text-primary",
					children: he(e.target_path)
				})
			]
		}, e.current_path))
	}), e.truncated || e.rows.length > Ht ? /* @__PURE__ */ (0, Q.jsx)("p", {
		className: "text-caption-1-regular text-text-secondary",
		children: "只列出前 8 行，完整计划在计划 CSV 里。"
	}) : null] });
}
function Wt({ toast: t, failure: n }) {
	let r = X({
		queryKey: T,
		queryFn: ({ signal: e }) => Me(e)
	}), i = r.data, a = i?.locations ?? [], [s, u] = (0, Z.useState)(""), f = a.some((e) => e.location === s) ? s : a[0]?.location ?? "", m = i?.templates?.[f], [h, g] = (0, Z.useState)(null), _ = h?.location === f ? h : {
		location: f,
		file: m?.file ?? "",
		dir: m?.dir ?? ""
	}, ee = (e) => {
		g({
			..._,
			...e
		}), N.reset();
	}, [y, b] = (0, Z.useState)({
		location: "",
		path: ""
	}), x = y.location === f ? y.path : "", S = (0, Z.useRef)({
		location: f,
		path: x
	});
	S.current = {
		location: f,
		path: x
	};
	let [E, D] = (0, Z.useState)(null), O = (0, Z.useRef)(null), k = (0, Z.useRef)(null), te = (0, Z.useRef)(null), A = X({
		queryKey: [
			"organize-example",
			_.file,
			_.dir
		],
		queryFn: ({ signal: e }) => Ne(_.file, _.dir, e),
		enabled: !!i
	}), [j, ne] = (0, Z.useState)("file"), M = (0, Z.useRef)(!1), re = (0, Z.useRef)(null);
	(0, Z.useLayoutEffect)(() => {
		let e = re.current;
		if (!e) return;
		re.current = null;
		let t = (e.field === "file" ? O : k).current;
		t?.focus(), t?.setSelectionRange(e.caret, e.caret);
	});
	let ie = () => ({
		location: f,
		path: x.trim(),
		file_template: _.file.trim(),
		dir_template: _.dir.trim()
	}), N = gt({
		mutationFn: Xe,
		onError: (e) => {
			let t = /整理路径/.test(W(e)) ? "path" : o.test(W(e)) ? "dir" : "file";
			D(t), (t === "path" ? te : t === "dir" ? k : O).current?.focus();
		}
	}), P = gt({
		mutationFn: ({ initial: e }) => Je(e),
		onSuccess: (e, t) => {
			e.path && t.location === S.current.location && t.path === S.current.path && (b({
				location: t.location,
				path: e.path
			}), D(null), N.reset(), te.current?.focus());
		}
	}), F = Y({
		queryKey: T,
		queryFn: ({ signal: e }) => Me(e),
		start: ut,
		jobOf: (e) => e,
		withJob: _t,
		onStarted: () => N.reset(),
		onFinish: (e) => {
			if (q.invalidateQueries({
				queryKey: T,
				exact: !0
			}), e.status !== "complete") return;
			let { text: r, failed: i } = qe(e);
			i ? n("整理文件", /* @__PURE__ */ Error(`${i} 行未能处理`)) : t(r.replace(/。$/, ""));
		}
	}), I = F.running || F.start.isPending, ce = JSON.stringify(N.variables) === JSON.stringify(ie()), L = ce ? N.data : void 0, le = Number(L?.counts?.change || 0), ue = v[f] || f, z = (e) => {
		ee(e), D(null), N.reset();
	}, de = (e) => {
		let t = (j === "file" ? O : k).current, n = _[j], r = M.current ? t?.selectionStart ?? n.length : n.length, i = M.current ? t?.selectionEnd ?? r : r, a = `{${e}}`;
		re.current = {
			field: j,
			caret: r + a.length
		}, z({ [j]: n.slice(0, r) + a + n.slice(i) });
	}, fe = () => {
		N.isPending || I || !f || (F.dismiss(), F.start.reset(), D(null), N.mutate(ie()));
	}, pe = () => {
		let e = N.variables;
		e && L && le && U({
			title: "整理文件",
			body: Bt(ue, e.path),
			confirmLabel: "整理文件",
			onConfirm: async () => {
				await F.start.mutateAsync({
					kind: "apply",
					request: e
				}), tt({
					...i?.templates ?? {},
					[e.location]: {
						file: e.file_template,
						dir: e.dir_template
					}
				});
			}
		});
	}, me = () => void U({
		title: "回滚上一批整理",
		body: Vt,
		confirmLabel: "回滚整理",
		onConfirm: () => F.start.mutateAsync({ kind: "rollback" })
	}), B = null, he = !!le && !I && !F.outcome, H = F.job, ge = F.outcome;
	if (H?.status === "running") {
		let e = H.message || H.stage || "正在整理文件";
		B = /* @__PURE__ */ (0, Q.jsx)(R, {
			embedded: !0,
			label: e,
			value: Math.min(H.checked || 0, H.total || 0),
			total: H.total
		});
	} else if (ge?.status === "failed") B = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "文件整理未完成",
		children: ge.error || "请查看任务记录，核对已处理的文件。"
	});
	else if (ge) {
		let { text: e, failed: t } = qe(ge);
		B = /* @__PURE__ */ (0, Q.jsx)(w, {
			tone: t ? "warning" : "success",
			title: t ? "部分完成" : "整理结果",
			children: e
		});
	} else F.start.isError ? B = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "整理失败",
		children: W(F.start.error)
	}) : N.isPending ? B = /* @__PURE__ */ (0, Q.jsx)(R, {
		embedded: !0,
		label: "正在核对整理计划"
	}) : N.isError && ce ? B = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "整理预览失败",
		children: W(N.error)
	}) : L && (B = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "neutral",
		title: "预览结果",
		children: Ye(L)
	}), le ? /* @__PURE__ */ (0, Q.jsx)(Ut, { plan: L }) : null] }));
	return /* @__PURE__ */ (0, Q.jsxs)(c, {
		layout: "stack",
		id: "organize",
		labelledBy: "cleanup-organize-title",
		attributes: { "data-cleanup-organize": "" },
		footer: /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
			i?.last_batch ? /* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "secondary",
				...V(I),
				onClick: me,
				children: "回滚上一批"
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(e, {
				variant: he ? "secondary" : "primary",
				disabled: !a.length || I,
				...V(N.isPending),
				onClick: fe,
				children: "预览"
			}),
			he ? /* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "primary",
				onClick: pe,
				children: "执行整理"
			}) : null
		] }),
		children: [
			/* @__PURE__ */ (0, Q.jsx)(l, {
				id: "cleanup-organize-title",
				gap: "medium",
				children: "整理"
			}),
			/* @__PURE__ */ (0, Q.jsx)("p", {
				className: "text-body-regular text-text-secondary",
				children: "清理文件名中的特殊符号与乱码，也可按模板改名并归入目录。先预览，确认后执行；执行过的一批可以整批退回。"
			}),
			r.isError ? /* @__PURE__ */ (0, Q.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, Q.jsx)(w, {
					tone: "error",
					title: "整理配置读取失败",
					children: W(r.error)
				})
			}) : null,
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "mt-3 flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, Q.jsxs)("div", {
						"data-organize-scope": !0,
						className: "flex min-w-0 flex-wrap items-start gap-2",
						children: [a.length ? /* @__PURE__ */ (0, Q.jsx)(ae, {
							"aria-label": "整理哪个来源",
							prefix: "来源",
							className: "w-fit min-w-25",
							selectedKey: f || null,
							onSelectionChange: (e) => {
								e !== null && (u(String(e)), b({
									location: String(e),
									path: ""
								}), D(null), N.reset(), P.reset(), M.current = !1);
							},
							children: a.map((e) => /* @__PURE__ */ (0, Q.jsxs)(oe, {
								id: e.location,
								textValue: v[e.location] || e.location,
								children: [/* @__PURE__ */ (0, Q.jsx)(se, { mark: C[e.location] || "database" }), v[e.location] || e.location]
							}, e.location))
						}) : null, /* @__PURE__ */ (0, Q.jsxs)("div", {
							className: "flex min-w-0 basis-64 flex-1 items-start gap-2",
							children: [/* @__PURE__ */ (0, Q.jsx)(p, {
								"aria-label": "整理路径",
								className: "min-w-0 flex-1",
								placeholder: "留空整理整个来源",
								name: "organize-path",
								autoComplete: "off",
								spellCheck: "false",
								value: x,
								ref: te,
								isInvalid: E === "path",
								onChange: (e) => {
									b({
										location: f,
										path: e
									}), D(null), N.reset(), P.reset();
								}
							}), /* @__PURE__ */ (0, Q.jsx)(d, {
								icon: Ct,
								"aria-label": "选择整理路径",
								...V(P.isPending),
								onClick: () => P.mutate({
									initial: x || a.find((e) => e.location === f)?.roots[0] || "",
									location: f,
									path: x
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "text-caption-1-regular text-text-secondary",
						children: "指定路径时包含子目录，目录模板以该路径为起点。模板均留空时只清理文件名。"
					}),
					P.isError ? /* @__PURE__ */ (0, Q.jsxs)(w, {
						tone: "error",
						title: "目录选择失败",
						children: [W(P.error), "；也可直接输入路径。"]
					}) : null,
					/* @__PURE__ */ (0, Q.jsx)(p, {
						label: "文件名模板",
						placeholder: "{code}[ {title}]",
						value: _.file,
						ref: O,
						spellCheck: "false",
						isInvalid: E === "file",
						onFocus: () => {
							ne("file"), M.current = !0;
						},
						onChange: (e) => z({ file: e })
					}),
					/* @__PURE__ */ (0, Q.jsx)(p, {
						label: "目录模板",
						placeholder: "留空表示原地改名",
						value: _.dir,
						ref: k,
						spellCheck: "false",
						isInvalid: E === "dir",
						onFocus: () => {
							ne("dir"), M.current = !0;
						},
						onChange: (e) => z({ dir: e })
					}),
					i?.presets?.length ? /* @__PURE__ */ (0, Q.jsxs)("div", {
						className: "flex flex-col gap-2",
						role: "group",
						"aria-label": "套用模板",
						children: [/* @__PURE__ */ (0, Q.jsx)("p", {
							className: "text-caption-1-medium text-text-secondary",
							children: "套用模板"
						}), /* @__PURE__ */ (0, Q.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: i.presets.map((t) => /* @__PURE__ */ (0, Q.jsx)(e, {
								variant: "secondary",
								size: "small",
								title: t.example || t.label,
								className: "max-w-full [&>span]:min-w-0 [&>span]:shrink",
								onClick: () => {
									z({
										file: t.file,
										dir: t.dir
									}), M.current = !1;
								},
								children: /* @__PURE__ */ (0, Q.jsx)("span", {
									className: "truncate",
									children: t.label
								})
							}, t.label))
						})]
					}) : null,
					/* @__PURE__ */ (0, Q.jsxs)("p", {
						"aria-live": "polite",
						"aria-busy": A.isFetching,
						"data-organize-example": "",
						className: "text-caption-1-regular text-text-secondary",
						children: ["路径示例：", /* @__PURE__ */ (0, Q.jsx)("code", {
							className: "wrap-anywhere",
							children: A.data?.example || A.data?.error || (A.isError ? W(A.error) : "正在预览…")
						})]
					}),
					i?.placeholders?.length ? /* @__PURE__ */ (0, Q.jsxs)("div", {
						className: "flex flex-col gap-2",
						role: "group",
						"aria-label": "插入参数",
						children: [/* @__PURE__ */ (0, Q.jsxs)("p", {
							className: "text-caption-1-regular text-text-secondary",
							"aria-live": "polite",
							children: [
								/* @__PURE__ */ (0, Q.jsx)("strong", {
									className: "text-caption-1-semibold text-text-primary",
									children: "插入参数"
								}),
								"（到",
								j === "file" ? "文件名模板" : "目录模板",
								"）"
							]
						}), /* @__PURE__ */ (0, Q.jsx)("div", {
							className: "flex flex-wrap gap-1",
							children: i.placeholders.map((t) => /* @__PURE__ */ (0, Q.jsx)(e, {
								variant: "ghost",
								size: "small",
								"aria-label": `${t.label} {${t.key}}`,
								onClick: () => de(t.key),
								children: /* @__PURE__ */ (0, Q.jsxs)("span", {
									className: "inline-flex flex-wrap items-center gap-x-1.5",
									children: [/* @__PURE__ */ (0, Q.jsx)("code", { children: `{${t.key}}` }), /* @__PURE__ */ (0, Q.jsx)("span", {
										className: "text-text-secondary",
										children: t.label
									})]
								})
							}, t.key))
						})]
					}) : null,
					/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "text-caption-1-regular leading-4.5 text-text-secondary",
						children: "点击参数插入光标处，选中文字可替换。方括号里的内容在字段为空时整段省略。"
					})
				]
			}),
			/* @__PURE__ */ (0, Q.jsx)("div", {
				"aria-live": "polite",
				className: "mt-3 flex flex-col gap-2 empty:hidden",
				children: B
			})
		]
	});
}
// src/react/data-cleanup/orphan-records-card.tsx
var Gt = J("play"), Kt = () => q.invalidateQueries({
	queryKey: E,
	exact: !0
});
function qt({ item: t, toast: n }) {
	let [r, i] = (0, Z.useState)(t.candidates[0]?.id ?? null), a = gt({
		mutationFn: () => B(t.id, Number(r)),
		onSuccess: () => {
			let e = t.candidates.find((e) => e.id === r);
			n(`已将「${t.name}」的个人记录转移到「${e?.name ?? "所选文件"}」`), Kt();
		},
		onError: (e) => n(W(e))
	}), o = gt({
		mutationFn: () => $e(t.id),
		onSuccess: (e) => {
			n(e.blocked.length ? `「${t.name}」的文件已恢复，记录未删除；下次扫描后恢复为在库状态` : `已删除「${t.name}」的作品记录及个人记录`), Kt();
		}
	}), s = () => {
		U({
			title: "删除记录",
			body: `将删除「${t.name}」的作品记录${et(t.records) ? `及其个人记录（${et(t.records)}）` : ""}。此操作不可撤销。`,
			confirmLabel: "删除记录",
			danger: !0,
			onConfirm: () => o.mutateAsync()
		});
	}, c = a.isPending || o.isPending;
	return /* @__PURE__ */ (0, Q.jsxs)("span", {
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "danger",
				size: "small",
				...V(c),
				onClick: s,
				children: "删除记录"
			}),
			t.candidates.length ? /* @__PURE__ */ (0, Q.jsx)(ae, {
				"aria-label": `选择接收 ${t.name} 个人记录的文件`,
				prefix: "接收",
				className: "w-52",
				selectedKey: r,
				onSelectionChange: (e) => {
					e !== null && i(Number(e));
				},
				children: t.candidates.map((e) => /* @__PURE__ */ (0, Q.jsx)(oe, {
					id: e.id,
					textValue: H(e),
					children: H(e)
				}, e.id))
			}) : null,
			t.candidates.length ? /* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "primary",
				size: "small",
				disabled: r === null,
				...V(c),
				onClick: () => a.mutate(),
				children: "转移记录"
			}) : null
		]
	});
}
function Jt({ item: e }) {
	return /* @__PURE__ */ (0, Q.jsxs)("span", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, Q.jsxs)("span", {
			className: "relative inline-grid aspect-16/10 w-24 flex-none place-items-center max-cleanup-tight:hidden overflow-hidden rounded-lg border border-separator-border bg-background-tertiary-default text-text-tertiary",
			children: [/* @__PURE__ */ (0, Q.jsx)(Gt, {
				"aria-hidden": !0,
				className: "size-5"
			}), e.has_thumb ? /* @__PURE__ */ (0, Q.jsx)("img", {
				src: `/thumb?id=${e.id}&c=4`,
				alt: "",
				loading: "lazy",
				onError: (e) => e.currentTarget.remove(),
				className: "absolute inset-0 size-full object-contain"
			}) : null]
		}), /* @__PURE__ */ (0, Q.jsxs)("span", {
			className: "flex min-w-0 flex-1 flex-col gap-0.5",
			children: [/* @__PURE__ */ (0, Q.jsx)("span", {
				title: e.name,
				className: "truncate text-body-regular text-text-primary",
				children: e.name
			}), /* @__PURE__ */ (0, Q.jsx)("small", {
				className: "truncate text-caption-1-regular text-text-secondary",
				children: [e.code, v[e.location] || e.location].filter(Boolean).join(" · ")
			})]
		})]
	});
}
function Yt({ toast: t }) {
	let [n, r] = (0, Z.useState)([]), i = X({
		queryKey: E,
		queryFn: ({ signal: e }) => Pe(e)
	}), a = i.data?.items ?? [], o = gt({
		mutationFn: (e) => $e(e),
		onSuccess: (e) => {
			t(`已删除 ${e.purged} 条作品记录及其个人记录${e.blocked.length ? `；${e.blocked.length} 条文件已恢复，记录未删除` : ""}`), r([]), Kt();
		}
	}), s = (e) => void U({
		title: "删除所选记录",
		body: `将删除以下 ${e.length} 条作品记录及其全部个人记录。此操作不可撤销。`,
		items: e.map((e) => e.name),
		confirmLabel: "删除所选记录",
		danger: !0,
		onConfirm: () => o.mutateAsync(e.map((e) => e.id))
	}), u = [
		{
			id: "item",
			label: "作品",
			width: 480,
			min: 320,
			value: (e) => e.name,
			render: (e) => /* @__PURE__ */ (0, Q.jsx)(Jt, { item: e })
		},
		{
			id: "records",
			label: "个人记录",
			width: 176,
			min: 144,
			value: (e) => et(e.records),
			render: (e) => /* @__PURE__ */ (0, Q.jsx)("span", {
				className: "block min-w-0 whitespace-normal wrap-anywhere",
				children: et(e.records) || "无"
			})
		},
		{
			id: "target",
			label: "操作",
			width: a.some((e) => e.candidates.length) ? 360 : 128,
			min: 128,
			value: (e) => e.candidates.length,
			render: (e) => /* @__PURE__ */ (0, Q.jsx)(qt, {
				item: e,
				toast: t
			})
		}
	];
	return /* @__PURE__ */ (0, Q.jsx)("section", {
		id: "orphan-records",
		"aria-labelledby": "orphan-records-title",
		className: "flex scroll-mt-20 flex-col gap-4",
		children: i.isError ? /* @__PURE__ */ (0, Q.jsxs)(c, {
			layout: "stack",
			labelledBy: "orphan-records-title",
			children: [/* @__PURE__ */ (0, Q.jsx)(l, {
				id: "orphan-records-title",
				children: "文件已丢失的记录"
			}), /* @__PURE__ */ (0, Q.jsx)(w, {
				tone: "error",
				title: "读取文件已丢失的记录失败",
				children: W(i.error)
			})]
		}) : /* @__PURE__ */ (0, Q.jsx)(bt, {
			label: "文件已消失的作品",
			items: a,
			columns: u,
			title: "文件已丢失的记录",
			titleId: "orphan-records-title",
			unit: "条作品",
			description: "这些作品的源文件已删除，喜欢、稍后看、播放列表与观看历史仍保留。选择替代文件后，这些记录会转移到该文件，旧作品记录随之删除。",
			rowId: (e) => String(e.id),
			rowLabel: (e) => e.name,
			selected: n,
			onSelected: r,
			actions: (t) => /* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "danger",
				size: "small",
				disabled: !t.length,
				...V(o.isPending),
				onClick: () => s(t),
				children: `删除所选记录（${t.length}）`
			})
		})
	});
}
// src/react/data-cleanup/performer-delete-card.tsx
var Xt = "勾选女优，永久删除她们在全部来源中的影片文件、影片资料和观看记录，包括回收站中的影片。女优档案和照片保留。共同出演的同一文件只删除一次。";
function Zt({ person: e }) {
	let t = ye("performer", e.k, e.entity_id), n = Ke("performer", e.k, e.entity_id);
	return /* @__PURE__ */ (0, Q.jsxs)("a", {
		href: xe("performer", e.k, e.entity_id),
		title: n || t,
		className: "flex min-w-0 items-center gap-3 text-text-primary",
		children: [/* @__PURE__ */ (0, Q.jsx)("span", {
			"aria-hidden": !0,
			className: _e("relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background-quaternary-default text-caption-1-medium", St),
			dangerouslySetInnerHTML: { __html: `<span>${Se(Ve(t))}</span>` + be({
				kind: "performer",
				id: e.entity_id,
				hasImage: e.has_image,
				version: e.image_version,
				focus: e.avatar_focus,
				thumb: !0
			}) }
		}), /* @__PURE__ */ (0, Q.jsx)("span", {
			className: "min-w-0 wrap-anywhere",
			children: t
		})]
	});
}
function Qt({ toast: t }) {
	ht();
	let n = X({
		queryKey: D,
		queryFn: ({ signal: e }) => Ce(e)
	}), [r, i] = (0, Z.useState)([]), [a, o] = (0, Z.useState)(""), [s, u] = (0, Z.useState)(!1), [d, p] = (0, Z.useState)(null), [m, h] = (0, Z.useState)(""), g = (0, Z.useRef)(null);
	(0, Z.useEffect)(() => () => g.current?.abort(), []);
	let _ = (0, Z.useMemo)(() => [
		{
			id: "name",
			label: "女优",
			width: 280,
			min: 160,
			value: (e) => e.k,
			render: (e) => /* @__PURE__ */ (0, Q.jsx)(Zt, { person: e })
		},
		{
			id: "works",
			label: "影片",
			width: 104,
			min: 80,
			value: (e) => e.n,
			render: (e) => `${e.n.toLocaleString()} 部`
		},
		{
			id: "files",
			label: "文件",
			width: 104,
			min: 80,
			value: (e) => e.file_count,
			render: (e) => `${e.file_count.toLocaleString()} 个`
		},
		{
			id: "bytes",
			label: "登记大小",
			width: 136,
			min: 104,
			value: (e) => e.bytes,
			render: (e) => G(e.bytes)
		}
	], []), ee = a.toLocaleLowerCase(), v = (n.data?.items || []).filter((e) => !ee || [
		e.k,
		ye("performer", e.k, e.entity_id),
		...e.aliases
	].some((e) => e.toLocaleLowerCase().includes(ee))), y = async (e, n) => {
		if (s) return;
		u(!0), h("");
		let r = new AbortController();
		g.current = r;
		try {
			let i = await we(e.map((e) => e.entity_id), r.signal);
			if (r.signal.throwIfAborted(), !i.total) {
				t("所选女优没有可删除的影片");
				return;
			}
			let a = i.performers.map((e) => ye("performer", e.name, e.id)), o = [...new Set(i.items.map((e) => e.code || e.name || `#${e.id}`))], s = await U({
				title: "删除所选女优的全部影片",
				body: `将永久删除 ${a.slice(0, 5).join("、")}${a.length > 5 ? `等 ${a.length} 位女优` : ""} 关联的 ${i.total} 个影片文件（登记大小 ${G(i.bytes)}）。范围包含全部来源和回收站，不受当前搜索、排序或分页影响。文件、影片资料和观看记录将永久删除，无法恢复；女优档案和照片保留。` + (i.shared ? `其中 ${i.shared} 个文件还关联了未勾选的女优，删除后也会从她们的作品中消失。` : "") + `涉及：${o.slice(0, 5).join("、")}${o.length > 5 ? `等 ${o.length} 部作品` : ""}。`,
				confirmLabel: "永久删除影片",
				danger: !0,
				onConfirm: () => ve(i)
			});
			if (!s.confirmed) return;
			let c = s.result;
			p(c), n(), await Promise.all([q.invalidateQueries({
				queryKey: D,
				exact: !0
			}), q.invalidateQueries({
				queryKey: L,
				exact: !0
			})]), t(`已永久删除 ${c.purged} 个影片文件${c.blocked.length ? `，${c.blocked.length} 个未删除` : ""}`);
		} catch (e) {
			r.signal.aborted || h(W(e));
		} finally {
			r.signal.aborted || u(!1);
		}
	}, b = d ? [
		...d.blocked,
		...d.cleanup_pending,
		...d.cache_blocked.map((e) => ({
			path: e.name,
			reason: e.reason
		}))
	] : [];
	return /* @__PURE__ */ (0, Q.jsxs)("section", {
		id: "batch-delete",
		className: "flex min-w-0 scroll-mt-20 flex-col gap-3",
		"aria-label": "批量删除",
		children: [
			n.isPending || n.isError ? /* @__PURE__ */ (0, Q.jsxs)(c, {
				layout: "stack",
				labelledBy: "batch-delete-title",
				children: [/* @__PURE__ */ (0, Q.jsx)(l, {
					id: "batch-delete-title",
					children: "批量删除"
				}), n.isError ? /* @__PURE__ */ (0, Q.jsx)(w, {
					tone: "error",
					title: "读取女优列表失败",
					action: /* @__PURE__ */ (0, Q.jsx)(e, {
						variant: "secondary",
						size: "small",
						onClick: () => void n.refetch(),
						children: "重试"
					}),
					children: W(n.error)
				}) : /* @__PURE__ */ (0, Q.jsx)("p", {
					role: "status",
					className: "text-body-regular text-text-secondary",
					children: "正在读取女优列表…"
				})]
			}) : /* @__PURE__ */ (0, Q.jsx)(bt, {
				label: "女优影片",
				title: "批量删除",
				titleId: "batch-delete-title",
				unit: "位女优",
				description: Xt,
				items: v,
				columns: _,
				rowId: (e) => String(e.entity_id),
				rowLabel: (e) => ye("performer", e.k, e.entity_id),
				selected: r,
				onSelected: i,
				toolbarActions: /* @__PURE__ */ (0, Q.jsx)(f, {
					label: "搜索女优姓名或别名",
					value: a,
					onQuery: (e) => {
						o(e), i([]);
					}
				}),
				actions: (t, n) => /* @__PURE__ */ (0, Q.jsx)(e, {
					variant: "danger",
					size: "small",
					...V(s),
					onClick: () => void y(t, n),
					children: "删除所选女优影片"
				})
			}),
			m ? /* @__PURE__ */ (0, Q.jsx)(w, {
				tone: "error",
				title: "未能读取删除清单",
				children: m
			}) : null,
			d ? /* @__PURE__ */ (0, Q.jsx)(w, {
				tone: b.length ? "warning" : "info",
				title: `已永久删除 ${d.purged} 个影片文件`,
				extra: b.length ? /* @__PURE__ */ (0, Q.jsx)("div", {
					className: "flex flex-col gap-2 text-body-2-regular wrap-anywhere",
					children: b.slice(0, 5).map((e, t) => /* @__PURE__ */ (0, Q.jsxs)("p", { children: [
						e.path,
						"（",
						e.reason,
						"）"
					] }, t))
				}) : null,
				children: b.length ? `${d.blocked.length} 个文件未能删除，馆藏记录仍保留；${d.cleanup_pending.length} 个隔离文件和 ${d.cache_blocked.length} 个缓存文件待清理。` : "所选影片及关联记录已删除，女优档案和照片保留。"
			}) : null
		]
	});
}
// src/react/data-cleanup/resource-sync-card.tsx
var $t = J("git-compare"), en = J("rotate-cw"), tn = "暂时无法读取进度，正在重新连接…", nn = "清理失效条目", rn = "inline-grid w-full grid-flow-col auto-cols-fr gap-4 max-plain-stat-pair:grid-flow-row max-plain-stat-pair:grid-cols-2 max-plain-stat-single:grid-cols-1", $ = (e) => Number(e || 0).toLocaleString();
function an({ scan: e, partial: t = !1 }) {
	let n = e.cache ?? {
		files: 0,
		bytes: 0
	};
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("div", {
		className: rn,
		children: (e.sources ?? []).map((e) => /* @__PURE__ */ (0, Q.jsxs)("article", {
			className: K(),
			children: [/* @__PURE__ */ (0, Q.jsx)(k, {
				label: F[e.location] || "媒体来源",
				mark: /* @__PURE__ */ (0, Q.jsx)(se, { mark: C[e.location] ?? "database" }),
				aside: /* @__PURE__ */ (0, Q.jsx)(wt, {
					online: e.online,
					children: e.online ? "可访问" : "离线"
				}),
				figure: e.online ? `${$(e.missing)} 项` : "—",
				meta: e.online ? st(e) : `${st(e)} · 本次已跳过`,
				wrapMeta: !0
			}), e.online && e.unreadable > 0 ? /* @__PURE__ */ (0, Q.jsx)("span", {
				className: "self-start",
				children: /* @__PURE__ */ (0, Q.jsxs)(ce, {
					tone: "warning",
					children: [$(e.unreadable), " 个目录未读取"]
				})
			}) : null]
		}, e.location))
	}), !t && /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: rn,
		children: [
			/* @__PURE__ */ (0, Q.jsx)("article", {
				className: K(),
				children: /* @__PURE__ */ (0, Q.jsx)(k, {
					label: "待永久删除",
					figure: `${$(Qe(e))} 项`,
					meta: "文件已不在盘上，含回收站"
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)("article", {
				className: K(),
				children: /* @__PURE__ */ (0, Q.jsx)(k, {
					label: "将标为已消失",
					figure: `${$(e.vanish)} 项`,
					meta: "带个人记录，记录留着"
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)("article", {
				className: K(),
				children: /* @__PURE__ */ (0, Q.jsx)(k, {
					label: "空文件夹",
					figure: `${$(e.empty)} 个`,
					meta: "保留来源根目录"
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)("article", {
				className: K(),
				children: /* @__PURE__ */ (0, Q.jsx)(k, {
					label: "可清理的缓存",
					figure: `${$(n.files)} 个`,
					meta: n.files ? G(n.bytes) : ""
				})
			})
		]
	})] });
}
function on({ toast: t }) {
	let n = Y({
		queryKey: M,
		queryFn: ({ signal: e }) => Le(e),
		start: dt,
		onFinish: (e) => {
			if (q.invalidateQueries({
				queryKey: L,
				exact: !0
			}), q.invalidateQueries({
				queryKey: re,
				exact: !0
			}), e.status !== "complete") return;
			let { done: n, left: r } = fe(e);
			r ? t(`已完成 ${$(n)} 项，${$(r)} 项没有处理`, { warning: !0 }) : t("已清理失效条目");
		}
	}), r = Y({
		queryKey: re,
		queryFn: ({ signal: e }) => Re(e),
		start: ft,
		onStarted: () => n.dismiss()
	}), i = r.job, a = r.running || r.start.isPending, o = n.running || n.start.isPending, s = i?.status === "complete" || i?.status === "failed", u = a ? "扫描中" : s ? "重新扫描" : "检查文件", d = (e) => void U({
		title: nn,
		body: de(e),
		confirmLabel: nn,
		danger: !0,
		onConfirm: () => n.start.mutateAsync(e.scan_id || "")
	}), f = n.outcome, p = (e) => {
		let t = fe(e).left > 0;
		return /* @__PURE__ */ (0, Q.jsx)(w, {
			tone: t ? "warning" : "success",
			title: t ? "部分完成" : "清理结果",
			children: me(e, G)
		});
	}, m = null, h = null;
	if (f?.status === "failed") h = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "资源清理未完成",
		children: f.error || "请查看任务记录，核对已处理的文件。"
	});
	else if (f) h = p(f);
	else if (n.running) m = /* @__PURE__ */ (0, Q.jsx)(R, {
		embedded: !0,
		label: n.job?.message || "正在复核并清理失效条目"
	});
	else if (r.start.isError) h = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "扫描失败",
		children: W(r.start.error)
	});
	else if (r.query.isError && i) h = /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "neutral",
		title: "任务状态",
		children: tn
	});
	else if (i?.status === "running") {
		let e = at(i);
		m = /* @__PURE__ */ (0, Q.jsx)(R, {
			embedded: !0,
			label: e,
			value: i.completed_sources,
			total: i.total_sources
		}), i.sources?.length && (h = /* @__PURE__ */ (0, Q.jsx)(an, {
			scan: i,
			partial: !0
		}));
	} else if (i?.status === "failed") h = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [i.sources?.length ? /* @__PURE__ */ (0, Q.jsx)(an, {
		scan: i,
		partial: !0
	}) : null, /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "扫描失败",
		children: i.error || "后台扫描失败"
	})] });
	else if (i?.status === "complete" && i.applied) h = n.job?.status === "complete" ? p(n.job) : /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "neutral",
		title: "清理结果",
		children: "这次检查的结果已经清理，重新扫描可再核对。"
	});
	else if (i?.status === "complete") {
		let t = He(i);
		h = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(an, { scan: i }), t ? /* @__PURE__ */ (0, Q.jsx)(w, {
			tone: "neutral",
			title: "清理内容",
			action: /* @__PURE__ */ (0, Q.jsx)(e, {
				variant: "danger",
				...V(o),
				onClick: () => d(i),
				children: o ? "正在复核并清理…" : nn
			}),
			children: pe(i)
		}) : /* @__PURE__ */ (0, Q.jsx)("p", {
			className: "mr-auto text-body-regular text-notification-success-foreground",
			children: "已检查可访问的来源，没有待清理的记录、空文件夹或缓存。"
		})] });
	}
	return n.start.isError && !f && (h = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [h, /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "清理失败",
		children: W(n.start.error)
	})] })), /* @__PURE__ */ (0, Q.jsxs)("section", {
		id: "resource-sync",
		"aria-labelledby": "resource-sync-title",
		className: "flex scroll-mt-20 flex-col gap-4",
		children: [/* @__PURE__ */ (0, Q.jsxs)(c, {
			layout: "split",
			labelledBy: "resource-sync-title",
			footer: /* @__PURE__ */ (0, Q.jsx)(e, {
				"data-resource-scan": !0,
				leadingIcon: s && !a ? en : $t,
				...V(a),
				onClick: () => {
					a || r.start.mutate();
				},
				children: u
			}),
			children: [
				/* @__PURE__ */ (0, Q.jsx)(l, {
					id: "resource-sync-title",
					gap: "small",
					children: "资源同步"
				}),
				/* @__PURE__ */ (0, Q.jsx)("p", {
					className: "max-w-190 text-body-2-regular leading-5 text-text-secondary",
					children: "按馆藏记录逐条查找本地磁盘与网盘上的文件，列出文件已不存在的记录、空文件夹，以及不再被引用的缓存。"
				}),
				/* @__PURE__ */ (0, Q.jsx)("div", {
					"aria-live": "polite",
					className: "mt-4 empty:hidden",
					children: m
				})
			]
		}), /* @__PURE__ */ (0, Q.jsx)("div", {
			"aria-live": "polite",
			className: "flex flex-col gap-4 empty:hidden",
			children: h
		})]
	});
}
// src/react/data-cleanup/data-cleanup-tool-page.tsx
function sn({ toast: e }) {
	let t = X({
		queryKey: S,
		queryFn: ({ signal: e }) => je(e)
	});
	return t.isError ? /* @__PURE__ */ (0, Q.jsx)(w, {
		tone: "error",
		title: "读取媒体来源失败",
		children: W(t.error)
	}) : t.isPending ? /* @__PURE__ */ (0, Q.jsx)("p", {
		role: "status",
		children: "正在读取媒体来源…"
	}) : Ue(t.data) ? /* @__PURE__ */ (0, Q.jsx)(on, { toast: e }) : /* @__PURE__ */ (0, Q.jsxs)(c, {
		layout: "stack",
		label: "资源同步",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(l, { children: "资源同步" }),
			/* @__PURE__ */ (0, Q.jsx)("p", {
				className: "text-body-regular text-text-secondary",
				children: "尚未配置可核对的媒体目录。"
			}),
			/* @__PURE__ */ (0, Q.jsx)("a", {
				href: "/settings/library",
				className: "text-body-medium text-accent-600 underline",
				children: "配置媒体库"
			})
		]
	});
}
function cn({ tool: e, toast: t, failure: n }) {
	let r = (e) => t(e), i;
	switch (e) {
		case "organize":
			i = /* @__PURE__ */ (0, Q.jsx)(Wt, {
				toast: r,
				failure: n
			});
			break;
		case "resource-sync":
			i = /* @__PURE__ */ (0, Q.jsx)(sn, { toast: t });
			break;
		case "orphan-records":
			i = /* @__PURE__ */ (0, Q.jsx)(Yt, { toast: r });
			break;
		case "media-repair":
			i = /* @__PURE__ */ (0, Q.jsx)(kt, { toast: r });
			break;
		case "links":
			i = /* @__PURE__ */ (0, Q.jsx)(zt, {});
			break;
		case "batch-delete": i = /* @__PURE__ */ (0, Q.jsx)(Qt, { toast: r });
	}
	return /* @__PURE__ */ (0, Q.jsx)(vt, { children: i });
}
// src/react/data-cleanup/data-cleanup-page.tsx
function ln(e, t) {
	return e.data === void 0 ? e.isError ? {
		figure: "读取失败",
		state: "error"
	} : {
		figure: "正在读取…",
		state: "loading"
	} : t(e.data);
}
function un({ section: e, label: t, icon: n, value: r, open: i }) {
	return /* @__PURE__ */ (0, Q.jsx)("button", {
		type: "button",
		className: K({ interactive: !0 }),
		"data-cleanup-go": e,
		"data-entry-state": r.state,
		"aria-busy": r.state === "loading" || void 0,
		onClick: () => i(e),
		children: /* @__PURE__ */ (0, Q.jsx)(k, {
			label: t,
			icon: n,
			figure: r.figure,
			meta: r.meta
		})
	});
}
function dn({ tool: e, navigate: t }) {
	let n = J(e.icon);
	return /* @__PURE__ */ (0, Q.jsx)(Et, {
		label: e.title,
		icon: n,
		summary: e.description,
		attributes: { "data-cleanup-tool": e.key },
		onOpen: () => t(e.path + location.search)
	});
}
var fn = J("square-check-big"), pn = J("sparkles"), mn = J("file-stack"), hn = J("file-archive"), gn = J("trash"), _n = () => {
	for (let e of [
		P,
		A,
		s,
		m
	]) q.invalidateQueries({
		queryKey: e,
		exact: !0
	});
};
function vn({ toast: e, open: t, navigate: a }) {
	let o = X({
		queryKey: P,
		queryFn: ({ signal: e }) => ze(e)
	}), c = X({
		queryKey: A,
		queryFn: ({ signal: e }) => Fe(e)
	}), l = X({
		queryKey: s,
		queryFn: ({ signal: e }) => Te(e)
	}), u = X({
		queryKey: m,
		queryFn: ({ signal: e }) => Ee(e)
	}), d = X({
		queryKey: L,
		queryFn: ({ signal: e }) => Be(e)
	});
	return (0, Z.useEffect)(() => {
		let e = r[location.hash];
		e && ot(e + location.search, { replace: !0 });
	}, []), /* @__PURE__ */ (0, Q.jsxs)(vt, { children: [
		/* @__PURE__ */ (0, Q.jsxs)("section", {
			"aria-labelledby": "cleanup-pending",
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, Q.jsx)(I, {
				id: "cleanup-pending",
				children: "待处理事项"
			}), /* @__PURE__ */ (0, Q.jsxs)("div", {
				className: O,
				children: [
					/* @__PURE__ */ (0, Q.jsx)(un, {
						section: "review",
						label: "人工复核",
						icon: fn,
						open: t,
						value: ln(o, it)
					}),
					/* @__PURE__ */ (0, Q.jsx)(un, {
						section: "duplicates",
						label: "重复文件",
						icon: mn,
						open: t,
						value: ln(l, (e) => Number(e.total || 0) ? {
							figure: `${Number(e.total).toLocaleString()} 组 · ${Number(e.files || 0).toLocaleString()} 个文件`,
							meta: `可回收 ${G(e.reclaimable || 0)}`
						} : { figure: "没有重复内容" })
					}),
					/* @__PURE__ */ (0, Q.jsx)(un, {
						section: "ads",
						label: "垃圾文件",
						icon: hn,
						open: t,
						value: ln(u, (e) => ({
							figure: `${Number(e.pending_total || 0).toLocaleString()} 个待判断`,
							meta: We(e)
						}))
					}),
					/* @__PURE__ */ (0, Q.jsx)(un, {
						section: "quality",
						label: "高清版",
						icon: pn,
						open: t,
						value: ln(c, (e) => ({ figure: `${Number(e.total || 0).toLocaleString()} 个待升级` }))
					}),
					/* @__PURE__ */ (0, Q.jsx)(un, {
						section: "trash",
						label: "回收站",
						icon: gn,
						open: t,
						value: ln(d, (e) => ({
							figure: `${Number(e.total || 0).toLocaleString()} 项在回收站`,
							meta: e.total ? `占用 ${G(e.bytes || 0)}` : "查看和还原已移入回收站的内容"
						}))
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, Q.jsx)("div", {
			id: "libraryProcessing",
			className: "scroll-mt-20",
			children: /* @__PURE__ */ (0, Q.jsx)(y, {
				toast: (t) => e(t),
				monitor: !0,
				onComplete: _n
			})
		}),
		/* @__PURE__ */ (0, Q.jsxs)("section", {
			"aria-labelledby": "cleanup-maintenance",
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, Q.jsx)(I, {
				id: "cleanup-maintenance",
				children: "整理与维护"
			}), /* @__PURE__ */ (0, Q.jsx)("div", {
				className: n,
				children: i.filter((e) => e.key !== "batch-delete").map((e) => /* @__PURE__ */ (0, Q.jsx)(dn, {
					tool: e,
					navigate: a
				}, e.key))
			})]
		}),
		/* @__PURE__ */ (0, Q.jsxs)("section", {
			"aria-labelledby": "cleanup-deletion",
			className: "flex flex-col gap-4",
			children: [/* @__PURE__ */ (0, Q.jsx)(I, {
				id: "cleanup-deletion",
				children: "清理与删除"
			}), /* @__PURE__ */ (0, Q.jsx)("div", {
				className: n,
				children: i.filter((e) => e.key === "batch-delete").map((e) => /* @__PURE__ */ (0, Q.jsx)(dn, {
					tool: e,
					navigate: a
				}, e.key))
			})]
		})
	] });
}
export { vn as DataCleanupPage, cn as DataCleanupToolPage };

//# debugId=6b8d56f0-ee85-4f37-be73-02bf9038ae04