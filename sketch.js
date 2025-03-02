// Note: This example is purposely inefficient for the purpose of demonstration and can be significantly sped up via bitwise-based rather than iteration-based column operations

let pixy;
let meshes;
let block_size;

function generate_meshes(get_block, del_block) {
  let meshes = [];
  
  const calculate_mesh_horizontal = (i, j, mesh_start_y) => {
    let k = i + 1;
    for (; k < pixy.res[0]; k++) {
      let l = mesh_start_y;
      for (; l < j; l++)
        if (!get_block(k, l))
          break;
      if (l < j)
        break;
      l = mesh_start_y;
      for (; l < j; l++)
        del_block(k, l); // pixy.setPixel([k, l], color(0, 255, 0)); // (Display green for horizontally expanded)
    }
    
    return k;
  }
  
  for (let i = 0; i < pixy.res[0]; i++) { // Loop over each column
    let j = 0; // Current block's y position iterator
    let mesh_start_y = j; // Designate where the first of the previous unbroken sequence of active block before the current one is; otherwise equal the current block's j
    for (; j < pixy.res[1]; j++) {
      if (get_block(i, j)) // If there's an active block don't update mesh_start_y so that it designates whichever was the first of the previous unbroken sequence of active blocks
        del_block(i, j); // pixy.setPixel([i, j], color(0, 0, 255)); (Display blue for vertically expanded)
      else {
        if (mesh_start_y != j) // Generate a mesh now that a break in a generated mesh is detected (mesh_start_y == j would mean invalid length 0)
          meshes.push(i, mesh_start_y, calculate_mesh_horizontal(i, j, mesh_start_y), j);
        mesh_start_y = j + 1; // If there isn't an active block update mesh_start_y so that it's the same as j in the next iteration
      }
    }
    if (mesh_start_y != j) // Generate a mesh now that a break in a generated mesh is detected (mesh_start_y == j would mean invalid length 0)
      meshes.push(i, mesh_start_y, calculate_mesh_horizontal(i, j, mesh_start_y), j);
  }
  
  return new Uint8Array(meshes);
}

function setup() {
  createCanvas(400, 400, WEBGL);
  noStroke();
  noSmooth();
  
  pixy = new Pixy(
    [-width / 2, -height / 2], // The [x, y] (x position, y position) of the top left
    [width, height], // The [w, h] (width, height) of the Pixy instance
    [64, 64] // The resolution in width and height of the Pixy instance
  );
  this._renderer.getTexture(pixy.img).setInterpolation(NEAREST, NEAREST); // Make the image pixelated rather than blurry
  pixy.loadPixels(); // Generate some noise to greedily mesh
  {
    const noise_scale = 0.3;
    for (let i = 0; i < pixy.res[0]; i++)
      for (let j = 0; j < pixy.res[1]; j++)
        pixy.setPixel([i, j], noise(i * noise_scale, j * noise_scale) < 0.5 ? 0 : 255);
  }
  pixy.updatePixels();
  block_size = pixy.size[0] / pixy.res[0]
  
  // Getters and setters to interact with the block data (you're free to replace this to test the greedy meshing algorithm)
  const get_block = (x, y) => pixy.img.pixels[4 * (pixy.res[0] * y + x)];
  const del_block = (x, y) => pixy.setPixel([x, y], 0);
  // Generate the meshes
  meshes = generate_meshes(get_block, del_block);
  pixy.updatePixels();
}

function draw() {
  background(0);
  
  pixy.display(); // Draw pixy just to show that there's nothing less or the debug pixels if used
  push(); // Draw the generated meshes
  {
    fill(100, 100, 100, 100);
    strokeWeight(2);
    stroke("red");
    
    for (let i = 0; i < meshes.length; i += 4)
      rect(-width / 2 + block_size * meshes[i], -height / 2 + block_size * meshes[i + 1], block_size * (meshes[i + 2] - meshes[i]), block_size * (meshes[i + 3] - meshes[i + 1]));
  }
  pop();
}