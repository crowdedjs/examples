import ATransportResponsibility from "./atransport.js"
import ACK from "./ack.js"

class TechXRayPickupResponsibility extends ATransportResponsibility {


  constructor(entry, medicalStaff) {
    super("Tech XRay Pickup Responsibility", entry, medicalStaff, entry.getBed());
  }

  doFinish() {
    this.entry.acknowledge(ACK.XRAY_PICKUP);
  }
}

export default TechXRayPickupResponsibility;