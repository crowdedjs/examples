import chai from "chai"
//import mocha from "mocha"
import greeterNurse from "../data/greeterNurse.js"
import APatient from "../support/APatient.js"
import Computer from "../support/Computer.js"
import ComputerEntry from "../support/ComputerEntry.js"


const expect = chai.expect;
// var assert = require('assert');
// var expect = require('chai').expect;
// var should = require('chai').should();


// describe("This blank test should do something", function(){
//   it("Should be happy with this test", function(){
//     expect(1).to.be.equal(1);
//   })
//   it("Should be sad with this test", function(){
//     expect(1).to.be.equal(10);
//   })
// })

// describe("Greeter nurse", function(){
//   it("Has a constructor", function(){
//     let greeter = new greeterNurse(null, null, null, null);
//     expect(greeter).to.not.be.null;
//   })
// })


describe("Computer", function(){
  it("Patient, ComputerEntry, and Computer Testing", function(){
    let samplePatient = new APatient(null, null, "ESI5", null);
    //expect(samplePatient.Severity).to.be.equal("ESI5");
    
    let sampleComplaint = "My butt has a crack in it.";
    let sampleEntry = new ComputerEntry(samplePatient, sampleComplaint);
    //expect(sampleEntry.ChiefComplaint).to.be.equal(sampleComplaint);

    let sampleComputer = new Computer();

    sampleComputer.add(sampleEntry);
    expect(sampleEntry).to.be.equal(sampleComputer.getEntry(samplePatient));

})

  })
