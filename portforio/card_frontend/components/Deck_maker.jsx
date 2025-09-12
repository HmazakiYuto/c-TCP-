export default function Deck_maker(user_id) {
  return (
    <div>
      <h2>デッキ登録</h2>
      <tr>
        <th>デッキ名</th>
          <td><input name="name" type="text"></input></td>
        </tr>
    
          <button>登録</button>
    </div>
  );
}