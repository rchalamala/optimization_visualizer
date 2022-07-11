import { evaluate, randomNumberInRange, gaussianRandom } from './Components'

const InitializePopulation = (populationSize, functionEquation, lowerBound, upperBound, dimension) => {
    let population = new Array(populationSize);
    
    for (let i = 0; i < populationSize; ++i) {
        if (dimension === 2) {
            population[i] = [randomNumberInRange(lowerBound, upperBound)];
        } else {
            population[i] = [randomNumberInRange(lowerBound, upperBound), randomNumberInRange(lowerBound, upperBound)];
        }
        let fitness = evaluate(functionEquation, population[i]);
        population[i].push(fitness);
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

const Mutate = (parent, lowerBound, upperBound, dimension) => {
    let child = [];

    let gene = randomNumberInRange(0, dimension - 1);

    for(let i = 0; i < dimension - 1; ++i) {
        child.push(parent[i]);
        if(i === gene) {
            child[i] += gaussianRandom(0, (upperBound - lowerBound));
        }
    }

    return child;
}
// -cos(x)*cos(y)*e^(-((x)-pi)^2-((y)-pi)^2) [-100, 100]
// -(1+cos(12*sqrt(x^2+y^2)))/(0.5*(x^2+y^2)+2) [-5.12, 5.12]
const GeneticAlgorithm = (populationSize, currentPopulationAndFitness, functionEquation, lowerBound, upperBound, dimension, eliteCount, crossoverProbability) => {
    if (currentPopulationAndFitness[0].length === 0) {
        return InitializePopulation(populationSize, functionEquation, lowerBound, upperBound, dimension);
    }

    let currentPopulation = new Array(populationSize);

    let populationFitness = new Array(populationSize);

    let indices = new Array(populationSize);

    for (let i = 0; i < populationSize; ++i) {
        currentPopulation[i] = currentPopulationAndFitness[i].slice(0, currentPopulationAndFitness[i].length - 1);

        populationFitness[i] = currentPopulationAndFitness[i][currentPopulationAndFitness[i].length - 1];

        indices[i] = i;
    }

    // Rank Scaling

    indices.sort(function (lhs, rhs) { return populationFitness[lhs] < populationFitness[rhs] ? -1 : populationFitness[lhs] > populationFitness[rhs] ? 1 : 0; });

    let newPopulation = new Array(populationSize);

    for (let i = 0; i < populationSize; ++i) {
        newPopulation[i] = currentPopulation[indices[i]];

        if(i === 0) {
            console.log(currentPopulation[indices[i]]);
            console.log(populationFitness[indices[i]]);
        }

        populationFitness[i] = 1 / Math.sqrt(i + 1);
    }

    let crossoverCount = Math.floor(crossoverProbability * populationSize);

    if (crossoverCount % 2) {
        crossoverCount -= 1;
    }

    let sum = 0;

    for (let i = 0; i < populationSize; ++i) {
        currentPopulation[i] = newPopulation[i];
        if(i >= eliteCount && i < eliteCount + crossoverCount) {
            sum += populationFitness[eliteCount + i];
        }
    }

    let step = sum / crossoverCount;

    let randomOffset = Math.random() * step;

    let currentSum = 0;
    let stepIndex = 0;

    for (let i = 0; i < crossoverCount; i += 2) {
        while (currentSum < i * step + randomOffset) {
            currentSum += populationFitness[eliteCount + stepIndex];
            stepIndex += 1;
        }

        let offspring = [currentPopulation[eliteCount + stepIndex], []];

        while (currentSum < (i + 1) * step + randomOffset) {
            currentSum += populationFitness[eliteCount + stepIndex];
            stepIndex += 1;
        }

        offspring[1] = currentPopulation[eliteCount + stepIndex];

        offspring = Crossover(offspring[0], offspring[1], dimension);

        newPopulation[eliteCount + i] = offspring[0];
        newPopulation[eliteCount + i + 1] = offspring[1];
    }

    for(let i = 0; i < populationSize - eliteCount - crossoverCount; ++i) {
        newPopulation[eliteCount + crossoverCount + i] = Mutate(currentPopulation[eliteCount + crossoverCount + i], lowerBound, upperBound, dimension);
    }

    for(let i = 0; i < populationSize; ++i) {
        newPopulation[i].push(evaluate(functionEquation, newPopulation[i]));
    }

    return newPopulation;

}

export { GeneticAlgorithm };