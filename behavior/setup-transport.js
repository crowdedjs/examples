import ATransportResponsibility from "./responsibility/atransport.js"
import PatientTempState from "../support/patient-temp-state.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class SetupTransport {
	constructor(myIndex) {
		this.index = myIndex;
		let self = this;
		let me= ()=>Hospital.agents.find(a=>a.id == myIndex);;

		const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

		this.tree = builder
			.sequence("Setup Transport")
			.do("Setup Transport", (t) => {
				let patient = me().getCurrentPatient();

				let responsibility = me().Responsibility;
				if (!(responsibility instanceof ATransportResponsibility))
					return fluentBehaviorTree.BehaviorTreeStatus.Success;
				let transportResponsibility = responsibility;
				// Hospital.addComment(me, patient, "Follow me");
				me().setDestination(transportResponsibility.getRoom().getLocation());
				patient.setInstructor(me());
				patient.setPatientTempState( PatientTempState.FOLLOWING);

				return fluentBehaviorTree.BehaviorTreeStatus.Success;
			})
			.end()
			.build();
	}

}

export default SetupTransport;