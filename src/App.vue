<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { createSocket } from '@/api/websocket.js';
import { mapState } from 'vuex';
export default {
  name: 'App',
  created() {},
  destroyed() {
    this.closeWebSocket();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  mounted() {
    // 创建 websocket 链接
    // this.createWebsocket();
  },
  created() {
    // createSocket('ws://127.0.0.1:10086');
    createSocket('wss://www.oldgerry.com/webSocket/');
  },
  methods: {
    // // 创建 websocket 链接
    // createWebsocket() {
    //   console.log('创建连接');
    //   const httpURL = 'ws://127.0.0.1:10086';
    //   this.websocket = new WebSocket(httpURL);
    //   // 连接发生错误的回调方法
    //   this.websocket.onerror = this.websocketOnerror;
    //   // 连接成功建立的回调方法
    //   this.websocket.onopen = this.websocketOnopen;
    //   // 接收到消息的回调方法
    //   this.websocket.onmessage = this.websocketOnmessage;
    //   // 连接关闭的回调方法
    //   this.websocket.onclose = this.websocketOnclose;
    //   // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    //   this.websocket.onbeforeunload = this.websocketOnbeforeunload;
    // },
    // // 连接发生错误的回调方法
    // websocketOnerror() {
    //   console.log('连接发生错误的回调方法');
    // },
    // // 连接成功建立的回调方法
    // websocketOnopen() {
    //   console.log('连接成功建立的回调方法');
    //   var params = {
    //     action: 1,
    //     userId: '123'
    //   };
    //   var json = JSON.stringify(params);
    //   this.websocket.send(json);
    // },
    // // 接收到消息的回调方法
    // websocketOnmessage(event) {
    //   console.log('接收到消息的回调方法', event);
    // },
    // // 发送消息的回调方法'
    // websocketsend(message) {
    //   console.log('发送消息的回调方法', message);
    //   this.websocket.send(message);
    // },
    // // 连接关闭的回调方法
    // websocketOnclose() {
    //   console.log('连接关闭的回调方法');
    // },
    // // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常
    // websocketOnbeforeunload() {
    //   this.closeWebSocket();
    //   console.log(
    //     '监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常'
    //   );
    // },
    // // 关闭WebSocket连接
    // closeWebSocket() {
    //   this.websocket.close();
    // }
  }
};
</script>
<style>
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
