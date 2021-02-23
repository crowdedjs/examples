class Computer {
  entries =  [];//List<ComputerEntry>
    
    add(entry) {
      this.entries.push(entry);
      //console.log(entry);
    }
    
    print() {
      this.entries.forEach(c=>console.log(c));
    }
  
    getEntry(patient) {
      if(!patient) return null;
      return this.entries.find(c=>c.patient.id == patient.id)
      
    }
  
  }
  export default Computer;
