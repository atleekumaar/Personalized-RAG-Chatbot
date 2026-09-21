import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as array } from "../_libs/zod.mjs";
import { a as ShieldAlert, c as FileUp, d as ArrowUp, i as ShieldCheck, l as FileText, o as Plus, r as Trash2, s as Files, t as X, u as BookOpen } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DPgCZqjM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-40 enabled:active:scale-96", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-raised text-fg hairline hover:bg-raised/80",
			ghost: "text-muted hover:bg-raised hover:text-fg",
			danger: "bg-danger/15 text-danger hover:bg-danger/25"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Landing({ onUpload, onSample, busy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "relative mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-5 py-12 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.18em] text-muted uppercase",
						children: "Document Q&A"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl leading-tight font-medium tracking-tight text-fg sm:text-5xl",
						children: "Ask only what the page can prove."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-md text-base leading-relaxed text-muted",
						children: "Upload a PDF or Markdown file. Folio retrieves the relevant passages and answers from those pages alone — with citations. If it is not in your documents, Folio says so."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							size: "lg",
							onClick: onUpload,
							disabled: busy,
							className: "min-h-12 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Upload PDF or Markdown"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "secondary",
							size: "lg",
							onClick: onSample,
							disabled: busy,
							className: "min-h-12 w-full sm:w-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Load sample manual"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs leading-relaxed text-subtle",
						children: "Strict grounding. No web search. No outside knowledge. Drop a file anywhere on this page."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperStack, {})]
		})
	});
}
function PaperStack() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto hidden h-80 w-full max-w-md lg:block",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-10 top-10 h-64 -rotate-6 rounded-xl bg-raised hairline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-6 top-6 h-64 rotate-3 rounded-xl bg-surface hairline" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-2 top-2 flex h-64 flex-col rounded-xl bg-raised p-6 hairline",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-2xs tracking-widest text-subtle uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "NTA Winter Manual" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "p. 4" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-4/5 rounded-full bg-fg/20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-full rounded-full bg-fg/10" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-5/6 rounded-full bg-fg/10" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2/3 rounded-full bg-fg/10" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 rounded-md bg-bg/60 px-3 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-sm leading-relaxed text-fg/90",
							children: "“Winter operations lead: Mara Ellison, extension 4412.”"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-auto text-2xs text-subtle",
						children: "Grounded excerpt"
					})
				]
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide", {
	variants: { tone: {
		mute: "bg-raised text-muted",
		ok: "bg-ok/15 text-ok",
		warn: "bg-warn/15 text-warn",
		danger: "bg-danger/15 text-danger"
	} },
	defaultVariants: { tone: "mute" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("w-full resize-none rounded-lg bg-raised px-4 py-3 text-base text-fg shadow-border placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50 md:text-sm", className),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var excerptSchema = object({
	n: number().int().min(1).max(12),
	source: string().min(1).max(200),
	page: number().int().min(1).max(9999).nullable(),
	heading: string().max(200).nullable(),
	text: string().min(1).max(1400)
});
var inputSchema = object({
	question: string().min(1).max(2e3),
	excerpts: array(excerptSchema).min(1).max(8)
});
var askFolio = createServerFn({ method: "POST" }).validator((data) => inputSchema.parse(data)).handler(createSsrRpc("af24a59d9d69f256fe9f9511b678eb82a9a8a495ec178ba03d8e13b96d9c14b3"));
var SAMPLE_DOC_NAME = "NTA Winter Operations Manual.md";
var SAMPLE_MARKDOWN = `# Northshore Transit Authority
## Winter Operations Manual — Season 2026–27

Controlled document. Issued 12 October 2026. Supersedes the 2025–26 manual.
Classification: Internal operations. Not a public timetable.

### 1. Purpose and scope

This manual governs snow-route service, vehicle preparation, operator call-in,
and fare exceptions for the Northshore Transit Authority (NTA) between
15 November 2026 and 15 March 2027. It applies to fixed-route bus service on
the coastal and inland divisions. Rail, ferries, and contracted paratransit
are out of scope.

Winter operations lead: **Mara Ellison**, Superintendent of Service Delivery,
extension 4412, radio callsign LEAD-W. Deputy: **Owen Park**, extension 4418.
After 19:00 local, the duty superintendent is reachable on TAC-3.

### 2. Snow-route hours

Snow-route overlays replace the published timetable on declared snow days.

| Period | Weekday | Saturday | Sunday / holiday |
| --- | --- | --- | --- |
| First trip | 05:30 | 07:00 | 08:00 |
| Last trip | 22:00 | 21:00 | 19:30 |

Owl service (trips after 22:00) is **suspended** on snow days. Holiday
exception: no owl service 24–26 December even on clear days, per board minute
2026-08-14.

Headways on snow routes:

- Coastal trunk (routes 4, 7, 11): 20 minutes weekday, 30 minutes weekend
- Inland local (routes 16, 18, 22): 30 minutes all days
- Hill climb (route 31 Queenridge): 15 minutes while the chain restriction
  is posted; otherwise 30 minutes

Route 31 does not operate when the Queenridge Road Department posts a
**red** chain restriction (dual chains, no buses). A yellow restriction
(chains or snow tires) is operable with NTA dual-axle buses only.

### 3. Weather alert levels

Dispatch declares a level by 03:30 on the service day, or immediately if
conditions deteriorate.

- **Level 1 — Watch.** Regular timetable. Pre-treat lots. Operators carry
  chains but do not mount them.
- **Level 2 — Snow overlay.** Snow-route hours and the reduced fare apply.
  Reduced fare is **$1.25**; the regular adult fare is **$2.90**. Youth,
  honoured-citizen, and agency-pass fares are unchanged.
- **Level 3 — Essential only.** Coastal trunk plus hospital shuttle H-1.
  Inland locals cancelled. No fare collection on H-1.

A Level 2 declaration after 12:00 does **not** change fares already collected.
Operators must not refund cash on board.

### 4. Delay call-in

Operators call Dispatch at **555-0188** (radio: DISPATCH) when:

- running time exceeds schedule by **8 minutes** or more
- a stop is missed because of a drift, detour, or passenger medical event
- a vehicle cannot mount chains within the **12-minute** dwell cap at a
  chain-up bay

Do not use personal phones for delay call-in except if both radio and the
onboard modem have failed. Voice first; then log the delay in the Mobile Data
Terminal within 5 minutes.

Passenger messaging: the headsign must read \`SNOW ROUTE\` on Level 2 and 3.
Interior announcement every 10 minutes on trunk routes.

### 5. Vehicles and facilities

Spare fleet held at the **Pier 6 barn** overnight layover: 14 articulated
buses and 9 forty-foot buses. Do not stage spares at the Harbor Street garage
after 1 December; that pit cannot take dual-chain buses.

De-icing: use **potassium acetate** on the Pier 6 apron when pavement
temperature is at or below **18°F**. Sodium chloride brine is prohibited at
Pier 6 because of the timber tide-crib. Lot C (inland) may use brine above
22°F.

Chain-up bays:

- Bay A — Harbor & 4th (coastal), 3 slots
- Bay B — Millbridge Park-and-Ride (inland), 4 slots
- Bay C — Queenridge summit turnout, 2 slots, buses only when yellow

Maximum dwell for ice chains is 12 minutes. If a slot is blocked, hold short
and call DISPATCH; do not idle in the travel lane.

Fuel: winter blend diesel only after 20 November. Do not top off with summer
blend remaining in Harbor Street tank 2 — that tank is locked out.

### 6. Staffing and reports

Minimum extra board on a Level 2 weekday: 6 operators and 2 mechanics at
Pier 6 by 04:45. On Level 3, 8 operators and 3 mechanics.

Each snow day, the winter operations lead files a **Dawn Report** to the
general manager by 06:10 covering: declared level, open bays, spare count,
and any red restriction on Queenridge. A **Dusk Report** is due by 21:30
with cancelled trips and injury/incident count.

Timekeeping code for snow overlay duty is **WOP-26**. Do not use the general
overtime code OT-1 for snow days; payroll will reject it.

### 7. Passenger rules (operators)

Strollers may remain open on snow days if the aisle stays 18 inches clear.
Bicycles are **not** permitted in the articulated kneel during Level 2 or 3.
Animals: service animals only; the winter pet-pass program is suspended
15 November–15 March.

If a stop is drifted in, operators may board or alight at the nearest safe
shoulder and must log the substitute location. Do not pass a drifted stop
without an announcement.

### 8. Contacts (quick card)

| Role | Name | Reach |
| --- | --- | --- |
| Winter operations lead | Mara Ellison | ext. 4412 / LEAD-W |
| Deputy | Owen Park | ext. 4418 |
| Dispatch | On-duty controller | 555-0188 / DISPATCH |
| Duty superintendent after 19:00 | Rotating | TAC-3 |
| Queenridge Road Department desk | External | 555-0140 |
| Pier 6 barn night foreman | Lila Cho | ext. 3370 |

End of excerpt. Full annexes (detour maps, chain diagrams) are issued as
separate plates and are not part of this text.
`;
var SAMPLE_QUESTIONS = [
	"Who is the winter operations lead, and how do I reach them?",
	"What are weekday snow-route hours?",
	"When does a delay have to be called in?",
	"What fare applies during a Level 2 weather alert?"
];
var STOP = /* @__PURE__ */ new Set([
	"the",
	"a",
	"an",
	"and",
	"or",
	"of",
	"to",
	"in",
	"on",
	"for",
	"is",
	"are",
	"was",
	"were",
	"be",
	"as",
	"at",
	"by",
	"it",
	"that",
	"this",
	"with",
	"from",
	"your",
	"you",
	"we",
	"our",
	"their",
	"its",
	"not",
	"do",
	"does",
	"did",
	"if",
	"but",
	"can",
	"will",
	"into",
	"than",
	"then",
	"so",
	"about",
	"what",
	"when",
	"who",
	"how",
	"which",
	"where"
]);
function tokenize(text) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(/\s+/).filter((t) => t.length > 1 && !STOP.has(t));
}
function retrieveChunks(query, chunks, k = 6) {
	if (chunks.length === 0) return [];
	const limit = Math.min(Math.max(k, 1), 8);
	const qTokens = tokenize(query);
	const N = chunks.length;
	if (qTokens.length === 0) return toExcerpts(chunks.slice(0, limit));
	const tokenized = chunks.map((c) => tokenize(`${c.source} ${c.heading ?? ""} ${c.text}`));
	const df = /* @__PURE__ */ new Map();
	for (const tokens of tokenized) for (const t of new Set(tokens)) df.set(t, (df.get(t) ?? 0) + 1);
	const avgdl = tokenized.reduce((sum, tokens) => sum + tokens.length, 0) / Math.max(N, 1);
	const k1 = 1.5;
	const b = .75;
	const scored = chunks.map((chunk, i) => {
		const tfMap = /* @__PURE__ */ new Map();
		for (const t of tokenized[i] ?? []) tfMap.set(t, (tfMap.get(t) ?? 0) + 1);
		const dl = tokenized[i]?.length ?? 0;
		let score = 0;
		for (const qt of qTokens) {
			const tf = tfMap.get(qt) ?? 0;
			if (!tf) continue;
			const n = df.get(qt) ?? 0;
			const idf = Math.log(1 + (N - n + .5) / (n + .5));
			score += idf * (tf * 2.5 / (tf + k1 * (.25 + b * (dl / Math.max(avgdl, 1)))));
		}
		return {
			chunk,
			score
		};
	});
	scored.sort((a, b) => b.score - a.score);
	const positive = scored.filter((s) => s.score > 0).slice(0, limit);
	if (positive.length > 0) return toExcerpts(positive.map((s) => s.chunk));
	const seen = /* @__PURE__ */ new Set();
	const fallback = [];
	for (const chunk of chunks) {
		if (seen.has(chunk.docId)) continue;
		seen.add(chunk.docId);
		fallback.push(chunk);
		if (fallback.length >= limit) break;
	}
	return toExcerpts(fallback);
}
function toExcerpts(chunks) {
	return chunks.map((chunk, i) => ({
		n: i + 1,
		source: chunk.source,
		page: chunk.page,
		heading: chunk.heading,
		text: chunk.text.slice(0, 1400)
	}));
}
function expandFollowUpQuery(current, previousUser) {
	const tokens = tokenize(current);
	if (!previousUser) return current;
	if (tokens.length >= 6) return current;
	return `${previousUser} ${current}`;
}
var useFolio = create((set) => ({
	docs: [],
	chunks: [],
	messages: [],
	asking: false,
	ingesting: false,
	libraryOpen: false,
	addDoc: (doc, chunks) => set((state) => ({
		docs: [...state.docs, doc],
		chunks: [...state.chunks, ...chunks]
	})),
	removeDoc: (id) => set((state) => {
		const docs = state.docs.filter((d) => d.id !== id);
		return {
			docs,
			chunks: state.chunks.filter((c) => c.docId !== id),
			messages: docs.length === 0 ? [] : state.messages,
			libraryOpen: docs.length === 0 ? false : state.libraryOpen
		};
	}),
	clearAll: () => set({
		docs: [],
		chunks: [],
		messages: [],
		asking: false,
		ingesting: false,
		libraryOpen: false
	}),
	addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
	patchMessage: (id, patch) => set((state) => ({ messages: state.messages.map((m) => m.id === id ? {
		...m,
		...patch
	} : m) })),
	setAsking: (asking) => set({ asking }),
	setIngesting: (ingesting) => set({ ingesting }),
	setLibraryOpen: (libraryOpen) => set({ libraryOpen })
}));
function ChatPanel() {
	const docs = useFolio((s) => s.docs);
	const chunks = useFolio((s) => s.chunks);
	const messages = useFolio((s) => s.messages);
	const asking = useFolio((s) => s.asking);
	const addMessage = useFolio((s) => s.addMessage);
	const patchMessage = useFolio((s) => s.patchMessage);
	const setAsking = useFolio((s) => s.setAsking);
	const [draft, setDraft] = (0, import_react.useState)("");
	const scroller = (0, import_react.useRef)(null);
	const suggestions = (0, import_react.useMemo)(() => {
		if (docs.some((d) => d.kind === "sample")) return SAMPLE_QUESTIONS;
		const headings = chunks.map((c) => c.heading).filter((h) => Boolean(h && h.length > 3 && h.length < 60));
		return [...new Set(headings)].slice(0, 4).map((h) => `What does the document say about ${h}?`);
	}, [chunks, docs]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTo({
			top: el.scrollHeight,
			behavior: "smooth"
		});
	}, [messages, asking]);
	async function submit(question) {
		const trimmed = question.trim();
		if (!trimmed || asking || chunks.length === 0) return;
		setDraft("");
		const userMsg = {
			id: crypto.randomUUID(),
			role: "user",
			content: trimmed
		};
		addMessage(userMsg);
		const previous = [...useFolio.getState().messages].filter((m) => m.role === "user").at(-2)?.content;
		const excerpts = retrieveChunks(expandFollowUpQuery(trimmed, previous), chunks, 6);
		const assistantId = crypto.randomUUID();
		addMessage({
			id: assistantId,
			role: "assistant",
			content: ""
		});
		setAsking(true);
		try {
			const result = await askFolio({ data: {
				question: trimmed,
				excerpts
			} });
			if (!result.ok) {
				patchMessage(assistantId, {
					error: result.error,
					content: result.error
				});
				toast.error(result.error);
				return;
			}
			const used = new Set(result.used);
			const citations = excerpts.filter((e) => used.size === 0 || used.has(e.n)).map((e) => excerptToCitation(e));
			patchMessage(assistantId, {
				content: result.answer,
				found: result.found,
				citations: result.found ? citations : citations.slice(0, 3)
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong asking Folio.";
			patchMessage(assistantId, {
				error: message,
				content: message
			});
			toast.error(message);
		} finally {
			setAsking(false);
		}
	}
	function onSubmit(event) {
		event.preventDefault();
		submit(draft);
	}
	function onKeyDown(event) {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			submit(draft);
		}
	}
	const empty = messages.length === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: scroller,
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8",
			children: empty ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChat, {
				suggestions,
				onPick: (q) => void submit(q),
				disabled: asking
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mx-auto flex max-w-2xl flex-col gap-5",
				children: messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
					message,
					pending: asking
				}, message.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "safe-pad-b border-t border-border bg-bg/80 px-4 py-3 sm:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-2xl items-end gap-2 rounded-xl bg-surface p-2 hairline",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					onKeyDown,
					placeholder: "Ask something in the documents…",
					rows: 1,
					maxLength: 2e3,
					disabled: asking || chunks.length === 0,
					className: "max-h-36 min-h-11 border-0 bg-transparent shadow-none focus-visible:ring-0",
					"aria-label": "Question",
					autoComplete: "off"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "icon",
					className: "size-11 shrink-0",
					disabled: asking || !draft.trim() || chunks.length === 0,
					"aria-label": "Send question",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-2xl text-center text-xs text-subtle",
				children: "Answers are retrieved from your library only."
			})]
		})]
	});
}
function EmptyChat({ suggestions, onPick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-lg flex-col items-start pt-4 sm:pt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-2xl text-fg",
				children: "Your library is ready."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "Ask a question. Folio will retrieve matching passages and refuse anything the pages do not support."
			}),
			suggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 flex w-full flex-col gap-2",
				children: suggestions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled,
					onClick: () => onPick(q),
					className: "w-full rounded-lg bg-raised px-4 py-3 text-left text-sm text-fg transition-colors duration-150 hairline hover:bg-raised/70 disabled:opacity-50",
					children: q
				}) }, q))
			}) : null
		]
	});
}
function MessageBubble({ message, pending }) {
	if (message.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-xl rounded-xl rounded-br-md bg-primary px-4 py-3 text-sm leading-relaxed text-primary-fg",
			children: message.content
		})
	});
	const waiting = pending && !message.content && !message.error;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "flex justify-start",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "w-full max-w-2xl rounded-xl rounded-bl-md bg-raised px-4 py-4 hairline",
			children: waiting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shimmer-text text-sm",
				children: "Reading sources…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3",
					children: message.error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "danger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3" }), "Could not answer"]
					}) : message.found === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "warn",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3" }), "Not in your documents"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "ok",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }), "Grounded"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnswerBody, {
					text: message.content,
					citations: message.citations ?? []
				}),
				message.citations && message.citations.length > 0 && message.found !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationList, { citations: message.citations }) : null
			] })
		})
	});
}
function AnswerBody({ text, citations }) {
	const paragraphs = text.split(/\n{2,}/).filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 text-sm leading-relaxed text-fg",
		children: paragraphs.map((para, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: renderCited(para, citations) }, i))
	});
}
function renderCited(text, citations) {
	return text.split(/(\[\d+\])/g).map((part, i) => {
		const match = part.match(/^\[(\d+)\]$/);
		if (!match) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
		const n = Number(match[1]);
		const citation = citations.find((c) => c.n === n);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", {
			className: cn("ml-0.5 inline-flex size-4 translate-y-px items-center justify-center rounded-sm bg-bg text-2xs font-medium text-muted tabular-nums"),
			title: citation ? citation.source : `Source ${n}`,
			children: n
		}, i);
	});
}
function CitationList({ citations }) {
	const [open, setOpen] = (0, import_react.useState)(citations[0]?.n ?? null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 border-t border-border pt-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xs font-medium tracking-[0.14em] text-subtle uppercase",
			children: "Sources"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-2",
			children: citations.map((c) => {
				const expanded = open === c.n;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen(expanded ? null : c.n),
					className: "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-xs text-muted transition-colors duration-150 hover:bg-bg hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 truncate",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mr-2 font-medium text-fg tabular-nums",
								children: [
									"[",
									c.n,
									"]"
								]
							}),
							c.source,
							c.page ? ` · p. ${c.page}` : "",
							c.heading ? ` · ${c.heading}` : ""
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-subtle",
						children: expanded ? "Hide" : "Show"
					})]
				}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
					className: "mt-1 rounded-md bg-bg px-3 py-2 text-xs leading-relaxed text-muted",
					children: c.quote
				}) : null] }, c.n);
			})
		})]
	});
}
function excerptToCitation(excerpt) {
	return {
		n: excerpt.n,
		source: excerpt.source,
		page: excerpt.page,
		heading: excerpt.heading,
		quote: excerpt.text.length > 280 ? `${excerpt.text.slice(0, 277)}…` : excerpt.text
	};
}
function LibraryPanel({ docs, ingesting, onUpload, onSample, onRemove, onClear, onClose }) {
	const hasSample = docs.some((d) => d.kind === "sample");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col bg-surface",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-muted uppercase",
					children: "Sources"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-subtle tabular-nums",
					children: [
						docs.length,
						" ",
						docs.length === 1 ? "document" : "documents"
					]
				})] }), onClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					size: "icon",
					className: "size-11 md:hidden",
					onClick: onClose,
					"aria-label": "Close sources",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "secondary",
					onClick: onUpload,
					disabled: ingesting,
					className: "w-full justify-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add PDF or Markdown"]
				}), !hasSample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onSample,
					disabled: ingesting,
					className: "w-full justify-start",
					children: "Load sample manual"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto px-4 pb-4",
				children: docs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start gap-3 rounded-lg bg-raised p-3 hairline",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-bg text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium text-fg",
								children: doc.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1.5 flex flex-wrap items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: kindLabel(doc.kind) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-subtle tabular-nums",
									children: [
										doc.pageCount,
										" ",
										doc.pageCount === 1 ? "page" : "pages"
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onRemove(doc.id),
							className: "relative flex size-9 shrink-0 items-center justify-center rounded-md text-subtle transition-colors duration-150 hover:bg-bg hover:text-fg after:absolute after:top-1/2 after:left-1/2 after:size-11 after:-translate-x-1/2 after:-translate-y-1/2",
							"aria-label": `Remove ${doc.name}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})
					]
				}, doc.id))
			}),
			docs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-border px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: onClear,
					className: cn("w-full text-subtle"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Clear library"]
				})
			}) : null
		]
	});
}
function kindLabel(kind) {
	if (kind === "pdf") return "PDF";
	if (kind === "markdown") return "Markdown";
	if (kind === "sample") return "Sample";
	return "Text";
}
function Workspace({ docs, ingesting, libraryOpen, onUpload, onSample, onRemove, onClear, onOpenLibrary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-80 shrink-0 border-r border-border md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryPanel, {
					docs,
					ingesting,
					onUpload,
					onSample,
					onRemove,
					onClear
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-2 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "secondary",
						size: "sm",
						onClick: () => onOpenLibrary(true),
						className: "min-h-11",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Files, { className: "size-4" }),
							"Sources",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: docs.length
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Grounded only" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatPanel, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("fixed inset-0 z-40 md:hidden", libraryOpen ? "pointer-events-auto" : "pointer-events-none"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close sources",
					onClick: () => onOpenLibrary(false),
					className: cn("absolute inset-0 bg-bg/70 transition-opacity duration-200 ease-out-soft", libraryOpen ? "opacity-100" : "opacity-0")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("absolute inset-y-0 left-0 w-80 max-w-full transform-gpu transition-transform duration-300 ease-out-soft", libraryOpen ? "translate-x-0" : "-translate-x-full"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryPanel, {
						docs,
						ingesting,
						onUpload,
						onSample,
						onRemove,
						onClear,
						onClose: () => onOpenLibrary(false)
					})
				})]
			})
		]
	});
}
function headingFrom(text) {
	const line = text.split("\n").find((l) => l.trim().length > 0) ?? "";
	const match = line.match(/^#{1,3}\s+(.+)$/);
	if (match?.[1]) return match[1].replace(/\*+/g, "").trim();
	if (line.length > 0 && line.length < 80 && !line.endsWith(".")) return line.trim();
	return null;
}
function splitLong(text, chunkSize, overlap) {
	const clean = text.replace(/\r\n/g, "\n").trim();
	if (!clean) return [];
	if (clean.length <= chunkSize) return [clean];
	const paragraphs = clean.split(/\n{2,}/);
	const parts = [];
	let buffer = "";
	const flush = () => {
		const next = buffer.trim();
		if (next) parts.push(next);
		buffer = overlap > 0 && next ? next.slice(-overlap) : "";
	};
	for (const para of paragraphs) {
		const piece = para.trim();
		if (!piece) continue;
		if (piece.length > chunkSize) {
			if (buffer) flush();
			for (let i = 0; i < piece.length; i += chunkSize - overlap) parts.push(piece.slice(i, i + chunkSize).trim());
			buffer = "";
			continue;
		}
		const candidate = buffer ? `${buffer}\n\n${piece}` : piece;
		if (candidate.length > chunkSize && buffer) {
			flush();
			buffer = buffer ? `${buffer.trim()}\n\n${piece}` : piece;
			if (buffer.length > chunkSize) {
				parts.push(buffer.slice(0, chunkSize).trim());
				buffer = buffer.slice(-overlap);
			}
		} else buffer = candidate;
	}
	if (buffer.trim()) parts.push(buffer.trim());
	return parts.filter(Boolean);
}
function chunkPages(docId, source, pages, chunkSize = 900, overlap = 140) {
	const chunks = [];
	let index = 0;
	for (const page of pages) {
		const pieces = splitLong(page.text, chunkSize, overlap);
		for (const text of pieces) {
			chunks.push({
				id: `${docId}:${index}`,
				docId,
				source,
				page: page.page,
				heading: page.heading ?? headingFrom(text),
				text
			});
			index += 1;
		}
	}
	return chunks;
}
function pagesFromMarkdown(markdown) {
	const normalized = markdown.replace(/\r\n/g, "\n").trim();
	if (!normalized) return [];
	const sections = normalized.split(/(?=^#{1,3} )/m).filter((s) => s.trim());
	if (sections.length <= 1) return [{
		page: null,
		heading: headingFrom(normalized),
		text: normalized
	}];
	return sections.map((section) => ({
		page: null,
		heading: headingFrom(section),
		text: section.trim()
	}));
}
function newId() {
	return crypto.randomUUID();
}
function extKind(file) {
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
	if (type === "text/markdown" || name.endsWith(".md") || name.endsWith(".markdown") || name.endsWith(".mdx")) return "markdown";
	if (type === "text/plain" || name.endsWith(".txt")) return "text";
	throw new Error("Use a PDF, Markdown, or plain text file.");
}
function pagesToDoc(id, name, kind, pages) {
	const charCount = pages.reduce((sum, p) => sum + p.text.length, 0);
	if (charCount === 0) throw new Error("No extractable text was found in that file.");
	if (charCount > 18e4) throw new Error("That file is too long. Try a shorter document.");
	return {
		doc: {
			id,
			name,
			kind,
			pageCount: pages.filter((p) => p.page !== null).length || 1,
			charCount,
			addedAt: Date.now()
		},
		chunks: chunkPages(id, name, pages)
	};
}
async function ingestFile(file) {
	if (file.size > 12582912) throw new Error("Files must be 12 MB or smaller.");
	const kind = extKind(file);
	const id = newId();
	if (kind === "pdf") {
		const { extractPdfPages } = await import("./parse-pdf-CWsQ8vGk.mjs");
		const pages = await extractPdfPages(await file.arrayBuffer());
		return pagesToDoc(id, file.name, "pdf", pages);
	}
	const pages = pagesFromMarkdown(await file.text());
	return pagesToDoc(id, file.name, kind, pages);
}
function ingestSample() {
	return pagesToDoc(newId(), SAMPLE_DOC_NAME, "sample", pagesFromMarkdown(SAMPLE_MARKDOWN));
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	const fileRef = (0, import_react.useRef)(null);
	const docs = useFolio((s) => s.docs);
	const ingesting = useFolio((s) => s.ingesting);
	const libraryOpen = useFolio((s) => s.libraryOpen);
	const addDoc = useFolio((s) => s.addDoc);
	const removeDoc = useFolio((s) => s.removeDoc);
	const clearAll = useFolio((s) => s.clearAll);
	const setIngesting = useFolio((s) => s.setIngesting);
	const setLibraryOpen = useFolio((s) => s.setLibraryOpen);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	function openPicker() {
		fileRef.current?.click();
	}
	async function handleFiles(fileList) {
		if (!fileList || fileList.length === 0) return;
		const remaining = 8 - useFolio.getState().docs.length;
		if (remaining <= 0) {
			toast.error("You can keep up to 8 documents in the library.");
			return;
		}
		const files = [...fileList].slice(0, remaining);
		setIngesting(true);
		try {
			for (const file of files) {
				const { doc, chunks } = await ingestFile(file);
				addDoc(doc, chunks);
				toast.success(`Added ${doc.name}`);
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not read that file.");
		} finally {
			setIngesting(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	function handleSample() {
		if (useFolio.getState().docs.length >= 8) {
			toast.error("You can keep up to 8 documents in the library.");
			return;
		}
		if (useFolio.getState().docs.some((d) => d.kind === "sample")) return;
		const { doc, chunks } = ingestSample();
		addDoc(doc, chunks);
		toast.success("Sample winter operations manual added.");
	}
	function onDragOver(event) {
		event.preventDefault();
		setDragging(true);
	}
	function onDragLeave(event) {
		if (event.currentTarget.contains(event.relatedTarget)) return;
		setDragging(false);
	}
	function onDrop(event) {
		event.preventDefault();
		setDragging(false);
		handleFiles(event.dataTransfer.files);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "desk-grain relative flex min-h-dvh flex-col",
		onDragOver,
		onDragLeave,
		onDrop,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center justify-between border-b border-border px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-xl tracking-tight text-fg",
						children: "Folio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden text-xs text-subtle sm:inline",
						children: "Grounded document Q&A"
					})]
				}), docs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden text-xs text-muted md:inline",
					children: "Answers only from your sources"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: ".pdf,.md,.markdown,.txt,application/pdf,text/markdown,text/plain",
				multiple: true,
				className: "sr-only",
				onChange: (e) => void handleFiles(e.target.files)
			}),
			docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, {
				onUpload: openPicker,
				onSample: handleSample,
				busy: ingesting
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {
				docs,
				ingesting,
				libraryOpen,
				onUpload: openPicker,
				onSample: handleSample,
				onRemove: removeDoc,
				onClear: clearAll,
				onOpenLibrary: setLibraryOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-bg/80 transition-opacity duration-200", dragging ? "opacity-100" : "opacity-0"),
				"aria-hidden": !dragging,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-raised px-6 py-4 font-display text-lg hairline",
					children: "Drop PDF or Markdown to add it"
				})
			})
		]
	});
}
//#endregion
export { routes_exports as t };
