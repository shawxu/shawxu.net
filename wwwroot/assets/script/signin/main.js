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

    const suF = doc["signinForm"] || doc.getElementById("signinFm");
    if (typeof suF != "object" || suF.tagName != 'FORM') {
      throw new Error("找不到核心表单");
    }

    function submitHandler(evt) {
      cp.info("signin form submit...");
      if ("object" == typeof evt && evt.target && evt.target.tagName == "FORM") {
        setTimeout(() => {
          cp.info("异步处理表单开始");
          registerProcess(suF);
        }, 0);
        
      }
      evt.preventDefault();
    }

    function inputCheck(eleFm) {
      if (eleFm.email.value.trim().match(EMAIL_REXP)) {
        cp.info("邮箱名正确");
      } else {
        cp.error("错误的邮箱名格式");
        return false;
      }

      const sPwd = doc.getElementById("signPwd");
      const sRPwd = doc.getElementById("signRePwd");

      if ("object" == typeof sPwd && sPwd.tagName == "INPUT" && "object" == typeof sRPwd && sRPwd.tagName == "INPUT") {
        cp.info("密码元素存在");
      } else {
        cp.error("密码元素不存在");
        return false;
      }

      if (sPwd.value.trim().length >= MIN_PWD_LEN) {
        cp.info("密码合法");
      } else {
        cp.error("密码不够长");
        return false;
      }

      if (sPwd.value.trim() === sRPwd.value.trim()) {
        cp.info("密码确认一致");
      } else {
        cp.error("密码确认不一致");
        return false;
      }

      return true;
    }

    function registerProcess(eleFm) {
      if (!inputCheck(eleFm)) {
        cp.error("输入检查未通过，提交中止");
        return;
      }
      
      let uri, sig, tout, bd;

      try {
        uri = new URL(eleFm.action);
      } catch(err) {
        console.error(err);
        return;
      }

      sig = new AbortController();
      tout = setTimeout(() => {
        sig.abort();
        console.error("Fetch 15s timeout.");
      }, 15000);

      bd = new URLSearchParams();
      bd.append("email", eleFm.email.value.trim());
      bd.append("pwd", sha1(doc.getElementById("signPwd").value.trim(), true));

      fetch(uri, {
        "method": "POST",
        "priority": "low",
        "mode": "cors",
        "signal": sig.signal,
        "body": bd
      }).then(resp => {
        return resp.json();

      }).then(dt => {
        if(dt && dt.code === 0) {
          console.info(dt.msg);
          doc.querySelector(".toast-body").textContent = dt.msg;
          toastBootstrap.show();
        }
      }).catch(err => {
        console.error("Response Exception:\n", err);
      }).finally(() => {
        clearTimeout(tout);
      });
      
    }

    suF.addEventListener("submit", submitHandler);
  });
});