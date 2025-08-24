#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <stdio.h>
#include <winsock2.h>

#pragma comment(lib, "ws2_32.lib")

int main() {
    WSADATA wsaData;
    SOCKET sock;
    struct sockaddr_in serverAddr;
    char buffer[1024];
    int recvLen;

    // Winsock初期化
    if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }

    // ソケット作成
    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock == INVALID_SOCKET) {
        printf("Socket creation failed\n");
        WSACleanup();
        return 1;
    }

    // サーバアドレス設定
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = inet_addr("127.0.0.1"); // ローカルホスト
    serverAddr.sin_port = htons(12345); // サーバと同じポート

    // サーバへ接続
    if (connect(sock, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        printf("Connect failed\n");
        closesocket(sock);
        WSACleanup();
        return 1;
    }
    printf("サーバに接続しました\n");

    // メッセージ送信
    send(sock, "Hello from client!", 18, 0);

    // サーバからの応答受信
    recvLen = recv(sock, buffer, sizeof(buffer) - 1, 0);
    if (recvLen > 0) {
        buffer[recvLen] = '\0';
        printf("受信: %s\n", buffer);
    }

    // ソケットクローズ
    closesocket(sock);
    WSACleanup();
    printf("クライアント終了\n");
    return 0;
}
