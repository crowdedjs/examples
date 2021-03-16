//Different requests that need to be ACKnowledged

class ACK {
  static RESIDENT_EKG_READ = "ResidentEKGRead";
  static RESIDENT_EKG_CONSULT = "ResidentEKGConsult";
  static RESIDENT_EKG_ORDER_CAT = "ResidentEKGOrderCAT";
  static RESIDENT_SCAN_READ = "ResidentScanRead"
  static RESIDENT_ATTENDING_CONSULT = "ResidentAttendingConsult"
  static RESIDENT_PATIENT_CONSULT = "ResidentPatientConsult"

  static CT_CAT_DO_SCAN = "CTCATDoScan";
  static CT_PICKUP = "CTPickup";

  static RADIOLOGY_REVIEW_SCAN = "RadiologyReviewScan"

  static NURSE_DISCHARGE_PATIENT = "NurseDischargePatient"
  static NURSE_ESCORT_PATIENT_TO_EXIT = "NurseEscortPatientToExit"

}

export default ACK;
