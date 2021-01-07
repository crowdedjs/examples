class ComputerEntry {
    es; //int
    status; // ComputerEntryStatus -> string
    lastChange = new Date(); // Date
    patient; // APatient
    bed; //ARoom
    chiefComplaint; //string
    arr = new Date(); // Date
    vitals; //string
    comments; //string
    rn; // AMedician
    res; // AMedician
    md; //AMedician
    unack = []; // ArrayList<String>
    imageStat; //string
    bed2; //string
    bedReq; //string
    admitMD; //string
    reg; //string
    ekg; //string
    answeredQuestions = false;

   constructor(patient, complaint) //APatient, string
   {
        this.patient = patient;
        this.chiefComplaint = complaint;
   }

   get AnsweredQuestions() {
       return this.answeredQuestions;
   }

   set AnsweredQuestions(answeredQuestions) {
        this.answeredQuestions = answeredQuestions;
        change();
   }

   get Es() {
       return this.es;
   }

   set Es(es) {
       this.es = es;
       change();
   }

   get Status() {
       return this.status;
   }

   set Status(status) {
       this.status = status;
       change();
   }

   get LastChange() {
       return this.lastChange;
   }

   set LastChange(lastChange) {
        this.lastChange = lastChange;
        change();
   }

   get Patient() {
		return this.patient;
	}

	set Patient(patient) {
		this.patient = patient;
		change();
	}

	get Bed() {
		return this.bed;
	}

	set Bed(bed) {
		this.bed = bed;
		change();
	}

    get ChiefComplaint() {
        return this.chiefComplaint;
    }

    set ChiefComplaint(chiefComplaint) {
        this.chiefComplaint = chiefComplaint;
        change();
    }

    get Arr() {
        return this.arr;
    }

    set Arr(arr) {
        this.arr = arr;
        change();
    }

    get Vitals() {
        return this.vitals;
    }

    set Vitals(vitals) {
        this.vitals = vitals;
        change();
    }

    get Comments() {
        return this.comments;
    }

    set Comments(comments) {
        this.comments = comments;
        change();
    }

    get Rn() {
		return this.rn;
	}

	set Rn(rn) {
		this.rn = rn;
		change();
	}

	get Res() {
		return this.res;
	}

	set Res(res) {
		this.res = res;
		change();
	}

	get Md() {
		return this.md;
	}

	set Md(md) {
		this.md = md;
		change();
	}

    get Unack() {
        return this.unack;
    }

    set Unack(unack) {
        this.unack = unack;
        change();
    }

    get ImageStat() {
        return this.imageStat;
    }

    set ImageStat(imageStat) {
        this.imageStat = imageStat;
        change();
    }

    get Bed2() {
        return this.bed2;
    }

    set Bed2(bed2) {
        this.bed2 = bed2;
        change();
    }

    get BedReq() {
        return this.bedReq;
    }

    set BedReq(bedReq) {
        this.bedReq = bedReq;
        change();
    }

    get AdmitMD() {
        return this.admitMD;
    }

    set AdmitMD(admitMD) {
        this.admitMD = admitMD;
        change();
    }

    get Reg() {
        return this.reg;
    }

    set Reg(reg) {
        this.reg = reg;
        change();
    }

    get Ekg() {
        return this.ekg;
    }

    set Ekg(ekg) {
        this.ekg = ekg;
        change();
    }

    unacknowledged(string) {
        return this.unack.contains(string);
    }

    acknowledge(string) {
        this.unack.remove(string);
    }

    addUnacknowledged(string) {
        this.unack.add(string);
    }

    change() {
        this.lastChange = new Date();
        
        // HospitalModel.get().computer.print();
        // replace this with HospitalModel equivalent in this sim
    }


   toString() {
    toReturn = "";
    toReturn += es + ",";
    toReturn += status + ", ";
    toReturn += lastChange + ", ";
    toReturn += patient + ", ";
    toReturn += bed + ", ";
    toReturn += chiefComplaint + ", ";
    toReturn += arr + ", ";
    toReturn += vitals + ", ";
    toReturn += comments + ", ";
    toReturn += rn + ", ";
    toReturn += res + ", ";
    toReturn += md + ", ";
    toReturn += unack + ", ";
    toReturn += imageStat + ", ";
    toReturn += bed2 + ", ";
    toReturn += bedReq + ", ";
    toReturn += admitMD + ", ";
    toReturn += reg + ", ";
    toReturn += ekg + ", ";
    toReturn += answeredQuestions + ", ";
    
    return toReturn;
    }

}

export default ComputerEntry;