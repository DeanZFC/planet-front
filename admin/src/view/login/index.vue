<template>
  <div id="body">
    <div class="login">
      <div class="login_left" />
      <div class="login_form">
        <div class="login_form_title">
          <img class="login_form_title_logo" :src="$ADMIN.appLogo" alt />
          <p class="login_form_title_p">{{ $ADMIN.appName }}</p>
        </div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="rules"
          :validate-on-rule-change="false"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              size="large"
              placeholder="请输入用户名"
              suffix-icon="user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              show-password
              size="large"
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="vPicBox">
              <el-input
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                size="large"
                style="flex: 1; padding-right: 20px"
              />
              <div class="vPic">
                <img
                  :src="picPath"
                  alt="请输入验证码"
                  @click="getCaptchaPic()"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              style="width: 46%"
              size="large"
              @click="checkInit"
              >注册</el-button
            >
            <el-button
              type="primary"
              size="large"
              style="width: 46%; margin-left: 8%"
              @click="handleLogin"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/pinia/modules/user";
import { getCaptcha } from "@/api/common.js";
const router = useRouter();

// 获取验证码
const picPath = ref();
const getCaptchaPic = () => {
  getCaptcha().then(({ data }) => {
    picPath.value = data.picPath;
    loginForm.captchaId = data.captchaId;
  });
};

// 登录相关操作
const loginFormRef = ref();
const loginForm = reactive({
  username: "admin",
  password: "123456",
  captcha: "",
  captchaId: "",
});

const rules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }],
  captcha: [{ required: true, trigger: "blur", message: "请输入验证码" }],
});

const userStore = useUserStore();

const handleLogin = () => {
  loginFormRef.value.validate((isValid) => {
    if (isValid) {
      userStore.login(loginForm).then((flag) => {
        if (flag) {
          router.replace({ name: userStore.userInfo.authority.defaultRouter });
        } else {
          getCaptchaPic();
        }
      });
    } else {
      ElMessage({
        type: "error",
        message: "请正确填写登录信息",
        showClose: true,
      });
      getCaptchaPic();
      return false;
    }
  });
};

onMounted(() => {
  getCaptchaPic();
});
</script>

<style lang="scss" scoped>
#body {
  margin: 0;
  padding: 0;
  background-image: url("@/assets/login_background.jpg");
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  .input-icon {
    padding-right: 6px;
    padding-top: 4px;
  }
  .login {
    position: absolute;
    top: 3vh;
    left: 2vw;
    width: 96vw;
    height: 94vh;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .login_left {
      background-image: url("@/assets/login_left.svg");
      background-size: cover;
      width: 40%;
      height: 60%;
      float: left !important;
    }
    .login_form {
      width: 420px;
      background-color: #fff;
      padding: 40px 40px 40px 40px;
      border-radius: 10px;
      box-shadow: 2px 3px 7px rgba(0, 0, 0, 0.2);
      .login_form_title {
        display: flex;
        align-items: center;
        margin: 30px 0;
        .login_form_title_logo {
          width: 90px;
          height: 72px;
        }
        .login_form_title_p {
          font-size: 40px;
          padding-left: 20px;
        }
      }
      .vPicBox {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .vPic {
        width: 33%;
        height: 38px;
        background: #ccc;
        img {
          width: 100%;
          height: 100%;
          vertical-align: middle;
        }
      }
    }
  }
}

//小屏幕不显示右侧，将登录框居中
@media (max-width: 750px) {
  .login_left {
    display: none;
  }
  .login {
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
  }
  .login_form {
    width: 100%;
  }
}
</style>
