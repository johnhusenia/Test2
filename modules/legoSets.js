
class LegoData{
    sets;
    constructor(){
        this.sets = [];
        // this.newsets = [];
    }
    initialize(){
        return new Promise((resolve,reject)=>{
        const setData = require("../data/setData");
        const themeData = require("../data/themeData");

        for (let i=0; i<setData.length; i++){

            let setTobeAdded = setData[i]
            for (let j=0; j<themeData.length; j++){
            if (setData[i].theme_id == themeData[j].id){
                setTobeAdded.theme = themeData[j].name
            }
        }
            this.sets.push(setTobeAdded)
        }
        if(this.sets != 0){
            resolve("The sets array is filled with objects.")
        }else{
            reject("no data")
        }
        
    });
    }

    getAllSets(){
        return new Promise((resolve,reject)=>{
            let setTobeAdded = [];
            if(this.sets != 0){
                resolve(this.sets);
            }else{
                reject('No data sets');

            }

        });
        
    }

    getSetByNum(setNum){
        return new Promise((resolve,reject)=>{
        let num1=0;
        for (let i=0; i<this.sets.length; i++){
        if(this.sets[i].set_num==setNum){
            num1=this.sets[i];
        }
        }
        if(num1!=0){
            resolve(num1)
        }else{
            reject("Unable to find requested set.")
        }

    });
    }
    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {
            // if no theme is provided, return all sets
            if (!theme) {
                return resolve(this.sets);
            }
    
            // filter sets by theme (case-insensitive match)
            const lowerCaseTheme = theme.toLowerCase();
            const matchingSets = this.sets.filter(set => 
                set.theme && set.theme.toLowerCase().includes(lowerCaseTheme)
            );
    
            if (matchingSets.length > 0) {
                resolve(matchingSets);
            } else {
                reject('Unable to find requested sets');
            }
        });
    }
    

}
module.exports = LegoData;


// let leg = new LegoData();
// leg.initialize() // Call initialize to fill the sets array first
//     .then(() => {
//         return leg.getSetsByTheme("asadsa"); // Chain with getSetsByTheme
//     })
//     .then((sets) => {
//         console.log("Sets found:", sets);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });

    // getSetsByTheme(theme){
    //     return new Promise((resolve,reject)=>{
        
    //     let setTobeAdded = [];
    //     let j=0;

    //     console.log("theme: " + theme);
    //     if(theme){
    //         const lowerCaseTheme = theme.toLowerCase();
    //         for (let i=0; i<this.sets.length; i++){
    //             // console.log(lowerCaseTheme + ' ' + this.sets[i].theme.toLowerCase())
    //             if(this.sets[i].theme.toLowerCase().includes(lowerCaseTheme)== 1 ){
    //                 setTobeAdded[j] = this.sets[i];
    //                 j++;
    //                 // this.newsets.push(setTobeAdded)
    //             }
    //         }
         
    //     }

    //     if(setTobeAdded!=0){
    //         resolve(setTobeAdded)
    //     }
    //     else if(theme == 0 || theme == undefined){

    //         resolve(setTobeAdded=this.sets)
    //     }
    //     else{
    //         reject('Unable to find requested sets');
    //     }
        
    // });
    // }