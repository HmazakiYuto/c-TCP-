#define _WINSOCK_DEPRECATED_NO_WARNINGS
#include <stdio.h>
#include <winsock2.h>

#pragma comment(lib, "ws2_32.lib")

int main() {
    WSADATA wsaData;
    SOCKET serverSocket, clientSocket;
    struct sockaddr_in serverAddr, clientAddr;
    int addrLen = sizeof(clientAddr);
    char buffer[1024];
    int recvLen;

    // Winsock初期化
    if (WSAStartup(MAKEWORD(2, 0), &wsaData) != 0) {
        printf("WSAStartup failed\n");
        return 1;
    }

    // ソケット作成
    serverSocket = socket(AF_INET, SOCK_STREAM, 0);
    if (serverSocket == INVALID_SOCKET) {
        printf("Socket creation failed\n");
        WSACleanup();
        return 1;
    }

    // アドレス構造体の設定
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_addr.s_addr = INADDR_ANY;
    serverAddr.sin_port = htons(12345); // ポート番号12345

    // バインド
    if (bind(serverSocket, (struct sockaddr*)&serverAddr, sizeof(serverAddr)) == SOCKET_ERROR) {
        printf("Bind failed\n");
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }

    // リッスン
    if (listen(serverSocket, 1) == SOCKET_ERROR) {
        printf("Listen failed\n");
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }
    printf("サーバ起動。接続待ち...\n");

    // クライアントからの接続を受け付け
    clientSocket = accept(serverSocket, (struct sockaddr*)&clientAddr, &addrLen);
    if (clientSocket == INVALID_SOCKET) {
        printf("Accept failed\n");
        closesocket(serverSocket);
        WSACleanup();
        return 1;
    }
    printf("クライアント接続\n");

    // データ受信
    recvLen = recv(clientSocket, buffer, sizeof(buffer) - 1, 0);
    if (recvLen > 0) {
        buffer[recvLen] = '\0';
        printf("受信: %s\n", buffer);
        // 応答を送信
        send(clientSocket, "Hello from server!", 18, 0);
    }

    // ソケットクローズ
    closesocket(clientSocket);
    closesocket(serverSocket);
    WSACleanup();
    printf("サーバ終了\n");
    return 0;
}
