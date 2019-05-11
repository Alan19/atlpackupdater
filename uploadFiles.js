/*
This script will zip the script, resources, configs, and structures folder.
Then, it will upload them to the ATL website using ``PUT /admin/pack/[pack name]/file/[folder name]/[file name]``.
Finally, it will modify the XML by fetching the JSON version with ```GET /admin/pack/[pack name]/versions/[version name]/json```.
Then it will upload it with ```PUT /admin/pack/[pack name]/versions/[version name]/xml```
 */
const fs = require("fs");
const settings = fs.readFileSync('settings.json');
const jsonContent = JSON.parse(settings);
const api = require('atlauncher-api')({
    api_key: jsonContent.api_key
});
const zipFolder = require('zip-folder');

const foldersToZip = ['../config', '../scripts', '../structures', '../resources'];

function getFormattedDate() {
    const today = new Date();
    return `${today.getFullYear()}${('0' + (today.getMonth() + 1)).slice(-2)}${today.getDate()}`;
}

const formattedDate = getFormattedDate();
foldersToZip.forEach(function(folder){
   zipFolder(folder, `${folder + formattedDate}.zip`, (err) => {
       if(err){
           console.log(`Failed to zip${folder}`)
       }
       else{
           console.log(`Successfully zipped${folder}`)
       }
   });
});
api.admin.pack.info(jsonContent.pack_name, (err, info) => {
   //Get latest version of pack
   const latestVersion = info.devVersions[info.devVersions.length-1].version;
   console.log(latestVersion);
});
// api.admin.packs((err, packs) => console.log(packs));
// // api.admin.pack.info("Wanderlust Renewed", (pack) => console.log(pack));