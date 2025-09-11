#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<time.h>
#include<stdbool.h>
#include <conio.h> 
#include <windows.h>
#include<math.h>



/*a*アルゴリズムを使って追いかけてくるEから逃げてゴールを目指すゲーム*/
/*入力受付、終了判定完了、追跡アルゴリズムの実装
    astarアルゴリズムの実装方法　
        １　隣接するノードのコストを調べ、評価する（評価はそのノードへの歩数＋座標コスト）。
        ２　一番評価の低いノードに対して１を適用する。（評価が同率なら最後に調べたほう優先）
        ３　１，２を繰り返し、評価対象がgoalノードになった場合、評価を終了し親ノードをたどると最短経路のなる。*/

enum{
    //縦横は奇数&&縦＊横が２５６以下にすること
    MAX_WIDTH=15, //x
    MAX_HEIGHT=7 //y
};

enum{
    ACTOR_TYPE_NONE,
    ACTOR_TYPE_PLAYER,
    ACTOR_TYPE_GOAL,
    ACTOR_TYPE_ENEMY
};

enum{
    GAME_PLAYING,
    GAME_OVER,
    GAME_CLEAR
};


typedef struct {
    int x;
    int y;
}vector;

typedef struct {
    int type;
    vector pos;
}actor;

typedef struct {
    char field[MAX_HEIGHT][MAX_WIDTH];
}canbus_class;

//structの横にnodeを書かないとself->parentがうまく動かない
typedef struct node {
    vector pos; //ノードの座標
    int g; //スタートからの移動コスト
    int h; //ゴールまでの推定コスト
    int f; //g+h（評価）
    struct node *parent; //親ノードへのポインタ
}node;




int game_state=GAME_PLAYING;




void init_canbus(canbus_class *self){
    bool check=true;
    srand(time(NULL));
   
    //memset関数で配列を空白で初期化
    memset(self->field,' ',sizeof(self->field));

    for (int x=0;x<MAX_WIDTH;x++){
        self->field[0][x]='#';
        self->field[MAX_HEIGHT-1][x]='#';
    }

       for (int y=0;y<MAX_HEIGHT;y++){
        self->field[y][0]='#';
        self->field[y][MAX_WIDTH-1]='#';
    }

    //偶数行、偶数列に＊（壁）を格納


       for (int x=2;x<MAX_WIDTH-1;x+=2){
        for(int y=2;y<MAX_HEIGHT-1;y+=2){
            self->field[y][x]='#';
                    }
    }
    //上下左右の空白にランダムに柱を倒す。
        for (int x=2;x<MAX_WIDTH-1;x+=2){
        for(int y=2;y<MAX_HEIGHT-1;y+=2){
            int a=rand() %4;
            check=false;
            while(!check){
                //checkがtrueになるまでループ
                /*空白に＃を設置できるまでループ*/
                switch (a)
                {
                case 0: if(self->field[y-1][x]=='#'){
                    a++; break;
                }self->field[y-1][x]='#';
                check=true; 
                break;
                case 1: if(self->field[y][x+1]=='#'){
                    a++; break;
                }self->field[y][x+1]='#';
                check=true; 
                break;
                case 2: if(self->field[y+1][x]=='#'){
                    a++; break;
                }self->field[y+1][x]='#';
                check=true; 
                break;
                case 3: if(self->field[y][x-1]=='#'){
                    a=0; break;
                }self->field[y][x-1]='#';
                check=true; 
                break;
               
            
                        }
                    }
            }
    }

    
}

//actor同士の位置が被らないように
void init_actor(actor *self,canbus_class *canbus){
    srand(time(NULL));
    //ランダムな座標を取得し、座標が壁に囲まれてなければそこに配置する
    while(1){
    int x=rand() % (MAX_WIDTH-1)+1;
    int y=rand() % (MAX_HEIGHT-1)+1;
    if(canbus->field[y][x]==' '){
        if(canbus->field[y-1][x]==' '||canbus->field[y+1][x]==' '||canbus->field[y][x-1]==' '||canbus->field[y][x+1]==' '){
            self->pos.x=x;
            self->pos.y=y;      
            break;
     }
    }
}

    switch(self->type){
        case ACTOR_TYPE_PLAYER:
            canbus->field[self->pos.y][self->pos.x]='P';break;
        case ACTOR_TYPE_GOAL:
            canbus->field[self->pos.y][self->pos.x]='G';break;
        case ACTOR_TYPE_ENEMY:
            canbus->field[self->pos.y][self->pos.x]='E';break;
    }
}

void canbus_update(canbus_class *self, actor *player,  actor *enemy, actor *goal){
    //コンソール上に迷路を描画する処理
for(int y=0;y<MAX_HEIGHT;y++){
    for(int x=0;x<MAX_WIDTH;x++){
        if(y==goal->pos.y && x==goal->pos.x){
            printf("G");
        }else{
                printf("%c",self->field[y][x]);
            }
    
    if(x==MAX_WIDTH-1)printf("\n");
    }
}

}


void get_key(actor *player,canbus_class *canbus){
    //キーボード入力を取得し、WASDで移動する
    if (_kbhit()) {  
            char key = _getch();
            int nx = player->pos.x, ny = player->pos.y;
            if (key == 'w' || key == 'W') ny--;
            if (key == 's' || key == 'S') ny++;
            if (key == 'a' || key == 'A') nx--;
            if (key == 'd' || key == 'D') nx++;
            if (key == 'q' || key == 'Q') exit(0);
            //壁でなければ移動
            if(canbus->field[ny][nx]=='G'){
                game_state=GAME_CLEAR;
                return;
            }
            if(canbus->field[ny][nx]=='E'){
                game_state=GAME_OVER;
                return;
            }
            if(canbus->field[ny][nx]=='#') return;
            canbus->field[player->pos.y][player->pos.x]=' ';
            canbus->field[ny][nx]='P';
            player->pos.x = nx;
            player->pos.y = ny;

        }

}



/*astarアルゴリズムを実装*/

/*距離の計算　(enemy.pos.x-player.pos.x)+(enemy.pos.y-player.pos.y)*/

/*引数（前ノード,エネミーの目的地,エネミーの配列上の位置,ゴール,配列,終了判定フラグ,）*/
/*flagがfalseの間、再帰的にastar_algolithmを呼び続ける。selfのposがゴールと等しくなった時、flagを立てる*/
//探索した道が行き止まりだった場合戻れない
/*void astar_algorithm(node *self, actor *player, actor *enemy,canbus_class *canbus, bool *finish_flag){ 
    if (*finish_flag) return;
     node *adjacent_nodes[4];
    // 隣接ノードを作成
    
    for (int i = 0; i < 4; i++) {
        adjacent_nodes[i] = (node*)malloc(sizeof(node));
        adjacent_nodes[i]->parent = self;  // 親は必ずヒープ上のノード
        adjacent_nodes[i]->g = self->g + 1; //前のノーどから１歩進むのでgは+1
    
        switch (i) {
            case 0: adjacent_nodes[i]->pos.x = self->pos.x - 1; adjacent_nodes[i]->pos.y = self->pos.y; break; // 左
            case 1: adjacent_nodes[i]->pos.x = self->pos.x + 1; adjacent_nodes[i]->pos.y = self->pos.y; break; // 右
            case 2: adjacent_nodes[i]->pos.x = self->pos.x; adjacent_nodes[i]->pos.y = self->pos.y - 1; break; // 上
            case 3: adjacent_nodes[i]->pos.x = self->pos.x; adjacent_nodes[i]->pos.y = self->pos.y + 1; break; // 下
        }

        // 壁や敵の位置は通れない
        if (adjacent_nodes[i]->pos.x <= 0 || adjacent_nodes[i]->pos.x > MAX_WIDTH ||
            adjacent_nodes[i]->pos.y <= 0 || adjacent_nodes[i]->pos.y > MAX_HEIGHT ||
            canbus->field[adjacent_nodes[i]->pos.y][adjacent_nodes[i]->pos.x] == '#' ||
            (adjacent_nodes[i]->pos.x == enemy->pos.x && adjacent_nodes[i]->pos.y == enemy->pos.y)
            ) {
            adjacent_nodes[i]->f = 9999; // 評価を大きくして通れないように
        } else {
            adjacent_nodes[i]->h = abs(player->pos.x - adjacent_nodes[i]->pos.x) +
                                   abs(player->pos.y - adjacent_nodes[i]->pos.y);
            adjacent_nodes[i]->f = adjacent_nodes[i]->g + adjacent_nodes[i]->h;
        }
    }

    // 最小評価のノードを選択
    node *next_node = adjacent_nodes[0];
    for (int i = 1; i < 4; i++) {
        if (adjacent_nodes[i]->f <= next_node->f) {
            //一番評価（f）の低いノードがnext_nodeになる。同率なら最後に調べたノードを優先。
            next_node = adjacent_nodes[i]; 
        }
    }

    // ゴールに到達したら終了
    if (next_node->pos.x == player->pos.x && next_node->pos.y == player->pos.y) {
        *finish_flag = true;

        // 最短経路をたどる
        node *current = next_node;
        node *temp;
        while (current->parent != NULL) {
            temp = current;
            current = current->parent;
        }
        // 敵を次の位置に移動
        canbus->field[enemy->pos.y][enemy->pos.x] = ' ';
        enemy->pos.x = temp->pos.x;
        enemy->pos.y = temp->pos.y;
        canbus->field[enemy->pos.y][enemy->pos.x] = 'E';
    } else {
        //ゴールでないなら再帰的に呼び出す
        astar_algorithm(next_node, player, enemy, canbus, finish_flag);
    }
            
    // ヒープを解放
    for (int i = 0; i < 4; i++) free(adjacent_nodes[i]);
}*/

// マンハッタン距離
int heuristic(vector a, vector b) {
    return abs(a.x - b.x) + abs(a.y - b.y);
}

// 最低f値ノードを探す
int find_lowest_f(node **open, int open_count) {
    int idx = 0;
    for (int i = 1; i < open_count; i++) {
        if (open[i]->f < open[idx]->f) idx = i;
    }
    return idx;
}

void astar_algorithm(vector start_pos, vector goal_pos, canbus_class *canbus) {
    node *open[256];   // 探索候補
    int open_count = 0;
    bool closed[MAX_HEIGHT][MAX_WIDTH] = {false}; // 探索済みフラグ

    // startノードを作成
    node *start = malloc(sizeof(node));
    start->pos = start_pos;
    start->g = 0;
    start->h = heuristic(start_pos, goal_pos);
    start->f = start->g + start->h;
    start->parent = NULL;

    open[open_count++] = start;

    while (open_count > 0) {
        // 評価が最小のノードの添え字をidxに取得
        int idx = find_lowest_f(open, open_count);
        node *current = open[idx];

        // Openから取り出す（末尾と交換）
        open[idx] = open[--open_count];

        // ゴール判定
        if (current->pos.x == goal_pos.x && current->pos.y == goal_pos.y) {
          

            
            node *p = current;
            node *before_node=current; //stratノードの親がNULLなので、before_nodeが進むべきマス。
            while (p) {
                before_node=p;
                p = p->parent;
                if(p->parent==NULL){
                    
                    canbus->field[before_node->pos.y][before_node->pos.x] = 'E';
                    canbus->field[p->pos.y][p->pos.x] = ' ';
                }
               
            }
            return;
        }

        closed[current->pos.y][current->pos.x] = true;

        // 隣接4方向
        int dx[4] = {1,-1,0,0};
        int dy[4] = {0,0,1,-1};
        for (int i=0;i<4;i++){
            int nx = current->pos.x + dx[i];
            int ny = current->pos.y + dy[i];

            // 範囲外チェック
            if(nx<0 || nx>=MAX_WIDTH || ny<0 || ny>=MAX_HEIGHT) continue;
            if(canbus->field[ny][nx] == '#') continue; // 壁
            if(closed[ny][nx]) continue; // 探索済み

            node *next = malloc(sizeof(node));
            next->pos = (vector){nx, ny};
            next->g = current->g + 1;
            next->h = heuristic(next->pos, goal_pos);
            next->f = next->g + next->h;
            next->parent = current;

            open[open_count++] = next;
        }
    }

    
}


int main(){


canbus_class canbus ;
actor player={ACTOR_TYPE_PLAYER,};
actor goal={ACTOR_TYPE_GOAL,};
actor enemy={ACTOR_TYPE_ENEMY,};

init_canbus(&canbus);
init_actor(&player,&canbus);
init_actor(&goal,&canbus);
init_actor(&enemy,&canbus);


//ループの中でcanbusをアップデートする。入力はgetchar()で取得する。
//AWSDで移動　方向を受けとり座標を動かす。
while (1) {
        // 入力
      
        node *start_enemy = (node*)malloc(sizeof(node));
        start_enemy->pos = enemy.pos;
        start_enemy->g = 0;
        start_enemy->h = 0;
        start_enemy->f = 0;
        start_enemy->parent = NULL;
        bool finish_flag = false;


        get_key(&player,&canbus);

       
        // 描画
         system("cls");

         if(game_state==GAME_OVER){
            printf("GAME OVER\n");
            return 0;
         }

         if(game_state==GAME_CLEAR){
            printf("GAME CLEAR\n");
            return 0;
         }
        
        
        canbus_update(&canbus, &player, &enemy,&goal);
        astar_algorithm(enemy.pos,player.pos,&canbus);

        printf("--wasdで移動して、qで終了--\n");
        Sleep(100); // 約60FPS  40
    }
    return 0;
}
