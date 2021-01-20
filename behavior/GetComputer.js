// public class GetComputer extends LeafTask<IMedician> {
	

	
// 	@Override
// 	public Status execute() {
// 		IMedician me = getObject();
// 		HospitalModel hospital = HospitalModel.get();
		
// 		switch(me.getMedicianSubclass()) {
// 		case TECH:
// 			me.setComputer(hospital.getLocationByName("TechPlace"));
// 			break;
// 		case NURSE:
// 			me.setComputer(hospital.getLocationByName("NursePlace"));
// 			break;
// 		case RESIDENT:
// 			me.setComputer(hospital.getLocationByName("ResidentStart"));
// 			break;
// 		}
// 		//me.addRoom(hospital.getLocationByName("C1"));
// 		return Status.SUCCEEDED;
// 	}

// 	@Override
// 	protected Task copyTo(Task arg0) {
// 		return arg0;
// 	}

// }