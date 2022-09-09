const fs = require("fs-extra");
/**
 * TODO LIST
 * -Atomları moleküllerde, molekülleri organizmalarda çağırma opsiyonu
 */
/**
 * config.json okuyup static variable at !TODO!
 *
 */
var ATOMIC_FOLDERS = ["atoms", "molecules", "organisms", "templates"];
fs.readJson("./test/folder-config.json")
  .then((folderConfig) => {
    //!TODO create folders
    ATOMIC_FOLDERS.map((atomicName) => {
      createFolder(atomicName, basePath + "/components");
      folderConfig.components[`${atomicName}`].map((folder) => {
        createFolder(folder.name, basePath + "/components/" + componentFolder);
        createFiles(folder, basePath + "/components/" + componentFolder + `/${folder.name}`);
        console.log(folder);
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });

const createFolder = (folderName, path) => {};

const createFiles = (fileName, path) => {};
