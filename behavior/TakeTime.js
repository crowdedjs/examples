class TakeTime {
    constructor(minTime, maxTime) {

        // let amountTime = time;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Take Time")
                .do("Take Time", (t) => {
                    // milliseconds = # x 25 fps
                    // let milliseconds = amountTime * 25;
                    
                    let milliseconds = (Math.random() * (maxTime - minTime) + minTime) * 25;

                    while (milliseconds > 0)
                    {
                        milliseconds--;
                    }

                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }
    async update(agents, positions, msec) {
        await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
    }

}

export default TakeTime;