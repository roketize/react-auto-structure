const fs = require('fs-extra');
/**
 * TODO LIST
 * -Atomları moleküllerde, molekülleri organizmalarda çağırma opsiyonu
 */
/**
 * config.json okuyup static variable at !TODO!
 *
 */

const ATOMIC_FOLDERS = ['atoms', 'molecules', 'organisms', 'templates'];
const DEFAULT_FOLDERS = ['pages', 'components', 'layouts'];
const SHARED_FOLDERS = ['assets', 'config'];


const componentPathSet = new Map();


fs.readJson('./folder-structure/folder-config.json')
  .then((folderConfig) => {
    //!TODO create folders
    if(folderConfig.options.pattern == "atomic"){
      ATOMIC_FOLDERS.map((atomicName) => {
        createFolder(atomicName, folderConfig.path + '/components');
        folderConfig.components.atomic[`${atomicName}`].map((folder) => {
          createFolder(folder.name, folderConfig.path + '/components/' + atomicName);
          createFiles(folder, folderConfig.path + '/components/' + atomicName + `/${folder.name}`, folderConfig.options);
        });
      });
    }
    else if(folderConfig.options.pattern == "default"){
      DEFAULT_FOLDERS.map((defaultName) => {
        createFolder(defaultName, folderConfig.path);
        folderConfig.components.default[`${defaultName}`].map((folder) => {
          createFolder(folder.name, folderConfig.path + '/' + defaultName);
          createFiles(folder, folderConfig.path + '/' + defaultName + `/${folder.name}`, folderConfig.options);
        });
      })
    }

    SHARED_FOLDERS.map((sharedName) => {
      if(folderConfig.options[`${sharedName}`] == true){
        createFolder(sharedName, folderConfig.path);
      }
    })

    if(folderConfig.options.router === true){
      createFolder("router", folderConfig.path + '/');
    }
  })
  .catch((err) => {
    console.error(err);
  });

const createFolder = (folderName, path) => {
  const newFolderPath = `${path}/${folderName}`;
  fs.ensureDir(newFolderPath)
  .then(() => {
    /*adding path to componentPathSet in order to 
    import within tsx/js files **/
    componentPathSet.set(folderName, newFolderPath);
  }).catch(err =>{
    console.error(err);
  })
};

const createFiles = (file, path, options) => {
   buildContentString(file.name,options.jstsx).then((content)=> {
    var filePath = `${path}/index.${options.jstsx}`;
    fs.outputFile(filePath, content)
    .then(() => {
      //if children exist then imports.
      if( file.children != undefined ){
      addModules(filePath, file.children);
    }
    })
    .catch(err => {
      console.error(err)
    })
   });
  }
  
const createRouterFile = (file, path, options) => {
   buildContentString(file.name, options.jstsx).then((content)=> {
    var filePath = `${path}/index.${options.jstsx}`;
    fs.outputFile(filePath, content)
    .then(() => {
      //if children exist then imports.
      if( file.children != undefined ){
      var childTemp = file.children;
      addModules(filePath, file.children);

      while(childTemp.children != undefined){
      addModules(filePath, childTemp.children);
      childTemp = childTemp.children;
      }
    }
    })
    .catch(err => {
      console.error(err)
    })
   });


  fs.outputFile(`${path}/index.${options.css}`, '')
  .then(() => {})
  .catch(err => {
    console.error(err)
  })
};

const addModules = (path, children) => {
  fs.readFile(path,"utf8").then((file)=>{
    var modules = [];
    children.map((module) => {
      modules.push(`import ${module} from '/${componentPathSet.get(module)}'`);
    });
    let lines = file.split('\n');
    for(var i = 0; i < lines.length; i++) {

      // Dosyanın 2. satırından sonra gelen moduller ekleniyor.
      if(i == 2) {
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
// const buildRouterString = ( fileType ) => {
//     return new Promise(function(myResolve, myReject) {
//         // "Producing Code" (May take some time)
//         fs.readJson('./folder-structure/snippets.json').then((snippets)=> {
//             var str = snippets[`${fileType}`];
//             var mutatedStr = str.replaceAll('componentName', componentName)
//             myResolve(mutatedStr); // when successful
//         }).catch((err) => myReject(err))
//         });
  
// }




