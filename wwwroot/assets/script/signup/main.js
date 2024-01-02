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
  });
});