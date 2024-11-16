
class LegoData{
    sets;
    themes;

    constructor(){
        this.sets = [];
        this.themes = []; 
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
    

}
module.exports = LegoData;

