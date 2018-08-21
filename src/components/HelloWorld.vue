<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h3>{{ jestMessage }}</h3>
    <h2>Essential Links</h2>
    <button class="yes" @click="callYes">Yes</button>
    <button class="no" @click="callNo">No</button>
    <input type="text" @keyup.prevent="onKeydown" v-model="quantity" />>
    <ul>
      <li>
        <a href="https://vuejs.org" target="_blank">
              Core Docs
            </a>
      </li>
      <li>
        <a href="https://forum.vuejs.org" target="_blank">
              Forum
            </a>
      </li>
      <li>
        <a href="https://chat.vuejs.org" target="_blank">
              Community Chat
            </a>
      </li>
      <li>
        <a href="https://twitter.com/vuejs" target="_blank">
              Twitter
            </a>
      </li>
      <br>
      <li>
        <a href="http://vuejs-templates.github.io/webpack/" target="_blank">
              Docs for This Template
            </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a href="http://router.vuejs.org/" target="_blank">
              vue-router
            </a>
      </li>
      <li>
        <a href="http://vuex.vuejs.org/" target="_blank">
              vuex
            </a>
      </li>
      <li>
        <a href="http://vue-loader.vuejs.org/" target="_blank">
              vue-loader
            </a>
      </li>
      <li>
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
              awesome-vue
            </a>
      </li>
    </ul>
  </div>
</template>

<script>
  const KEY_DOWN = 40
  const KEY_UP = 38
  const ESCAPE = 27
  const CHAR_A = 65
  export default {
    name: "HelloWorld",
    props: ["jestMessage"],
    data() {
      return {
        msg: "Welcome to Your Vue.js App",
        quantity: 0,
      };
    },
    // watch: {
    //   quantity: function(newValue) {
    //     this.$emit('input', newValue)
    //   }
    // },
    created() {
      this.msg = "bye!";
    },
    methods: {
      callYes() {
        this.jestMessage = "Yes";
      },
      callNo() {
        this.jestMessage = "No";
      },
      increment() {
        this.quantity += 1
      },
      decrement() {
        this.quantity -= 1
      },
      clear() {
        this.quantity = 0
      },
      onKeydown(e) {
        console.log('调用键盘触发事件');
        console.log(e);
        if (e.keyCode === ESCAPE) {
          this.clear()
        }
        if (e.keyCode === KEY_DOWN) {
          this.decrement()
        }
        if (e.keyCode === KEY_UP) {
          this.increment()
        }
        if (e.which === CHAR_A) {
          this.quantity = 13
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1,
  h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
</style>
