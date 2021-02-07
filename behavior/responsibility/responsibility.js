// NOT FULLY PORTED
import GetComputerResponsibility from "../get-computer-responsibility.js";
import GetResponsibility from "../get-responsibility.js";
import GoTo from "../go-to.js";
import GoToLazy from "../go-to-lazy.js";
import HandleResponsibility from "../handle-responsibility.js";
import Vector3 from "../../math/vector-3.js";
import GetHealthInformationResponsibility from "./get-health-information.js";
import GoToResponsibility from "../go-to-responsibility.js"
import SetupTransport from "../setup-transport.js";
import Reassess from "../reassess.js"
import ResponsibilitySubject from "./responsibility-subject.js";

class responsibility {

    constructor(myIndex, locations, start, end) {
        this.index = myIndex;
        this.waypoints = [];
        this.waypoints.push(start);
        this.waypoints.push(end);

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference

        let debug = "Resident"
        let me = () => Hospital.agents.find(a => a.id == myIndex);

        let goToComputer = new GoToLazy(self.index, () => me().Computer.position).tree;
        let getComputerResponsibility = new GetComputerResponsibility(myIndex, locations).tree;
        let getResponsibility = new GetResponsibility(myIndex, locations).tree;
        let goToResponsibility = new GoToResponsibility(myIndex, locations).tree;
        let setupTransport = new SetupTransport(myIndex).tree;
        let handleResponsibility = new HandleResponsibility(myIndex).tree;
        let reassess = new Reassess(myIndex).tree;
        let counter = 0;
        //let myGoal = me.Computer;
        //this.goTo = new GoTo(self.index, myGoal.position);
        let stopper = () => {
            console.log("Stopper")
        }

        this.tree = builder
            .sequence("Responsibility")

            .do("getRooms", (t) => {
                let agent = Hospital.agents.find(a => a.id == myIndex);
                agent.addRoom(locations.find(l => l.name == "C1"));
                if (me().name == debug)
                    console.log("getRooms")

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .do("getComputer", (t) => {
                // Not sure if medicalStaff subclass is implemented
                switch (me().MedicalStaffSubclass) {
                    case "Tech":
                        me().Computer = locations.find(l => l.name == "TechPlace");
                        break;
                    case "Nurse":
                        me().Computer = locations.find(l => l.name == "NursePlace");
                        break;
                    case "Resident":
                        me().Computer = locations.find(l => l.name == "ResidentStart");
                        break;
                    case "CT":
                        me().Computer = locations.find(l => l.name == "CT 1");
                        break;
                    case "Radiology":
                        me().Computer = locations.find(l => l.name == "CT 2");
                        break;
                    default:
                        console.error("Bad Subclass Name")
                }

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .repeat("Main Repeat")
            .inverter("Main Repeat Inverter")
            .untilFail("Computer Loop")
            .do("Go to my computer", async function (t) {
                if (me().name == debug)
                    console.log("Go to my computer");
                let result = await goToComputer.tick(t);
                return result;
            })// GO TO COMPUTER
            .do("Get Computer Responsibility", async function (t) {
                if (me().name == debug)
                    console.log("Get computer responsibility")
                let result = await getComputerResponsibility.tick(t);
                return result;
            })
            .do("Handle Responsibility", async (t) => {
                if (me().name == debug)
                    console.log("Handle Responsibility (a)")
                let result = await handleResponsibility.tick(t);
                return result;
            })
            .end()
            .end()
            .inverter("After Computer Inverter")
            .untilFail("After Computer Until Fail")
            .do("Go to my computer", async function (t) {
                if (me().name == debug)
                    console.log("Go to my computer")
                let result = await goToComputer.tick(t);
                return result;
            })// GO TO COMPUTER
            .do("Get Responsibility", async function (t) {
                counter++;
                if (me().name == debug)
                    console.log("Get Responsibility")
                let result = await getResponsibility.tick(t);
                return result;
            })
            .do("Go to Responsibility", async function (t) {
                if (me().name == debug)
                    console.log("Go to Responsibility")
                let result = await goToResponsibility.tick(t)
                return result;
            })
            .do("Wait For Responsibility Person", (t) => {
                if (me().name == debug)
                    console.log("Wait for Responsibility Person")

                let location;
                if (me().Responsibility.getSubject() == ResponsibilitySubject.COMPUTER) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                }
                else if (me().Responsibility.getSubject() == ResponsibilitySubject.ATTENDING) {
                    location = Hospital.agents.find(a=>a.name == "Attending").location;
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
                if (me().name == debug)
                    console.log("Set up Transport")
                let result = await setupTransport.tick(t);
                return result;
            })
            .do("Handle Responsibility", async (t) => {
                if (me().name == debug)
                    console.log("Handle Responsibility")
                let result = await handleResponsibility.tick(t);
                return result;
            })
            .inverter()
            .untilFail("Reassess")
            // UNTIL FAIL?
            //.sequence("Reassess Responsibility")
            .do("Reassess", async (t) => {
                if (me().name == debug)
                    console.log("Reassess");
                let result = await reassess.tick(t);
                return result;
            })
            //NOT FINISHED
            .do("Handle Responsibility", async (t) => {
                if (me().name == debug)
                    console.log("HandleResponsibility")
                let result = await handleResponsibility.tick(t);
                return result;
            })
            .end()
            .end()
            .end()
            .end()





            .end()
            .end()


            .build();
    }

    async update(crowd, msec) {
        //this.toReturn = null;//Set the default return value to null (don't change destination)
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
        //return this.toReturn; //Return what the behavior tree set the return value to
    }

}

export default responsibility;