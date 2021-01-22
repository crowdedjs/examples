 class CTResponsibilities extends AResponsibilityFactory{

get(entry, medician) {

		if(entry.unacknowledged(ACK.CT_CAT_DO_SCAN)) {
			Hospital.setCTOccupied(true);
			return new CTCATDoScanResponsibility(entry, medician);
		}
		
		return null;
	}

}

export CTResponsibilities;