function urlParser(window, params) {
  //From https://stackoverflow.com/a/901144/10047920
  const urlParams = new URLSearchParams(window.location.search);
  const objPathParam = urlParams.get('obj');
  const arrivalPathParam = urlParams.get('arrival');
  const secondsOfSimulationParam = urlParams.get('seconds');
  const locationsPathParam = urlParams.get('location');

  if (objPathParam) params.objPath = "./node_modules/@crowdedjs/objs/" + objPathParam;
  if (arrivalPathParam) params.arrivalPath = "./arrivals/" + arrivalPathParam;
  if (secondsOfSimulationParam) params.secondsOfSimulation = secondsOfSimulationParam;
  if (locationsPathParam) params.locationsPath = "./locations/" + locationsPathParam;

  return params;
}

export default urlParser;