import ComputerEntryStatus from "./ComputerEntryStatus.js";

class ComputerEntry {
  es; //int
  status; //ComputerEntryStatus
  lastChange = new Date(); //Date
  patient; //IPatient
  bed; //IRoom
  chiefComplaint; //String
  arr = new Date(); //Date
  vitals; //String
  comments; //String
  rn; //IMedician
  res; //IMedician
  md; //IMedician
  unack = []; //Array of strings
  imageStat; //String
  bed2; //String
  bedReq; //String
  admitMD; //String
  reg; //String
  ekg; //EKG
  answeredQuestions = false; //bool



  isAnsweredQuestions() {
    return this.answeredQuestions;
  }

  setAnsweredQuestions(answeredQuestions) {
    this.answeredQuestions = answeredQuestions;
    this.change();
  }

  constructor(patient, complaint) {
    this.patient = patient;
    this.chiefComplaint = complaint;
  }

  toString() {
    let toReturn = "";
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

  getEs() {
    return this.es;
  }

  setEs(es) {
    this.es = es;
    this.change();
  }

  getStatus() {
    return this.status;
  }

  setStatus(status) {
    this.status = status;
    this.change();
  }

  getLastChange() {
    return this.lastChange;
  }

  setLastChange(lastChange) {
    this.lastChange = lastChange;
    this.change();
  }

  getPatient() {
    return this.patient;
  }

  setPatient(patient) {
    this.patient = patient;
    this.change();
  }

  getBed() {
    return this.bed;
  }

  setBed(bed) {
    this.bed = bed;
    this.change();
  }

  getChiefComplaint() {
    return this.chiefComplaint;
  }

  setChiefComplaint(chiefComplaint) {
    this.chiefComplaint = chiefComplaint;
    this.change();
  }

  getArr() {
    return this.arr;
  }

  setArr(arr) {
    this.arr = arr;
    this.change();
  }

  getVitals() {
    return this.vitals;
  }

  setVitals(vitals) {
    this.vitals = this.vitals;
    this.change();
  }

  getComments() {
    return this.comments;
  }

  setComments(comments) {
    this.comments = comments;
    this.change();
  }

  getRn() {
    return this.rn;
  }

  setRn(rn) {
    this.rn = rn;
    this.change();
  }

  getRes() {
    return this.res;
  }

  setRes(res) {
    this.res = res;
    this.change();
  }

  getMd() {
    return this.md;
  }

  setMd(md) {
    this.md = md;
    this.change();
  }

  getUnack() {
    return this.unack;
  }

  setUnack(unack) {
    this.unack = unack;
    this.change();
  }

  getImageStat() {
    return this.imageStat;
  }

  setImageStat(imageStat) {
    this.imageStat = imageStat;
    this.change();
  }

  getBed2() {
    return this.bed2;
  }

  setBed2(bed2) {
    this.bed2 = bed2;
    this.change();
  }

  getBedReq() {
    return this.bedReq;
  }

  setBedReq(bedReq) {
    this.bedReq = bedReq;
    this.change();
  }

  getAdmitMD() {
    return this.admitMD;
  }

  setAdmitMD(admitMD) {
    this.admitMD = admitMD;
    this.change();
  }

  getReg() {
    return this.reg;
  }

  setReg(reg) {
    this.reg = reg;
    this.change();
  }

  getEkg() {
    return this.ekg;
  }

  setEkg(ekg) {
    this.ekg = ekg;
    this.change();
  }

  change() {
    this.lastChange = new Date();
    HospitalModel.get().computer.print(); //TODO: Figure out how to redo this.
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




}


export default ComputerEntry;