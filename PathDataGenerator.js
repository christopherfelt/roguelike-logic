import {ACCEPTABLE_BOUNDARY_PATH_TYPES} from './PathData.js';


class PathDataGenerator {

    constructor(){
        this.gridWidth = 4;
        this.gridHeight = 4;
        this.gridSize = this.gridWidth * this.gridHeight;
        this.x = 0;
        this.y = 0;
        this.cellWidth = 100;
        this.cellHeight = 100;
        this.boundaryCells = [];
        this.acceptablePaths = [];
        this.randomPath = 0;
        this.cellData = [];

    }

    setGridSize(width, height){
        this.gridWidth = width;
        this.gridHeight = height;
        this.gridSize = this.gridWidth * this.gridHeight;
    }

    setCellSize(width, height){
        this.cellWidth = width;
        this.cellHeight = height;
    }

    getAllData(){
        let gridData = {
            cellWidth: this.cellWidth,
            cellHeight: this.cellHeight,
            gridSize: this.gridSize,
            cellData: this.cellData
        }
        return gridData;
    }

    generatePathData(){
        this.generateInitialPathData();
        this.analyzePath();

    }


    generateInitialPathData(){
        // consider doing an array of objects
        // add random this this function
        let x_counter = 1;
        let y_counter = 1;
        for(let i = 1; i <= this.gridSize; i++){

            if(y_counter == 1){
                if(x_counter == 1){
                    this.generateCellRecord('TOP_LEFT_CORNER', x_counter, y_counter);

                } else if (x_counter == this.gridWidth){
                    this.generateCellRecord('TOP_RIGHT_CORNER', x_counter, y_counter);
                } else {
                    this.generateCellRecord('TOP', x_counter, y_counter);
                }
            } else if (y_counter == this.gridHeight){
                if(x_counter == 1){
                    this.generateCellRecord('BOTTOM_LEFT_CORNER', x_counter, y_counter);
                } else if(x_counter == this.gridWidth){
                    this.generateCellRecord('BOTTOM_RIGHT_CORNER', x_counter, y_counter);
                } else {
                    this.generateCellRecord('BOTTOM', x_counter, y_counter);
                }
            } else if (x_counter == 1){
                this.generateCellRecord('LEFT', x_counter, y_counter);
            } else if (x_counter == this.gridWidth){
                this.generateCellRecord('RIGHT', x_counter, y_counter);
            } else {
                this.generateCellRecord('CENTER', x_counter, y_counter);
            }

            if(x_counter==this.gridWidth){
                y_counter++;
                x_counter=0;
            }
            x_counter++;
        }
    }

    generateCellRecord(cellBoundaryType, x_counter, y_counter){
        // console.log(cellBoundaryType);
        // console.log("(" + x_counter + ", " + y_counter, ")");
        let cellRecord = {}
        cellRecord["cellBoundayType"] = cellBoundaryType;
        cellRecord["coordinates"] = [x_counter, y_counter];
        cellRecord["acceptableBoundaryPathTypes"] = ACCEPTABLE_BOUNDARY_PATH_TYPES[cellBoundaryType];
        cellRecord["selectedPath"] = this.determineRandomPath(cellRecord);
        this.cellData.push(cellRecord);
    }

    determineRandomPath(cellRecord){
        let paths = cellRecord.acceptableBoundaryPathTypes
        let randomPath;
        if(paths.length > 1){
            randomPath = paths[Math.floor(Math.random()*paths.length)];
        } else if(paths.length == 1){
            randomPath = paths[0];
        }
        return randomPath;
    }

    analyzePath(){
        // loop through each cell starting with top left corner 
        // checking the next cell to the right and bottom
        // for incompatiable paths
        // I will need to create a library of incompatible paths
    }

}

export default PathDataGenerator;