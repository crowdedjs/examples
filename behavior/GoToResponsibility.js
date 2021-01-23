import ResponsibilitySubject from "../support/responsibility/ResponsibilitySubject.js"
import Vector3 from "./Vector3.js"
class GoToResponsibility {

  constructor(myIndex, agentConstants, locations) {
    this.index = myIndex;
    this.waypoints = [];
    //this.waypoints.push(start);

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = () => agentConstants.find(a => a.id == myIndex);;

    this.tree = builder
      .sequence("Go To Responsibility")
      //Set the destination. This is a one-shot behavior since we only want to
      //update the return value once
      .do("Go to responsibility", (t) => {
        let responsibility = me().Responsibility;

        if (me().Responsibility.getSubject() == ResponsibilitySubject.COMPUTER)
          return fluentBehaviorTree.BehaviorTreeStatus.Success;

        let destination = responsibility.entry.patient.AssignedRoom.location;

        me().Destination = destination;

        let distance = Vector3.fromObject(me().location.position).distanceTo(destination);
        if (distance < 1) {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })
      .end()
      .build();
  }
}

export default GoToResponsibility;