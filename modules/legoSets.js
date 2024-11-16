const fs = require('fs');

class LegoData {
    sets;
    themes;

    constructor() {
        this.sets = [];
        this.themes = [];  // Initialize themes as an empty array
    }

    initialize() {
        return new Promise((resolve, reject) => {
            // Re-read the JSON data from the file
            fs.readFile('data/setData.json', 'utf8', (err, data) => {
                if (err) {
                    reject("Failed to read set data.");
                    return;
                }
    
                const setData = data ? JSON.parse(data) : [];
                const themeData = require("../data/themeData");
    
                this.themes = [...themeData];
                this.sets = []; 
    

                for (let i = 0; i < setData.length; i++) {
                    let setTobeAdded = setData[i];
                    let matchingTheme = themeData.find(theme => theme.id === setTobeAdded.theme_id);
    
                    if (matchingTheme) {
                        setTobeAdded.theme = matchingTheme.name;
                    } else {
                        setTobeAdded.theme = 'Unknown';
                    }
    
                    this.sets.push(setTobeAdded);
                }
    
                if (this.sets.length > 0) {
                    resolve("The sets array is filled with objects.");
                } else {
                    reject("No data found in setData.");
                }
            });
        });
    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            if (this.sets.length > 0) {
                resolve(this.sets);
            } else {
                reject("No data sets");
            }
        });
    }

    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            const set = this.sets.find(s => s.set_num === setNum);
            if (set) {
                resolve(set);
            } else {
                reject("Unable to find requested set.");
            }
        });
    }

    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            if (!theme) {
                return resolve(this.sets);
            }

            const lowerCaseTheme = theme.toLowerCase();
            const matchingSets = this.sets.filter(set =>
                set.theme && set.theme.toLowerCase().includes(lowerCaseTheme)
            );

            if (matchingSets.length > 0) {
                resolve(matchingSets);
            } else {
                reject("Unable to find requested sets 123");
            }
        });
    }

    getAllThemes() {  // Method to get all themes
        return new Promise((resolve, reject) => {
            if (this.themes.length > 0) {
                resolve(this.themes);
            } else {
                reject("No themes available");
            }
        });
    }

    getThemeById(id) {
        return new Promise((resolve, reject) => {
            const themesWithId = this.themes.filter(t => t.id == id);
    
            if (themesWithId.length > 0) {
                resolve(themesWithId[0].name);
            } else {
                reject("Unable to find requested theme(s)");
            }
        });
    }


    legoaddset(newObject) {
        console.log('addfunction is running');
        return new Promise((resolve, reject) => {
            if (newObject==0) {
                reject('Error writing to file: ' + writeErr);
              } else {
                this.sets.push(newObject);
                resolve(newObject);
              }

        });
    }

    legodeleteset(newObject) {
        console.log('deletefunction is running');
        return new Promise((resolve, reject) => {
            if (newObject==0) {
                reject('Error writing to file: ');
              } else {
                const filteredData = this.sets.filter(item => item.set_num != newObject);
                this.sets = filteredData;
                resolve('Data deleted successfully');
              }

        });
    }


// This functions are adding and deleting files on json file already

    addsets(newObject) {
        console.log('Fadd is running');
        // this.sets.push(newObject);

        return new Promise((resolve, reject) => {

            const filePath = 'data/setData.json';

            this.sets.push(newObject);
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                reject('Error reading the file: ' + err);
                return;
              }
        
              let jsonData;
              try {
                jsonData = JSON.parse(data); 
              } catch (parseErr) {
                reject('Error parsing JSON: ' + parseErr);
                return;
              }
        
              jsonData.push(newObject);
        
              const updatedJson = JSON.stringify(jsonData, null, 2);
        
              fs.writeFile(filePath, updatedJson, 'utf8', (writeErr) => {
                if (writeErr) {
                  reject('Error writing to file: ' + writeErr);
                } else {
                  resolve(newObject);
                }
              });
            });
          });
      }

      deleteSet(newObject) {
        console.log('Fdeletefunction is running');
        return new Promise((resolve, reject) => {
            const filePath = 'data/setData.json';

            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                reject('Error reading the file: ' + err);
                return;
              }
        
              let jsonData = JSON.parse(data);
             const filteredData = jsonData.filter(item => item.set_num != newObject); // getting all objects that are not = set_num

                if (jsonData.length === filteredData.length) {
                    reject('Set not found');
                    return;
                }
        
              fs.writeFile('data/setData.json', JSON.stringify(filteredData, null, 2), (err) => {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Failed to delete data.");
                }
                resolve('Data deleted successfully');
                this.sets = filteredData;
              });
            });
          });
      }

      


      
}
module.exports = LegoData;