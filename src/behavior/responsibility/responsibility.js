import GetComputerResponsibility from "../get-computer-responsibility.js";
import GetResponsibility from "../get-responsibility.js";
import GoToLazy from "../go-to-lazy.js";
import HandleResponsibility from "../handle-responsibility.js";
import Vector3 from "@crowdedjs/math";
import GoToResponsibility from "../go-to-responsibility.js"
import SetupTransport from "../setup-transport.js";
import Reassess from "../reassess.js"
import ResponsibilitySubject from "./responsibility-subject.js";
import SubResponsibility from "./sub-responsibility.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class responsibility {

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
        let subResponsibility = new SubResponsibility(myIndex).tree;
        let i = 1;
        

        this.tree = builder
            .sequence("Responsibility")

            .do("getRooms", (t) => {               
                // ADD A ROOM EACH LOOP WITHOUT DELETING, EVERYONE LOOPS, AND LOOPS IN ORDER,
                // BUT THE TECH NEVER TRANSPORTS MORE THAN ONE PATIENT FOR XRAYS LIKE ABOVE
                let agent = Hospital.agents.find(a => a.id == myIndex);
                let roomName = "C1";

                if (i == 1) {
                    agent.addRoom(Hospital.locations.find(l => l.name == roomName));
                    i++;
                }
                else if (i <= 21) {
                    roomName = "C " + i;
                    agent.addRoom(Hospital.locations.find(l => l.name == roomName));
                    i++;
                }
                

                // ORIGINAL METHOD: ONLY WORKS FOR ONE PATIENT, DOESN'T LOOP ANYONE
                //let agent = Hospital.agents.find(a => a.id == myIndex);
                //agent.addRoom(Hospital.locations.find(l => l.name == "C1"));


                if (me().name == debug)
                    console.log("getRooms")
                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .do("getComputer", (t) => {
                switch (me().MedicalStaffSubclass) {
                    case "Tech":
                        me().Computer = Hospital.locations.find(l => l.name == "TechPlace");
                        break;
                    case "Nurse":
                        me().Computer = Hospital.locations.find(l => l.name == "NursePlace");
                        break;
                    case "Resident":
                        me().Computer = Hospital.locations.find(l => l.name == "ResidentStart");
                        break;
                    case "CT":
                        me().Computer = Hospital.locations.find(l => l.name == "CT 1");
                        break;
                    case "Radiology":
                        me().Computer = Hospital.locations.find(l => l.name == "CT 2");
                        break;
                    default:
                        console.error("Bad Subclass Name")
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .do("Sub Responsibility", async function(t){
                let result = await subResponsibility.tick(t);
                return result;
            })

            /*.inverter("Main Repeat Inverter")
            .untilFail("Computer Loop")
            .do("Go to my computer", async function (t) {
                if (debug && me().name == debug) console.log("Go to my computer");
                let result = await goToComputer.tick(t);
                return result;
            })// GO TO COMPUTER
            .do("Get Computer Responsibility", async function (t) {
                if (debug && me().name == debug) console.log("Get computer responsibility")
                let result = await getComputerResponsibility.tick(t);
                return result;
            })
            .do("Handle Responsibility", async (t) => {
                if (debug && me().name == debug) console.log("Handle Responsibility (a)")
                let result = await handleResponsibility.tick(t);
                return result;
            })
            .end()
            .end()
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
            .inverter()
            .untilFail("Reassess")
            .do("Reassess", async (t) => {
                if (debug && me().name == debug) console.log("Reassess");
                let result = await reassess.tick(t);
                return result;
            })
            .do("Go to Responsibility", async function (t) {
                if (debug && me().name == debug) console.log("Go to Responsibility")
                let result = await goToResponsibility.tick(t)
                return result;
            })
            .do("Set Up Transport", async (t) => {
                if (debug && me().name == debug) console.log("Set up Transport")
                let result = await setupTransport.tick(t);
                return result;
            })
            .do("Handle Responsibility", async (t) => {
                if (debug && me().name == debug) console.log("HandleResponsibility")
                let result = await handleResponsibility.tick(t);
                return result;
            })
            .end()
            .end()
            .end()
            .end()
            .end()*/
            .end()
            .build();
    }

    async update(crowd, msec) {
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
    }
}

export default responsibility;