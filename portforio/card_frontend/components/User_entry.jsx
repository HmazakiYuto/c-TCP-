import React, { useState } from "react";

export default function User_entry() {
    
    
  const [entryUserName, setEntryUserName] = useState("");
  const [entryPassword, setEntryPassword] = useState("");
  const [loginUserName, setloginUserName] = useState("");
  const [loginPassword, setloginPassword] = useState("");
    
    async function adduser() {
          if(entryUserName.length>=6&&entryPassword.length>=6){
           try {
               const res = await fetch("http://localhost:3001/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_name: entryUserName,
              user_password: entryPassword,
            }),
          });

            if (!res.ok) {
            const data = await res.json();
            alert(data.message || "登録に失敗しました");
            return;
          }

          const data = await res.json();
          alert(data.message);



          // 登録成功したら入力欄を空に戻す
          setEntryUserName("");
          setEntryPassword("");

          alert("ユーザー登録完了");
        } catch (err) {
          console.error(err);
          console.log("せつぞくしっぱい");
        }
          }else{
              alert("６文字以上で入力してください");
          }
      };
    
    //ログイン処理
    async function loginuser() {
       try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: loginUserName, user_password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }
           //ブラウザのストレージにトークンを保存
      localStorage.setItem("token", data.token);
            // 登録成功したら入力欄を空に戻す
        setloginUserName("");
        setloginPassword("");
      alert("ログイン成功");
    } catch (err) {
      console.error(err);
      alert("サーバーに接続できません");
    }  
    };

    
    
  return (
      <div>
    
          <h2>ログイン</h2>
          <table>
              <tbody>
          <tr>
              <th>ユーザ名</th>
              <td><input name="name" id="login_user_name" type="text" maxLength={10}  value={loginUserName} onChange={(e) =>setloginUserName(e.target.value)}/></td></tr>
          <tr>
              <th>パスワード</th>
              <td><input name="password" id="login_password" type="passward"  maxLength={10} value ={loginPassword} onChange={(e) =>setloginPassword(e.target.value)} /></td>
          </tr>
                                </tbody>
          </table>
          <button　onClick={loginuser}>ログイン</button>

     
          <h2>ユーザー登録</h2>      <table>
          <tbody>
      <tr>
        <th>ユーザー名</th>
          <td><input name="name" id="entry_user_name"type="text" placeholder="６文字以上１０文字以内" maxLength={10} min="6"
                  value={entryUserName}
                  onChange={(e) => setEntryUserName(e.target.value)} /></td>
        </tr>
    <tr>
        <th>パスワード</th>
        <td><input name="entry_passward" type="password" placeholder="６文字以上１０文字以内" maxLength={10} min="6"
                  value={entryPassword}
                  onChange={(e) => setEntryPassword(e.target.value)} /></td>
          </tr>
          </tbody>
          </table>
          <button　onClick={adduser}>登録</button>
   
      </div>
  );
}
