import CanvasBuilder from "./CanvasBuilder.js";

function main(){


    var c = document.getElementById("myCanvas")
    var ctx = c.getContext("2d");
    
    let cb = new CanvasBuilder(ctx);
    // cb.buildGrid();
    cb.buildCanvas();

}

main();


