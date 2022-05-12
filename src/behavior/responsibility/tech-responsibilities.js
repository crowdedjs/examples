import AResponsibilityFactory from "./aresponsibility-factory.js"
import TakeVitalsResponsibility from "./take-vitals.js"
import TechEKGDo from "./teck-ekg-do.js";
import TechEKGTakePatientToResponsibility from "./tech-ekg-rpatient.js"
import TechCATPickupResponsibility from "./tech-cat-pickup.js"
import TechXRayPickupResponsibility from "./tech-xray-pickup"
import ACK from "./ack.js"

 class TechResponsibilities extends AResponsibilityFactory {

	
	 get(entry, medicalStaff) {
		
		medicalStaff.amIdle = false;

		if (Hospital.aTeam[3] == null) {
			Hospital.aTeam[3] = medicalStaff;
		}

		if (Hospital.emergencyQueue.length > 0 && Hospital.aTeam[3] == medicalStaff) {
			let emergencyPatients = Hospital.computer.entries.filter(i=>i.getPatient().getSeverity() == "ESI1");
			for (let i = 0; i < emergencyPatients.length; i++) {
				let emergencyPatient = emergencyPatients[i];
				emergencyPatient.setTech(medicalStaff);

				if (emergencyPatient.getVitals() == null) {
					//console.log("Checking Emergency Vitals");
					return new TakeVitalsResponsibility(emergencyPatient, medicalStaff);
				}
				else if(emergencyPatient.getEkg() == null){
					//console.log("Checking Emergency EKG");
					return new TechEKGDo(emergencyPatient, medicalStaff);
				}
				else if(emergencyPatient.unacknowledged(ACK.CT_PICKUP)) {
					//console.log("Fetching Emergency Patient");
					emergencyPatient.getPatient().setScan(true);
					return new TechCATPickupResponsibility(emergencyPatient, medicalStaff);
				}
				else if(emergencyPatient.unacknowledged(ACK.XRAY_PICKUP)) {
					emergencyPatient.getPatient().setScan(true);
					return new TechXRayPickupResponsibility(emergencyPatient, medicalStaff);
				}
				else if (!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == null && Hospital.getXRayQueue().length > 0 && !Hospital.isXRay1Occupied() && (emergencyPatient.getPatient() == Hospital.getXRayQueue()[0] || emergencyPatient.getPatient() == Hospital.getXRayQueue()[1])) {
					Hospital.setXRay1Occupied(true);
					emergencyPatient.getPatient().setImagingRoom("XRay 1");
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("XRay 1"));
				}
				else if (!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == null && Hospital.getXRayQueue().length > 0 && !Hospital.isXRay2Occupied() && (emergencyPatient.getPatient() == Hospital.getXRayQueue()[0] || emergencyPatient.getPatient() == Hospital.getXRayQueue()[1])) {
					Hospital.setXRay2Occupied(true);
					emergencyPatient.getPatient().setImagingRoom("XRay 2");
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("XRay 2"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT1Occupied() && (emergencyPatient.getPatient() == Hospital.getCTQueue()[0] || emergencyPatient.getPatient() == Hospital.getCTQueue()[1])) {
					Hospital.setCT1Occupied(true);
					emergencyPatient.getPatient().setImagingRoom("CT 1");
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("CT 1"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT2Occupied() && (emergencyPatient.getPatient() == Hospital.getCTQueue()[0] || emergencyPatient.getPatient() == Hospital.getCTQueue()[1])) {
					Hospital.setCT2Occupied(true);
					emergencyPatient.getPatient().setImagingRoom("CT 2");
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("CT 2"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == "CT 1") {
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("CT 1"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == "CT 2") {
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("CT 2"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == "XRay 1") {
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("XRay 1"));
				}
				else if(!emergencyPatient.getPatient().getScan() && emergencyPatient.getPatient().getImagingRoom() == "XRay 2") {
					return new TechEKGTakePatientToResponsibility(emergencyPatient, medicalStaff, Hospital.getLocationByName("XRay 2"));
				}
			}
		}
		
		if (entry.getTech() == null || entry.getTech() == medicalStaff) {
			entry.setTech(medicalStaff);

			if(entry.getVitals() == null) {
				return new TakeVitalsResponsibility( entry, medicalStaff);
			}
			else if(entry.getEkg() == null){
				return new TechEKGDo(entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.CT_PICKUP)) {
				entry.getPatient().setScan(true);
				return new TechCATPickupResponsibility(entry, medicalStaff);
			}
			else if(entry.unacknowledged(ACK.XRAY_PICKUP)) {
				entry.getPatient().setScan(true);
				return new TechXRayPickupResponsibility(emergencyPatient, medicalStaff);
			}
			else if (!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == null && Hospital.getXRayQueue().length > 0 && !Hospital.isXRay1Occupied() && (entry.getPatient() == Hospital.getXRayQueue()[0] || entry.getPatient() == Hospital.getXRayQueue()[1])) {
				Hospital.setXRay1Occupied(true);
				entry.getPatient().setImagingRoom("XRay 1");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("XRay 1"));
			}
			else if (!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == null && Hospital.getXRayQueue().length > 0 && !Hospital.isXRay2Occupied() && (entry.getPatient() == Hospital.getXRayQueue()[0] || entry.getPatient() == Hospital.getXRayQueue()[1])) {
				Hospital.setXRay2Occupied(true);
				entry.getPatient().setImagingRoom("XRay 2");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("XRay 2"));
			}
			//else if(Hospital.getCTQueue().length > 0 && !Hospital.isCTOccupied() && entry.getPatient() == Hospital.getCTQueue()[0]) {
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT1Occupied() && (entry.getPatient() == Hospital.getCTQueue()[0] || entry.getPatient() == Hospital.getCTQueue()[1])) {
				Hospital.setCT1Occupied(true);
				entry.getPatient().setImagingRoom("CT 1");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == null && Hospital.getCTQueue().length > 0 && !Hospital.isCT2Occupied() && (entry.getPatient() == Hospital.getCTQueue()[0] || entry.getPatient() == Hospital.getCTQueue()[1])) {
				Hospital.setCT2Occupied(true);
				entry.getPatient().setImagingRoom("CT 2");
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 2"));
			}
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == "CT 1") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 1"));
			}
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == "CT 2") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("CT 2"));
			}
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == "XRay 1") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("XRay 1"));
			}
			else if(!entry.getPatient().getScan() && entry.getPatient().getImagingRoom() == "XRay 2") {
				return new TechEKGTakePatientToResponsibility(entry, medicalStaff, Hospital.getLocationByName("XRay 2"));
			}
		}

		medicalStaff.amIdle = true;
		return null;
	}
}

export default TechResponsibilities;