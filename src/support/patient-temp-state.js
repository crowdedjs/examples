class PatientTempState{
  static WAITING = 0;
  static FOLLOWING = 1;
  static GO_INTO_ROOM = 2;
  static DONE = 3;

  // needed to have fresh state, as greeter nurse sets new patients to WAITING, and they already were WAITING.
  // previously, the greeter nurse was adding the same patient to the computer multiple times because it didn't check for anything but location.
  static ARRIVED = 4;
}

export default PatientTempState;