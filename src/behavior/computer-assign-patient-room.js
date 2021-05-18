import LocationStatus from "../support/location-status.js";
import RoomType from "../support/room-type.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class ComputerAssignPatientRoom {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Computer Assign Patient Room")
        .do("Assign Room", (t) => {
            let patient = me().getCurrentPatient();
            let entry = Hospital.computer.getEntry(patient);

            // get rooms C_ROOM
            // if you get back LocationStatus.NONE then return Running
            /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
            if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
                return Status.RUNNING;//They are all occupied, so we have to wait.
            IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
            */

           let rooms = Hospital.locations.filter(l=>l.roomType == RoomType.C_ROOM && l.locationStatus == LocationStatus.NONE );
          //let waitingRoom = Hospital.locations.filter(l=>l.name == "Waiting Room");

           if(rooms.length == 0) {
            // patient.setAssignedRoom(waitingRoom);
            // patient.setPermanentRoom(waitingRoom);
            // entry.setBed(waitingRoom);
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
           }

            // need to set room as claimed
            rooms[0].setLocationStatus(LocationStatus.CLAIMED);

            patient.setAssignedRoom(rooms[0]);
            patient.setPermanentRoom(rooms[0]);
            entry.setBed(rooms[0]);

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default ComputerAssignPatientRoom;