<template>
  <div class="container">
    <h1>Welcome to 大华 NVR!</h1>
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
        <label for="channel">通道列表</label>
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

    <DahuaVideo ref="videoRef" :options="options" />
  </div>
</template>
<script>
import DahuaVideo from "./components/DahuaVideo.vue";

export default {
  components: {
    DahuaVideo,
  },
  data() {
    return {
      options: {
        ip: "172.30.1.234",
        port: 18554,
        subtype: "0",
        channel: "1",
        username: "admin",
        password: "admin",
      },
    };
  },
  methods: {
    handleSetting(e) {
      e.preventDefault();
      this.$refs.videoRef.init();
    },
  },
};
</script>
<style scoped lang="scss">
.logo.vite:hover {
  filter: drop-shadow(0 0 2em #747bff);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #249b73);
}
.form {
  display: flex;
  flex-direction: column;
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
    height: 44px;
    width: 300px;
  }
}
</style>
