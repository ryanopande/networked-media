const mapDiv = document.getElementById("map");

if (mapDiv) {
  // Check URL for ?moment=<id> so we can focus on that pin
  const params = new URLSearchParams(window.location.search);
  const targetId = params.get("moment");

  // Create map centered on NYC
  const map = L.map("map").setView([40.7306, -73.9866], 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);

  // Emoji marker icon
  function createEmojiIcon(emoji, extraClass) {
    return L.divIcon({
      className: ("emoji-marker " + (extraClass || "")).trim(),
      html: `<div class="pin">${emoji}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  // Popups
  const viewPopup = document.getElementById("viewMomentPopup");
  const addPopup = document.getElementById("addMomentPopup");

  // Add-moment form inputs
  const latInput = document.getElementById("latInput");
  const lngInput = document.getElementById("lngInput");

  // View popup elements
  const momentImageWrapper = document.getElementById("momentImageWrapper");
  const momentCaption = document.getElementById("momentCaption");
  const likeButton = document.getElementById("likeButton");
  const likeCount = document.getElementById("likeCount");
  const commentsList = document.getElementById("commentsList");
  const commentForm = document.getElementById("commentForm");
  const commentText = document.getElementById("commentText");
  const commentToggle = document.getElementById("commentToggle");
  const commentCount = document.getElementById("commentCount");
  const commentsBox = document.getElementById("commentsBox");

  let currentMoment = null;
  let tempMarker = null;
  let clickedMarker = false;

  // Open view popup with an existing moment
  function openViewPopup(moment) {
    currentMoment = moment;

    // caption
    momentCaption.textContent = moment.caption || "";

    // image
    momentImageWrapper.innerHTML = "";
    if (moment.image) {
      momentImageWrapper.innerHTML = `<img src="${moment.image}" class="moment-image">`;
    }

    // likes
    likeCount.textContent = moment.likes || 0;

    // comments
    commentsList.innerHTML = "";
    let count = 0;
    if (moment.comments && moment.comments.length) {
      count = moment.comments.length;
      moment.comments.forEach((c) => {
        const li = document.createElement("li");
        li.textContent = c.text;
        commentsList.appendChild(li);
      });
    }
    commentCount.textContent = count;

    // hide comments box by default when opening
    commentsBox.style.display = "none";

    viewPopup.style.display = "block";
    addPopup.style.display = "none";
  }

  // Toggle comments box when comments button is clicked
  commentToggle.addEventListener("click", () => {
    if (commentsBox.style.display == "block") {
      commentsBox.style.display = "none";
    } else {
      commentsBox.style.display = "block";
    }
  });

  // Add markers from server data
  let targetMoment = null;

  momentsFromServer.forEach((moment) => {
    const marker = L.marker([moment.lat, moment.lng], {
      icon: createEmojiIcon("📍"),
    }).addTo(map);

    marker.on("click", () => {
      clickedMarker = true;
      openViewPopup(moment);
    });

    if (targetId && moment._id == targetId) {
      targetMoment = moment;
    }
  });

  // show location pressed from home on map page
  if (targetMoment) {
    map.setView([targetMoment.lat, targetMoment.lng], 15);
    openViewPopup(targetMoment);
  }

  // Click on empty map space to add a new moment
  map.on("click", (e) => {
    if (clickedMarker) {
      // click came from a marker; marker handler already ran
      clickedMarker = false;
      return;
    }

    // hide view popup
    viewPopup.style.display = "none";

    // remove old temp marker
    if (tempMarker) {
      map.removeLayer(tempMarker);
    }

    // add temp marker at click location
    tempMarker = L.marker(e.latlng, {
      icon: createEmojiIcon("📍", "temp"),
    }).addTo(map);

    // fill form inputs
    latInput.value = e.latlng.lat;
    lngInput.value = e.latlng.lng;

    // show add popup
    addPopup.style.display = "block";
  });

  // Like button
  likeButton.addEventListener("click", () => {
    if (!currentMoment) return;

    fetch(`/moment/${currentMoment._id}/like`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        likeCount.textContent = data.likes;
        currentMoment.likes = data.likes;
      });
  });

  // Comment form
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentMoment) return;

    const textValue = commentText.value.trim();
    if (!textValue) return;

    const body = new URLSearchParams();
    body.append("commentText", textValue);

    fetch(`/moment/${currentMoment._id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) return;

        const li = document.createElement("li");
        li.textContent = data.comment.text;
        commentsList.appendChild(li);

        commentText.value = "";

        if (!currentMoment.comments) {
          currentMoment.comments = [];
        }
        currentMoment.comments.push(data.comment);

        commentCount.textContent = currentMoment.comments.length;
      });
  });
}
