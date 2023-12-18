requirejs.config({
  baseUrl: "https://s3.shawxu.net/js/lib/",
  paths: {
    domReady: "requirejs/plugins/domReady.2.0.1",
    consolePlus: "console-plus/console-plus.min"
  }
});


require(["domReady", "consolePlus"], (domReady, _cp) => {
  domReady(() => {
    //This function is called once the DOM is ready.
    //It will be safe to query the DOM and manipulate
    //DOM nodes in this function.
    _cp.config({
      silent: false //让console-plus能把log打到控制台,其实不用写也可,默认就是flase
      , productName: "cpTest"
    });
    _cp.info("info start", 60);
    _cp.debug("debug hahaha", 1024);
    _cp.inject();
    console.error("lalala", 123);
    console.warn("wowowo", 456);
    console.log("log papapa", 777);
    console.info("info 哈哈哈哈哈", 8888);
    console.debug("debug yyyyy", 999999);

    setTimeout(() => {
      document.querySelector("#txt_out").textContent = _cp.get();
    }, 2000);

    _cp.report({
      clear: false,
      reportUrl: "https://shawxu.cn/log/",
      componentUrl: "console-plus/components/reportr.min"
    });
  });
});

