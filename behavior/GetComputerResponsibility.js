import ResponsibilityFactory from "../support/responsibility/ResponsibilityFactory.js"


class GetComputerResponsibility {
    constructor(myIndex, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = () => Hospital.agents.find(a => a.id == myIndex);;

        this.tree = builder
            .sequence("Get Computer Responsibility")
            .do("Check Responsibilities", (t) => {
                //Computer computer = HospitalModel.get().computer;
                //get computer

                //go through computer entries and find highest priority task
                // requires looking thru responsibilities to get priority?
                let responsibility = Hospital.computer.entries.filter(
                    i => me().hasRoom(i.Bed) &&
                        this.getResponsibilityFactory(me().MedicianSubclass).get(i,  me()) != null
                )
                    .map(i => this.getResponsibilityFactory(me().MedicianSubclass).get(i,  me()))
                    .reduce((a, b) => a == null ? null : b == null ? a : a.getPriority() < b.getPriority() ? a : b)
                    


                if (responsibility == null) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                }

                me().Responsibility = responsibility;

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

    getResponsibilityFactory(medicianSubclass) {
        return ResponsibilityFactory.get(medicianSubclass);
    }

}

export default GetComputerResponsibility;