<template>
  <div class="video-box">
    <video v-show="decodeMode === 'video'" ref="videoRef" class="video"></video>
    <canvas
      v-show="decodeMode !== 'video'"
      ref="canvasRef"
      class="canvas"
    ></canvas>
  </div>
</template>
<script>
const DEFAULT_OPTIONS = {
  /** 用户名，因为 rtsp 拉流需要鉴权，因此需要用户名和密码。 */
  username: "",
  /** 密码 */
  password: "",
  channel: "",
  /** 代表码流类型（0：主码流，1：辅码流 1，2：辅码流 2） */
  subtype: "",
  ip: "",
  port: "",
};

export default {
  props: {
    options: {
      type: Object,
      default: () => DEFAULT_OPTIONS,
    },
  },
  data() {
    return {
      decodeMode: "video",
      player: null,
      canvasSon: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initPlayer();
    },
    handleLogin() {
      const { options } = this;
      // RPC.login(options.username, options.password, false).then((res) => {

      // })
    },
    initPlayer() {
      if (this.player) {
        this.player.stop();
        this.player.close();
      }
      const { options } = this;
      const playerOptions = {
        wsURL: `ws://${options.ip}:${options.port}/rtspoverwebsocket`,
        rtspURL: `rtsp://${options.ip}:${options.port}/cam/realmonitor?channel=${options.channel}&subtype=${options.subtype}&proto=Private3`,
        username: options.username,
        password: options.password,
        lessRateCanvas: true,
      };
      const player = new PlayerControl(playerOptions);

      player.on("WorkerReady", () => {
        player.connect();
      });
      player.on("MSEResolutionChanged", (e) => {
        console.log(e);
      });
      player.on("PlayStart", (e) => {
        console.log(e);
      });
      player.on("DecodeStart", (e) => {
        console.log(e);
        this.decodeMode = e.decodeMode;
        this.canvasSon = new PluginCanvasES6();

        // this.canvasSon.init(this.$refs.canvasRef, (data) => {
        //   console.log("data :>> ", data);
        // });
        // this.canvasSon.addChangeShapeEvent();
      });
      player.on("GetFrameRate", (e) => {
        console.log(`GetFrameRate: ${e}`);
      });
      player.on("FrameTypeChange", (e) => {
        console.log(`FrameTypeChange: ${e}`);
      });
      player.on("Error", (e) => {
        console.log(`Error:`, e);
      });
      player.init(this.$refs.canvasRef, this.$refs.videoRef); // 初始化播放器

      this.player = player;
    },
  },
};
</script>
<style lang="scss" scoped>
.video,
.canvas {
  width: 500px;
  height: 300px;
  border: 1px solid #396cd8;
  background-color: #0f0f0f98;
}
</style>
