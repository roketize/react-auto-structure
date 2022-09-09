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
    var filePath = `${path}/index.${options.jstsx}`;
    fs.outputFile(filePath, content)
    .then(() => {

      // Import edilecek moduller config dosyasına eklenecek. 
      // Eklenecek moduller tiplerine göre ayrı ayrı listelerde eklenmeli örn
      //  "molecules": [
      // {"name":"exampleComponent","propTypes":true,"atoms":["simpleButton","simpleText"]}
      // ],
      var modules = ['import test from "../../test/test"', 'import test from "../../test/test"'];

      addModules(filePath,modules);
    })
    .catch(err => {
      console.error(err)
    })
   });


  fs.outputFile(`${path}/index.${options.css}`, 'hello!')
  .then(() => {})
  .catch(err => {
    console.error(err)
  })
};


const addModules = (path,modules) => {
  fs.readFile(path,"utf8").then((file)=>{
    let lines = file.split('\n');
    for(var i = 0; i < lines.length; i++) {

      // Dosyanın 2. satırından sonra gelen moduller ekleniyor.
      if(i==2) {
        var module = '';
        for(var j = 0; j < modules.length; j++) {
          module += modules[j] + "\n"; 
        }
        lines[2] = module + lines[2];
      }

      if(lines[i].includes("<>")){
        //test 
        lines[i+1] = "<div>test</div>\n";
      }
    }
    
    let newFile = lines.join('\n');
    fs.outputFile(path, newFile).then(()=>{
      //console.log("created");
    })
  })
}

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




