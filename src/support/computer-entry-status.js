class ComputerEntryStatus {
  static In_Process = "IN_PROCESS";
  static Initial_Triage = "INITIAL_TRIAGE"; //Patient is being triaged by a tech and nurse
  static Waiting_For_CAT_Scan = "WAITING_FOR_CAT_SCAN"; //Patient needs a CAT scan but isn't the first in the queue
  static CAT_Scan = "CAT_SCAN"; //The patient is in the CAT SCAN
  static Vitals = "VITALS"; //The patient needs vitals taken
  static Consult_In_Room = "CONSULT_IN_ROOM"; //The patient is being consulted in their room
  static Waiting_For_Consult = "WAITING_FOR_CONSULT"; //Waiting for a consult
  static IP_Bed_Assignment = "IP_BED_ASSIGNMENT"; //In Process? Bed Assignment
  static Admit_No_Bed = "ADMIT_NO_BED"; //Patient has been admitted to the hospital, but there is no hospital bed assigned
  static With_Provider = "WITH_PROVIDER"; //The patient is with the provider
  static Admit_Bed_Not_Ready = "ADMIT_BED_NOT_READY"; //The patient has been admitted and assigned a rom, but the room is not ready
  static Ready_For_Discharge = "READY_FOR_DISCHARGE"; //The patient is going to be discharged (not admitted), but needs to go through th formal discharge process
  static Waiting_For_Swing = "WAITING__FOR_SWING";
  static Ready_For_Reeval = "READY_FOR_REEVAL"; //The patient needs to be reevaluated and is waiting for that to happen
  static Hold_Discharge = "HOLDING_DISCHARGE"; //The discharge has been put on hold.
  static Bed_Request = "BED_REQUEST"; //Requesting a bed
  static Waiting_For_Room_Care_Area = "WAITING_FOR_ROOM_CARE_AREA";


}

export default ComputerEntryStatus;