import { useState } from "react";
//分岐先の４つのjsxファイルをimport
import User_entry from "/components/User_entry.jsx";
import Card_maker from "/components/Card_maker.jsx";
import Deck_maker from "/components/Deck_maker.jsx";
import Deck_display from "/components/Deck_display.jsx";

export default function App() {
  const [page, setPage] = useState("user");

    function  check_login_card(){
        
        setPage("card")
    }

    function  check_login_deck_maker(){
        setPage("deck_maker")
    }

    function  check_login_deck_display(){
        setPage("deck_display")
    }
    
    
    
  return (
    <>
      
      <button onClick={() => setPage("user")}>ログイン</button> 
     <button onClick={() => setPage("card")}>カード登録</button>
     <button onClick={() => setPage("deck_maker")}>デッキ登録</button>
     <button onClick={() => setPage("deck_display")}>デッキ閲覧</button>
  
      

      {page === "user" && <User_entry />}
      {page === "card" && <Card_maker />}
      {page === "deck_maker" && <Deck_maker />}
      {page === "deck_display" && <Deck_display />}
      
    </>
  );
}