//Strip behavior definitions out of agentConstants when we serialize them with JSON
//to prevent circular loops.

function replacer(key, value) {
  // if (key === 'behavior' || key === 'instructor' || key==='currentPatient' || key==="medician")
  //   return undefined;
  // return value;
  let validKeys = ["", "idx", "id", "destX", "destY", "destZ", "startX", "startY", "startZ"]
  if(validKeys.includes(key) || !Number.isNaN(Number(key)))
    return value;
  return undefined;
}

export default replacer;