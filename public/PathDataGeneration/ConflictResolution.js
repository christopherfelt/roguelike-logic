import {ACCEPTABLE_BOUNDARY_PATH_TYPES, COMPATIBLE_PATHS,  PATH_ORIENTATION} from './PathDataLibrary.js';


class ConflictResolver {
    constructor(cellData, compatiblityReport, width, height){
        this.cellData = cellData;
        this.compatiblityReport = compatiblityReport;
        this.gridWidth = width;
        this.gridHeight = height 
    }

    resolveConflicts(){
        this.analyzePath();
        this.resolvePathConflicts();
        return [this.cellData, this.compatiblityReport];
    }

    analyzePath(){

        let cellData = this.cellData;
        
        for(let i = 0; i < cellData.length; i++){
            
            let cell = cellData[i];

            this.compatiblityReport.push(this.analyzeCell(cell));

        }
    }

    analyzeCell(cell){
        let reportRecord = {
            cell:{},
            top:{},
            bottom:{},
            left:{},
            right:{}
        };
        
        // Record the current cells data
        console.log(cell)
        reportRecord.cell.coordinates = cell.coordinates;
        reportRecord.cell.selectedPath = cell.selectedPath;

        // Get the coordinates for the bottom and right adjacent cells
        let adjTopCellCoors = cell.coordinates[1]-1 > 0 ? [cell.coordinates[0], cell.coordinates[1]-1] : "NA";
        let adjBottomCellCoors = cell.coordinates[1]+1 <= this.gridHeight ? [cell.coordinates[0], cell.coordinates[1]+1] : "NA";
        let adjLeftCellCoors = cell.coordinates[0]-1 > 0 ? [cell.coordinates[0]-1, cell.coordinates[1]] : "NA";
        let adjRightCellCoors =  cell.coordinates[0]+1 <= this.gridWidth ? [cell.coordinates[0]+1, cell.coordinates[1]] : "NA";
        
        // Find the cells in the celldata
        let adjTopCellSelectedPath = adjTopCellCoors == "NA" ? "NA" : this.cellData.find(p => {
            return p.coordinates[0] == adjTopCellCoors[0] && p.coordinates[1] == adjTopCellCoors[1] });

        let adjBottomCellSelectedPath = adjBottomCellCoors == "NA" ? "NA" : this.cellData.find(p => {
            return p.coordinates[0] == adjBottomCellCoors[0] && p.coordinates[1] == adjBottomCellCoors[1] });

        let adjLeftCellSelectedPath = adjLeftCellCoors == "NA" ? "NA" :  this.cellData.find((p) => {
                return p.coordinates[0] == adjLeftCellCoors[0] && p.coordinates[1] == adjLeftCellCoors[1]})

        let adjRightCellSelectedPath = adjRightCellCoors == "NA" ? "NA" :  this.cellData.find((p) => {
            return p.coordinates[0] == adjRightCellCoors[0] && p.coordinates[1] == adjRightCellCoors[1]})
            
        // Determine if the selected paths for the adjacent cells conflict with the current cells path and add it to the record
        // Record cell data for the adjacent cells
        if(adjTopCellCoors == "NA"){
            reportRecord.top.coordinates = "NA";
            reportRecord.top.selectedPath = "NA";
            reportRecord.top.conflict = true;
        } else {
            reportRecord.top.coordinates = adjTopCellCoors;
            reportRecord.top.selectedPath = adjTopCellSelectedPath["selectedPath"];
            reportRecord.top.conflict = !COMPATIBLE_PATHS[cell.selectedPath]["TOP"].includes(reportRecord.top.selectedPath);
        }

        if(adjBottomCellCoors == "NA"){
            reportRecord.bottom.coordinates = "NA";
            reportRecord.bottom.selectedPath = "NA";
            reportRecord.bottom.conflict = true;
        } else {
            reportRecord.bottom.coordinates = adjBottomCellCoors;
            reportRecord.bottom.selectedPath = adjBottomCellSelectedPath["selectedPath"];
            reportRecord.bottom.conflict = !COMPATIBLE_PATHS[cell.selectedPath]["BOTTOM"].includes(reportRecord.bottom.selectedPath);
        }

        if(adjLeftCellCoors == "NA"){
            reportRecord.left.coordinates = "NA";
            reportRecord.left.selectedPath = "NA";
            reportRecord.left.conflict = true;
        } else {
            reportRecord.left.coordinates = adjLeftCellCoors;
            reportRecord.left.selectedPath = adjLeftCellSelectedPath["selectedPath"];
            reportRecord.left.conflict = !COMPATIBLE_PATHS[cell.selectedPath]["LEFT"].includes(reportRecord.left.selectedPath);
        }

        if(adjRightCellCoors == "NA"){
            reportRecord.right.coordinates = "NA";
            reportRecord.right.selectedPath = "NA";
            reportRecord.right.conflict = true;
        } else {
            reportRecord.right.coordinates = adjRightCellCoors;
            reportRecord.right.selectedPath = adjRightCellSelectedPath["selectedPath"];
            reportRecord.right.conflict = !COMPATIBLE_PATHS[cell.selectedPath]["RIGHT"].includes(reportRecord.right.selectedPath);
        }

        return reportRecord;
    }

    resolvePathConflicts(){
        this.resolveConflictsHorizontally();
        this.resolveConflictsVertically();

    }

    resolveConflictsHorizontally(){
        let cellData = this.cellData;
       

        // get cells in window
        let topLeft = [1, 1];
        let topRight = [0,0];
        let bottomLeft = [0, 0];
        let bottomRight = [0, 0];
        let windowRepeatCount = 1;


        while (topLeft[0] <= this.gridWidth-1 && topLeft[1] <= this.gridHeight-1){
            topRight = [topLeft[0]+1, topLeft[1]];
            bottomLeft = [topLeft[0], topLeft[1]+1];
            bottomRight = [topLeft[0]+1, topLeft[1]+1];
            // // find cell report record
            let window = [topLeft, topRight, bottomLeft, bottomRight]
            let allRecordsForWindowCells = [];

            for(let c = 0; c < window.length; c++){
                let windowCell = window[c];

                let cellRecord= cellData.find(c => {
                    return c.coordinates[0] == windowCell[0] && c.coordinates[1] == windowCell[1];
                })

                let cellCompatibilityRecord = this.compatiblityReport.find(r => {
                    return r.cell.coordinates[0] == windowCell[0] && r.cell.coordinates[1] == windowCell[1];
                })

                allRecordsForWindowCells.push({data: cellRecord, conflict: cellCompatibilityRecord})

            }

            // console.log("window (" + windowRepeatCount + "):", JSON.stringify(window), allRecordsForWindowCells);
            let topLeftRightConflict = allRecordsForWindowCells[0].conflict.right.conflict;
            let topLeftBoundaryType = allRecordsForWindowCells[0].data.cellBoundaryType;
            let topLeftPath = allRecordsForWindowCells[0].data.selectedPath;

            let topRightLeftConflict = allRecordsForWindowCells[1].conflict.left.conflict;
            let topRightBoundaryType = allRecordsForWindowCells[1].data.cellBoundaryType;
            let topRightPath = allRecordsForWindowCells[1].data.selectedPath;

            let bottomLeftRightConflict = allRecordsForWindowCells[2].conflict.right.conflict;
            let bottomLeftBoundaryType = allRecordsForWindowCells[2].data.cellBoundaryType;
            let bottomLeftPath = allRecordsForWindowCells[2].data.selectedPath;

            let bottomRightLeftConflict = allRecordsForWindowCells[3].conflict.left.conflict;
            let bottomRightBoundaryType = allRecordsForWindowCells[3].data.cellBoundaryType;
            let bottomRightPath = allRecordsForWindowCells[3].data.selectedPath;


            if(topLeftRightConflict && topLeftBoundaryType !="TOP_LEFT_CORNER" && !PATH_ORIENTATION.RIGHT_FACING.includes(topLeftPath)){
                
                // console.log("topleft resolution");
                // console.log(allRecordsForWindowCells[0]);
                if(topLeftBoundaryType == "TOP"){allRecordsForWindowCells[0].data.selectedPath = "HORIZONTAL_BOTTOM"}
                else if(topLeftBoundaryType == "LEFT"){allRecordsForWindowCells[0].data.selectedPath = "VERTICAL_RIGHT"}
                else{allRecordsForWindowCells[0].data.selectedPath = "HORIZONTAL_STRAIGHT"}//or cross or horizontal bottom

                this.updateConflictRecords(topLeft, this.analyzeCell(allRecordsForWindowCells[0].data));
                this.updateConflictRecords(topRight, this.analyzeCell(allRecordsForWindowCells[1].data));
                this.updateConflictRecords(bottomLeft, this.analyzeCell(allRecordsForWindowCells[2].data));
                this.updateConflictRecords(bottomRight, this.analyzeCell(allRecordsForWindowCells[3].data));
                windowRepeatCount++;
                continue;
            }

            if(topRightLeftConflict && topRightBoundaryType !="TOP_RIGHT_CORNER" && !PATH_ORIENTATION.LEFT_FACING.includes(topRightPath)){
                
                // console.log("topright resolution");
                // console.log(allRecordsForWindowCells[1]);
                if(topRightBoundaryType == "TOP"){allRecordsForWindowCells[1].data.selectedPath = "HORIZONTAL_BOTTOM"}
                else if(topRightBoundaryType == "RIGHT"){allRecordsForWindowCells[1].data.selectedPath = "VERTICAL_LEFT"}
                else{allRecordsForWindowCells[1].data.selectedPath = "HORIZONTAL_STRAIGHT"}

                this.updateConflictRecords(topLeft, this.analyzeCell(allRecordsForWindowCells[0].data));
                this.updateConflictRecords(topRight, this.analyzeCell(allRecordsForWindowCells[1].data));
                this.updateConflictRecords(bottomLeft, this.analyzeCell(allRecordsForWindowCells[2].data));
                this.updateConflictRecords(bottomRight, this.analyzeCell(allRecordsForWindowCells[3].data));
                windowRepeatCount++;
                continue;
            }

            if(bottomLeftRightConflict && bottomLeftBoundaryType !="BOTTOM_LEFT_CORNER" && !PATH_ORIENTATION.RIGHT_FACING.includes(bottomLeftPath)){
                
                // console.log("bottom left resolution");
                // console.log(allRecordsForWindowCells[2]);
                if(bottomLeftBoundaryType == "BOTTOM"){allRecordsForWindowCells[2].data.selectedPath = "HORIZONTAL_TOP"}
                else if(bottomLeftBoundaryType == "LEFT"){allRecordsForWindowCells[2].data.selectedPath = "VERTICAL_RIGHT"}
                else{allRecordsForWindowCells[2].data.selectedPath = "HORIZONTAL_STRAIGHT"}

                this.updateConflictRecords(topLeft, this.analyzeCell(allRecordsForWindowCells[0].data));
                this.updateConflictRecords(topRight, this.analyzeCell(allRecordsForWindowCells[1].data));
                this.updateConflictRecords(bottomLeft, this.analyzeCell(allRecordsForWindowCells[2].data));
                this.updateConflictRecords(bottomRight, this.analyzeCell(allRecordsForWindowCells[3].data));
                windowRepeatCount++;
                continue;
            }
            
            if(bottomRightLeftConflict && bottomRightBoundaryType !="BOTTOM_RIGHT_CORNER" && !PATH_ORIENTATION.LEFT_FACING.includes(bottomRightPath)){
                
                // console.log("bottom right resolution");
                // console.log(allRecordsForWindowCells[3]);
                if(bottomRightBoundaryType == "BOTTOM"){allRecordsForWindowCells[3].data.selectedPath = "HORIZONTAL_TOP"}
                else if(bottomRightBoundaryType == "RIGHT"){allRecordsForWindowCells[3].data.selectedPath = "VERTICAL_LEFT"}
                else{allRecordsForWindowCells[3].data.selectedPath = "HORIZONTAL_STRAIGHT"}

                this.updateConflictRecords(topLeft, this.analyzeCell(allRecordsForWindowCells[0].data));
                this.updateConflictRecords(topRight, this.analyzeCell(allRecordsForWindowCells[1].data));
                this.updateConflictRecords(bottomLeft, this.analyzeCell(allRecordsForWindowCells[2].data));
                this.updateConflictRecords(bottomRight, this.analyzeCell(allRecordsForWindowCells[3].data));
                windowRepeatCount++;
                continue;
            }

            // console.log(topLeft, this.gridWidth)
            // console.log("==================RESOLVED==================")
            windowRepeatCount = 1;
            topLeft[0] += 1;
            if(topLeft[0] >= this.gridWidth){
                topLeft[0] = 1;
                topLeft[1] += 1;
            }
        }

    }

    resolveConflictsVertically(){

        // Move the window down row by row
        // the window will be the width of the grid and the height of two rows
        let cellData = this.cellData;
        let compatiblityReport = this.compatiblityReport

        let firstCell = [1,1]

        while(firstCell[1] <= this.gridHeight-1){
            console.log(firstCell[1]);

            let topRow = compatiblityReport.filter(c =>{
                return c.cell.coordinates[0] >= 1 && c.cell.coordinates[0] <= this.gridWidth && c.cell.coordinates[1] == firstCell[1]
            })

            console.log(topRow);

            //Are there any that have a connection to the next row
            let bottomConnection = topRow.find(r => {
                return r.bottom.conflict == false;
            });

            console.log("find bottom connection", bottomConnection);

            let bottomFacing;
            if(!bottomConnection){
                bottomFacing = topRow.find(r => {
                    return PATH_ORIENTATION["BOTTOM_FACING"].includes(r.cell.selectedPath);
                })
                console.log("bottom facing", bottomFacing);
                if(bottomFacing){
                    console.log("Bottom Facing Cell: ", bottomFacing.cell.coordinates);


                    //TODO CHANGE THE FOLLOWING TO FIND INDEX


                    let correspondingBottomCell = cellData.find(c => {
                        return this.compareCellCoordinates(c.coordinates, [bottomFacing.cell.coordinates[0],bottomFacing.cell.coordinates[1]+1]);
                    })

                    console.log("Corresponding Botom Cell before: ", correspondingBottomCell);
    
                    if(correspondingBottomCell.cellBoundaryType == "LEFT"){
                        console.log("Fixing Left");
                        correspondingBottomCell.selectedPath = "VERTICAL_RIGHT";
                        this.updateSurroundingConflictRecords(correspondingBottomCell.coordinates);
                    } else if(correspondingBottomCell.cellBoundaryType == "RIGHT"){
                        console.log("Fixing Right");
                        correspondingBottomCell.selectedPath = "VERTICAL_LEFT";
                        this.updateSurroundingConflictRecords(correspondingBottomCell.coordinates);
                    } else if(correspondingBottomCell.cellBoundaryType == "CENTER"){
                        console.log("Fixing Cener");
                        correspondingBottomCell.selectedPath = "CROSS";
                        this.updateSurroundingConflictRecords(correspondingBottomCell.coordinates);
                    } else if(correspondingBottomCell.cellBoundaryType == "BOTTOM"){
                        console.log("fixing bottom");
                        correspondingBottomCell.selectedPath = "HORIZONTAL_TOP";
                        this.updateSurroundingConflictRecords(correspondingBottomCell.coordinates);
                    }

                    console.log("Corresponding Botom Cell after: ", correspondingBottomCell);

                }else {
                    console.log("No Bottom Facing Parts");
                    let chosenTopRow = cellData.find(c => {
                        return this.compareCellCoordinates(c.coordinates, topRow[3].cell.coordinates);
                    })

                    chosenTopRow.selectedPath = "HORIZONTAL_BOTTOM";
                    this.updateSurroundingConflictRecords(topRow[3].cell.coordinates);

                    continue;
                }
            }

            firstCell[1] +=1
        }
    }

    updateSurroundingConflictRecords(cellCoordinates){
        let cellData = this.cellData.find(c => {
            return this.compareCellCoordinates(c.coordinates, cellCoordinates)
        }) ;
        let topCellData = this.cellData.find(c => {
            return this.compareCellCoordinates(c.coordinates, [cellCoordinates[0], cellCoordinates[1]-1])
        }) ;

        let bottomCellData = this.cellData.find(c => {
            return this.compareCellCoordinates(c.coordinates, [cellCoordinates[0], cellCoordinates[1]+1])
        }) ;

        this.updateConflictRecords(cellCoordinates, this.analyzeCell(cellData));
        this.updateConflictRecords([cellCoordinates[0], cellCoordinates[1]-1], this.analyzeCell(topCellData));
        this.updateConflictRecords([cellCoordinates[0], cellCoordinates[1]+1], this.analyzeCell(bottomCellData));



    }


   updateConflictRecords(cellCoordinates, analysis){

        let compatibilityRecordIndex = this.compatiblityReport.findIndex(r => {
            return this.compareCellCoordinates(r.cell.coordinates, cellCoordinates)
        })

        // console.log("analysis", analysis);

        this.compatiblityReport[compatibilityRecordIndex] = analysis;
        
    }

    compareCellCoordinates(cell1, cell2){
        return cell1[0] == cell2[0] && cell1[1] == cell2[1];
    }


}

export default ConflictResolver;