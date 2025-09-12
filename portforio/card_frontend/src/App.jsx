import { useState, useEffect } from "react";
import User_entry from "/components/User_entry.jsx";
import Card_maker from "/components/Card_maker.jsx";
import Deck_maker from "/components/Deck_maker.jsx";
import Deck_display from "/components/Deck_display.jsx";

export default function App() {
  const [page, setPage] = useState("user");
  const [userId, setUserId] = useState(null); // ← ログイン中のユーザーidをもつ

  const getUserId = async () => {
    const res = await fetch("http://localhost:3001/get_id", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    const data = await res.json();
    console.log("ユーザーID:", data.user_id);
    setUserId(data.user_id); // ← ログイン状態を記憶
  };

  const check_login = async (target_page) => {
    const token = localStorage.getItem("token");
    if (token) {
      await getUserId(); // userId を取得して state に保存
      setPage(target_page);
    } else {
      alert("ログインしてください");
    }
  };

  return (
    <>
      <button onClick={() => setPage("user")}>ログイン</button> 
      <button onClick={() => check_login("card")}>カード登録</button>
      <button onClick={() => check_login("deck_maker")}>デッキ登録</button>
      <button onClick={() => check_login("deck_display")}>デッキ閲覧</button>

      {page === "user" && <User_entry />}
      {page === "card" && <Card_maker user_id={userId} />}
      {page === "deck_maker" && <Deck_maker user_id={userId} />}
      {page === "deck_display" && <Deck_display user_id={userId} />}
    </>
  );
}
