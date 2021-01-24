import Hospital from "../support/Hospital.js"
import LocationStatus from "../support/LocationStatus.js";
import RoomType from "../support/RoomType.js"

class ComputerAssignPatientRoom {

  constructor(myIndex, locations) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Computer Assign Patient Room")
        .do("Assign Room", (t) => {
            let patient = me().CurrentPatient;
            let entry = Hospital.computer.getEntry(patient);

            // get rooms C_ROOM
            // if you get back LocationStatus.NONE then return Running
            /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
            if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
                return Status.RUNNING;//They are all occupied, so we have to wait.
            IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
            */

           let rooms = Hospital.locations.filter(l=>l.roomType == RoomType.C_ROOM && l.locationStatus == LocationStatus.NONE );
           if(rooms.length == 0)
            return fluentBehaviorTree.BehaviorTreeStatus.Failed


           
            patient.AssignedRoom = rooms[0];
            entry.Bed = rooms[0];

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