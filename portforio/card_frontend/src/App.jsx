import { useState, useEffect } from "react";
import User_entry from "/components/User_entry.jsx";
import Card_maker from "/components/Card_maker.jsx";
import Deck_maker from "/components/Deck_maker.jsx";
import Deck_display from "/components/Deck_display.jsx";

export default function App() {
  const [page, setPage] = useState("user");
  const [userId, setUserId] = useState(null); //← ログイン中のユーザーidをもつ
    const[userName,setUsername] = useState("");
    
  const check_login = async (target_page) => {
        const res = await fetch("http://localhost:3001/get_id", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
      
        if (!res.ok) {  // 401, 403 などのエラー
            //有効期限切れのトークンを削除
          localStorage.removeItem("token");
          alert("ログインしてください");
            setPage("user");
            setUsername("");
          return;
        }

        const data = await res.json();
        console.log("ユーザーID:", data.user_id,data.user_name);
        setUsername(data.user_name);
        setPage(target_page);
        setUserId(data.user_id);
          };
    
    
const remove_taken = () =>{
   const data = localStorage.getItem("token");
    if(data){
    localStorage.removeItem("token");
    alert("ログアウトしました");
     setUsername("");
    setPage("user");
    }else{
        alert("ログインしていません");
    }
    
    return;
}


  return (
    <>
      <div className = "menu-bar">
      <button onClick={() => setPage("user")} className={`menu-item ${page === "user" ? "active" : ""}`}>ログイン</button> 
          
 
          
      <button onClick={() => check_login("card")} className={`menu-item ${page === "card" ? "active" : ""}`}>カード登録</button>
          
      <button onClick={() => check_login("deck_maker")} className={`menu-item ${page === "deck_maker" ? "active" : ""}`}>デッキ登録</button>
          
      <button onClick={() => check_login("deck_display")}
          className={`menu-item ${page === "deck_display" ? "active" : ""}`}>デッキ閲覧</button>
          
      <button onClick={() => remove_taken()}
          >ログアウト</button>
           <p>{userName ? `${userName}でログイン中` : "未ログイン"}</p>
      </div>
      <div className ="contents">
      {page === "user" && <User_entry Check_login={check_login} />}
      {page === "card" && <Card_maker user_id={userId} />}
      {page === "deck_maker" && <Deck_maker user_id={userId} />}
      {page === "deck_display" && <Deck_display user_id={userId} />}
      </div>
    </>
  );
}
