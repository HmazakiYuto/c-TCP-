import React, { useState } from "react";

export default function Deck_maker({ user_id }) {
  const [cards, setCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [deckName, setDeckName] = useState("");

  // デッキ総枚数
  const totalCount = deck.reduce((sum, c) => sum + c.count, 0);

  // DBからカード取得
  const getCardLists = async () => {
    const res = await fetch("http://localhost:3001/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id }),
    });
    if (!res.ok) return console.error("サーバーエラー", res.status);
    const data = await res.json();
    setCards(data);
  };

  // カード追加
  const addToDeck = (card) => {
    if (totalCount >= 40) return alert("デッキは40枚までです");

    setDeck((prevDeck) => {
      const existing = prevDeck.find((c) => c.card_id === card.card_id);
      if (existing) {
        if (existing.count < 3) {
          return prevDeck.map((c) =>
            c.card_id === card.card_id ? { ...c, count: c.count + 1 } : c
          );
        } else {
          alert("このカードは3枚までです");
          return prevDeck;
        }
      } else {
        return [...prevDeck, { ...card, count: 1 }];
      }
    });
  };

  const increaseDeckCard = (card) => {
    if (totalCount >= 40) return alert("デッキは40枚までです");

    setDeck((prevDeck) =>
      prevDeck.map((c) =>
        c.card_id === card.card_id ? { ...c, count: Math.min(c.count + 1, 3) } : c
      )
    );
  };

  const decreaseDeckCard = (card) => {
    setDeck((prevDeck) =>
      prevDeck
        .map((c) =>
          c.card_id === card.card_id ? { ...c, count: c.count - 1 } : c
        )
        .filter((c) => c.count > 0)
    );
  };

  const registerDeck = async () => {
  if (!deckName.trim()) return alert("デッキ名を入力してください");
  if (deck.length === 0) return alert("デッキにカードを追加してください");
  if (totalCount < 40) return alert("デッキにはカードが40枚必要です");

  try {
    // 1. deck登録
    const resDeck = await fetch("http://localhost:3001/deck", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deck_name: deckName, deck_maker: user_id }),
    });

    if (!resDeck.ok) throw new Error("デッキ登録失敗");
    const deckData = await resDeck.json();
    const deck_id = deckData.deck_id || deckData.id; // バックエンド仕様に応じて

    // 2. deck_list登録
    const resList = await fetch("http://localhost:3001/deck_list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deck_id,
        cards: deck.map((c) => ({ card_id: c.card_id, card_count: c.count })),
      }),
    });

    if (!resList.ok) throw new Error("デッキリスト登録失敗");

    alert("デッキ登録完了！");
    setDeck([]);
    setDeckName("");
  } catch (err) {
    console.error(err);
    alert("接続失敗");
  }
};

  return (
    <div className="deck-maker-container">
      {/* 左半分：カードリスト */}
      <div className="card-list">
       <h2>登録カードリスト</h2>
        <button onClick={getCardLists}>カードリスト表示</button>
        {cards.map((card) => {
          const deckCount = deck.find((c) => c.card_id === card.card_id)?.count || 0;
          return (
            <div key={card.card_id} className="card-row">
              <span>{card.card_name}</span>
              <button onClick={() => addToDeck(card)}>＋</button>
              <button onClick={() => decreaseDeckCard(card)}>－</button>
              <span>（{deckCount}枚）</span>
            </div>
          );
        })}
      </div>

      {/* 右半分：デッキ */}
      <div className="deck">
        
        {deck.length === 0 && <p>カードを追加してください</p>}
           <h2>デッキ（合計 {totalCount} 枚）</h2>
          <input
          type="text"
          placeholder="デッキ名を入力"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        />
        <button onClick={registerDeck}>デッキ登録</button>
         
        {deck.map((card) => (
          <div key={card.card_id} className="card-row">
            <span>{card.card_name} × {card.count}</span>
            <button onClick={() => increaseDeckCard(card)}>＋</button>
            <button onClick={() => decreaseDeckCard(card)}>－</button>
          </div>
        ))}

         
      </div>
    </div>
  );
}
