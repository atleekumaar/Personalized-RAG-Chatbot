export const SAMPLE_DOC_NAME = "NTA Winter Operations Manual.md";

export const SAMPLE_MARKDOWN = `# Northshore Transit Authority
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

export const SAMPLE_QUESTIONS = [
  "Who is the winter operations lead, and how do I reach them?",
  "What are weekday snow-route hours?",
  "When does a delay have to be called in?",
  "What fare applies during a Level 2 weather alert?",
];
