import ResponsibilitySubject from "./responsibility/responsibility-subject.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class GoToResponsibility {

  constructor(myIndex) {
    this.index = myIndex;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = () => Hospital.agents.find(a => a.id == myIndex);;

    this.tree = builder
      .sequence("Go To Responsibility")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Go to responsibility", (t) => {
        let responsibility = me().Responsibility;

        let destination;
        if (me().Responsibility.getSubject() == ResponsibilitySubject.COMPUTER) {
          let a = me().computer.location;
          destination = a;
        }
        else if (me().Responsibility.getSubject() == ResponsibilitySubject.ATTENDING) {
          destination = Hospital.agents.find(a => a.name == "Attending").location;
        }
        else {
          if (me().name == "Tech")
            destination = responsibility.entry.patient.getAssignedRoom().location;
          else
            destination = responsibility.entry.patient.getPermanentRoom().location;
        }

        me().setDestination(Vector3.fromObject(destination));

        //let distance = Vector3.fromObject(me().location).distanceTo(destination);
        let distance = Vector3.fromObject(me().location).distanceToSquared(destination);
        //if (distance < 2) {
        if (distance < 4) {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }
}

export default GoToResponsibility;