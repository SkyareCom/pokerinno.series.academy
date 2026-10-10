import {trainingSpots} from '../dist/simulator-spots.js';
import {auditStrategicDuplicates} from '../dist/simulator-uniqueness.js';
const report=auditStrategicDuplicates(trainingSpots);
console.log(JSON.stringify({total:report.total,unique:report.unique,duplicateCount:report.duplicateCount,examples:report.duplicates.slice(0,20)},null,2));
const missingContext=trainingSpots.filter(s=>s.street!=='pre'&&(!s.bettingLine||!s.aggressor||!s.effectiveStack||!s.villainRange));
const missingProvenance=trainingSpots.filter(s=>!s.solver?.solveId);
console.log(JSON.stringify({missingPostflopContext:missingContext.length,missingSolverReference:missingProvenance.length},null,2));
if(report.duplicateCount) {
 console.error('BLOCKED: repeated strategic decisions must not be released as new spots.');
 process.exitCode=1;
}

// A candidate dataset is not release-ready if its decisions lack complete strategic context.
if(missingContext.length){
 console.error('BLOCKED: postflop candidates without complete betting context cannot be certified unique.');
 process.exitCode=1;
}
