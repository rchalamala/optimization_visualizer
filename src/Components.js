function evaluate(functionEquation, x) {
    const app = window.mainDisplay;

    console.log("Function value evaluated");

    return x === "" ? "" : app.evalCommandCAS(functionEquation.replace(/x/g, "(" + x + ")"));
}

function randomNumberInRange(minimum, maximum) {
    console.log("Random number generated");

    return Math.random() * (maximum - minimum) + minimum;
}

function addPoints(functionEquation, values) {
    const app = window.mainDisplay;

    let labels = [];

    for (let i = 0; i < values.length; ++i) {
        const label = app.evalCommandGetLabels("(" + values[i].join() + "," + evaluate(functionEquation, values[i].slice(0, values[i].length)) + ")");
        labels.push(label);
    }

    return labels;
}

function removePoints(labels) {
    const app = window.mainDisplay;

    for (let i = 0; i < labels.length; ++i) {
        app.deleteObject(labels[i])
    }
}

export {evaluate, randomNumberInRange, addPoints, removePoints};