import { useState, useEffect } from "react";

export default function Deck_display({ user_id }) {
  const [decks, setDecks] = useState([]);

  // デッキ一覧を取得
  const getDecks = async () => {
    const res = await fetch("http://localhost:3001/deck_display", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    });

    if (!res.ok) {
      console.error("デッキ取得失敗");
      return;
    }

    const data = await res.json();
    setDecks(data);
  };

  useEffect(() => {
    if (user_id) {
      getDecks();
    }
  }, [user_id]);

  return (
    <div className="deck-display">
      <h2>デッキ一覧</h2>
      {decks.length === 0 && <p>デッキがありません</p>}

      {decks.map((deck) => (
        <div key={deck.deck_id} className="deck-card">
          <h3>{deck.deck_name}</h3>
          <p>作成者ID: {deck.deck_maker}</p>

          <ul>
            {deck.cards.map((card) => (
              <li key={card.card_id}>
                {card.card_name} × {card.card_count}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
