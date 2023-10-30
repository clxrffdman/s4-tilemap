import "./style.css";

//setting up the multiple canvases
const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
const gridCtx = gridCanvas.getContext("2d") as CanvasRenderingContext2D;

const selectCanvas = document.getElementById(
  "selectCanvas"
) as HTMLCanvasElement;
const selectCtx = selectCanvas.getContext("2d") as CanvasRenderingContext2D;

//defining the textures to use
const imageUrls = [
  "/tile1.png",
  "/tile2.png",
  "/tile3.png",
  "/tile4.png",
  "/tile5.png",
  "/tile6.png",
  "/tile7.png",
  "/tile8.png",
];

class Tile {
  private imageSrc: string;
  private tileSize: number;
  private static imgMap: HTMLImageElement[][];

  constructor(src: string, size: number) {
    this.imageSrc = src;
    this.tileSize = size;
  }

  static setTilemapSize(size: number) {
    Tile.imgMap = new Array(size);
    for (let i = 0; i < size; i++) {
      let row = new Array(size);
      for (let j = 0; j < size; j++) {
        row[j] = new Image();
      }
      Tile.imgMap[i] = row;
    }
  }

  drawTile(row: number, col: number, ctx: CanvasRenderingContext2D) {
    const image = Tile.imgMap[row][col];
    image.src = this.imageSrc;
    image.onload = () => {
      ctx.drawImage(
        image,
        row * this.tileSize,
        col * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    };
  }
}

//defining the size of the main grid
const numTiles = 32;
const tileSize = gridCanvas.width / numTiles;

const tiles: { [src: string]: Tile } = {};
imageUrls.forEach((element) => {
  tiles[element] = new Tile(element, tileSize);
});

//defining the size of the select grid
const numSelectables = imageUrls.length;
const selectHeight = selectCanvas.height / numSelectables;

//creating the tilemap nested array
let tilemap: string[][] = new Array(numTiles);
initMap();
Tile.setTilemapSize(numTiles);
//track the selected tile
let currentTile = "/tile1.png";
let clicked = false;

//draw the initial canvases

redrawTilemap();
drawSelectCanvas();

function initMap() {
  for (let i = 0; i < numTiles; i++) {
    let row = new Array(numTiles);
    for (let j = 0; j < numTiles; j++) {
      row[j] = "/tile1.png";
    }
    tilemap[i] = row;
  }
}

//Function that draws a texture to a specific canvas ctx
function drawTexture(
  row: number,
  col: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  cellSize: number
) {
  image.onload = () => {
    ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
  };
  ctx.drawImage(image, row * cellSize, col * cellSize, width, height);
}

// ----- Interacting with the main tilemap -----

function redrawTilemap() {
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  for (let i = 0; i < numTiles; i++) {
    for (let j = 0; j < numTiles; j++) {
      tiles[tilemap[i][j]].drawTile(i, j, gridCtx);
    }
  }
}

gridCanvas.addEventListener("mousedown", function () {
  clicked = true;
});

gridCanvas.addEventListener("mouseup", function () {
  clicked = false;
});

gridCanvas.addEventListener("mouseleave", function () {
  clicked = false;
});

gridCanvas.addEventListener("mousemove", (e) => {
  if (!clicked) {
    return;
  }

  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = currentTile;
  tiles[tilemap[coordX][coordY]].drawTile(coordX, coordY, gridCtx);
});

gridCanvas.addEventListener("click", (e) => {
  const coordX = Math.trunc(e.offsetX / tileSize);
  const coordY = Math.trunc(e.offsetY / tileSize);

  tilemap[coordX][coordY] = currentTile;
  tiles[tilemap[coordX][coordY]].drawTile(coordX, coordY, gridCtx);
});

// ----- Interacting with the selectable tilemap -----

// Loop through the selectable tiles and draw textures in each cell
function drawSelectCanvas() {
  for (let i = 0; i < numSelectables; i++) {
    const selectableImage = new Image();
    selectableImage.src = imageUrls[i];
    drawTexture(
      0,
      i,
      selectCtx,
      selectableImage,
      selectCanvas.width,
      selectHeight,
      64
    );
  }
}

selectCanvas.addEventListener("click", (e) => {
  const coordY = Math.trunc(e.offsetY / selectHeight);
  currentTile = imageUrls[coordY];
});
