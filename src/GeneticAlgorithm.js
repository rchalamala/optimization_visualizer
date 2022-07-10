import { evaluate, randomNumberInRange, gaussianRandom, addPoints, removePoints } from './Components'

const InitializePopulation = (populationSize, lowerBound, upperBound, dimension) => {
    let population = new Array(populationSize);

    for (let i = 0; i < populationSize; ++i) {
        if (dimension === 2) {
            population[i] = [randomNumberInRange(lowerBound, upperBound)];
        } else {
            population[i] = [randomNumberInRange(lowerBound, upperBound), randomNumberInRange(lowerBound, upperBound)];
        }
    }

    return population;
}

const Crossover = (parent1, parent2, dimension) => {
    // https://apmonitor.com/me575/uploads/Main/chap6_genetic_evolutionary_optimization_v2.pdf
    let child1 = [];
    let child2 = [];

    let a = 0.5;
    
    for(let i = 0; i < dimension - 1; ++i) {
        let d = Math.abs(parent1[i] - parent2[i]);

        let bounds = [Math.min(parent1[i], parent2[i]) - a * d, Math.max(parent1[i], parent2[i]) + a * d];

        child1.push(randomNumberInRange(bounds[0], bounds[1]));
        child2.push(randomNumberInRange(bounds[0], bounds[1]));
    }

    return [child1, child2];
}

const Mutate = (parent, dimension) => {
    let child = [];

    let gene = randomNumberInRange(0, dimension - 1);

    for(let i = 0; i < dimension - 1; ++i) {
        child.push(parent[i]);
        if(i === gene) {
            child[i] += gaussianRandom(0, 1);
        }
    }

    return child;
}
// -cos(x)*cos(y)*e^(-((x)-pi)^2-((y)-pi)^2) [-100, 100]
// -(1+cos(12*sqrt(x^2+y^2)))/(0.5*(x^2+y^2)+2) [-5.12, 5.12]
const GeneticAlgorithm = (populationSize, currentPopulation, currentPopulationLabels, functionEquation, lowerBound, upperBound, dimension, eliteCount, crossoverProbability) => {
    if (currentPopulation.length === 0) {
        let population = InitializePopulation(populationSize, parseFloat(lowerBound), parseFloat(upperBound), dimension);

        return [population, addPoints(functionEquation, population)];
    }

    removePoints(currentPopulationLabels);

    let currentPopulationFitness = new Array(populationSize);
    let indices = new Array(populationSize);

    for (let i = 0; i < populationSize; ++i) {
        currentPopulationFitness[i] = evaluate(functionEquation, currentPopulation[i]);
        indices[i] = i;
    }

    // Rank Scaling

    indices.sort(function (lhs, rhs) { return currentPopulationFitness[lhs] < currentPopulationFitness[rhs] ? -1 : currentPopulationFitness[lhs] > currentPopulationFitness[rhs] ? 1 : 0; });

    let newPopulation = new Array(populationSize);

    for (let i = 0; i < populationSize; ++i) {
        newPopulation[i] = currentPopulation[indices[i]];
        if(i === 0) {
            console.log(currentPopulation[indices[i]]);
            console.log(currentPopulationFitness[indices[i]]);
        }
        currentPopulationFitness[i] = 1 / Math.sqrt(i + 1);
    }

    let crossoverCount = Math.floor(crossoverProbability * populationSize);

    if (crossoverCount % 2) {
        crossoverCount -= 1;
    }

    let sum = 0;

    for (let i = 0; i < populationSize; ++i) {
        currentPopulation[i] = newPopulation[i];
        if(i >= eliteCount && i < eliteCount + crossoverCount) {
            sum += currentPopulationFitness[eliteCount + i];
        }
    }

    let step = sum / crossoverCount;

    let randomOffset = Math.random() * step;

    let currentSum = 0;
    let stepIndex = 0;

    for (let i = 0; i < crossoverCount; i += 2) {
        while (currentSum < i * step + randomOffset) {
            currentSum += currentPopulationFitness[eliteCount + stepIndex];
            stepIndex += 1;
        }

        let offspring = [currentPopulation[eliteCount + stepIndex], []];

        while (currentSum < (i + 1) * step + randomOffset) {
            currentSum += currentPopulationFitness[eliteCount + stepIndex];
            stepIndex += 1;
        }

        offspring[1] = currentPopulation[eliteCount + stepIndex];

        offspring = Crossover(offspring[0], offspring[1], dimension);

        newPopulation[eliteCount + i] = offspring[0];
        newPopulation[eliteCount + i + 1] = offspring[1];
    }

    for(let i = 0; i < populationSize - eliteCount - crossoverCount; ++i) {
        newPopulation[eliteCount + crossoverCount + i] = Mutate(currentPopulation[eliteCount + crossoverCount + i], dimension);
    }

    return [newPopulation, addPoints(functionEquation, newPopulation)];

}

export { GeneticAlgorithm };