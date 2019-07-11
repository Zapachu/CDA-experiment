const SCHOOL = {
  none: 0,
  beijingUni: 1,
  qinghuaUni: 2,
  renminUni: 3,
  fudanUni: 4,
  shangjiaoUni: 5,
  zhejiangUni: 6,
  nanjingUni: 7,
  wuhanUni: 8,
  huakeUni: 9,
  nankaiUni: 10,
  xiamenUni: 11,
  zhongshanUni: 12
};
const UNI_LETTER = {
  [SCHOOL.beijingUni]:
    "已经被$北京大学$录取，我们比隔壁清华多13年历史，我们的食堂全国第一。",
  [SCHOOL.qinghuaUni]:
    "已经被$清华大学$录取，你会有一个豪华学长团，习近平、胡锦涛、邓稼先、杨振宁，有他们成为你前进的动力。",
  [SCHOOL.renminUni]:
    "已经被$中国人民大学$录取，我们是人民的大学，你和强东是校友。",
  [SCHOOL.fudanUni]:
    "已经被$复旦大学$录取，欢迎你来到魔都享受大学时光，这是最好的大学，也是最好的城市，这是你的小时代。",
  [SCHOOL.shangjiaoUni]:
    "已经被$上海交通大学$录取，我们不是只有交通专业！不是只有交通专业！不是只有交通专业！重要事情说三遍。",
  [SCHOOL.zhejiangUni]:
    "已经被$浙江大学$录取，上有天堂，下有苏杭，这里不仅有马爸爸的阿里巨头，还有网易丁磊的养猪场。",
  [SCHOOL.nanjingUni]:
    "已经被$南京大学$录取，我们坐落于六朝古都，我们帅哥美女比浙大多。",
  [SCHOOL.wuhanUni]:
    "已经被$武汉大学$录取，听说其他大学都在晒校友，那我们也就随便推一个，小米雷军。",
  [SCHOOL.huakeUni]:
    "已经被$华中科技大学$录取，顺便说一句，你们人人都用的微信，就是我校校友张小龙的产品，低调、低调！",
  [SCHOOL.nankaiUni]:
    "已经被$南开大学$录取，我校在天津！天津！天津在南方城市！周恩来总理是你的学长，德云社总部就在你隔壁。",
  [SCHOOL.xiamenUni]:
    "已经被$厦门大学$录取，欢迎你来到全国最美大学，没有之一，不接受反驳。",
  [SCHOOL.zhongshanUni]:
    "已经被$中山大学$录取，咱们再广州、珠海、深圳都有校区，三个城市任你选，对了，福建人不好吃。"
};
const UNI_IMG = {
  [SCHOOL.beijingUni]: "beijingUni.png",
  [SCHOOL.qinghuaUni]: "qinghuaUni.png",
  [SCHOOL.renminUni]: "renminUni.png",
  [SCHOOL.fudanUni]: "fudanUni.png",
  [SCHOOL.shangjiaoUni]: "shangjiaoUni.png",
  [SCHOOL.zhejiangUni]: "zhejiangUni.png",
  [SCHOOL.nanjingUni]: "nanjingUni.png",
  [SCHOOL.wuhanUni]: "wuhanUni.png",
  [SCHOOL.huakeUni]: "huakeUni.png",
  [SCHOOL.nankaiUni]: "nankaiUni.png",
  [SCHOOL.xiamenUni]: "xiamenUni.png",
  [SCHOOL.zhongshanUni]: "zhongshanUni.png"
};
const PREFIX = window.location.href.split("result")[0] + "result/static/";
const SHARE_URL = getShareUrl();

const isWechat = checkWechat();
if (isWechat) {
  initWechat().catch(err => {
    console.log(err);
    alert("微信sdk加载出错");
  });
} else {
  loadScript(PREFIX + "qrcode.min.js").then(() => {
    window.QRCode.toDataURL(SHARE_URL + `?userId=${window._userId}`, function(
      err,
      url
    ) {
      if (err) {
        return console.log("qrcode加载出错");
      }
      const shareWx = document.getElementById("shareWx");
      shareWx.src = url;
    });
  });
}

if (window._admission > 0) {
  renderAdmission(window._admission);
} else {
  renderNoAdmission();
}

async function initWechat() {
  if (!window.wx) {
    await loadScript("https://res.wx.qq.com/open/js/jweixin-1.4.0.js");
  }
  const res = await ajax(
    "/wechat/jssdk?url=" + encodeURIComponent(window.location.href)
  );
  if (res.err) {
    return alert("微信加载出错");
  }
  const option = res.msg;
  window.wx.config({
    debug: false,
    appId: option.appId,
    timestamp: option.timestamp,
    nonceStr: option.nonceStr,
    signature: option.signature,
    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
  });
  window.wx.ready(function() {
    let imgUrl;
    if (window._admission) {
      imgUrl = PREFIX + UNI_IMG[window._admission];
    } else {
      imgUrl = PREFIX + "qrcode.jpg";
    }
    window.wx.onMenuShareTimeline({
      title: "平行志愿", // 分享标题
      link: SHARE_URL, // 分享链接
      imgUrl
    });
    window.wx.onMenuShareAppMessage({
      title: "平行志愿", // 分享标题
      desc: "快来填报志愿吧!", // 分享描述
      link: SHARE_URL, // 分享链接
      imgUrl
    });
  });
}

function renderAdmission(admission) {
  const resultLetter = _renderResultLetter(admission);
  const resultImg = _renderResultImg(admission);
  const button = document.getElementsByClassName("button")[0];
  _addEventToButton(button);
  const playContent = document.getElementsByClassName("playContent")[0];
  playContent.insertBefore(resultImg, button);
  playContent.insertBefore(resultLetter, resultImg);
}

function renderNoAdmission() {
  const resultLetter = _renderNoResultLetter();
  const button = document.getElementsByClassName("button")[0];
  _addEventToButton(button);
  const playContent = document.getElementsByClassName("playContent")[0];
  playContent.insertBefore(resultLetter, button);
}

function getShareUrl() {
  if (window.location.search) {
    return window.location.href.split(window.location.search)[0];
  }
  return window.location.href;
}

function checkWechat() {
  return (
    window.navigator.userAgent.toLowerCase().indexOf("micromessenger") > -1
  );
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
      script.onreadystatechange = function() {
        if (
          script.readyState === "loaded" ||
          script.readyState === "complete"
        ) {
          script.onreadystatechange = null;
          resolve();
        }
      };
    } else {
      script.onload = function() {
        resolve();
      };
    }
    script.onerror = function() {
      reject(new Error("script loading failed"));
    };
    script.src = url;
    document.body.appendChild(script);
  });
}

async function ajax(urlOrOptions) {
  if (
    typeof urlOrOptions === "string" ||
    urlOrOptions.method.toLowerCase() === "get"
  ) {
    const url =
      typeof urlOrOptions === "string" ? urlOrOptions : urlOrOptions.url;
    return fetch(url, {
      method: "GET",
      cache: "default",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.json());
  }
  return fetch(urlOrOptions.url, {
    method: urlOrOptions.method,
    cache: "default",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(urlOrOptions.data)
  }).then(response => response.json());
}

function _renderResultLetter(admission) {
  const resultLetter = document.createElement("div");
  resultLetter.classList.add("resultLetter");
  const p1 = document.createElement("p");
  p1.innerText = "恭喜您:";
  const p2 = document.createElement("p");
  const letters = UNI_LETTER[admission].split("$");
  p2.innerHTML = `&nbsp;&nbsp;${letters[0]}<span class="redFont">${
    letters[1]
  }</span>${letters[2]}`;
  resultLetter.appendChild(p1);
  resultLetter.appendChild(p2);
  if (!isWechat) {
    const share = _renderShare();
    resultLetter.append(share);
  }
  return resultLetter;
}

function _renderNoResultLetter() {
  const resultLetter = document.createElement("div");
  resultLetter.classList.add("resultLetter");
  const p1 = document.createElement("p");
  p1.innerText = "很遗憾:";
  const p2 = document.createElement("p");
  p2.innerHTML = "&nbsp;&nbsp;您没能被录取";
  resultLetter.appendChild(p1);
  resultLetter.appendChild(p2);
  if (!isWechat) {
    const share = _renderShare();
    resultLetter.append(share);
  }
  return resultLetter;
}

function _renderShare() {
  const shareBtn = document.createElement("img");
  shareBtn.classList.add("shareBtn");
  shareBtn.src = PREFIX + "share.svg";
  const modal = document.getElementsByClassName("modal")[0];
  shareBtn.addEventListener("click", () => {
    modal.style.visibility = "visible";
  });
  const modalClose = document.getElementsByClassName("modalClose")[0];
  modalClose.addEventListener("click", () => {
    modal.style.visibility = "hidden";
  });
  return shareBtn;
}

function _renderResultImg(admission) {
  const resultImg = document.createElement("img");
  resultImg.classList.add("resultImg");
  resultImg.src = PREFIX + UNI_IMG[admission];
  return resultImg;
}

function _addEventToButton(button) {
  button.addEventListener("click", async () => {
    const url = window.location.href;
    const res = await ajax(url.replace("result", "onceMore"));
    if (res.code) {
      return alert(res.msg);
    }
    window.location.href = res.url;
  });
}
