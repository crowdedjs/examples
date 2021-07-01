import LocationStatus from "../support/location-status.js";
import RoomType from "../support/room-type.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import PatientTempState from "../support/patient-temp-state.js";

class ComputerAssignPatientRoom {

  constructor(myIndex) {
    this.index = myIndex;
    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>Hospital.agents.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Computer Assign Patient Room")
        .do("Assign Room", (t) => {
          //let patient = me().getCurrentPatient();
          // let patient = me().PatientList[0];
          // let entry = Hospital.computer.getEntry(patient);
          let patient;
          let entry;
          for(let i = 0; i < me().PatientList.length; i++) {
            if (me().PatientList[i].getPermanentRoom() == null || me().PatientList[i].getPermanentRoom().getName() == "Waiting Room") {
              patient = me().PatientList[i];
              entry = Hospital.computer.getEntry(patient);
              break;
            }
          }
          if (patient == null) {
            return fluentBehaviorTree.BehaviorTreeStatus.Failure;
          }
          // get rooms C_ROOM
          // if you get back LocationStatus.NONE then return Running
          /*List<IRoom> cRooms = HospitalModel.get().getLocations(RoomType.C_ROOM);
          if(!cRooms.stream().anyMatch(i->i.getLocationStatus() == LocationStatus.NONE))
              return Status.RUNNING;//They are all occupied, so we have to wait.
          IRoom chosenRoom = cRooms.stream().filter(i->i.getLocationStatus()==LocationStatus.NONE).findFirst().get();
          */
          let rooms;

          if (patient.getSeverity() == "ESI1") {
            // what rooms do we send ESI1 PATIENTS?
            rooms = Hospital.locations.filter(l=>l.roomType == RoomType.TRAUMA_BAY && l.locationStatus == LocationStatus.NONE );
          }
          // BOOK INTO MAIN HOSPITAL - NEEDS EDITS TO PARAMETERS
          else if (patient.getSeverity() == "ESI2") {
            rooms = Hospital.locations.find(l => l.name == "Main Entrance");
            //entry.getPatient().setPatientTempState(PatientTempState.BOOKED);
          }
          else          
            rooms = Hospital.locations.filter(l=>l.roomType == RoomType.C_ROOM && l.locationStatus == LocationStatus.NONE );
          
          if(rooms.length == 0) {
            // patient.setAssignedRoom(waitingRoom);
            // patient.setPermanentRoom(waitingRoom);
            // entry.setBed(waitingRoom);
            return fluentBehaviorTree.BehaviorTreeStatus.Running;
          }

          // need to set room as claimed
          if (rooms.name != "Main Entrance") {
            rooms[0].setLocationStatus(LocationStatus.CLAIMED);
            patient.setAssignedRoom(rooms[0]);
            patient.setPermanentRoom(rooms[0]);
            entry.setBed(rooms[0]);
          }
          else {
            patient.setAssignedRoom(rooms);
            patient.setPermanentRoom(rooms);
            entry.setBed(rooms);
          }

          return fluentBehaviorTree.BehaviorTreeStatus.Success;
          
      })
      .end()
      .build();
  }


}

export default ComputerAssignPatientRoom;