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


const createFiles = (fileName, path,options) => {
   buildContentString(fileName,options.jstsx).then((content)=> {
    fs.outputFile(`${path}/index.${options.jstsx}`, content)
    .then((file) => {
  
    })
    .catch(err => {
      console.error(err)
    })
   });


  fs.outputFile(`${path}/index.${options.css}`, 'hello!')
  .then((file) => {})
  .catch(err => {
    console.error(err)
  })
};

const buildContentString = (componentName, fileType ) => {
    return new Promise(function(myResolve, myReject) {
        // "Producing Code" (May take some time)
        fs.readJson('./folder-structure/snippets.json').then((snippets)=> {
            var str = snippets[`${fileType}`];
            var mutatedStr = str.replaceAll('componentName', componentName)
            myResolve(mutatedStr); // when successful
        }).catch((err) => myReject(err))
        });
  
}


