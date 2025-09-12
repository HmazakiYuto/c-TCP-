// db.js
const sqlite3 = require("sqlite3").verbose();

// DBファイルを作成（なければ自動生成）
const db = new sqlite3.Database("./mydb.sqlite", (err) => {
  if (err) {
    console.error("DB接続エラー:", err.message);
  } else {
    console.log("SQLite データベースに接続しました");
  }
});

db.run("PRAGMA foreign_keys = ON");


// 初回起動時にテーブルを作成
db.run(`
  CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    user_password TEXT
  )
`);
//auto incrementは自動で連番を振る(引数にidをとる必要がない)
db.run(`
  CREATE TABLE IF NOT EXISTS card (
    card_id INTEGER PRIMARY KEY AUTOINCREMENT,
    card_name TEXT,
    card_cost INTEGER,
    card_attack INTEGER,
    card_health INTEGER,
    card_maker INTEGER,
     FOREIGN KEY (card_maker) REFERENCES user(user_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS deck (
    deck_id INTEGER  PRIMARY KEY AUTOINCREMENT,
    deck_name TEXT,
    deck_maker INTEGER,
    FOREIGN KEY (deck_maker) REFERENCES user(user_id)
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS deck_list (
    deck_id INTEGER  ,
    card_id INTEGER ,
    card_count INTEGER,
    PRIMARY KEY (deck_id, card_id),
    FOREIGN KEY (deck_id) REFERENCES deck(deck_id),
    FOREIGN KEY (card_id) REFERENCES card(card_id)
  )
`);

module.exports = db;