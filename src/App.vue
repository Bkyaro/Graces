<template>
  <div id="app">
    <div>
      <div class="lds-roller">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div id="loading-text-intro"><p>Loading</p></div>

      <div class="main-container" v-show="showMainContainer">
        <nav class="header">
          <a class="active a"><span>ART</span></a>
          <a class="a"><span>ABOUT</span></a>
          <a class="a"><span>VISIT</span></a>
          <a class="a"><span>SHOP</span></a>
          <a class="a"><span>SEARCH</span></a>
          <div class="cursor"></div>
        </nav>

        <!-- 其他部分 -->
      </div>
    </div>
  </div>
</template>

<script>
import {
  Clock,
  Scene,
  LoadingManager,
  WebGLRenderer,
  sRGBEncoding,
  Group,
  PerspectiveCamera,
  DirectionalLight,
  PointLight,
  MeshPhongMaterial,
} from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  data() {
    return {
      showMainContainer: false, // 控制主容器显示
      oldMaterial: null,
      secondContainer: false,
      width: 0,
      height: 0,
      scene: null,
      renderer: null,
      renderer2: null,
      cameraGroup: null,
      camera: null,
      camera2: null,
      cursor: { x: 0, y: 0 },
      clock: null,
      previousTime: 0,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化方法，包括加载管理器、渲染器配置、场景创建等
    init() {
      // 初始化相关代码
    },
    // 渲染循环函数
    rendeLoop() {
      // 渲染循环相关代码
    },
    // 鼠标移动事件处理
    handleMouseMove(event) {
      // 鼠标移动事件处理相关代码
    },
    // 其他方法
  },
  // 监听窗口大小变化，调整相机和渲染器尺寸等
  watch: {
    $route() {
      // 窗口大小变化监听相关代码
    },
  },
};
</script>


<style src="./app.css"></style>
