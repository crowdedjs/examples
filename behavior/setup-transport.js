import ATransportResponsibility from "./responsibility/atransport.js"

class SetupTransport {
	constructor(myIndex) {
		this.index = myIndex;
		let self = this;
		let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

		const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

		this.tree = builder
			.sequence("Setup Transport")
			.do("Setup Transport", (t) => {
				let patient = me().CurrentPatient;

				let responsibility = me().Responsibility;
				if (!(responsibility instanceof ATransportResponsibility))
					return fluentBehaviorTree.BehaviorTreeStatus.Success;
				let transportResponsibility = responsibility;
				// Hospital.addComment(me, patient, "Follow me");
				me().Destination = transportResponsibility.Room.Location;
				patient.Instructor = me;
				patient.PatientTempState = PatientTempState.FOLLOWING;

				return fluentBehaviorTree.BehaviorTreeStatus.Success;
			})
			.end()
			.build();
	}

}

export default SetupTransport;