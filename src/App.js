import React, { useRef, useState } from 'react'
import Geogebra from 'react-geogebra'
import { evaluate, removePoints } from './Components'
import { GeneticAlgorithm } from "./GeneticAlgorithm";

function App() {
    const ref = useRef(null);
    const [appletLoaded, setAppletLoaded] = useState(false);
    const [functionEquation, setFunctionEquation] = useState("");
    const [functionEquationLabel, setFunctionEquationLabel] = useState("");
    const [functionValid, setFunctionValid] = useState(false);
    const [populationAndLabels, setPopulationAndLabels] = useState([[], []]);
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(0);
    const [dimension, setDimension] = useState(2);

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

        const selected = ref.current;

        if(event.target.value.search("y") === -1) {
            if(dimension !== 2) {
                setDimension(2);
                app.setPerspective('G');
            }
        } else if (dimension === 2) {
            setDimension(3);
            app.setPerspective('T');
        }

        selected.focus();

        console.log("Function updated");
    }

    const processLowerBound = (event) => {
        setLowerBound(event.target.value);
    }

    const processUpperBound = (event) => {
        setUpperBound(event.target.value);
    }

    const evolveGeneticAlgorithm = () => {
        setPopulationAndLabels(GeneticAlgorithm(200, populationAndLabels[0], populationAndLabels[1], functionEquation, parseFloat(lowerBound), parseFloat(upperBound), parseInt(dimension), 1, 0.8));
    }

    const resetGeneticAlgorithm = () => {
        removePoints(populationAndLabels[1]);

        setPopulationAndLabels([[], []]);
    }

    return (
        <div className="min-h-screen bg-whites flex flex-row">
            <div className="p-6">
                <Geogebra
                    id="mainDisplay"
                    width="400"
                    height="400"
                    showMenuBar={false}
                    showToolBar={false}
                    showAlgebraInput
                    appletOnLoad={appletOnLoad}
                    errorDialogsActive={false}
                    perspective={'G'}
                />
            </div>

            <div className="p-6 flex flex-col">
                <div className="w-half flex flex-col">
                    Equation (in terms of x and y):
                        <input className="border rounded" type="text" value={functionEquation}
                                onChange={changeFunction} ref={ref} disabled={!appletLoaded} />

                    Lower Bound:
                    <input className="border rounded" type="text" value={lowerBound} onChange={processLowerBound}
                        disabled={!appletLoaded} />

                    Upper Bound:
                    <input className="border rounded" type="text" value={upperBound} onChange={processUpperBound}
                            disabled={!appletLoaded} />

                    <button className="border rounded mt-6 w-half" onClick={evolveGeneticAlgorithm} disabled={!appletLoaded || !functionValid}>
                        Generate/Evolve Genetic Algorithm
                    </button>

                    <button className="border rounded mt-6 w-half" onClick={resetGeneticAlgorithm} disabled={!appletLoaded}>
                    Reset Genetic Algorithm
                    </button>
                    </div>
            </div>
        </div>
    );
}

export default App;
