#include <stdio.h>
#include <conio.h>  // _kbhit(), _getch()（Windows限定）
#include <stdlib.h>


#define WIDTH 10
#define HEIGHT 6

int main() {
    char maze[HEIGHT][WIDTH + 1] = {
        "#########",
        "#     # #",
        "# ###   #",
        "#   ### #",
        "###     #",
        "#########"
    };

    int px = 1, py = 1;  // プレイヤー位置

    while (1) {
       
        for (int y = 0; y < HEIGHT; y++) {
            for (int x = 0; x < WIDTH; x++) {
                if (x == px && y == py)
                    putchar('@');
                else
                    putchar(maze[y][x]);
            }
            putchar('\n');
        }

        if (_kbhit()) {  // キー入力があれば処理
            char key = _getch();
            int nx = px, ny = py;
            if (key == 'w') ny--;
            if (key == 's') ny++;
            if (key == 'a') nx--;
            if (key == 'd') nx++;

            if (maze[ny][nx] == ' ') {  // 壁でなければ移動
                px = nx;
                py = ny;
            }
        }
         system("cls");  // 画面クリア (Windows) 
    }

    return 0;
}
