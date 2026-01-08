const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'oiloguard.db'));

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  age INTEGER,
  heightCm INTEGER,
  weightKg REAL,
  locale TEXT
);

CREATE TABLE IF NOT EXISTS consumption_logs (
  id TEXT PRIMARY KEY,
  userId TEXT,
  dateISO TEXT,
  amountMl REAL
);

CREATE TABLE IF NOT EXISTS profiles (
  userId TEXT PRIMARY KEY,
  points INTEGER,
  badges TEXT,
  rank INTEGER
);

CREATE TABLE IF NOT EXISTS certifications (
  code TEXT PRIMARY KEY,
  userId TEXT,
  issuedAt TEXT
);
`);

function getUser(userId){
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

function upsertUser(user){
  db.prepare(`INSERT INTO users(id,name,age,heightCm,weightKg,locale)
              VALUES (@id,@name,@age,@heightCm,@weightKg,@locale)
              ON CONFLICT(id) DO UPDATE SET
                name=excluded.name,
                age=excluded.age,
                heightCm=excluded.heightCm,
                weightKg=excluded.weightKg,
                locale=excluded.locale`).run(user);
}

function listLogs(userId){
  return db.prepare('SELECT * FROM consumption_logs WHERE userId = ? ORDER BY dateISO ASC').all(userId);
}

function insertLog(log){
  db.prepare('INSERT INTO consumption_logs(id,userId,dateISO,amountMl) VALUES (@id,@userId,@dateISO,@amountMl)').run(log);
}

function getProfile(userId){
  const row = db.prepare('SELECT * FROM profiles WHERE userId = ?').get(userId);
  if (!row) return null;
  return { ...row, badges: JSON.parse(row.badges || '[]') };
}

function upsertProfile(profile){
  const toSave = { ...profile, badges: JSON.stringify(profile.badges || []) };
  db.prepare(`INSERT INTO profiles(userId,points,badges,rank)
              VALUES (@userId,@points,@badges,@rank)
              ON CONFLICT(userId) DO UPDATE SET
                points=excluded.points,
                badges=excluded.badges,
                rank=excluded.rank`).run(toSave);
}

function insertCert(cert){
  db.prepare('INSERT INTO certifications(code,userId,issuedAt) VALUES (@code,@userId,@issuedAt)').run(cert);
}

function findCert(code){
  return db.prepare('SELECT * FROM certifications WHERE code = ?').get(code);
}

function leaderboard(){
  return db.prepare('SELECT userId, points FROM profiles ORDER BY points DESC LIMIT 10').all();
}

module.exports = {
  db,
  getUser,
  upsertUser,
  listLogs,
  insertLog,
  getProfile,
  upsertProfile,
  insertCert,
  findCert,
  leaderboard,
};


