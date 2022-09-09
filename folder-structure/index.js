const fs = require('fs-extra');
/**
 * TODO LIST
 * -Atomları moleküllerde, molekülleri organizmalarda çağırma opsiyonu
 */
/**
 * config.json okuyup static variable at !TODO!
 *
 */
var ATOMIC_FOLDERS = ['atoms', 'molecules', 'organisms', 'templates'];
fs.readJson('./test/folder-config.json')
  .then((folderConfig) => {
    //!TODO create folders
    ATOMIC_FOLDERS.map((atomicName) => {
      createFolder(atomicName, folderConfig.path + '/components');
      folderConfig.components[`${atomicName}`].map((folder) => {
        createFolder(folder.name, folderConfig.path + '/components/' + atomicName);
        createFiles(folder.name, folderConfig.path + '/components/' + atomicName + `/${folder.name}`,folderConfig.options);
        console.log(folder);
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });

const createFolder = (folderName, path) => {
  fs.ensureDir(`${path}/${folderName}`)
  .then(() => {

    //console.log('success!')
  }).catch(err =>{
    console.error(err);
  })
};



