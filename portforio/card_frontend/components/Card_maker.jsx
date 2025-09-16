import React, { useState } from "react";

export default function Card_maker({ user_id }) {
  const [cardCost, setCardCost] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardAttack, setCardAttack] = useState("");
  const [cardHealth, setCardHealth] = useState("");

  async function add_card() {
    // 入力チェック
    if (!cardName.trim()) {
      alert("カード名を入力してください");
      return;
    }
    if (cardCost === "" || cardAttack === "" || cardHealth === "") {
      alert("コスト・攻撃力・体力をすべて入力してください");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_name: cardName,
          card_cost: cardCost,
          card_attack: cardAttack,
          card_health: cardHealth,
          user_id: user_id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "登録に失敗しました");
        return;
      }

      alert(data.message || "カード登録完了");

      // 入力欄をリセット
      setCardCost("");
      setCardName("");
      setCardAttack("");
      setCardHealth("");
    } catch (err) {
      console.error(err);
      alert("接続失敗");
    }
  }

  return (
    <div>
      <h2>カード登録</h2>
      <table>
        <tbody>
          <tr>
            <th>コスト</th>
            <td>
              <input
                className="card-input"
                name="card_cost"
                type="number"
                max="99"
                min="0"
                placeholder="コストを入力（99以下）"
                value={cardCost}
                onChange={(e) => setCardCost(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>カード名</th>
            <td>
              <input
                className="card-input"
                name="card_name"
                type="text"
                maxLength="10"
                placeholder="カード名を入力（10文字以下）"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>攻撃力</th>
            <td>
              <input
                className="card-input"
                name="card_attack"
                type="number"
                max="99"
                min="0"
                placeholder="攻撃力を入力（99以下）"
                value={cardAttack}
                onChange={(e) => setCardAttack(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th>体力</th>
            <td>
              <input
                className="card-input"
                name="card_health"
                type="number"
                max="99"
                min="0"
                placeholder="体力を入力（99以下）"
                value={cardHealth}
                onChange={(e) => setCardHealth(e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={add_card}>登録</button>
    </div>
  );
}

