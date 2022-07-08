import React, {useState} from 'react'
import Geogebra from 'react-geogebra'
import {evaluate, randomNumberInRange, addPoints, removePoints} from './Components'
import {GeneticAlgorithm} from "./GeneticAlgorithm";

function App() {
    const [appletLoaded, setAppletLoaded] = useState(false);
    const [functionEquation, setFunctionEquation] = useState("");
    const [functionEquationLabel, setFunctionEquationLabel] = useState("");
    const [functionValid, setFunctionValid] = useState(false);
    const [inputValue, setInputValue] = useState(0);
    const [outputValue, setOutputValue] = useState(0);
    const [sampleCount, setSampleCount] = useState(0);
    const [sampleLabels, setSampleLabels] = useState([]);
    const [populationAndLabels, setPopulationAndLabels] = useState([[], []]);
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(0);

    const appletOnLoad = () => {
        const app = window.mainDisplay;

        app.setGridVisible(true);

        setAppletLoaded(true)

        console.log("Applet Loaded");
    }

    const changeFunction = (event) => {
        const app = window.mainDisplay;

        if (functionEquationLabel !== "") {
            app.deleteObject(functionEquationLabel)

            console.log("Last object deleted");
        }
        console.log(!appletLoaded || !functionValid)
        console.log(!appletLoaded)
        console.log(!functionValid)

        setFunctionValid(evaluate(event.target.value, 0) !== "" && evaluate(event.target.value, 0) !== "?");

        console.log(functionValid)

        setFunctionEquation(event.target.value);

        setFunctionEquationLabel(app.evalCommandGetLabels(event.target.value));

        console.log("Function updated");

        if (inputValue !== "") {
            setOutputValue(evaluate(event.target.value, inputValue));

            console.log("Function value updated");
        }
    }

    const processInput = (event) => {
        setInputValue(event.target.value);

        console.log("Input value updated");

        setOutputValue(evaluate(functionEquation, event.target.value));

        console.log("Output value updated")
    }


    const generateSamples = () => {
        const app = window.mainDisplay;

        let values = [];

        for (let i = 0; i < sampleCount; ++i) {
            const x = randomNumberInRange(-1, 1);
            values.push(x);
        }

        setSampleLabels(addPoints(functionEquation, values));

        console.log("Generated samples");
    }

    const removeSamples = () => {
        removePoints(sampleLabels);

        console.log("Removed samples");
    }

    const processSampleCount = (event) => {
        setSampleCount(event.target.value);

        console.log("Sample count updated");
    }

    const processLowerBound = (event) => {
        setLowerBound(event.target.value);
    }

    const processUpperBound = (event) => {
        setUpperBound(event.target.value);
    }

    const evolveGeneticAlgorithm = () => {
        console.log(populationAndLabels);
        setPopulationAndLabels(GeneticAlgorithm(10, populationAndLabels[0], populationAndLabels[1], functionEquation, lowerBound, upperBound, 2, 0.8, 0.15));
    }

    const resetGeneticAlgorithm = () => {
        removePoints(populationAndLabels[1]);

        setPopulationAndLabels([[], []]);
    }

    return (
        <div className="min-h-screen bg-slate-500 flex flex-row">
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

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-white m-3 p-3 w-half h-10">
                    Equation (in terms of x): <input className="bg-slate-300" type="text" value={functionEquation}
                                                     onChange={changeFunction} disabled={!appletLoaded}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    Input: <input className="bg-slate-300" type="text" value={inputValue} onChange={processInput}
                                  disabled={!appletLoaded || !functionValid}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    Output: {outputValue}
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    Samples: <input className="bg-slate-300" type="text" value={sampleCount} onChange={processSampleCount}
                                    disabled={!appletLoaded || !functionValid}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={generateSamples} disabled={!appletLoaded || !functionValid}>
                        Generate Samples
                    </button>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={removeSamples} disabled={!appletLoaded || !functionValid}>
                        Remove Samples
                    </button>
                </div>


                <div className="bg-white m-3 p-3 w-half h-10">
                    Lower Bound: <input className="bg-slate-300" type="text" value={lowerBound} onChange={processLowerBound}
                                    disabled={!appletLoaded || !functionValid}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    Upper Bound: <input className="bg-slate-300" type="text" value={upperBound} onChange={processUpperBound}
                                        disabled={!appletLoaded || !functionValid}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={evolveGeneticAlgorithm} disabled={!appletLoaded || !functionValid}>
                        Generate/Evolve Genetic Algorithm
                    </button>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={resetGeneticAlgorithm} disabled={!appletLoaded || !functionValid}>
                        Reset Genetic Algorithm
                    </button>
                </div>
            </div>

        </div>
    );
}

export default App;
