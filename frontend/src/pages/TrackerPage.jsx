import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const API = "https://oilwise-backend.vercel.app";
const DEMO_USER = "u1";

const THINGSPEAK_URL =
    "https://api.thingspeak.com/channels/3191188/fields/1,2.json?api_key=5UXJ02VYHWCCF70P&results=200";

export default function TrackerPage() {

    const [logs, setLogs] = useState([]);
    const [dateISO, setDateISO] = useState(new Date().toISOString().slice(0, 10));
    const [amountMl, setAmountMl] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [lastUpdate, setLastUpdate] = useState("");
    const [viewMode, setViewMode] = useState("month");

    const [suggestionText, setSuggestionText] = useState("");
    const [hoverSuggestion, setHoverSuggestion] = useState("");
    const [hoverDateKey, setHoverDateKey] = useState(null);

    const dateKey = (y, m, d) =>
        `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    function parseIST(istTimeString) {
        if (!istTimeString || typeof istTimeString !== "string")
            return { dateUTC: null, y: null, m: null, d: null };

        const [datePart, timePart] = istTimeString.split(" ");
        if (!datePart || !timePart)
            return { dateUTC: null, y: null, m: null, d: null };

        const [y, mo, da] = datePart.split("-").map(Number);
        const [hh, mm, ss] = timePart.split(":").map(Number);

        const utcMillis = Date.UTC(y, mo - 1, da, hh - 5, mm - 30, ss);
        return { dateUTC: new Date(utcMillis), y, m: mo, d: da };
    }

    async function load() {
        try {
            const res = await axios.get(THINGSPEAK_URL);
            const feeds = res.data?.feeds || [];

            const parsed = feeds
                .map((f) => {
                    const amount = Number(f.field1 || 0);
                    const time = (f.field2 || "").trim();
                    const { dateUTC, y, m, d } = parseIST(time);
                    return {
                        amountMl: amount,
                        istTimeString: time,
                        istDateUTC: dateUTC,
                        istYear: y,
                        istMonth: m,
                        istDay: d
                    };
                })
                .filter((l) => l.amountMl > 0 && l.istDateUTC)
                .sort((a, b) => a.istDateUTC - b.istDateUTC);

            localStorage.setItem(
                "ts_logs",
                JSON.stringify(
                    parsed.map((p) => ({
                        amountMl: p.amountMl,
                        istTimeString: p.istTimeString
                    }))
                )
            );

            setLogs(parsed);
            setLastUpdate(parsed.at(-1)?.istTimeString || "");
            setStatusText("Live IoT Data Active");

        } catch {
            let cached = [];

            try {
                const raw = JSON.parse(localStorage.getItem("ts_logs") || "[]");
                cached = raw
                    .map((p) => {
                        const { dateUTC, y, m, d } = parseIST(p.istTimeString);
                        return {
                            amountMl: p.amountMl,
                            istTimeString: p.istTimeString,
                            istDateUTC: dateUTC,
                            istYear: y,
                            istMonth: m,
                            istDay: d
                        };
                    })
                    .filter((p) => p.istDateUTC);
            } catch { }

            cached.sort((a, b) => a.istDateUTC - b.istDateUTC);

            setLogs(cached);
            setLastUpdate(cached.at(-1)?.istTimeString || "");
            setStatusText("Offline Mode — Showing Latest Saved Data");
        }
    }

    useEffect(() => {
        load();
    }, []);

    const totalsByDate = useMemo(() => {
        const map = {};
        logs.forEach((l) => {
            const k = dateKey(l.istYear, l.istMonth, l.istDay);
            map[k] = (map[k] || 0) + l.amountMl;
        });
        return map;
    }, [logs]);

    const usedDays = useMemo(
        () => Object.keys(totalsByDate).sort((a, b) => new Date(a) - new Date(b)),
        [totalsByDate]
    );

    useEffect(() => {
        const todayKey = dateISO;
        const todayTotal = totalsByDate[todayKey] || 0;
        const idx = usedDays.indexOf(todayKey);

        const readable = new Date(todayKey).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

        if (idx <= 0) {
            setSuggestionText(`On ${readable}, you logged ${todayTotal} ml.`);
            return;
        }

        const prev = totalsByDate[usedDays[idx - 1]];

        if (todayTotal > prev)
            setSuggestionText(
                `On ${readable}, you used more oil than the previous used day. Check out low-oil recipes to reduce oil usage in your diet.`
            );

        else if (todayTotal < prev)
            setSuggestionText(`On ${readable}, you used less oil than the previous used day.`);

        else
            setSuggestionText(`On ${readable}, your usage matched the previous used day.`);
    }, [logs, dateISO, usedDays, totalsByDate]);

    function generateHoverSuggestion(dayKey) {
        const idx = usedDays.indexOf(dayKey);
        if (idx <= 0) return "";

        const prevKey = usedDays[idx - 1];
        const todayTotal = totalsByDate[dayKey];
        const prevTotal = totalsByDate[prevKey];

        const readable = new Date(dayKey).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        });

        if (todayTotal > prevTotal)
            return `On ${readable}, you used more oil than the previous used day. Check out low-oil recipes to reduce oil usage in your diet.`;

        if (todayTotal < prevTotal)
            return `On ${readable}, you used less oil than the previous used day.`;

        return `On ${readable}, your usage matched the previous used day.`;
    }

    function handleHover(state) {
        if (!state?.activeLabel) {
            setHoverDateKey(null);
            setHoverSuggestion("");
            return;
        }

        if (viewMode === "month") {
            const [mon, day] = state.activeLabel.split(" ");
            const months = {
                Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
                Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12
            };

            const m = months[mon];
            const d = Number(day);
            const y = Number(dateISO.split("-")[0]);

            const key = dateKey(y, m, d);

            setHoverDateKey(key);
            setHoverSuggestion(generateHoverSuggestion(key));

        } else {
            setHoverDateKey(dateISO);
            setHoverSuggestion(generateHoverSuggestion(dateISO));
        }
    }

    const chartData = useMemo(() => {
        const [y, m, d] = dateISO.split("-").map(Number);

        if (viewMode === "month") {
            const grouped = {};
            logs.forEach((l) => {
                if (l.istYear === y && l.istMonth === m)
                    grouped[l.istDay] = (grouped[l.istDay] || 0) + l.amountMl;
            });

            const names = [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            return Object.keys(grouped)
                .map(Number)
                .sort((a, b) => a - b)
                .map((dd) => ({
                    date: `${names[m - 1]} ${dd}`,
                    amount: grouped[dd]
                }));
        }

        return logs
            .filter((l) => l.istYear === y && l.istMonth === m && l.istDay === d)
            .sort((a, b) => a.istDateUTC - b.istDateUTC)
            .map((l) => ({
                date: format(l.istDateUTC, "HH:mm:ss"),
                amount: l.amountMl
            }));
    }, [logs, viewMode, dateISO]);

    const totalMonth = chartData.reduce((s, c) => s + c.amount, 0);

    async function submit(e) {
        e.preventDefault();
        if (!amountMl) return;

        setLoading(true);
        try {
            await axios.post(`${API}/api/consumption`, {
                userId: DEMO_USER,
                dateISO: new Date(dateISO).toISOString(),
                amountMl: Number(amountMl)
            });

            setAmountMl("");
            await load();

        } finally {
            setLoading(false);
        }
    }

    const displayKey = hoverDateKey || dateISO;
    const used = totalsByDate[displayKey] || 0;
    const idx = usedDays.indexOf(displayKey);
    const prevUsed = idx > 0 ? totalsByDate[usedDays[idx - 1]] : 0;
    const diff = used - prevUsed;

    const boxSuggestion = hoverSuggestion || suggestionText;

    return (
        <div className="grid">

            {/* INPUT SECTION */}
            <section className="panel">
                <h2 style={{ marginTop: 0 }}>Oil Consumption Tracker</h2>
                <div className="muted">{statusText}</div>
                <div className="muted">Last IoT Update: {lastUpdate} (IST)</div>

                <form
                    onSubmit={submit}
                    className="grid"
                    style={{ gridTemplateColumns: "1fr 1fr 100px" }}
                >
                    <input
                        type="date"
                        value={dateISO}
                        onChange={(e) => setDateISO(e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Amount (ml)"
                        value={amountMl}
                        onChange={(e) => setAmountMl(e.target.value)}
                    />

                    <button disabled={loading}>
                        {loading ? "Saving..." : "Add"}
                    </button>
                </form>
            </section>

            {/* CHART */}
            <section className="panel">
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between"
                    }}
                >
                    <h3>{viewMode === "month" ? "This Month" : "Selected Day"}</h3>
                    <span className="muted">Total: {totalMonth} ml</span>
                </div>

                <div style={{ display: "flex", gap: 8, margin: "8px 0" }}>
                    <button
                        onClick={() => setViewMode("month")}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border:
                                viewMode === "month" ? "none" : "1px solid #2a2f36",
                            background:
                                viewMode === "month"
                                    ? "linear-gradient(135deg,var(--brand),var(--brand-accent))"
                                    : "transparent",
                            color: viewMode === "month" ? "#0b0f19" : "#9da7b1"
                        }}
                    >
                        Month
                    </button>

                    <button
                        onClick={() => setViewMode("day")}
                        style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border:
                                viewMode === "day" ? "none" : "1px solid #2a2f36",
                            background:
                                viewMode === "day"
                                    ? "linear-gradient(135deg,var(--brand),var(--brand-accent))"
                                    : "transparent",
                            color: viewMode === "day" ? "#0b0f19" : "#9da7b1"
                        }}
                    >
                        Day
                    </button>

                    {viewMode === "day" && (
                        <input
                            type="date"
                            value={dateISO}
                            onChange={(e) => setDateISO(e.target.value)}
                            style={{
                                marginLeft: "auto",
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #2a2f36",
                                background: "transparent",
                                color: "#9da7b1"
                            }}
                        />
                    )}
                </div>

                <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={chartData}
                            onMouseMove={handleHover}
                            onMouseLeave={() => {
                                setHoverDateKey(null);
                                setHoverSuggestion("");
                            }}
                        >
                            <CartesianGrid stroke="#2a2f36" />
                            <XAxis dataKey="date" stroke="#9da7b1" />
                            <YAxis stroke="#9da7b1" />

                            <Tooltip
                                contentStyle={{
                                    background: "#0e1116",
                                    border: "1px solid #2a2f36",
                                }}
                                formatter={(v) => `${v} ml`}
                            />

                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#1f6feb"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* SUMMARY PANEL */}
                <div
                    className="panel summary-box"
                    style={{
                        marginTop: "18px",
                        padding: "24px",
                        borderRadius: "14px",
                        background: "var(--summary-bg)",
                        border: "1px solid var(--summary-border)",
                        boxShadow: "var(--summary-shadow)",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px"
                    }}
                >
                    <div
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "var(--summary-title)",
                            marginBottom: "8px"
                        }}
                    >
                          Daily Summary
                    </div>

                    <div style={{ fontSize: "18px", color: "var(--summary-text)" }}>
                        <strong style={{ color: "var(--summary-strong)" }}>Daily Target:</strong> 50 ml
                    </div>

                    <div style={{ fontSize: "18px", color: "var(--summary-text)" }}>
                        <strong style={{ color: "var(--summary-strong)" }}>Total Used:</strong> {used} ml
                    </div>

                    <div
                        style={{
                            fontSize: "18px",
                            color:
                                diff > 0 ? "var(--summary-red)" :
                                    diff < 0 ? "var(--summary-green)" : "var(--summary-text)"
                        }}
                    >
                        <strong style={{ color: "var(--summary-strong)" }}>Status:</strong>{" "}
                        {diff > 0 ? "More Used" :
                            diff < 0 ? "Less Used" : "Same Usage"}
                    </div>

                    <div style={{ fontSize: "18px", color: "var(--summary-text)" }}>
                        <strong style={{ color: "var(--summary-strong)" }}>Difference:</strong>{" "}
                        {Math.abs(diff)} ml
                    </div>

                    <div
                        className="summary-suggestion"
                        style={{
                            marginTop: "14px",
                            fontSize: "15px",
                            color: "var(--summary-muted)",
                            lineHeight: "1.6",
                            padding: "12px",
                            borderRadius: "10px",
                            background: "var(--summary-suggestion-bg)",
                            border: "1px solid var(--summary-suggestion-border)"
                        }}
                    >
                        <strong style={{ color: "var(--brand)" }}>Suggestion:</strong><br />
                        {boxSuggestion}
                    </div>
                </div>

                <div style={{ marginTop: 16, textAlign: "center" }}>
                    <p className="muted" style={{ margin: "0 0 12px 0" }}>
                        Want to know the oil content in your favorite foods?
                    </p>
                    <a
                        href="/campaigns"
                        style={{
                            display: "inline-block",
                            background:
                                "linear-gradient(135deg, var(--brand), var(--brand-accent))",
                            color: "#0b0f19",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            textDecoration: "none"
                        }}
                    >
                        🔍 Analyze Food Oil Content
                    </a>
                </div>
            </section>
        </div>
    );
}

/* --- THEME VARIABLES (ADD BELOW IN YOUR GLOBAL CSS) ---

:root {
  --summary-bg: linear-gradient(145deg, #0d1117, #10141c);
  --summary-border: #30363d;
  --summary-shadow: 0 4px 14px rgba(0,0,0,0.35);
  --summary-title: var(--brand-accent);
  --summary-text: #c9d1d9;
  --summary-strong: #ffffff;
  --summary-muted: #8b949e;
  --summary-suggestion-bg: rgba(255,255,255,0.04);
  --summary-suggestion-border: rgba(255,255,255,0.08);
  --summary-red: #ff7b72;
  --summary-green: #3fb950;
}

[data-theme="light"] {
  --summary-bg: #ffffff;
  --summary-border: #d0d7de;
  --summary-shadow: 0 2px 8px rgba(0,0,0,0.08);
  --summary-title: #0055cc;
  --summary-text: #24292f;
  --summary-strong: #000;
  --summary-muted: #57606a;
  --summary-suggestion-bg: #f6f8fa;
  --summary-suggestion-border: #d0d7de;
  --summary-red: #d1242f;
  --summary-green: #1a7f37;
}

*/
