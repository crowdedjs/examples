import AMedician from "../support/AMedician.js"
import ARoom from "../support/ARoom.js"

class AssignComputer {
    execute() {
        // IMedician me = getObject();
        // IRoom room = HospitalModel.get().getLocationByName(name);
        let me = new AMedician(null, null, null, null, null);
        let room = new Vector3(x,y,z); //CT 1
        
        me.setComputer(room);

        // return Success state
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
    }

    // copyTo(arg0) {
    //     return arg0;
    // }
}