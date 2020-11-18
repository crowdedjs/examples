import chai from "chai"

const expect = chai.expect;

describe("This blank test should do something", function(){
  it("Should be happy with this test", function(){
    expect(1).to.be.equal(1);
  })
  it("Should be sad with this test", function(){
    expect(1).to.be.equal(10);
  })
})