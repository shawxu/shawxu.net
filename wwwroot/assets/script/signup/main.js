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
  "consolePlus"
], (dr, bootstrap, cp) => {
  dr((doc) => {
    cp.info("DOM Ready.");

    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(doc.querySelector("#btsToast"));
    toastBootstrap.show();

    const suF = doc["signupForm"] || doc.getElementById("signupFm");
    if (typeof suF != "object" || suF.tagName != 'FORM') {
      throw new Error("找不到核心表单");
    }

    function submitHandler(evt) {
      cp.info("signup form submit...");
      if ("object" == typeof evt && evt.target && evt.target.tagName == "FORM") {
        evt.preventDefault();
      }  
    }

    suF.addEventListener("submit", submitHandler);
  });
});