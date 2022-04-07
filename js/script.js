document.addEventListener("DOMContentLoaded", () => {

// Grab form element from page
const form = document.querySelector("#postcode")
const splash = document.querySelector("#splash")
const resetLink = document.querySelector("#resetLink")
const message = document.querySelector("#message")
const error = document.querySelector("#error")
const councilName = document.querySelector("#councilName")
const outcomeFigure = document.querySelector("#outcomeFigure")
const loading = document.querySelector("#loading")

function generateGraphic() {

  html2canvas(document.querySelector("#infoBox"), {
    useCORS:true,
    proxy: 'https://snpcuts.github.io/snpcuts/',
    windowWidth: infoBox.width,
    width: infoBox.width,
    windowHeight: infoBox.height,
    height: infoBox.height,

  }).then(canvas => {
      canvas.id = "graphic";
      document.getElementById('graphicOutput').appendChild(canvas);
      document.getElementById('graphic').style="display:none";
      document.getElementById('graphicButton').style="display:none";
      imgPreview = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      download_image();
  });

}

function download_image() {
  let download = document.getElementById("graphic");
  image = download.toDataURL("image/png").replace("image/png", "image/octet-stream");
  let link = document.createElement('a');
  link.download = "cuts_graphic.png";
  link.href = image;
  link.click();
}

function ShowInfo() {
  let result = document.getElementById("infoBox");
  document.getElementById('graphicButton').style="display:block";
  result.style.display = "block";
  document.getElementById('infoBox').scrollIntoView({behavior: "smooth", block: "end", inline: "center"});
  loading.style.display = "none";
  socials.style.display = "none";
}

let council
let councilString
let totalCut
let original
let now

form.addEventListener("submit", e => {
  // Stop page refreshing
  e.preventDefault()
  // Make form data accessible as JS variable
  let formData = new FormData(form)
  let postcode = formData.get("postcode")

  function printMessageToScreen(councilString){
  fetch(`https://snpcuts.github.io/SNPCuts/js/cuts.json`)
      .then(res => res.json())
      .then(data => {
      console.log(data);
      totalCut = data[councilString].totalCut;
      if(councilString == undefined) {
        error.style.display = "block";
        error.innerHTML = "Sorry, looks like that's an invalid postcode.";
      } else {
        loading.style.display = "block";
        error.style.display = "none";
        splash.style.display = "none";
        resetLink.style.display = "block";
        councilName.innerHTML = `${councilString}`;
        outcomeFigure.innerHTML = `${totalCut}`;
        ShowInfo();
  }}
            )
  }

function getCouncilName(postcode) {
  fetch(`https://api.postcodes.io/postcodes/${postcode}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.status != 200) {
        error.innerHTML = "Sorry, looks like that's an invalid postcode."
        error.style.display = "block";
      } else if (data.result.country != "Scotland") {
        error.innerHTML = "Sorry, looks like that postcode isn't in Scotland."
        error.style.display = "block";
      } else {
      let council = data.result.admin_district
      let councilString = council.toString();
      if (councilString == "City of Edinburgh") {
        councilString = "Edinburgh";
      } else if (councilString == "Glasgow City") {
        councilString = "Glasgow";
      } else if (councilString == "Dundee City") {
        councilString = "Dundee";
      } else if (councilString == "Aberdeen City") {
        councilString = "Aberdeen";
      } else if (councilString == "Scottish Borders") {
        councilString = "the Scottish Borders";
      } else if (councilString == "Highland") {
        councilString = "the Highlands";
      } else if (councilString == "Orkney Islands") {
        councilString = "Orkney";
      } else if (councilString == "Shetland Islands") {
        councilString = "Shetland";
      }
      printMessageToScreen(councilString)
      }
    }
    )
}

getCouncilName(postcode);
let graphicButton = document.getElementById('graphicButton');
graphicButton.addEventListener("click", generateGraphic);

})

})
