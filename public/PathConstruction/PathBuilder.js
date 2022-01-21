class PathBuilder {
    constructor(gridData, ctx){
        this.width = gridData.cellWidth;
        this.height = gridData.cellHeight;
        this.cellData = gridData.cellData;
        this.ctx = ctx;
        this.x = 0;
        this.y = 0;
        this.selectedPath;
    }

    buildPath(){

        this.ctx.lineWidth = 40;

        for(let i = 0; i < this.cellData.length; i++){
            let cell = this.cellData[i];
            this.x = (cell.coordinates[0]-1)*this.width;
            this.y = (cell.coordinates[1]-1)*this.height;
            this.selectedPath = cell.selectedPath;
            this.buildPathGridCell();
        }
    }


    buildPathGridCell(){
        // let randomInt = Math.floor(Math.random()*Math.floor(11));
        switch(this.selectedPath){
            // Straight Path Horizontal
            case 'HORIZONTAL_STRAIGHT':
                this.drawStraightPathHorizontal();
                break;
            // Straight Path Vertical
            case 'VERTICAL_STRAIGHT':
                this.drawStraightPathVertical();
                break;
            // Cross Path
            case 'CROSS':
                this.drawStraightPathHorizontal();
                this.drawStraightPathVertical();
                break;
            // Horizontal Top Path
            case 'HORIZONTAL_TOP':
                this.drawStraightPathHorizontal();
                this.drawTopHalfPath();
                break;
            // Horizontal Bottom Path
            case 'HORIZONTAL_BOTTOM':
                this.drawStraightPathHorizontal();
                this.drawBottomHalfPath();
                break;
            // Vertical Right Path
            case 'VERTICAL_RIGHT':
                this.drawStraightPathVertical();
                this.drawRightHalfPath();
                break;
            // Vertical Left Path
            case 'VERTICAL_LEFT':
                this.drawStraightPathVertical();
                this.drawLeftHalfPath();
                break;
            // Right Bottom Corner Path
            case 'RIGHT_BOTTOM':
                this.drawRightHalfPath();
                this.drawBottomHalfPath();
                break;
            // Right Top Corner Path
            case 'RIGHT_TOP':
                this.drawRightHalfPath();
                this.drawTopHalfPath();
                break;
            // Left Bottom Corner Path
            case 'LEFT_BOTTOM':
                this.drawLeftHalfPath();
                this.drawBottomHalfPath();
                break;
            // Left Top Corner Path
            case 'LEFT_TOP':
                this.drawLeftHalfPath();
                this.drawTopHalfPath();
                break;
        }
        
    }

    drawStraightPathHorizontal(){
        var moveToYCoors = this.y + this.height/2;
        var lineToXCoors = this.x + this.width;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, moveToYCoors);
        this.ctx.lineTo(lineToXCoors, moveToYCoors);
        this.ctx.stroke();
    }

    drawStraightPathVertical(){
        var moveToXCoors = this.x + this.width/2;
        var lineToYCoors = this.y + this.height;

        this.ctx.beginPath();
        this.ctx.moveTo(moveToXCoors, this.y);
        this.ctx.lineTo(moveToXCoors, lineToYCoors);
        this.ctx.stroke();
    }

    drawLeftHalfPath(){
        var moveToYCoors = this.y + this.height/2;
        var lineToXCoors = this.x + this.width/2;

        this.ctx.beginPath();
        this.ctx.moveTo(this.x, moveToYCoors);
        this.ctx.lineTo(lineToXCoors, moveToYCoors);
        this.ctx.stroke();

    }

    drawRightHalfPath(){
        var moveToXCoors = this.x + this.width/2
        var moveToYCoors = this.y + this.height/2;
        var lineToXCoors = this.x + this.width;

        this.ctx.beginPath();
        this.ctx.moveTo(moveToXCoors, moveToYCoors);
        this.ctx.lineTo(lineToXCoors, moveToYCoors);
        this.ctx.stroke();
    }

    drawTopHalfPath(){
        var moveToXCoors = this.x + this.width/2;
        var lineToYCoors = this.y + this.height/2;

        this.ctx.beginPath();
        this.ctx.moveTo(moveToXCoors, this.y);
        this.ctx.lineTo(moveToXCoors, lineToYCoors);
        this.ctx.stroke();
    }

    drawBottomHalfPath(){
        var moveToXCoors = this.x + this.width/2;
        var moveToYCoors = this.y + this.height/2;
        var lineToYCoors = this.y + this.height;

        this.ctx.beginPath();
        this.ctx.moveTo(moveToXCoors, moveToYCoors);
        this.ctx.lineTo(moveToXCoors, lineToYCoors);
        this.ctx.stroke();

    }

}

export default PathBuilder;
