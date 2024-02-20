<template>
  <nav class="header">
    <a class="active a"><span>ART</span></a>
    <a class="a"><span>ABOUT</span></a>
    <a class="a"><span>VISIT</span></a>
    <a class="a"><span>SHOP</span></a>
    <a class="a"><span>SEARCH</span></a>
    <div class="cursor"></div>
  </nav>
</template>

<script>
export default {
  name: "Navigator",
};
</script>

<style scoped>
nav.header .a:hover {
  cursor: pointer;
  color: rgb(175, 175, 175);
  transform: scale(1.1);
}

nav.header .a:hover ~ .cursor {
  transform: translate(-50%, -50%) scale(5);
  opacity: 0.1;
}

.header {
  position: absolute;
  top: -2em;
  left: 0;
  color: #fff;
  font-size: 0.8em;
  width: 100%;
  text-align: center;
  font-family: "Josefin Sans", sans-serif;
  z-index: 2;
  opacity: 0;
  transition: all 1.9s ease-in-out;
  padding: 0;
  margin: 0;
}
.header.ended {
  top: 3em;
  opacity: 1;
}

.header > span {
  padding: 0 3.25em;
  letter-spacing: 0.4em;
  position: relative;
}

.header > span.active:after,
.first {
  position: absolute;
  left: 50%;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}

.header > span.active:after {
  content: "";
  bottom: -10px;
  width: 20px;
  height: 2px;
  background: #fff;
}

.cursor {
  pointer-events: none;
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 10px;
  background-color: #fff;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  mix-blend-mode: difference;
  transition: transform 0.8s ease, opacity 0.6s ease;
  z-index: 2;
}
</style>