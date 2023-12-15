'use strict';
{
  const D = document;
  //const W = window;

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
//=====================
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
        //cpRefer.info(JSON.stringify(dt));
        if(dt && dt.code === 0) {
          console.info(dt.msg);

        }
      }).catch(err => {
        console.error("Response Exception:\n", err);
      }).finally(() => {
        clearTimeout(o);
      });

//================================================
    }
  }

  ef.addEventListener("submit", submitHandler);
}