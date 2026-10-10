import {verifyBundle} from './lib/meta-audit-bundle.mjs';
const args=process.argv.slice(2),at=args.indexOf('--bundle');
if(at<0||!args[at+1])throw Error('Usage: node scripts/verify-meta-audit-bundle.mjs --bundle DIRECTORY');
const {manifest}=verifyBundle(args[at+1]);
console.log(JSON.stringify({bundleSha256:manifest.bundleSha256,files:manifest.files.length,spots:manifest.spotCount,byStreet:manifest.byStreet,certificationEffect:'NONE'}));
