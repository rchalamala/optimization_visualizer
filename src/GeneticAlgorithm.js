import React, {useState} from 'react'
import {evaluate, randomNumberInRange, addPoints, removePoints} from './Components'

const InitializePopulation = (populationSize, lowerBound, upperBound, dimension) => {
    let population = [];

    for(let i = 0; i < populationSize; ++i) {
        if(dimension === 2) {
            population.push([randomNumberInRange(lowerBound, upperBound)]);
        } else {
            population.push([randomNumberInRange(lowerBound, upperBound), randomNumberInRange(lowerBound, upperBound)]);
        }
    }

    return population;
}

const GeneticAlgorithm = (populationSize, currentPopulation, currentPopulationLabels, functionEquation, lowerBound, upperBound, dimension, crossoverProbability, mutationProbability) => {
    const app = window.mainDisplay;

    if(currentPopulation.length === 0) {
        let population = InitializePopulation(populationSize, lowerBound, upperBound, dimension);

        return [population, addPoints(functionEquation, population)];
    }

    removePoints(currentPopulationLabels);

    let currentPopulationFitness = [];

    for(let i = 0; i < populationSize; ++i) {
        currentPopulationFitness.push(evaluate(functionEquation, currentPopulation[i]))
    }

    // Rank Scaling


}

export {GeneticAlgorithm};