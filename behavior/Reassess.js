import ResponsibilityFactory from "./responsibility/responsibility-factory.js";

class Reassess {
	constructor(myIndex) {
		this.index = myIndex;
		let self = this;
		let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

		const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

		this.tree = builder
			.sequence("Reasses")
			.do("Reassess", (t) => {
				let patient = me().getCurrentPatient();

        let entry = Hospital.computer.getEntry(patient);
        let responsibility;
        if(entry != null){
          let factory = ResponsibilityFactory.get(me().MedicianSubclass)
          responsibility = factory.get(entry, me())
        }
        if(entry == null || responsibility == null){
          me().setCurrentPatient(null);
          return fluentBehaviorTree.BehaviorTreeStatus.Failure;
        }
        //Implied else
        me().setCurrentPatient(patient);
        me().Responsibility = responsibility;

				return fluentBehaviorTree.BehaviorTreeStatus.Success;
			})
			.end()
			.build();
	}

}

export default Reassess;