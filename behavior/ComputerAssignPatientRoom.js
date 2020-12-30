import Computer from "../support/Computer.js";
import ComputerEntry from "../support/ComputerEntry.js";

class ComputerAssignPatientRoom {

  constructor() {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me = agent;

    this.tree = builder
      .sequence("Computer Assign Patient Room")
        .do("Assign Room", (t) => {
            let patient = me.CurrentPatient;
            let entry = computer.getEntry(patient);

            // get rooms C_ROOM
            // if you get back LocationStatus.NONE then return Running
            /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
            if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
                return Status.RUNNING;//They are all occupied, so we have to wait.
            IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
            */
           
            patient.AssignedRoom(chosenRoom);
            entry.Bed(chosenRoom);

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }

  async update(agents, positions, msec) {
    await this.tree.tick({ agents, positions, msec }) //Call the behavior tree
  }

}

export default ComputerAssignPatientRoom;