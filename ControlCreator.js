class ControlCreator {
  PLAY_STATE_STOP = 0;
  PLAY_STATE_PLAY_FORWARD = 1;
  PLAY_STATE_PLAY_BACKWARD = -1;

  playState = this.PLAY_STATE_PLAY_FORWARD;
  playSpeed = 1;

  constructor(secondsOfSimulation, millisecondsPerFrame) {
    let self = this;
    this.secondsOfSimulation = secondsOfSimulation;
    this.millisecondsPerFrame = millisecondsPerFrame;
    let canvas = document.createElement("canvas");
    canvas.id = "canv";
    document.body.appendChild(canvas);

    let divRange = document.createElement("div");
    divRange.style.position = "absolute"
    divRange.style.top = "20px";
    divRange.style.left = "50%";
    divRange.id = "divRange";
    divRange.style.visibility = "hidden"

    let divChild = document.createElement("div");
    divChild.style.position = "relative";
    divChild.style.left = "-50%";
    divRange.appendChild(divChild);

    let divTop = document.createElement("div");
    let divBottom = document.createElement("div");
    divChild.appendChild(divTop);
    divChild.appendChild(divBottom);

    let inputRange = document.createElement("input");
    inputRange.type = "range"
    inputRange.min = 0;
    inputRange.max = secondsOfSimulation * 1_000 / this.millisecondsPerFrame - 1;
    inputRange.value = 0;
    inputRange.class = "slider";
    inputRange.id = "myRange";
    divTop.appendChild(inputRange);

    let buttonRev = document.createElement("button");
    buttonRev.innerText = "◄"
    buttonRev.addEventListener('click', () => self.clickPlayButton(self.PLAY_STATE_PLAY_BACKWARD))
    divBottom.appendChild(buttonRev);

    let buttonStop = document.createElement("button");
    buttonStop.innerText = "█"
    buttonStop.addEventListener('click', () => self.clickPlayButton(self.PLAY_STATE_STOP))
    divBottom.appendChild(buttonStop);

    let buttonPlay = document.createElement("button");
    buttonPlay.innerText = "►"
    buttonPlay.addEventListener('click', () => self.clickPlayButton(self.PLAY_STATE_PLAY_FORWARD))
    divBottom.appendChild(buttonPlay);

    let x1Speed = document.createElement("button");
    x1Speed.innerText = "x1"
    x1Speed.addEventListener('click', () => self.clickPlaySpeed(1))
    divBottom.appendChild(x1Speed);

    let x5Speed = document.createElement("button");
    x5Speed.innerText = "x5"
    x5Speed.addEventListener('click', () => self.clickPlaySpeed(5))
    divBottom.appendChild(x5Speed);

    let x10Speed = document.createElement("button");
    x10Speed.innerText = "x10"
    x10Speed.addEventListener('click', () => self.clickPlaySpeed(10))
    divBottom.appendChild(x10Speed);

    document.body.appendChild(divRange);

    let divCounterParent = document.createElement("div");
    divCounterParent.style.position = "absolute";
    divCounterParent.style.top = "20px";
    divCounterParent.style.right = "20px";

    let divCounter = document.createElement("div");
    divCounter.id = "counter";
    divCounterParent.appendChild(divCounter);

    document.body.appendChild(divCounterParent);

    let divLoading = document.createElement("div");
    divLoading.style.position = "absolute";
    divLoading.style.left = "50%";
    divLoading.style.top = "50%";
    divLoading.id = "loading";
    document.body.appendChild(divLoading);

    let divLoadingChild = document.createElement("div");
    divLoadingChild.style.position = "relative";
    divLoadingChild.style.left = "-50%";
    divLoadingChild.style.top = "-50%";
    divLoadingChild.style.padding = "1rem"
    divLoadingChild.innerText = "Loading the Simulation";
    divLoadingChild.style.backgroundColor = "white";
    divLoading.appendChild(divLoadingChild);

    let divOptions = document.createElement("div");
    divOptions.style.position = "absolute";
    divOptions.style.left = "20px";
    divOptions.style.bottom = "20px";
    document.body.appendChild(divOptions);

    let optionsButton = document.createElement("button");
    optionsButton.innerText = "▲";
    optionsButton.addEventListener('click', () => optionsButtonClick())
    divOptions.appendChild(optionsButton);

    let divDialog = document.createElement("div");
    divDialog.style.position = "absolute";
    divDialog.style.top = "50%";
    divDialog.style.left = "50%";
    divDialog.style.padding = "20px"
    divDialog.style.backgroundColor = "white";
    divDialog.id = "divDialog";
    divDialog.style.visibility = "hidden";
    divDialog.style.border = "1px solid black";
    document.body.appendChild(divDialog);

    let divDialogChild = document.createElement("div");
    divDialogChild.style.position = "relative";
    divDialogChild.innerText = "href"
    divDialogChild.id = "divDialogChild";

    divDialog.appendChild(divDialogChild);
  }
  clickPlayButton(state) {
    this.playState = state;
  }

  clickPlaySpeed(speed) {
    this.playSpeed = speed;
  }

  asTime(ticks) {
    let milliseconds = ticks * this.millisecondsPerFrame;

    let minutes = Math.floor(ticks / (60 * 25));
    let remainder = ticks - minutes * (60 * 25);
    let seconds = Math.floor(remainder / 25);
    remainder -= seconds * 25;
    //return ("" + minutes).padStart(2, "0") + ":" + ("" + seconds).padStart(2, "0") + ":" + ("" + remainder).padStart(2, "0");
    return milliseconds;
  }

  optionsButtonClick() {
    let div = document.getElementById("divDialog");
    if (div.style.visibility == "hidden") {
      div.innerHTML = '';
      for (let i = 0; i < simulations.length; i++) {
        let divLink = document.createElement("div");
        div.appendChild(divLink);

        let simulation = simulations[i];

        let a = document.createElement("a");
        console.log(window.pathname);
        let pathname = window.pathname;
        if (!pathname || pathname == "undefined" || pathname == "NaN")
          pathname = '';
        a.href = `?obj=${simulation.objPath}&arrival=${simulation.arrivalPath}&seconds=${simulation.secondsOfSimulation}&location=${simulation.locationsPath}`;
        //a.href="#"
        a.innerText = simulation.title;
        //a.addEventListener('click', ()=>window.search = `objPath=${simulation.objPath}&arrivalPath=${simulation.arrivalPath}&secondsOfSimulation=${simulation.secondsOfSimulation}&locationsPath=${simulation.locationsPath}`)
        divLink.appendChild(a);

      }
      div.style.visibility = "visible";
    }
    else
      div.style.visibility = "hidden";
  }
  getPlayState(){
    return this.playState;
  }
  getPlaySpeed(){
    return this.playSpeed;
  }
  update(simulatedLength){
    document.getElementById("counter").innerHTML = "" + this.asTime(document.getElementById("myRange").value) + "<br>" + this.asTime(simulatedLength) + "<br>" + this.asTime(this.secondsOfSimulation * 1_000 / this.millisecondsPerFrame);
  }
  getCurrentTick(){
    let rangeElement = document.getElementById("myRange");
    return +rangeElement.value
  }
  setTick(tick){
    let rangeElement = document.getElementById("myRange");
    rangeElement.value = tick;
  }
}

export default ControlCreator;