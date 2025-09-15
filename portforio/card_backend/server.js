// server.js
import bodyParser from "body-parser";
import express from "express";
import db from "./mydb.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //ログイン認証


const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

const JWT_SECRET = "secret_key"; // 簡易的な秘密鍵

app.post("/user", async (req, res) => {
 
  const { user_name, user_password } = req.body;

  db.get( //同じユーザー名は登録済みを返す
    "SELECT * FROM user WHERE user_name = ?",
    [user_name],
     async(err, row) => {
      if (err) {
        return res.status(500).json({ error: "DBエラー" });
      }
      if (row) {
        // 既に存在する
        return res.status(400).json({ message: "登録済み ユーザー名を変更してください。" });
      }

        // パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(user_password, 10);

      // 存在しないならINSERT
      db.run(
        "INSERT INTO user (user_name, user_password) VALUES (?, ?)",
        [user_name, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "登録失敗" });
          }
          res.status(201).json({ message: "登録成功", id: this.lastID });
        }
      );
    }
  );
});



// 新しいカードを追加
app.post("/card", (req, res) => {
  const { card_name,card_cost,card_attack,card_health ,user_id } = req.body;
 console.log(req.body);
  db.run(
   
    "INSERT INTO card (card_name,card_cost,card_attack,card_health,card_maker ) VALUES (?,?,?,?,?)",
    [card_name,card_cost,card_attack,card_health,user_id ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
     res.status(201).json({ message: "登録成功", id: this.lastID });
    }
  );
});

//ログインユーザのカード一覧を取得
app.post("/cards", (req, res) => {
  const { user_id } = req.body;
console.log("受け取った user_id:", user_id, typeof user_id);

  db.all("SELECT * FROM card WHERE card_maker = ?", [user_id], (err, rows) => {
   
    if (err) return res.status(500).json({ message: "DBエラー" });
     console.log(rows);
    res.json(rows);
  });
});




app.post("/login", async (req, res) => {
   const { user_name, user_password } = req.body;

  db.get("SELECT * FROM user WHERE user_name = ?", [user_name], async (err, row) => {
    if (err) return res.status(500).json({ message: "DBエラー" });
    if (!row) return res.status(401).json({ message: "ユーザーが存在しません" });

    const match = await bcrypt.compare(user_password, row.user_password);
    if (!match) return res.status(401).json({ message: "パスワードが違います" });

    const token = jwt.sign({ user_id: row.user_id, user_name: row.user_name },JWT_SECRET , { expiresIn: "1h" });
    res.json({ message: "ログイン成功", token });
  });
});

// 1. deck テーブル登録
app.post("/deck", (req, res) => {
  const { deck_name, deck_maker } = req.body;
  db.run(
    "INSERT INTO deck (deck_name, deck_maker) VALUES (?, ?)",
    [deck_name, deck_maker],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ deck_id: this.lastID });
    }
  );
});

// 2. deck_list テーブル登録
app.post("/deck_list", (req, res) => {
  const { deck_id, cards } = req.body; // cards: [{ card_id, card_count }, ...]

  const stmt = db.prepare(
    "INSERT INTO deck_list (deck_id, card_id, card_count) VALUES (?, ?, ?)"
  );

  try {
    cards.forEach((c) => {
      stmt.run(deck_id, c.card_id, c.card_count);
    });
    stmt.finalize();
    res.status(201).json({ message: "カード登録完了" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// JWT認証ミドルウェア
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
 
  if (!token) return res.status(401).json({ message: "トークンが必要" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "トークン無効" });
     console.log(user);
    // user = { id: xxx, user_name: "xxx", iat:..., exp:... }
    req.user = user;
    next();
  });
}

app.get("/get_id", authenticateToken, (req, res) => {
  // トークンに含まれる user.id を返す
  res.json({ user_id: req.user.user_id, user_name: req.user.user_name });
});
// サーバー起動
app.listen(3001, () => {
  console.log("API サーバーが http://localhost:3001 で起動しました");
});
