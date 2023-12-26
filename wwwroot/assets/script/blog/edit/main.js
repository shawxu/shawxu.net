'use strict';
{
  const D = document;

  const tst = D.querySelector("#btsToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(tst);


  let ef = D["editForm"] || D.getElementById("editFm");
  if (typeof ef != "object" || ef.tagName != 'FORM') {
    throw new Error("找不到编辑器表单");
  }

  function submitHandler(evt) {
    if ("object" == typeof evt && evt.target && evt.target.tagName == "FORM") {
      evt.preventDefault();

      let fm = evt.target;
      let fd = new FormData(fm);
      let t, s, o;

      try {
        t = new URL(fm.action);
      } catch(err) {
        console.error(err);
        return;
      }

      s = new AbortController();
      o = setTimeout(() => {
        s.abort();
        console.error("Fetch 15s timeout.");
      }, 15000);

      fetch(t, {
        "method": "POST",
        "priority": "low",
        "mode": "cors",
        "signal": s.signal,
        "body": fd
      }).then(resp => {
        return resp.json();

      }).then(dt => {
        if(dt && dt.code === 0) {
          console.info(dt.msg);
          tst.querySelector(".toast-body").textContent = dt.msg;
          toastBootstrap.show();
        }
      }).catch(err => {
        console.error("Response Exception:\n", err);
      }).finally(() => {
        clearTimeout(o);
      });

    }
  }

  ef.addEventListener("submit", submitHandler);

  toastBootstrap.show();
}