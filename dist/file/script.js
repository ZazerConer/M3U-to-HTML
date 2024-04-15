/** Convert M3U playlist to HTML (JS) **/

  async function M3U_load(target) {
    await fetch(target)
    .then(res => res.text())
    .then(data => {
       convertPlaylist(data);
    })
    .catch(err => console.error(err));
  }

  function insertChannel(logo, name, url) {
    const containerList = document.querySelector(".container-playlist");
    const channelList = document.createElement("div");
    const channelLogo = document.createElement("img");
    const channelName = document.createElement("span");

    channelList.classList.add("content-list");
    channelList.setAttribute("data-name", name);
    channelList.setAttribute("data-url", url);

    channelLogo.src = logo;
    channelName.textContent = name;
    
    channelList.appendChild(channelLogo);
    channelList.appendChild(channelName);
    containerList.appendChild(channelList);
  }

  function convertPlaylist(data) {
    let lines = data.split("\n");
    let channelLogo = "";
    let channelName = "";
    let channelUrl = "";

    for (const exp of lines) {
      const m3u = exp.match(/#EXTM3U/g),
            kdp = exp.match(/#KODIPROP/g),
            opt = exp.match(/#EXTVLCOPT/g);

      const ext = exp
         .replace(exp.split(m3u)[1], "").replace(m3u, "")
         .replace(exp.split(kdp)[1], "").replace(kdp, "")
         .replace(exp.split(opt)[1], "").replace(opt, "");

      if (ext.startsWith("#EXTINF")) {
        const logo = ext.split(/tvg-logo=(?<scope>"[^"]*")/g)[1];
        channelLogo = logo.replace(/["]/g, "");

        const tvgId = ext.split(/tvg-id=(?<scope>"[^"]*")/g)[1],id = ext.match("tvg-id="),
              tvgNm = ext.split(/tvg-name=(?<scope>"[^"]*")/g)[1],nm = ext.match("tvg-name="),
              tvgLg = ext.split(/tvg-logo=(?<scope>"[^"]*")/g)[1],lg = ext.match("tvg-logo="),
              tvgSh = ext.split(/tvg-shift=(?<scope>"[^"]*")/g)[1],sh = ext.match("tvg-shift="),
              tvgGp = ext.split(/group-title=(?<scope>"[^"]*")/g)[1],gp = ext.match("group-title="),
              useAg = ext.split(/user-agent=(?<scope>"[^"]*")/g)[1],ug = ext.match("user-agent="),
              chNum = ext.split(/ch-number=(?<scope>"[^"]*")/g)[1],nb = ext.match("ch-number="),
              tvgCn = ext.split(/tvg-chno=(?<scope>"[^"]*")/g)[1],cn = ext.match("tvg-chno="),
              cName = ext.replace(tvgId, "").replace(id, "")
                         .replace(tvgNm, "").replace(nm, "")
                         .replace(tvgLg, "").replace(lg, "")
                         .replace(tvgSh, "").replace(sh, "")
                         .replace(tvgGp, "").replace(gp, "")
                         .replace(useAg, "").replace(ug, "")
                         .replace(chNum, "").replace(nb, "")
                         .replace(tvgCn, "").replace(cn, "")
                         .replace("#EXTINF:-1", "").replace(/[\s,]/g, "");

        channelName = cName
          .replace(/[_]/g, " ").replace(/[&]/g, " & ").trim()
          .replace(/\w\S*/g, function(str){return str.charAt(0).toUpperCase() + str.substr(1)})
          .replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
          .replace("(", " (").replace(")", ") ").replace("[", " [").replace("]", "] ");
      } else if (ext.trim() !== "") {
        channelUrl = ext.trim();
        insertChannel(channelLogo, channelName, channelUrl);
      }
    }
    document.addEventListener("DOMContentLoaded", playlistTrigger());
  }

  function playlistTrigger() {
    const content = document.querySelectorAll(".content-list");
    const container = document.querySelector(".container-playlist");
    const closeBtn = document.querySelector(".close-player");
    const player = document.querySelector("#player");
    const video = videojs("video");

    for (const channel of content) {
       const name = channel.getAttribute("data-name");
       const url = channel.getAttribute("data-url");

       if (name.match("undefined") || name.match("null") || name === "") {
         channel.style.display = "none";
       } else {
         channel.style.display = "flex";
       }

       if (url.match(/https:/g) || url.match(/http:/g)) {
         channel.style.display = "flex";
       } else if (name.match("undefined") || name.match("null") || name === "") {
         channel.style.display = "none";
       } else {
         channel.style.display = "none";
       }

       channel.addEventListener("click", (e)=> {
         e.preventDefault();
          mediaPlayed();
          Object.assign(player.style, {
             display: "flex",
             visibility: "visible",
             zIndex: "100"
          });
          container.style.overflow = "hidden";
       });

       closeBtn.addEventListener("click", (e)=> {
         e.preventDefault();
          video.pause();
          Object.assign(player.style, {
             display: "none",
             visibility: "hidden",
             zIndex: "0"
          });
          container.style.overflow = "scroll";
       });
 
       function mediaPlayed() {
         video.src({
           src: url,
           type: types()
         });
         video.load();
         video.reloadSourceOnError({
           getSource: function(reload) {
             reload({
               src: url,
               type: types()
             });
           },
           errorInterval: 5
         });
         video.hlsQualitySelector();
       }

       function types() {
         if (url.match(/.m3u8/g)) {
           return "application/x-mpegURL" || "application/vnd.apple.mpegurl";
         } else if (url.match(/.mpd/g)) {
           return "application/dash+xml";
         } else if (url.match(/.mp4/g)) {
           return "video/mp4";
         } else if (url.match(/.mkv/g)) {
           return "video/webm";
         } else if (url.match(/.mp3/g)) {
           return "audio/mpeg";
         } else { // Default
           return "video/mp4";
         }
       }

       const loader = document.querySelector("#preloader");
       if (channel.style.display === "flex") {
         Object.assign(loader.style, {
        	display: "none",
            visibility: "hidden",
            zIndex: "0"
         });
       }
     }
  }
