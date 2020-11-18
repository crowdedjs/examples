import chai from "chai"
import greeterNurse from "../data/greeterNurse.js"

const expect = chai.expect;

describe("This blank test should do something", function(){
  it("Should be happy with this test", function(){
    expect(1).to.be.equal(1);
  })
  it("Should be sad with this test", function(){
    expect(1).to.be.equal(10);
  })
})

describe("Greeter nurse", function(){
  it("Has a constructor", function(){
    let greeter = new greeterNurse(null, null, null, null);
    expect(greeter).to.not.be.null;
  })
})