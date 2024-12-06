require('dotenv').config();
require('pg');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

class LegoData{
    sequelize;
    Set;
    Theme;

    constructor(){
        this.sequelize = new Sequelize(
            process.env.PGDATABASE,  
            process.env.PGUSER,      
            process.env.PGPASSWORD,  
            {
              host: process.env.PGHOST, 
              dialect: 'postgres',      
              port: process.env.PGPORT, 
              dialectOptions: {
                ssl: { rejectUnauthorized: false }, 
              },
            }
          );

          this.Theme = this.sequelize.define('Theme', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        }, {
            timestamps: false, // Disable createdAt and updatedAt
        });
        
        this.Set = this.sequelize.define('Set', {
            set_num: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            num_parts: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            theme_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            img_url: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            timestamps: false, 
        });

        this.Set.belongsTo(this.Theme, {foreignKey: 'theme_id'}); 
        

    }
    
    initialize(){
        return this.sequelize
        .authenticate() 
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch((err) => {
            console.error('Unable to connect to the database:', err);
        });
        
    }

    getAllSets() {
        return new Promise((resolve, reject) => {
            this.Set.findAll({
                include: [this.Theme] 
            })
            .then(sets => {
                if (sets.length > 0) {
                    resolve(sets); 
                } else {
                    reject("No data sets found");
                }
            })
            .catch(error => {
                reject(`Error retrieving sets: ${error.message}`);
            });
        });
    }


    getSetByNum(setNum) {
        return new Promise((resolve, reject) => {
            console.log(setNum);
            this.Set.findAll({
                where: { set_num: setNum }, 
                include: [this.Theme] 
                
            })
            .then(sets => {
                
                if (sets.length > 0) {
                    resolve(sets[0]); 
                } else {
                    reject("Unable to find requested set.");
                }
            })
            .catch(error => {
                reject(`Error retrieving set: ${error.message}`);
            });
        });
    }



    getSetsByTheme(theme) {
        return new Promise((resolve, reject) => {

            this.Set.findAll({
                include: [this.Theme] 
            })
            .then(sets => {
                if (!theme) {
                    resolve(sets); 
                }
            
                })

                this.Set.findAll({
                    include: [this.Theme],
                    where: {
                        '$Theme.name$': {
                            [Op.iLike]: `%${theme}%` 
                        }
                    }
                })
                .then(sets => {
                    if (sets.length > 0) {
                        resolve(sets); // Resolve with the matching sets
                    } 
                    else if (!theme) {
                        resolve(sets); 
                    }
                    else {
                        reject("Unable to find requested sets."); // Reject if no sets are found
                    }
                })
                .catch(error => {
                    reject(`Error retrieving sets: ${error.message}`); // Reject on error
                });
        });
    }

    getAllThemes() {  // Method to get all themes
        return new Promise((resolve, reject) => {
            this.Theme.findAll({
            })
            .then(themes => {
                if (themes.length > 0) {
                    resolve(themes); 
                } else {
                    reject("No data sets found");
                }
            })
            .catch(error => {
                reject(`Error retrieving themes: ${error.message}`);
            });
        });
    }


    legoaddset(newSet) {
        console.log('addfunction is running');
        return new Promise((resolve, reject) => {
 
            this.Set.create(newSet)
                .then(() => {
                    
                    resolve(newSet); 
                })
                .catch(err => {
                    reject(err.errors[0].message);
                });
        });
    }

    deleteSetByNum(setNum) {
        console.log('deletefunction is running');
        return new Promise((resolve, reject) => {
 
            this.Set.destroy({
                where: { set_num: setNum }, 
              }).then(() => {
                resolve('Data deleted successfully');
                console.log('successfully removed a set');
              })
              .catch(err => {
                reject(err.errors[0].message);
            });
        });
    }
    

}
module.exports = LegoData;

