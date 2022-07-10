import React, {useState} from 'react'
import Geogebra from 'react-geogebra'
import {evaluate, randomNumberInRange, addPoints, removePoints} from './Components'
import {GeneticAlgorithm} from "./GeneticAlgorithm";

function App() {
    const [appletLoaded, setAppletLoaded] = useState(false);
    const [functionEquation, setFunctionEquation] = useState("");
    const [functionEquationLabel, setFunctionEquationLabel] = useState("");
    const [functionValid, setFunctionValid] = useState(false);
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

        setFunctionValid(evaluate(event.target.value, 0) !== "" && evaluate(event.target.value, 0) !== "?");

        setFunctionEquation(event.target.value);

        setFunctionEquationLabel(app.evalCommandGetLabels(event.target.value));

        console.log("Function updated");
    }

    const processLowerBound = (event) => {
        setLowerBound(event.target.value);
    }

    const processUpperBound = (event) => {
        setUpperBound(event.target.value);
    }

    const evolveGeneticAlgorithm = () => {
        setPopulationAndLabels(GeneticAlgorithm(100, populationAndLabels[0], populationAndLabels[1], functionEquation, lowerBound, upperBound, 3, 5, 0.8));
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
                    width="400"
                    height="400"
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
