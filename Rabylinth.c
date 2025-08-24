#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <string.h>
#include <windows.h>
#define MAX_HEIGHT 11
#define MAX_WIDTH 11


typedef struct {
    int height;
    int width;
    char field[MAX_WIDTH][MAX_HEIGHT];
}map_object;

void init_map(map_object *map){
    //二次元配列を初期化して外壁を作り、棒倒し法を用いてランダムな道を作る
    srand(time(NULL));
    //memset関数で配列を空白で初期化
    memset(map->field,' ',sizeof(map->field));

    for (int i=0;i<MAX_HEIGHT;i++){
        map->field[0][i]='#';
        map->field[MAX_WIDTH-1][i]='#';
    }

       for (int i=0;i<MAX_WIDTH;i++){
        map->field[i][0]='#';
        map->field[i][MAX_HEIGHT-1]='#';
    }

    //偶数行、偶数列に＊（壁）を格納


       for (int i=2;i<MAX_WIDTH;i+=2){
        for(int y=2;y<MAX_HEIGHT;y+=2){
            map->field[i][y]='#';
                    }
    }
    //上下左右の空白にランダムに柱を倒す。
        for (int i=2;i<MAX_WIDTH;i+=2){
        for(int y=2;y<MAX_HEIGHT;y+=2){
            int a=rand() %4;
            switch (a)
            {
            case 0: map->field[i-1][y]='#';break;
            case 1: map->field[i][y+1]='#';break;
            case 2: map->field[i+1][y]='#';break;
            case 3: map->field[i][y-1]='#';break;
        
            }
                    }
    }

}

void map_print(map_object *map){
    //コンソール上に迷路を描画する処理を書く
for(int y=0;y<MAX_WIDTH;y++){
    for(int i=0;i<MAX_HEIGHT;i++){
    printf("%c",map->field[y][i]);

    if(i==MAX_HEIGHT-1)printf("\n");
    }
}
}

int main(){

map_object map_object = {MAX_HEIGHT,MAX_WIDTH};


/*init_map(&map_object);
map_print(&map_object);*/
  MessageBox(
        NULL,                      // 親ウィンドウのハンドル (今回はなし)
        "Hello, Windows API!",     // 本文
        "API Test",                // タイトル
        MB_OK | MB_ICONINFORMATION // ボタンとアイコンの種類
    );
return 0;
}