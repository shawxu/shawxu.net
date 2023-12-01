'use strict';
{
  const D = document;
  const W = window;

  let ef = D["editForm"] || D.getElementById("editFm");
  if(typeof ef != "object" || ef.tagName != 'FORM'){
    throw new Error("找不到编辑器表单");
  }

  let sbmtH = function(evt){
    console.log("submit me!");
    /*let ifrmHd = D.createElement("iframe");
    ifrmHd.setAttribute("width", "0");
    ifrmHd.setAttribute("height", "0");

    ifrmHd.setAttribute("src", "about:blank");
    ifrmHd.setAttribute("name", "__f_p__");
    ifrmHd.style.cssText = 'width:1px;height:1px;margin:0;padding:0;border:0;';
    let feO = evt.currentTarget;
    feO.after(ifrmHd);
    feO.target = "__f_p__";
    feO.nonscript.value = "JSONP";*/
    
    
    evt.preventDefault();
  };

  ef.addEventListener("submit", sbmtH);
}