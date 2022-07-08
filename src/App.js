import React, { useState} from 'react'
import Geogebra from 'react-geogebra'

function App() {
  const [appletLoaded, setAppletLoaded] = useState(false);
  const [currentFunction, setCurrentFunction] = useState("");
  const [currentFunctionLabel, setCurrentFunctionLabel] = useState("");
  const [inputValue, setInputValue] = useState(0);
  const [outputValue, setOutputValue] = useState(0);
  const [sampleCount, setSampleCount] = useState(0);
  const [sampleLabels, setSampleLabels] = useState([]);

  const appletOnLoad = () => {
    const app = window.mainDisplay;

    app.setGridVisible(true);

    setAppletLoaded(true)

    console.log("Applet Loaded");
  }

  const evaluate = (functionEquation, x) => {
    const app = window.mainDisplay;

    console.log("Function value evaluated");

    return x === "" ? "" : app.evalCommandCAS(functionEquation.replace(/x/g, "(" + x + ")"));
  }

  const changeFunction = (event) => {
    const app = window.mainDisplay;

    if(currentFunctionLabel !== "") {
      app.deleteObject(currentFunctionLabel)

      console.log("Last object deleted");
    }

    setCurrentFunction(event.target.value);

    setCurrentFunctionLabel(app.evalCommandGetLabels(event.target.value));

    console.log("Function updated");

    if(inputValue !== "") {
      setOutputValue(evaluate(event.target.value, inputValue));

      console.log("Function value updated");
    }
  }

  const processInput = (event) => {
    setInputValue(event.target.value);

    console.log("Input value updated");

    setOutputValue(evaluate(currentFunction, event.target.value));

    console.log("Output value updated")
  }

  const randomNumberInRange = (minimum, maximum) => {
    return Math.random() * (maximum - minimum) + minimum;
  }

  const generateSamples = () => {
    const app = window.mainDisplay;

    for(var i = 0; i < sampleCount; ++i) {
      const x = randomNumberInRange(-10, -5);
      const label = app.evalCommandGetLabels("(" + x + "," + evaluate(currentFunction, x) + ")");
      setSampleLabels(sampleLabels => [...sampleLabels, label]);
    }

    console.log("Generated samples");
  }

  const removeSamples = () => {
    const app = window.mainDisplay;

    for(var i = 0; i < sampleLabels.length; ++i) {
      app.deleteObject(sampleLabels[i])
    }

    setSampleLabels([]);

    console.log("Removed samples");
  }

  const processSampleCount = (event) => {
    setSampleCount(event.target.value);

    console.log("Sample count updated");
  }

  return (
    <div className="min-h-screen bg-slate-500">
      <div className="mx-6 pt-6">
        <Geogebra
          id="mainDisplay"
          width="800"
          height="600"
          showMenuBar
          showToolBar
          showAlgebraInput
          appletOnLoad={appletOnLoad}
          errorDialogsActive={false}
          perspective={'G'}
        />
      </div>

      <div className="bg-white m-6 p-6 w-half">
        Equation (in terms of x): <input className="bg-slate-300" type="text" value={currentFunction} onChange={changeFunction} disabled={!appletLoaded}/>
      </div>

      <div className="bg-white m-6 p-6 w-half">
        Input: <input className="bg-slate-300" type="text" value={inputValue} onChange={processInput} disabled={!appletLoaded}/>
      </div>

      <div className="bg-white m-6 p-6 w-half">
        Output: {outputValue}
      </div>

      <div className="bg-white m-6 p-6 w-half">
        Samples: <input className="bg-slate-300" type="text" value={sampleCount} onChange={processSampleCount} disabled={!appletLoaded}/>
      </div>

      <div className="bg-white m-6 p-6 w-half">
        <button className="bg-slate-300" onClick={generateSamples} disabled={!appletLoaded}>
          Generate Samples
        </button>
      </div>

      <div className="bg-white m-6 p-6 w-half">
        <button className="bg-slate-300" onClick={removeSamples} disabled={!appletLoaded}>
          Remove Samples
        </button>
      </div>

    </div>
  );
}

export default App;
