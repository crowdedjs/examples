import ATransportResponsibility from "./atransport.js"
import ACK from "./ack.js"

class TechCATPickupResponsibility extends ATransportResponsibility {


  constructor(entry, medicalStaff) {
    super("Tech CAT Pickup Responsibility", entry, medicalStaff, entry.getBed());
  }

  doFinish() {
    this.entry.acknowledge(ACK.CT_PICKUP);
  }
}

export default TechCATPickupResponsibility;