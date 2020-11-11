
//import BackAndForth from "../behavior/BackAndForth.js";
//import None from "../behavior/None.js"

class Agent {
  startX;
  startY;
  startZ;
  destX;
  destY;
  destZ;
  startMSec;
  inSimulation = false;
  hasEntered = false;
  behavior;

  static index = 0;
  idx; //Corresponds to the internal idx number used by recast

  constructor(l) {

    let splits = l.split(",");
    if (splits.length == 0 || splits.length < 8)
      console.log("Error")

    this.startX = parseFloat(splits[2]);
    this.startY = parseFloat(splits[3]);
    this.startZ = parseFloat(splits[4]);

    this.destX = parseFloat(splits[5]);
    this.destY = parseFloat(splits[6]);
    this.destZ = parseFloat(splits[7]);

    this.startMSec = Math.floor(parseFloat(splits[1]));

    ///Now check to see what behavior this agent should receive
    if (splits.length == 8 || splits[8].trim() == "" || splits[8].trim().toLowerCase() == "none") //i.e. there is no behavior specification
      this.behavior = new None(Agent.index++);
    else {
      //In this case we have to figure it out
      //The behavior is determined by the first word after the comma. Everything else can be a argument in the constructor
      let behave = splits[8].trim().toLowerCase();
      if (behave == "back")
        this.behavior = new BackAndForth(Agent.index++, [this.startX, this.startY, this.startZ], [this.destX, this.destY, this.destZ]);
    }



  }
  

  getStart() { return [this.startX, this.startY, this.startZ]; }

  getEnd() { return [this.destX, this.destY, this.destZ]; }

  ////////////////////////zhicheng////////////////////////
 

  setId(i) { this.id = i; }

  getId() { return this.id; }

  

  getStartMSec() { return this.startMSec; }

  
  /**
   * If current agent is active, update its newDestination to App() class's update method
   */
  isActive() { return active; }
  setActive(active) { this.active = active; }

  


}

export default Agent;