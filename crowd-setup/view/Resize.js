function Resize(window, renderer, camera) {
  let canvas = document.getElementById("canv");
  canvas.style.width = window.innerWidth + "px"
  canvas.style.height = window.innerHeight + "px"
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.setSize(canvas.width, canvas.height);
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
};

export default Resize;