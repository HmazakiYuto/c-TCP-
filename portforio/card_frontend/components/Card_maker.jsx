export default function Card_maker() {
  return (
    <div>
      <h2>カード登録</h2>
      <tr>
        <th>コスト</th>
          <td><input name="cost" type="number"></input></td>
        </tr>
    <tr>
        <th>カード名</th>
        <td><input name="card_name" type="text"></input></td>
          </tr>
          
    <tr>
        <th>攻撃力</th>
        <td><input name="card_attack" type="number"></input></td>
          </tr>
    <tr>
        <th>体力</th>
        <td><input name="card_health" type="number"></input></td>
          </tr>
          <button>登録</button>
    </div>
  );
}