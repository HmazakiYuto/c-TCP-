// server.js
import bodyParser from "body-parser";
import express from "express";
import db from "./mydb.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; //ログイン認証


const app = express();
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

app.post("/login", async (req, res) => {
   const { user_name, user_password } = req.body;

  db.get("SELECT * FROM user WHERE user_name = ?", [user_name], async (err, row) => {
    if (err) return res.status(500).json({ message: "DBエラー" });
    if (!row) return res.status(401).json({ message: "ユーザーが存在しません" });

    const match = await bcrypt.compare(user_password, row.user_password);
    if (!match) return res.status(401).json({ message: "パスワードが違います" });

    const token = jwt.sign({ user_name }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "ログイン成功", token });
  });
});




// 新しいカードを追加
app.post("/card", (req, res) => {
  const { card_name,card_cost,card_attack,card_health  } = req.body;
     console.log(card_name, card_cost,card_attack, card_health);
  db.run(
   
    "INSERT INTO card (card_name,card_cost,card_attack,card_health ) VALUES (?,?,?,?)",
    [card_name,card_cost,card_attack,card_health ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, card_name,card_cost,card_attack,card_health  });
    }
  );
});

// サーバー起動
app.listen(3001, () => {
  console.log("API サーバーが http://localhost:3001 で起動しました");
});
