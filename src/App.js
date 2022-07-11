import React, {useState} from 'react'
import Geogebra from 'react-geogebra'
import {evaluate} from './Components'
import {GeneticAlgorithm} from "./GeneticAlgorithm";
import Plot from 'react-plotly.js';

function App() {
    const [appletLoaded, setAppletLoaded] = useState(false);
    const [functionEquation, setFunctionEquation] = useState("");
    const [functionEquationLabel, setFunctionEquationLabel] = useState("");
    const [functionValid, setFunctionValid] = useState(false);
    const [population, setPopulation] = useState([[], []]);
    const [lowerBound, setLowerBound] = useState(0);
    const [upperBound, setUpperBound] = useState(0);
    const [dimension, setDimension] = useState(2);
    const [x, setX] = useState([]);
    const [y, setY] = useState([]);
    const [z, setZ] = useState([]);
    const [xSteps, setXSteps] = useState([]);
    const [ySteps, setYSteps] = useState([]);
    const [zSteps, setZSteps] = useState([]);

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

    const processDimension = (event) => {
        setDimension(event.target.value);
    }

    const generatePlot = () => {
        setXSteps([]);
        setYSteps([]);
        setZSteps([]);

        if(parseInt(dimension) === 2) {
            let n = 250;
            let step = (parseFloat(upperBound) - parseFloat(lowerBound)) / (n - 1);

            for(let i = 0; i < n; ++i) {
                let xStep = parseFloat(lowerBound) + i * step;
                setXSteps(xSteps => [...xSteps, xStep]);
                setYSteps(ySteps => [...ySteps, evaluate(functionEquation, [xStep])]);
            }
        } else {
            let n = 50;
            let step = (parseFloat(upperBound) - parseFloat(lowerBound)) / (n - 1);

            for(let i = 0; i < n; ++i) {
                let xStep = parseFloat(lowerBound) + i * step;
                setXSteps(xSteps => [...xSteps, xStep]);
                for(let j = 0; j < n; ++j) {
                    let yStep = parseFloat(lowerBound) + j * step;
                    setYSteps(ySteps => [...ySteps, yStep]);
                    setZSteps(zSteps => [...zSteps, evaluate(functionEquation, [xStep, yStep])]);
                }
            }
        }
    }

    const resetPlot = (event) => {
        setXSteps([]);
        setYSteps([]);
        setZSteps([]);
    }

    const evolveGeneticAlgorithm = () => {
        //setPopulation(GeneticAlgorithm(20, population[0], population[1], functionEquation, lowerBound, upperBound, 2, 1, 0.8));
        let newPopulation = GeneticAlgorithm(200, population, functionEquation, parseFloat(lowerBound), parseFloat(upperBound), parseInt(dimension), 10, 0.8);

        setX([]);
        setY([]);
        setZ([]);

        for(let i = 0; i < newPopulation.length; ++i) {
            setX(x => [...x, newPopulation[i][0]]);
            setY(y => [...y, newPopulation[i][1]]);
            if(newPopulation[i].length === 3) {
                setZ(z => [...z, newPopulation[i][2]]);
            }
        }

        setPopulation(newPopulation);
    }

    const resetGeneticAlgorithm = () => {
        setPopulation([[], []]);

        setX([]);
        setY([]);
        setZ([]);
    }

    return (
        <div className="min-h-screen bg-slate-500 flex flex-row">
            <div className="flex flex-col">
                <div className="mx-6 pt-6">
                    <Geogebra
                        id="mainDisplay"
                        width="0"
                        height="0"
                        showMenuBar={false}
                        showToolBar={false}
                        showAlgebraInput
                        appletOnLoad={appletOnLoad}
                        errorDialogsActive={false}
                        perspective={'G'}
                    />
                </div>

                <div className="mx-6 pt-6">
                    <Plot
                        data={[
                            {
                                x: x,
                                y: y,
                                z: (parseInt(dimension) === 3 ? z : []),
                                type: (parseInt(dimension) === 3 ? 'scatter3d' : 'scatter'),
                                mode: 'markers',
                                marker: {color: 'blue', size: (parseInt(dimension) === 3 ? 1 : 5)}
                            },
                            {
                                x: xSteps,
                                y: ySteps,
                                z: (parseInt(dimension) === 3 ? zSteps : []),
                                type: (parseInt(dimension) === 3 ? 'surface' : 'scatter'),
                                mode: 'lines',
                                marker: {color: 'red'}
                            }
                        ]}
                        layout={ {width: 400, height: 400, autosize: false, title: 'A Fancy Plot'}}
                    />
                </div>
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
                    Dimension: <input className="bg-slate-300" type="text" value={dimension} onChange={processDimension}
                                        disabled={!appletLoaded || !functionValid}/>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={generatePlot} disabled={!appletLoaded || !functionValid}>
                        Generate Plot
                    </button>
                </div>

                <div className="bg-white m-3 p-3 w-half h-10">
                    <button className="bg-slate-300" onClick={resetPlot} disabled={!appletLoaded || !functionValid}>
                        Reset Plot
                    </button>
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
