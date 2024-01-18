requirejs.config({
  baseUrl: "https://s3.shawxu.net/js/lib/",
  paths: {
    domReady: "requirejs/plugins/domReady.2.0.1",
    consolePlus: "console-plus/console-plus.min",
    bootstrap: "bootstrap/bootstrap.bundle.min",
    md5: "/assets/script/lib/md5.amd",
    sha1: "/assets/script/lib/sha1.amd"
  }
});

require([
  "domReady",
  "bootstrap",
  "consolePlus",
  "sha1"
], (dr, bootstrap, cp, sha1) => {
  dr((doc) => {
    cp.info("DOM Ready.");
    const EMAIL_REXP = /^[A-Za-z0-9_-\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/;
    const MIN_PWD_LEN = 6;

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(doc.querySelector("#btsToast"));
    toastBootstrap.show();

    const suF = doc["signupForm"] || doc.getElementById("signupFm");
    if (typeof suF != "object" || suF.tagName != 'FORM') {
      throw new Error("找不到核心表单");
    }

    let submitTimeout;

    function submitHandler(evt) {
      cp.info("signup form submit...");
      if ("object" == typeof evt && evt.target && evt.target.tagName == "FORM") {
        const fm = evt.target;

        if (fm.email.value.trim().match(EMAIL_REXP)) {
          cp.info("邮箱名正确");
        } else {
          cp.error("错误的邮箱名格式");
          evt.preventDefault();
          return;
        }

        const sPwd = doc.getElementById("signPwd");
        const sRPwd = doc.getElementById("signRePwd");

        if ("object" == typeof sPwd && sPwd.tagName == "INPUT" && "object" == typeof sRPwd && sRPwd.tagName == "INPUT") {
          cp.info("密码元素存在");
        } else {
          cp.error("密码元素不存在");
          evt.preventDefault();
          return;
        }

        if (sPwd.value.trim().length >= MIN_PWD_LEN) {
          cp.info("密码合法");
        } else {
          cp.error("密码不够长");
          evt.preventDefault();
          return;
        }

        if (sPwd.value.trim() === sRPwd.value.trim()) {
          cp.info("密码确认一致");
        } else {
          cp.error("密码确认不一致");
          evt.preventDefault();
          return;
        }
        
        fm.pwd.value = sha1(sRPwd.value.trim(), true);
        submitTimeout = setTimeout(submitTimeoutHandler, 10000);
      }  
    }

    function submitTimeoutHandler() {
      cp.error("表单提交服务器超时");
    }

    function messageListener(evt) {
      clearTimeout(submitTimeout);
      cp.info("收到信息", evt.data);
    }

    suF.addEventListener("submit", submitHandler);
    window.addEventListener("message", messageListener);

  });
});