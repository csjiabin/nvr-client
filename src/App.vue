<template>
  <div class="container">
    <h1>Welcome to NVR!</h1>
    <form class="form">
      <div>
        <label for="username">用户名</label>
        <input id="username" v-model="options.username" />
      </div>
      <div>
        <label for="password">密码</label>
        <input id="password" v-model="options.password" />
      </div>
      <div>
        <label for="ip">ip</label>
        <input id="ip" v-model="options.ip" />
      </div>
      <div>
        <label for="port">port</label>
        <input id="port" v-model="options.port" />
      </div>
      <div>
        <label for="channel">通道</label>
        <input id="channel" v-model="options.channel" />
      </div>
      <div>
        <label for="subtype">码流类型</label>
        <select id="subtype" v-model="options.subtype">
          <option value="0">主码流</option>
          <option v-for="i in 5" :key="i" :value="i">辅码流 {{ i }}</option>
        </select>
      </div>
      <div>
        <label></label>
        <button @click="handleSetting">设置播放</button>
      </div>
    </form>
    <hr style="width: 100%" />
    <div class="video-wrap">
      <div class="video-box">
        <h2>大华 SDK</h2>
        <DahuaVideo ref="videoRef" :options="options" />
      </div>
      <div class="video-box">
        <h2>EasyPlayer</h2>
        <EasyPlayer class="easyPlayer" ref="easyPlayer" :video-url="rtspURL" live />
      </div>
    </div>
  </div>
</template>
<script>
// import VConsole from 'vconsole';
import EasyPlayer from '@easydarwin/easyplayer';
import DahuaVideo from './components/DahuaVideo.vue';

export default {
  components: {
    EasyPlayer,
    DahuaVideo,
  },
  data() {
    return {
      // vConsole: new VConsole(),
      options: {
        ip: '172.30.1.234',
        port: 18554,
        subtype: '0',
        channel: '1',
        username: 'admin',
        password: 'admin',
      },
    };
  },
  computed: {
    rtspURL({ options }) {
      return `rtsp://${options.ip}:${options.port}/cam/realmonitor?channel=${options.channel}&subtype=${options.subtype}&proto=Private3`;
    },
  },
  methods: {
    handleSetting(e) {
      e.preventDefault();
      this.$refs.videoRef.init();
      this.$refs.easyPlayer.initPlayer();
    },
  },
};
</script>
<style scoped lang="scss">
.container {
  margin: 0;
  padding-top: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.form {
  padding-right: 80px;
  div {
    margin-bottom: 10px;
  }
  label {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 10px;
  }
  input,
  button,
  select {
    height: 40px;
    width: 300px;
  }
}
.video-wrap {
  display: flex;
  .video-box {
    margin: 5px;
    .easyPlayer {
      width: 500px !important;
      height: 300px !important;
      border: 1px solid #396cd8;
    }
  }
}
</style>
