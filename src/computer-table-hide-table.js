

export default function hideTable() {
  var x = document.getElementById("ComputerEntryTable");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}