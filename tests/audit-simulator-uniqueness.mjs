import {trainingSpots} from '../dist/simulator-spots.js';
import {auditStrategicDuplicates} from '../dist/simulator-uniqueness.js';
const report=auditStrategicDuplicates(trainingSpots);
console.log(JSON.stringify({total:report.total,unique:report.unique,duplicateCount:report.duplicateCount,examples:report.duplicates.slice(0,20)},null,2));
if(report.duplicateCount) {
 console.error('BLOCKED: repeated strategic decisions must not be released as new spots.');
 process.exitCode=1;
}
