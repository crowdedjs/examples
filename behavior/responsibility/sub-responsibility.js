import GetComputerResponsibility from "../get-computer-responsibility.js";
import GetResponsibility from "../get-responsibility.js";
import GoToLazy from "../go-to-lazy.js";
import HandleResponsibility from "../handle-responsibility.js";
import Vector3 from "../../math/vector-3.js";
import GoToResponsibility from "../go-to-responsibility.js"
import SetupTransport from "../setup-transport.js";
import Reassess from "../reassess.js"
import ResponsibilitySubject from "./responsibility-subject.js";
import SubSubResponsibility from "./sub-sub-responsibility.js"

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
    let subSubResponsibility = new SubSubResponsibility(myIndex).tree;
    let counter = 0;

    // let stopper = () => {
    //     console.log("Stopper")
    // }

    this.tree = builder
      .repeat("Main Repeat")
      .inverter("After Computer Inverter")
      .untilFail("After Computer Until Fail")
      .do("Go to my computer", async function (t) {
        if (debug && me().name == debug) console.log("Go to my computer")
        let result = await goToComputer.tick(t);
        return result;
      })// GO TO COMPUTER


      .do("Get Responsibility", async function (t) {
        counter++;
        if (debug && me().name == debug) console.log("Get Responsibility")
        let result = await getResponsibility.tick(t);
        return result;
      })
      .do("First Sub Sub", async function (t) {
        if (debug && me().name == debug) console.log("First Sub Sub")
        let result = await subSubResponsibility.tick(t);
        return result;
      })// GO TO COMPUTER

      .inverter()
      .untilFail("Reassess")
      .do("Reassess", async (t) => {
        if (debug && me().name == debug) console.log("Reassess");
        let result = await reassess.tick(t);
        return result;
      })
      .do("First Sub Sub", async function (t) {
        if (debug && me().name == debug) console.log("First Sub Sub")
        let result = await subSubResponsibility.tick(t);
        return result;
      })// GO TO COMPUTER
      
      .end()
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