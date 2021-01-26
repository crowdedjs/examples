// NOT FULLY PORTED
import GetComputerResponsibility from "../get-computer-responsibility.js";
import GetResponsibility from "../get-responsibility.js";
import GoTo from "../go-to.js";
import GoToLazy from "../go-to-lazy.js";
import HandleResponsibility from "../handle-responsibility.js";
import Vector3 from "../../math/vector3.js";
import GetHealthInformationResponsibility from "./get-health-information.js";
import GoToResponsibility from "../go-to-responsibility.js"
import SetupTransport from "../setup-transport.js";
import Reassess from "../reassess.js"

class responsibility {

    constructor(myIndex, locations, start, end) {
        this.index = myIndex;
        this.waypoints = [];
        this.waypoints.push(start);
        this.waypoints.push(end);

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        this.toReturn = null;

        let self = this;//Since we need to reference this in anonymous functions, we need a reference

        //   let me = agent;
        //let me = Hospital.agents.find(a=>a.id==self.index);
        let me = () => Hospital.agents.find(a => a.id == myIndex);

        let goToComputer = new GoToLazy(self.index, () => me().Computer.position).tree;
        let getResponsibility = new GetResponsibility(myIndex, locations).tree;
        let goToResponsibility = new GoToResponsibility(myIndex, locations).tree;
        let setupTransport = new SetupTransport(myIndex).tree;
        let handleResponsibility = new HandleResponsibility(myIndex).tree;
        let reassess = new Reassess(myIndex).tree;
        //let myGoal = me.Computer;
        //this.goTo = new GoTo(self.index, myGoal.position);

        this.tree = builder
            .sequence("Responsibility")

                .do("getRooms", (t) => {
                    let agent = Hospital.agents.find(a => a.id == myIndex);
                    agent.addRoom(locations.find(l => l.name == "C1"));
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })
                .do("getComputer", (t) => {
                    // Not sure if medician subclass is implemented
                    switch (me().MedicianSubclass) {
                        case "Tech":
                            me().Computer = locations.find(l => l.name == "TechPlace");
                            break;
                        case "Nurse":
                            me().Computer = locations.find(l => l.name == "NursePlace");
                            break;
                        case "Resident":
                            me().Computer = locations.find(l => l.name == "ResidentStart");
                            break;
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                })
                .inverter("Inverter")
                    .sequence("Main Repeat")
                        .do("Go to my computer", async function (t) {
                            let result = await goToComputer.tick(t);
                            return result;
                        })// GO TO COMPUTER
                        .inverter("Until Fail")
                        .sequence("Sub Sequence")

                            .do("Get Responsibility", async function (t) {
                                let result = await getResponsibility.tick(t);
                                return result;
                            })
                            .do("Go to Responsibility", async function (t) {
                                let result = await goToResponsibility.tick(t)
                                return result;
                            })

                            // .do("Go To Responsibility", (t) => {
                            //     //WRITE THIS BEHAVIOR
                            //     throw new Exception("Not implemented)")
                            // })
                            .do("Wait For Responsibility Patient", (t) => {
                                let patient = me().CurrentPatient;

                                let patientLocation = Vector3.fromObject(patient.Location);


                                let distance = Vector3.fromObject(me().Location).distanceTo(patientLocation);
                                if (distance < 2) {
                                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
                                }
                                return fluentBehaviorTree.BehaviorTreeStatus.Running;
                            })
                            .do("Set Up Transport", async (t) => {
                                let result = await setupTransport.tick(t);
                                return result;
                            })
                            .do("Handle Responsibility", async (t) => {
                                let result = await handleResponsibility.tick(t);
                                return result;
                            })
                            .sequence("Reassess")
                                // UNTIL FAIL?
                                //.sequence("Reassess Responsibility")
                                .do("Reassess", async (t) => {
                                    let result = await reassess.tick(t);
                                    return result;
                                })
                                //NOT FINISHED
                                .do("Handle Responsibility", async (t) => {
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

    async update( crowd, msec) {
        //this.toReturn = null;//Set the default return value to null (don't change destination)
        await this.tree.tick({ crowd, msec }) //Call the behavior tree
        //return this.toReturn; //Return what the behavior tree set the return value to
    }

}

export default responsibility;