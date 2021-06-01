import GetComputerResponsibility from "../get-computer-responsibility.js";
import GetResponsibility from "../get-responsibility.js";
import GoToLazy from "../go-to-lazy.js";
import HandleResponsibility from "../handle-responsibility.js";
import Vector3 from "@crowdedjs/math";
import GoToResponsibility from "../go-to-responsibility.js"
import SetupTransport from "../setup-transport.js";
import Reassess from "../reassess.js"
import ResponsibilitySubject from "./responsibility-subject.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class SubResponsibilty {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference

    let debug = null;
    let me = () => Hospital.agents.find(a => a.id == myIndex);


    let goToComputer = new GoToLazy(self.index, () => me().Computer.location).tree;
    let getComputerResponsibility = new GetComputerResponsibility(myIndex).tree;
    let getResponsibility = new GetResponsibility(myIndex).tree;
    let goToResponsibility = new GoToResponsibility(myIndex).tree;
    let setupTransport = new SetupTransport(myIndex).tree;
    let handleResponsibility = new HandleResponsibility(myIndex).tree;
    let reassess = new Reassess(myIndex).tree;
    let counter = 0;

    // let stopper = () => {
    //     console.log("Stopper")
    // }

    this.tree = builder
    .inverter()
      .untilFail()
      .do("Go to Responsibility", async function (t) {
        if (debug && me().name == debug) console.log("Go to Responsibility")
        let result = await goToResponsibility.tick(t)
        return result;
      })
      .do("Wait For Responsibility Person", (t) => {
        if (debug && me().name == debug) console.log("Wait for Responsibility Person")

        let location;
        if (me().Responsibility.getSubject() == ResponsibilitySubject.COMPUTER) {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        else if (me().Responsibility.getSubject() == ResponsibilitySubject.ATTENDING) {
          location = Hospital.agents.find(a => a.name == "Attending").location;
        }
        else {
          let patient = me().getCurrentPatient();
          location = Vector3.fromObject(patient.getLocation());
        }

        let distance = Vector3.fromObject(me().getLocation()).distanceTo(location);
        
        if (distance < 2) {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .do("Set Up Transport", async (t) => {
        if (debug && me().name == debug) console.log("Set up Transport")
        let result = await setupTransport.tick(t);
        return result;
      })
      .do("Handle Responsibility", async (t) => {
        if (debug && me().name == debug) console.log("Handle Responsibility")
        let result = await handleResponsibility.tick(t);
        return result;
      })
      .do("Force Fail", async(t)=>{
        return fluentBehaviorTree.BehaviorTreeStatus.Failure; 
      })
      
   
      .end()
      .end()
      // .end()
      // .end()
      // .end()
      //.end()
      .build();
  }

}
export default SubResponsibilty;