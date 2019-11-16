<template>
  <div class="container">
    <div class="title">Login to Access</div>
    <div class="field is-hidden">
      <label class="label">Name</label>
      <div class="control">
        <input id="username" class="input is-large" value="videotube" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input
          id="password"
          v-model="password"
          class="input is-large"
          required
          type="password"
          name="password"
          autocomplete="current-password"
          v-on:keyup.enter="login"
        />
        <span class="icon is-medium is-left">
          <i class="fas fa-envelope"></i>
        </span>
        <span class="icon is-medium is-right">
          <i class="fas fa-check"></i>
        </span>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" @click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      password: ''
    }
  },
  methods: {
    login: function() {
      let password = this.password
      this.$store
        .dispatch('login', { password })
        .then(() => this.$router.push('/browse'))
        .catch()
    }
  }
}
</script>

<style>
.title {
  padding-top: 100px;
}
</style>
