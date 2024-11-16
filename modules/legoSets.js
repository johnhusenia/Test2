
class LegoData{
    sets;
    themes;
    constructor(){
        this.sets = [];
        this.themes = []; 
    }
    initialize(){
        return new Promise((resolve,reject)=>{
        const setData = require("../data/setData");
        const themeData = require("../data/themeData");
        this.themes = [...themeData];
        
        for (let i=0; i<setData.length; i++){

            let setTobeAdded = setData[i]
            for (let j=0; j<themeData.length; j++){
            if (setData[i].theme_id == themeData[j].id){
                setTobeAdded.theme = themeData[j].name
            }
        }
            this.sets.push(setTobeAdded)
        }
        if (this.sets.length > 0) {
            resolve("The sets array is filled with objects.");
        } else {
            reject("No data found in setData.");
        }
        
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
    

}
module.exports = LegoData;

