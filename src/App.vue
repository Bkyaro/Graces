<template>
  <div id="app">
    <div>
      <Loading v-if="loading" />

      <div class="main-container">
        <Navigator />

        <div class="first">
          <h2>The</h2>
          <h1>THREE GRACES</h1>
          <p>
            Antonio Canova’s statue The Three Graces is a Neoclassical
            sculpture, in marble, of the mythological three Charites, daughters
            of Zeus – identified on some engravings of the statue as, from left
            to right, Euphrosyne, Aglaea and Thalia – who were said to represent
            youth/beauty (Thalia), mirth (Euphrosyne), and elegance (Aglaea).
            The Graces presided over banquets and gatherings, to delight the
            guests of the gods.
          </p>
        </div>

        <div class="section second">
          <div class="second-container">
            <ul>
              <li id="aglaea" class="active">Aglaea</li>
              <li id="thalia"><a>Thalia</a></li>
              <li id="euphre">Euphre</li>
            </ul>
            <p id="content">
              She was venerated as the goddess of beauty, splendor, glory,
              magnificence, and adornment. She is the youngest of the Charites
              according to Hesiod. Aglaea is one of three daughters of Zeus and
              either the Oceanid Eurynome, or of Eunomia, the goddess of good
              order and lawful conduct.
            </p>
          </div>
          <div id="canvas-container-details"></div>
        </div>

        <div class="third">
          <h1>The Making</h1>
          <p>
            Canova's assistants roughly blocked out the marble, leaving Canova
            to perform the final carving and shape the stone to highlight the
            Graces soft flesh. This was a trademark of the artist, and the piece
            shows a strong allegiance to the Neo-Classical movement in
            sculpture, of which Canova is the prime exponent.<br /><br />
            The three goddesses are shown nude, huddled together, their heads
            almost touching in what many have referred to as an erotically
            charged piece. They stand, leaning slightly inward — perhaps
            discussing a common issue, or simply enjoying their closeness. Their
            hair-styles are similar, braided atop their heads.
          </p>
        </div>
        <div id="canvas-container" class="fixed"></div>
        <h4 class="footer">
          Created by Anderson Mancini based on
          <a
            href="https://dribbble.com/shots/6767548-The-Three-Graces-Concept"
            target="_blank"
            >Tom Bogner Design</a
          >.
          <a
            href="https://sketchfab.com/3d-models/3d-printable-the-three-graces-58e0ae19e2984b86883edc41bf43415a"
            target="_blank"
            >Free model credits</a
          >
        </h4>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./components/Loading.vue";
import Navigator from "./components/Navigator.vue";
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
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default {
  data() {
    return {
      loading: true,
      // showMainContainer: false, // 控制主容器显示
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
      container: null,
      containerDetails: null,
      fillLight: null,
      sunLight: null,
      customCursor: null,
    };
  },
  components: {
    Loading,
    Navigator,
  },
  mounted() {
    this.init();
  },
  created() {
    window.addEventListener("resize", this.resizeHandler);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeHandler);
  },
  methods: {
    // 初始化方法，包括加载管理器、渲染器配置、场景创建等
    init() {
      console.log("mounted!");
      // LOADING MANAGER
      const looadingCover = document.getElementById("loading-text-intro");

      console.log("looadingCover", looadingCover);
      const loadingManager = new LoadingManager();

      loadingManager.onLoad = () => {
        document.querySelector(".main-container").style.visibility = "visible";
        document.querySelector(".main-container").style.display = "block";
        document.querySelector("body").style.overflow = "auto";

        const yPosition = { y: 0 };

        new TWEEN.Tween(yPosition)
          .to({ y: 100 }, 900)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
          .onUpdate(function () {
            looadingCover.style.setProperty(
              "transform",
              `translate( 0, ${yPosition.y}%)`
            );
          })
          .onComplete(function () {
            TWEEN.remove(this);
          });
        this.introAnimation();
        this.loading = false;

        window.scroll(0, 0);
      };

      //DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/assets/draco/");
      dracoLoader.setDecoderConfig({ type: "js" });
      const loader = new GLTFLoader(loadingManager);
      loader.setDRACOLoader(dracoLoader);

      // DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
      this.container = document.getElementById("canvas-container");
      this.containerDetails = document.getElementById(
        "canvas-container-details"
      );

      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.scene = new Scene();

      // RENDERER CONFIG
      this.renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      this.renderer.autoClear = true;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      this.renderer.setSize(this.width, this.height);
      this.renderer.outputEncoding = sRGBEncoding;
      this.container.appendChild(this.renderer.domElement);

      this.renderer2 = new WebGLRenderer({ antialias: false });
      this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      this.renderer2.setSize(this.width, this.height);
      this.renderer2.outputEncoding = sRGBEncoding;
      this.containerDetails.appendChild(this.renderer2.domElement);

      this.cameraGroup = new Group();
      this.scene.add(this.cameraGroup);

      this.camera = new PerspectiveCamera(35, this.width / this.height, 1, 100);
      this.camera.position.set(19, 1.54, -0.1);
      this.cameraGroup.add(this.camera);

      this.camera2 = new PerspectiveCamera(
        35,
        this.containerDetails.clientWidth / this.containerDetails.clientHeight,
        1,
        100
      );
      this.camera2.position.set(1.9, 2.7, 2.7);
      this.camera2.rotation.set(0, 1.1, 0);
      this.scene.add(this.camera2);

      //Lights
      this.sunLight = new DirectionalLight(0x435c72, 0.08);
      this.sunLight.position.set(-100, 0, -100);
      this.scene.add(this.sunLight);

      this.fillLight = new PointLight(0x88b2d9, 2.7, 4, 3);
      this.fillLight.position.set(30, 3, 1.8);
      this.scene.add(this.fillLight);

      // load module
      loader.load("/assets/models/gltf/graces-draco2.glb", (gltf) => {
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            this.oldMaterial = obj.material;
            obj.material = new MeshPhongMaterial({
              shininess: 45,
            });
          }
        });
        this.scene.add(gltf.scene);
        this.clearScene();
      });

      document.getElementById("aglaea").addEventListener("click", () => {
        console.log("this", this);
        document.getElementById("aglaea").classList.add("active");
        document.getElementById("euphre").classList.remove("active");
        document.getElementById("thalia").classList.remove("active");
        document.getElementById("content").innerHTML =
          "She was venerated as the goddess of beauty, splendor, glory, magnificence, and adornment. She is the youngest of the Charites according to Hesiod. Aglaea is one of three daughters of Zeus and either the Oceanid Eurynome, or of Eunomia, the goddess of good order and lawful conduct.";
        this.animateCamera({ x: 1.9, y: 2.7, z: 2.7 }, { y: 1.1 });
      });

      document.getElementById("thalia").addEventListener("click", () => {
        document.getElementById("thalia").classList.add("active");
        document.getElementById("aglaea").classList.remove("active");
        document.getElementById("euphre").classList.remove("active");
        document.getElementById("content").innerHTML =
          "Thalia, in Greek religion, one of the nine Muses, patron of comedy; also, according to the Greek poet Hesiod, a Grace (one of a group of goddesses of fertility). She is the mother of the Corybantes, celebrants of the Great Mother of the Gods, Cybele, the father being Apollo, a god related to music and dance. In her hands she carried the comic mask and the shepherd’s staff.";
        this.animateCamera({ x: -0.9, y: 3.1, z: 2.6 }, { y: -0.1 });
      });

      document.getElementById("euphre").addEventListener("click", () => {
        document.getElementById("euphre").classList.add("active");
        document.getElementById("aglaea").classList.remove("active");
        document.getElementById("thalia").classList.remove("active");
        document.getElementById("content").innerHTML =
          'Euphrosyne is a Goddess of Good Cheer, Joy and Mirth. Her name is the female version of a Greek word euphrosynos, which means "merriment". The Greek poet Pindar states that these goddesses were created to fill the world with pleasant moments and good will. Usually the Charites attended the goddess of beauty Aphrodite.';
        this.animateCamera({ x: -0.4, y: 2.7, z: 1.9 }, { y: -0.6 });
      });

      this.clock = new Clock();
      this.previousTime = 0;

      this.renderLoop();

      document.addEventListener(
        "mousemove",
        (event) => {
          event.preventDefault();

          this.cursor.x = event.clientX / window.innerWidth - 0.5;
          this.cursor.y = event.clientY / window.innerHeight - 0.5;

          this.handleCursor(event);
        },
        false
      );

      // DISABLE RENDERER BASED ON CONTAINER VIEW
      const watchedSection = document.querySelector(".second");

      const ob = new IntersectionObserver(this.obCallback, {
        threshold: 0.05,
      });

      ob.observe(watchedSection);

      const btn = document.querySelectorAll("nav > .a");
      this.customCursor = document.querySelector(".cursor");

      btn.forEach((b) => b.addEventListener("mousemove", this.update));
      btn.forEach((b) => b.addEventListener("mouseleave", this.update));
    },
    // 鼠标移动事件处理
    handleMouseMove(event) {
      // 鼠标移动事件处理相关代码
    },
    // 清除场景
    clearScene() {
      this.oldMaterial.dispose();
      this.renderer.renderLists.dispose();
    },

    // ANIMATE CAMERA
    animateCamera(position, rotation) {
      new TWEEN.Tween(this.camera2.position)
        .to(position, 1800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this);
        });
      new TWEEN.Tween(this.camera2.rotation)
        .to(rotation, 1800)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this);
        });
    },
    // 渲染循环函数
    renderLoop() {
      TWEEN.update();

      if (this.secondContainer) {
        this.renderer2.render(this.scene, this.camera2);
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      const elapsedTime = this.clock.getElapsedTime();
      const deltaTime = elapsedTime - this.previousTime;
      this.previousTime = elapsedTime;

      const parallaxY = this.cursor.y;
      this.fillLight.position.y -=
        (parallaxY * 9 + this.fillLight.position.y - 2) * deltaTime;

      const parallaxX = this.cursor.x;
      this.fillLight.position.x +=
        (parallaxX * 8 - this.fillLight.position.x) * 2 * deltaTime;

      this.cameraGroup.position.z -=
        (parallaxY / 3 + this.cameraGroup.position.z) * 2 * deltaTime;
      this.cameraGroup.position.x +=
        (parallaxX / 3 - this.cameraGroup.position.x) * 2 * deltaTime;

      requestAnimationFrame(this.renderLoop);
    },

    // obCallback
    obCallback(payload) {
      if (payload[0].intersectionRatio > 0.05) {
        this.secondContainer = true;
      } else {
        this.secondContainer = false;
      }
    },
    // 处理游标
    handleCursor(e) {
      const x = e.clientX;
      const y = e.clientY;
      this.customCursor.style.cssText = `left: ${x}px; top: ${y}px;`;
    },
    // resize
    resizeHandler() {
      this.camera.aspect =
        this.container.clientWidth / this.container.clientHeight;
      this.camera.updateProjectionMatrix();

      this.camera2.aspect =
        this.containerDetails.clientWidth / this.containerDetails.clientHeight;
      this.camera2.updateProjectionMatrix();

      this.renderer.setSize(
        this.container.clientWidth,
        this.container.clientHeight
      );
      this.renderer2.setSize(
        this.containerDetails.clientWidth,
        this.containerDetails.clientHeight
      );

      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      this.renderer2.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    },
    // INTRO CAMERA ANIMATION USING TWEEN
    introAnimation() {
      new TWEEN.Tween(this.camera.position.set(0, 4, 2.7))
        .to({ x: 0, y: 2.4, z: 8.8 }, 3500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
        .onComplete(function () {
          TWEEN.remove(this);
          document.querySelector(".header").classList.add("ended");
          document.querySelector(".first>p").classList.add("ended");
        });
    },
  },
};
</script>


<style src="./app.css"></style>
