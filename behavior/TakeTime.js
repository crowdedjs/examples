// NEED HELP WITH US

class TakeTime {
    constructor(myIndex) {
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Take Time")
                .do("Take Time", (t) => {
                    
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default TakeTime;