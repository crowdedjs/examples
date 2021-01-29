import ResponsibilityFactory from "./responsibility/responsibility-factory.js"

class GetResponsibility {
    constructor(myIndex, locations) {
        this.index = myIndex;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = () => Hospital.agents.find(a => a.id == myIndex);;

        this.tree = builder
            .sequence("Get Responsibility")
            .do("Check Responsibilities", (t) => {

                let responsibilities = Hospital.computer.entries.filter(
                    i => me().hasRoom(i.getBed()) &&
                        this.getResponsibilityFactory(me().MedicalStaffSubclass).get(i, me()) != null
                );
                if (!responsibilities || responsibilities.length == 0)
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                let responsibility = responsibilities
                    .map(i => this.getResponsibilityFactory(me().MedicalStaffSubclass).get(i, me()))
                    .reduce((a, b) => a == null ? null : b == null ? a : a.getPriority() < b.getPriority() ? a : b)



                if (responsibility == null) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                }

                //HospitalModel.get().addComment(me, null, "!! " + responsibility.getName());

                me().Responsibility = responsibility;

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

    getResponsibilityFactory(medicalStaffSubclass) {
        return ResponsibilityFactory.get(medicalStaffSubclass);
    }
}

export default GetResponsibility;