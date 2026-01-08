const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { randomUUID } = require('crypto');
const { getUser, upsertUser, listLogs, insertLog, getProfile, upsertProfile, insertCert, findCert, leaderboard } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Seed demo user/profile if not present
(function seed(){
	const user = getUser('u1');
	if (!user) {
		upsertUser({ id: 'u1', name: 'Asha', age: 29, heightCm: 162, weightKg: 62, locale: 'en' });
	}
	const profile = getProfile('u1');
	if (!profile) {
		upsertProfile({ userId: 'u1', points: 120, badges: ['b1'], rank: 1200 });
	}
})();

// Static demo data that remains in-memory
const dbMem = {
	recipes: [
		{ id: 'r1', title: 'Grilled Tofu Salad', cuisine: 'Global', diet: 'Vegetarian', lowOil: true, nutrition: { calories: 320, fat: 9, carbs: 28, protein: 24 }, steps: [ 'Press tofu', 'Grill with minimal oil spray', 'Mix salad and serve' ], rating: 4.4, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format' },
		{ id: 'r2', title: 'Steamed Fish with Herbs', cuisine: 'Asian', diet: 'Pescatarian', lowOil: true, nutrition: { calories: 280, fat: 7, carbs: 6, protein: 38 }, steps: [ 'Marinate fish', 'Steam with herbs', 'Serve with lemon' ], rating: 4.7, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format' },
	],
	badges: [
		{ id: 'b1', name: 'Mindful Eater', points: 100 },
		{ id: 'b2', name: 'Oil Saver', points: 250 },
	],
	campaigns: [
		{ id: 'c1', title: 'National Edible Oil Awareness Week', banners: [ '/static/banner1.png' ], videos: [ 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' ], infographics: [ 'Choose oils wisely', 'Limit deep frying' ], quiz: { questions: [ { id: 'q1', text: 'What is a healthy daily oil limit per adult?', options: [ '10-20 ml', '30-50 ml', '80-100 ml' ], answerIdx: 1 } ] } }
	]
};

function calculateBmi(weightKg, heightCm) {
	const heightM = heightCm / 100;
	return Number((weightKg / (heightM * heightM)).toFixed(1));
}

app.get('/api/health/:userId', (req, res) => {
	const { userId } = req.params;
	const user = getUser(userId);
	if (!user) return res.status(404).json({ error: 'User not found' });
	const bmi = calculateBmi(user.weightKg, user.heightCm);
	const risk = bmi >= 25 ? 'elevated' : 'normal';
	res.json({ user, bmi, risk, tips: risk === 'elevated' ? [ 'Reduce fried foods', 'Use measuring spoons for oil' ] : [ 'Keep it up!' ] });
});

// Accept analytics inputs to update user and compute new BMI/status
app.post('/api/health/evaluate', (req, res) => {
	const { userId, heightCm, weightKg, age, mealsPerDay } = req.body || {};
	if (!userId || !heightCm || !weightKg || !age) return res.status(400).json({ error: 'Missing required fields' });
	const user = getUser(userId) || { id: userId, name: 'User', locale: 'en' };
	upsertUser({ ...user, heightCm: Number(heightCm), weightKg: Number(weightKg), age: Number(age) });
	const bmi = calculateBmi(Number(weightKg), Number(heightCm));
	let risk = 'normal';
	if (bmi >= 25 || mealsPerDay >= 5) risk = 'elevated';
	res.json({ bmi, risk, advice: risk==='elevated' ? [ 'Target 30-50ml oil/day', 'Prefer steaming, baking, grilling' ] : [ 'Maintain balanced meals', 'Stay active' ] });
});

app.get('/api/consumption/:userId', (req, res) => {
	const { userId } = req.params;
	const logs = listLogs(userId);
	res.json({ logs });
});

app.post('/api/consumption', (req, res) => {
	const { userId, dateISO, amountMl } = req.body || {};
	if (!userId || !dateISO || typeof amountMl !== 'number') {
		return res.status(400).json({ error: 'Invalid payload' });
	}
	const entry = { id: randomUUID(), userId, dateISO, amountMl };
	insertLog(entry);
	res.status(201).json(entry);
});

// Live recipes with images via Spoonacular or fallback to demo data. Pass SPOONACULAR_KEY in env.
app.get('/api/recipes', async (req, res) => {
	const { cuisine, diet, lowOil } = req.query;
	const key = process.env.SPOONACULAR_KEY;
	if (!key) {
		// fallback to demo with filters
		let list = dbMem.recipes;
		if (cuisine) list = list.filter(r => r.cuisine.toLowerCase() === String(cuisine).toLowerCase());
		if (diet) list = list.filter(r => r.diet.toLowerCase() === String(diet).toLowerCase());
		if (typeof lowOil !== 'undefined') list = list.filter(r => r.lowOil === (String(lowOil) === 'true'));
		return res.json({ recipes: list });
	}
	try {
		const params = new URLSearchParams({ number: '10', addRecipeInformation: 'true' });
		if (cuisine) params.set('cuisine', String(cuisine));
		if (diet) params.set('diet', String(diet));
		const url = `https://api.spoonacular.com/recipes/complexSearch?${params.toString()}&apiKey=${key}`;
		const fetch = (await import('node-fetch')).default;
		const r = await fetch(url);
		const json = await r.json();
		const mapped = (json.results || []).map(x => ({
			id: String(x.id),
			title: x.title,
			cuisine: cuisine || 'Mixed',
			diet: diet || 'Mixed',
			lowOil: true,
			nutrition: { calories: x.nutrition?.nutrients?.find(n=>n.name==='Calories')?.amount || 0, fat: x.nutrition?.nutrients?.find(n=>n.name==='Fat')?.amount || 0, carbs: 0, protein: 0 },
			steps: [],
			rating: Math.round((x.spoonacularScore || 80)/20),
			image: x.image,
		}));
		res.json({ recipes: mapped });
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: 'Failed to fetch live recipes' });
	}
});

app.get('/api/campaigns', (req, res) => {
	res.json({ campaigns: dbMem.campaigns });
});

app.post('/api/quiz/submit', (req, res) => {
	const { userId, campaignId, answers } = req.body || {};
	if (!userId || !campaignId || !Array.isArray(answers)) return res.status(400).json({ error: 'Invalid payload' });
	const campaign = dbMem.campaigns.find(c => c.id === campaignId);
	if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
	let score = 0;
	campaign.quiz.questions.forEach((q, idx) => { if (answers[idx] === q.answerIdx) score += 1; });
	const pointsEarned = score * 50;
	const profile = getProfile(userId) || { userId, points: 0, badges: [], rank: 0 };
	profile.points += pointsEarned;
	if (profile.points >= 100 && !profile.badges.includes('b1')) profile.badges.push('b1');
	upsertProfile(profile);
	res.json({ score, pointsEarned, profile });
});

app.get('/api/profile/:userId', (req, res) => {
	const { userId } = req.params;
	const profile = getProfile(userId) || { userId, points: 0, badges: [], rank: 0 };
	// Expand badges from memory catalogue
	const badges = dbMem.badges.filter(b => (profile.badges||[]).includes(b.id));
	res.json({ profile: { ...profile, badges } });
});

app.post('/api/certifications/issue', (req, res) => {
	const { userId } = req.body || {};
	if (!userId) return res.status(400).json({ error: 'userId required' });
	const code = randomUUID().slice(0, 8);
	const cert = { code, userId, issuedAt: new Date().toISOString() };
	insertCert(cert);
	res.status(201).json(cert);
});

app.get('/api/certifications/verify/:code', (req, res) => {
	const { code } = req.params;
	const cert = findCert(code);
	if (!cert) return res.status(404).json({ valid: false });
	const user = getUser(cert.userId);
	res.json({ valid: true, cert, user });
});

app.get('/api/leaderboard', (_req, res) => {
	const rows = leaderboard();
	const entries = rows.map(row => {
		const user = getUser(row.userId);
		return { userId: row.userId, name: user?.name || row.userId, points: row.points };
	});
	res.json({ leaderboard: entries });
});

app.get('/', (_req, res) => { res.send('OiloGuard Backend is running'); });

app.listen(PORT, () => {
	console.log(`Backend listening on port ${PORT}`);
});


