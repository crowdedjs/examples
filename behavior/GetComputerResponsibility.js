import Hospital from "../support/Hospital.js"
import ResponsibilityFactory from "../support/responsibility/ResponsibilityFactory.js"
import ResponsibilitySubject from "../support/responsibility/ResponsibilitySubject.js"


class GetComputerResponsibility {
    constructor(myIndex, agentConstants, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = () => agentConstants.find(a => a.id == myIndex);;

        this.tree = builder
            .sequence("Get Computer Responsibility")
            .do("Check Responsibilities", (t) => {
                //Computer computer = HospitalModel.get().computer;
                //get computer

                //go through computer entries and find highest priority task
                // requires looking thru responsibilities to get priority?
                let responsibility = Hospital.computer.entries.filter(
                    i => me().hasRoom(i.Bed) && 
                    this.getResponsibilityFactory(me().MedicianSubclass).get(i, ResponsibilitySubject.COMPUTER, me) != null
                    )
                    

                if (responsibility == null) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                }

                me().Responsibility = responsibility;

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

    getResponsibilityFactory( medicianSubclass) {
		return ResponsibilityFactory.get(medicianSubclass);
	}

    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }
}

export default GetComputerResponsibility;