#!/usr/bin/env node
const fs = require('fs-extra');
/**
 * TODO LIST
 * -Atomları moleküllerde, molekülleri organizmalarda çağırma opsiyonu
 */
/**
 * config.json okuyup static variable at !TODO!
 *
 */

const SNIPPETS = {
  js: "import React from 'react'\nimport PropTypes from 'prop-types'\n\nconst componentName = props => {\n  return (\n    <>\n\n\t\t</>\n  )\n}\n\ncomponentName.propTypes = {}\n\nexport default componentName\n",
  tsx: "import React from 'react'\n\ntype Props = {}\n\n\nconst componentName = (props: Props) => {\n  return (\n    <>\n\n\t\t</>\n  )\n}",
};

const DESIGN_PATTERN = {
  atomic: 'atomic',
  default: 'default',
};

const ATOMIC_FOLDERS = {
  atoms: 'atoms',
  molecules: 'molecules',
  organisms: 'organisms',
  templates: 'templates',
  pages: 'pages',
};
const DEFAULT_FOLDERS = {
  pages: 'pages',
  components: 'components',
  layouts: 'layouts',
};
const SHARED_FOLDERS = ['assets', 'config'];
const CONFIG_PATH = './folder-config.json';

const componentPathSet = new Map();

if (fs.existsSync(CONFIG_PATH)) {
  fs.readJson(CONFIG_PATH)
    .then((folderConfig) => {
      if (folderConfig.options.pattern == DESIGN_PATTERN.atomic) {
        Object.keys(ATOMIC_FOLDERS).forEach((atomicName) => {
          createFolder(atomicName, folderConfig.path + '/components');
          folderConfig.components.atomic[`${atomicName}`].map((folder) => {
            if (atomicName != ATOMIC_FOLDERS.pages) {
              createFolder(
                folder.name,
                folderConfig.path + '/components/' + atomicName
              );
              createFiles(
                folder,
                folderConfig.path +
                  '/components/' +
                  atomicName +
                  `/${folder.name}`,
                folderConfig.options
              );
            } else {
              var childTemp = folder.children;
              createFolder(
                folder.name,
                folderConfig.path + '/components/' + atomicName
              );
              createFiles(
                folder,
                folderConfig.path +
                  '/components/' +
                  atomicName +
                  `/${folder.name}`,
                folderConfig.options
              );
              if (childTemp != undefined) {
                createChildFolderAtomic(childTemp, folderConfig, atomicName);
              }
            }
          });
        });
      } else if (folderConfig.options.pattern == DESIGN_PATTERN.default) {
        Object.keys(DEFAULT_FOLDERS).forEach((defaultName) => {
          createFolder(defaultName, folderConfig.path);
          folderConfig.components.default[`${defaultName}`].map((folder) => {
            if (defaultName != DEFAULT_FOLDERS.pages) {
              createFolder(folder.name, folderConfig.path + '/' + defaultName);
              createFiles(
                folder,
                folderConfig.path + '/' + defaultName + `/${folder.name}`,
                folderConfig.options
              );
            } else {
              var childTemp = folder.children;
              createFolder(folder.name, folderConfig.path + '/' + defaultName);
              createFiles(
                folder,
                folderConfig.path + '/' + defaultName + `/${folder.name}`,
                folderConfig.options
              );
              if (childTemp != undefined) {
                createChildFolderDefault(childTemp, folderConfig, defaultName);
              }
            }
          });
        });
      }

      SHARED_FOLDERS.map((sharedName) => {
        if (folderConfig.options[`${sharedName}`] == true) {
          createFolder(sharedName, folderConfig.path);
        }
      });

      if (folderConfig.options.router === true) {
        createFolder('router', folderConfig.path + '/');
      }
    })
    .catch((err) => {
      console.warn(err);
    });
} else {
  console.error('folder-config.json does not exist in the root directory.');
}

const createChildFolderDefault = (item, folderConfig, defaultName) => {
  item.map((childFolder) => {
    createFolder(childFolder.name, folderConfig.path + '/' + defaultName);
    createFiles(
      childFolder,
      folderConfig.path + '/' + defaultName + `/${childFolder.name}`,
      folderConfig.options
    );
    if (childFolder.children != undefined) {
      createChildFolderDefault(childFolder.children, folderConfig, defaultName);
    }
  });
};

const createChildFolderAtomic = (item, folderConfig, atomicName) => {
  item.map((childFolder) => {
    createFolder(
      childFolder.name,
      folderConfig.path + '/components/' + atomicName
    );
    createFiles(
      childFolder,
      folderConfig.path + '/components/' + atomicName + `/${childFolder.name}`,
      folderConfig.options
    );
    if (childFolder.children != undefined) {
      createChildFolderAtomic(childFolder.children, folderConfig, atomicName);
    }
  });
};

const createFolder = (folderName, path) => {
  const newFolderPath = `${path}/${folderName}`;
  fs.ensureDir(newFolderPath)
    .then(() => {
      /*adding path to componentPathSet in order to
    import within tsx/js files **/
      componentPathSet.set(folderName, newFolderPath);
    })
    .catch((err) => {
      console.error(err);
    });
};

const createFiles = (file, path, options) => {
  buildContentString(file.name, options.jstsx).then((content) => {
    var filePath = `${path}/index.${options.jstsx}`;
    fs.outputFile(filePath, content)
      .then(() => {
        //if children exist then imports.
        if (file.children != undefined) {
          // console.log (file.children);
          // addModules(filePath, file.children);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  fs.outputFile(`${path}/index.${options.css}`, '')
    .then(() => {})
    .catch((err) => {
      console.error(err);
    });
};

// const addModules = (path, children) => {
//   fs.readFile(path, 'utf8').then((file) => {
//     var modules = [];
//     children.map((module) => {
//       modules.push(`import ${module} from '/${componentPathSet.get(module)}'`);
//     });
//     let lines = file.split('\n');
//     for (var i = 0; i < lines.length; i++) {
//       // Dosyanın 2. satırından sonra gelen moduller ekleniyor.
//       if (i == 2) {
//         var moduleImport = '';
//         for (var j = 0; j < modules.length; j++) {
//           moduleImport += modules[j] + '\n';
//         }
//         lines[2] = moduleImport + lines[2];
//       }

//       if (lines[i].includes('<>')) {
//         //test
//         lines[i + 1] = `<${module.filename}>test</${module}>\n`;
//       }
//     }

//     let newFile = lines.join('\n');
//     fs.outputFile(path, newFile).then(() => {
//       //console.log('created');
//     });
//   });
// };

const buildContentString = (componentName, fileType) => {
  return new Promise(function (myResolve, myReject) {
    var str = SNIPPETS[`${fileType}`];
    var mutatedStr = str.replaceAll('componentName', componentName);
    myResolve(mutatedStr); // when successful
  });
};

const isRouterExist = () => {
    const indexJSRoot = '/index.js';
    
}
