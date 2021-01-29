import ATransportResponsibility from "./atransport.js"
import ACK from "./ACK.js"

class TechCATPickupResponsibility extends ATransportResponsibility {


  constructor(entry, medician) {
    super("Tech CAT Pickup Responsibility", entry, medician, entry.getBed());
  }

  doFinish() {
    this.entry.acknowledge(ACK.CT_PICKUP);
  }
}

export default TechCATPickupResponsibility;