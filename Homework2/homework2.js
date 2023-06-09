"use strict";

var canvas;
var gl;
var program;

var rotationMatrix = mat4();
var projectionMatrix;
var modelViewMatrix;
var nMatrix;
var instanceMatrix;
var modelViewMatrixLoc;
var rotationMatrixLoc;

//POINTS
var pointsArray = [];
var texCoordsArray = [];
var normalsArray = [];
var tangentsArray = [];

var vertices = [

    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

//BODY
var bodyId = 0;
var body1Id = 0;
var body2Id = 16;
var body3Id = 23;
var bodyHeight = 4.6;
var bodyWidth = 1.2;

//HEAD
var headId = 1;
var head1Id = 1;
var head2Id = 10;
var headHeight = 0.9;
var headWidth = 1.3;

//EARS
var EarLeftId = 21;
var EarHeight = 0.2;
var EarWidth = 0.4;
var EarRightId = 22;

//FRONT LEGS
var leftFrontUpperLegId = 2;
var leftFrontLowerLegId = 3;
var rightFrontUpperLegId = 4;
var rightFrontLowerLegId = 5;

//BACK LEGS
var leftBackUpperLegId = 6;
var leftBackLowerLegId = 7;
var rightBackUpperLegId = 8;
var rightBackLowerLegId = 9;
var upperLegHeight = 1.3;
var upperLegWidth = 0.39;
var lowerLegHeight = 1.0;
var lowerLegWidth = 0.3;

//TAIL
var tailId = 11;
var tail1Id = 12;
var tail2Id = 13;
var tailHeight = 1.4;
var tailWidth = 0.35;
var tailHeight1 = 1.4;
var tailWidth1 = 0.25;
var tailHeight2 = 1.2;
var tailWidth2 = 0.20;

//CARPET
var carpetId = 14;
var carpetHeight = 0.3;
var carpetWidth = 65.0;

//TABLE
var tableId = 15;
var tableHeight = 1.0;
var tableWidth = 15;
var leg1Id = 17;
var leg2Id = 18;
var leg3Id = 19;
var leg4Id = 20;
var legHeight = 1.85;
var legWidth = 1.0;

//SCENE 
var catPos = [23.0, 0.3, 0.0];
var numNodes = 23;

var theta = [90, 270, 90, 0, 90, 0, 90, 0, 90, 0, 180, 60, 30, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 270];
var thetaStart = Array.from(theta);

var stack = [];
var figure = [];

for (var i = 0; i < numNodes; i++) figure[i] = createNode(null, null, null, null);


//TEXTURE
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

//ANIMATION
var animationStep = 0;
var Iteration = 0;
var NumberOfIteration = 0;
var SecondPart = 1.0;
var defaultSpeed = 12;
var currentSpeed = 12;
var buttonFlag = false;
var finishAnimation = true;
var interval;

//JUMP ANIMATION
const g = 9.81; // gravity acceleration (m/s^2)
const yTableArriaval = 3.08; //Height of arrival
const xTableArrival = 5.99999999999912; //X position of arrival
var x0, y0; //Initial position
var v0x, v0y; //Initial speed
var t_vol;
var t = 0.0;
var distanceFromArrival;

//FUNCTION THAT CALCULATE MOTION BULLET
function ParabolicJump() {
    const x = x0 - v0x * t; //x positon
    const y = y0 + v0y * t - 0.5 * g * t * t; //y position
    catPos[0] = x;
    catPos[1] = y;
    t += 0.0025128; //TIME INCREASING (300 ITERATION)
}

//LIGHT
var lightPosition = vec4(15.0, 16.0, -17.0, 1.0);
var lightAmbient = vec4(0.8, 0.9, 0.7, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(0.1, 0.1, 0.1, 1.0);

//MATERIAL GREY COLOR
var materialAmbient = vec4(0.3, 0.2, 0.2, 1.0);
var materialDiffuse = vec4(1.0, 0.8, 0.8, 1.0);
var materialSpecular = vec4(0.3, 0.3, 0.3, 1.0);
var materialShininess = 0.1;

//CAMERA
var eye = vec3(0.0, 0.0, 0.0);
var at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var radius = 38.0;
var thetaEye = 20 * Math.PI / 180.0; //20
var phi = -120 * Math.PI / 180.0; //-120

var near = 1.0;
var far = 100.0;

var fovy = 35.0;
var aspect = 1.0;

//MOTION BLUR
var motionBlurFlag = false;
var motionBlurQuantity = 1.0;
var BlurIntensity = 1.0;
var defaultIntensity = 5;

//Function to create each node of scene
function createNode(transform, render, sibling, child) {
    var node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
    }
    return node;
}

//Function that initialize each node using case
function initNodes(Id) {

    //CAT MATRIX
    var m = mat4();
    switch (Id) {

        //CAT MODEL
        case bodyId:
        case body1Id:
        case body2Id:
            m = translate(catPos[0], catPos[1], catPos[2]);
            m = mult(m, rotate(theta[body1Id], vec3(1, 0, 0)));
            m = mult(m, rotate(theta[body2Id], vec3(0, 1, 0)));
            m = mult(m, rotate(theta[body3Id], vec3(0, 0, 1)));
            figure[bodyId] = createNode(m, body, null, headId);
            break;

        case headId:
        case head1Id:
        case head2Id:
            m = translate(0, bodyHeight + 0.7 * headHeight, 0.5
                * bodyWidth);
            m = mult(m, rotate(theta[head1Id], vec3(1, 0, 0)));
            m = mult(m, rotate(theta[head2Id], vec3(0, 1, 0)));
            m = mult(m, translate(0.0, -0.7 * headHeight, 0.0));
            figure[headId] = createNode(m, head, leftFrontUpperLegId, EarLeftId);
            break;

        case EarLeftId:
            m = translate(0.35, headHeight + 0.28, 0);
            m = mult(m, rotate(theta[EarLeftId], vec3(1, 0, 0)));
            m = mult(m, translate(0.0, -0.7 * headHeight, 0.0));
            figure[EarLeftId] = createNode(m, Ears, EarRightId, null);
            break;
        case EarRightId:
            m = translate(-0.35, headHeight + 0.28, 0);
            m = mult(m, rotate(theta[EarLeftId], vec3(1, 0, 0)));
            m = mult(m, translate(0.0, -0.7 * headHeight, 0.0));
            figure[EarRightId] = createNode(m, Ears, null, null);
            break;

        case leftFrontUpperLegId:
            m = translate(-(0.1 * bodyWidth + 0.7 * upperLegWidth), 0.9 * bodyHeight, -0.3);
            m = mult(m, rotate(theta[leftFrontUpperLegId], vec3(1, 0, 0)));
            figure[leftFrontUpperLegId] = createNode(m, leftFrontUpperLeg, rightFrontUpperLegId, leftFrontLowerLegId);
            break;

        case rightFrontUpperLegId:
            m = translate((0.1 * bodyWidth + 0.7 * upperLegWidth), 0.9 * bodyHeight, -0.3);
            m = mult(m, rotate(theta[rightFrontUpperLegId], vec3(1, 0, 0)));
            figure[rightFrontUpperLegId] = createNode(m, rightFrontUpperLeg, leftBackUpperLegId, rightFrontLowerLegId);
            break;

        case leftBackUpperLegId:
            m = translate(-(0.1 * bodyWidth + 0.7 * upperLegWidth), 0.1 * bodyHeight, -0.3);
            m = mult(m, rotate(theta[leftBackUpperLegId], vec3(1, 0, 0)));
            figure[leftBackUpperLegId] = createNode(m, leftBackUpperLeg, rightBackUpperLegId, leftBackLowerLegId);
            break;

        case rightBackUpperLegId:
            m = translate(0.1 * bodyWidth + 0.7 * upperLegWidth, 0.1 * bodyHeight, -0.3);
            m = mult(m, rotate(theta[rightBackUpperLegId], vec3(1, 0, 0)));
            figure[rightBackUpperLegId] = createNode(m, rightBackUpperLeg, null, rightBackLowerLegId);
            break;

        case leftFrontLowerLegId:
            m = translate(0.0, 0.9 * upperLegHeight, 0.0);
            m = mult(m, rotate(theta[leftFrontLowerLegId], vec3(1, 0, 0)));
            figure[leftFrontLowerLegId] = createNode(m, leftFrontLowerLeg, null, null);
            break;

        case rightFrontLowerLegId:
            m = translate(0.0, 0.9 * upperLegHeight, 0.0);
            m = mult(m, rotate(theta[rightFrontLowerLegId], vec3(1, 0, 0)));
            figure[rightFrontLowerLegId] = createNode(m, rightFrontLowerLeg, null, null);
            break;

        case leftBackLowerLegId:
            m = translate(0.0, 0.9 * upperLegHeight, 0.0);
            m = mult(m, rotate(theta[leftBackLowerLegId], vec3(1, 0, 0)));
            figure[leftBackLowerLegId] = createNode(m, leftBackLowerLeg, tailId, null);
            break;

        case rightBackLowerLegId:
            m = translate(0.0, 0.9 * upperLegHeight, 0.0);
            m = mult(m, rotate(theta[rightBackLowerLegId], vec3(1, 0, 0)));
            figure[rightBackLowerLegId] = createNode(m, rightBackLowerLeg, null, null);
            break;

        case tailId:
            m = translate(0.35 * bodyWidth, -0.35 * upperLegHeight, -0.1 * bodyWidth);
            m = mult(m, rotate(theta[tailId], vec3(1, 0, 0)));
            figure[tailId] = createNode(m, tail, null, tail1Id);
            break;

        case tail1Id:
            m = translate(0.0, 0.8 * tailHeight, 0.0);
            m = mult(m, rotate(theta[tail1Id], vec3(1, 0, 0)));
            figure[tail1Id] = createNode(m, tail1, null, tail2Id);
            break;

        case tail2Id:
            m = translate(0.0, 0.95 * tailHeight1, 0.0);
            m = mult(m, rotate(theta[tail2Id], vec3(1, 0, 0)));
            figure[tail2Id] = createNode(m, tail2, null, null);
            break;

        case carpetId:
            m = translate(0.0, 0.0, 0.0);
            m = mult(m, rotate(theta[carpetId], vec3(1, 0, 0)));
            figure[carpetId] = createNode(m, carpet, null, null);
            break;

        case tableId:
            m = translate(0.0, 0.0, 0.0);
            m = mult(m, rotate(theta[tableId], vec3(1, 0, 0)));
            figure[tableId] = createNode(m, table, null, leg1Id);
            break;

        case leg1Id:
            m = translate(7.0, 0.0, 7.0);
            m = mult(m, rotate(theta[leg1Id], vec3(1, 0, 0)));
            figure[leg1Id] = createNode(m, leg, leg2Id, null);
            break;

        case leg2Id:
            m = translate(-7.0, 0.0, -7.0);
            m = mult(m, rotate(theta[leg2Id], vec3(1, 0, 0)));
            figure[leg2Id] = createNode(m, leg, leg3Id, null);
            break;

        case leg3Id:
            m = translate(-7.0, 0.0, 7.0);
            m = mult(m, rotate(theta[leg3Id], vec3(1, 0, 0)));
            figure[leg3Id] = createNode(m, leg, leg4Id, null);
            break;

        case leg4Id:
            m = translate(7.0, 0.0, -7.0);
            m = mult(m, rotate(theta[leg4Id], vec3(1, 0, 0)));
            figure[leg4Id] = createNode(m, leg, null, null);
            break;
    }

}

//Function that scan all Hierarchical model
function traverse(Id) {
    if (Id == null) return;
    stack.push(rotationMatrix);
    rotationMatrix = mult(rotationMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverse(figure[Id].child);
    rotationMatrix = stack.pop();
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

//Function that draw body
function body() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * bodyHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(bodyWidth, bodyHeight, bodyWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw head
function head() {
    TextureToLoad(false, true, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    TextureToLoad(true, false, false, false);
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw ears
function Ears() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(EarWidth, EarHeight, EarWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));


    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw front left upper leg
function leftFrontUpperLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw front left lower leg
function leftFrontLowerLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw front right upper leg
function rightFrontUpperLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw front right lower leg
function rightFrontLowerLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw back left upper leg
function leftBackUpperLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw back left lower leg
function leftBackLowerLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw back right upper leg
function rightBackUpperLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw back right lower leg
function rightBackLowerLeg() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw first part of tail
function tail() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * tailHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tailWidth, tailHeight, tailWidth))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw second part of tail
function tail1() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * tailHeight1, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tailWidth1, tailHeight1, tailWidth1))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw third part of tail
function tail2() {
    TextureToLoad(true, false, false, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.5 * tailHeight2, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tailWidth2, tailHeight2, tailWidth2))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw carpet
function carpet() {
    TextureToLoad(false, false, true, false);

    instanceMatrix = mult(rotationMatrix, translate(0.0, -2.35, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(carpetWidth, carpetHeight, carpetWidth))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw table upper part
function table() {
    TextureToLoad(false, false, false, true);

    instanceMatrix = mult(rotationMatrix, translate(0.0, 0.1, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(tableWidth, tableHeight, tableWidth))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);
}

//Function that draw leg of table
function leg() {
    TextureToLoad(false, false, false, true);

    instanceMatrix = mult(rotationMatrix, translate(0.0, -1.3, 0.0));
    instanceMatrix = mult(instanceMatrix, scale(legWidth, legHeight, legWidth))
    gl.uniformMatrix4fv(rotationMatrixLoc, false, flatten(instanceMatrix));
    for (var i = 0; i < 6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4 * i, 4);

}


function quad(a, b, c, d) {
    //CALCULATE NORMALS AND TANGENTS
    var t1 = subtract(vertices[b], vertices[a]);
    var t2 = subtract(vertices[c], vertices[b]);
    var normal = normalize(cross(t1, t2));
    normal = vec4(normal[0], normal[1], normal[2], 0.0);
    var tangent = vec4(t1[0], t1[1], t1[2], 0.0);

    pointsArray.push(vertices[a]);
    texCoordsArray.push(texCoord[0]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[b]);
    texCoordsArray.push(texCoord[1]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[c]);
    texCoordsArray.push(texCoord[2]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);

    pointsArray.push(vertices[d]);
    texCoordsArray.push(texCoord[3]);
    normalsArray.push(normal);
    tangentsArray.push(tangent);
}


function cube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

//Function that set all needed textures
function setTextures() {
    var furTextureImage = document.getElementById("furTexture");
    var textureFur = configureTexture(furTextureImage, "utextureFur", 0);

    var catFaceTextureImage = document.getElementById("catFaceTexture");
    var textureFace = configureTexture(catFaceTextureImage, "uTextureFace", 1);

    var carpetTextureImage = document.getElementById("carpetTexture");
    var textureCarpet = configureTexture(carpetTextureImage, "utextureCarpet", 2);

    var woodTextureImage = document.getElementById("woodTexture");
    var textureWood = configureTexture(woodTextureImage, "uTextureWood", 3);
    //BUMPMAP

    var furBumpMapImage = document.getElementById("furNormal");
    var bumpMapFur = configureTexture(furBumpMapImage, "uBumpMapFur", 4);

    var carpetBumpMapImage = document.getElementById("carpetNormal");
    var bumpMapCarpet = configureTexture(carpetBumpMapImage, "uBumpMapCarpet", 5);

    var woodBumpMapImage = document.getElementById("woodNormal");
    var bumpMapWood = configureTexture(woodBumpMapImage, "uBumpMapWood", 6);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureFur);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textureFace);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, textureCarpet);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, textureWood);
    gl.activeTexture(gl.TEXTURE4);
    gl.bindTexture(gl.TEXTURE_2D, bumpMapFur);
    gl.activeTexture(gl.TEXTURE5);
    gl.bindTexture(gl.TEXTURE_2D, bumpMapCarpet);
    gl.activeTexture(gl.TEXTURE6);
    gl.bindTexture(gl.TEXTURE_2D, bumpMapWood);
}

function configureTexture(textureImage, textureName, textureNumber) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, textureImage);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, textureName), textureNumber);
    return texture;
}

//Texture to apply to each specific node using true on textyre to apply
function TextureToLoad(fur, face, carpet, wood) {
    gl.uniform1f(gl.getUniformLocation(program, "uCatFurFlag"), fur);
    gl.uniform1f(gl.getUniformLocation(program, "uCatFaceFlag"), face);
    gl.uniform1f(gl.getUniformLocation(program, "uCarpetFlag"), carpet);
    gl.uniform1f(gl.getUniformLocation(program, "uWoodFlag"), wood);
}

//Function that configure light
function setLight() {
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), flatten(specularProduct));
    gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);
    gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"), flatten(lightPosition));
}

//Initialization of all needed buffers
function setBuffers() {
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW);
    var texCoordLoc = gl.getAttribLocation(program, "aTexCoord");
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texCoordLoc);

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);
    var normalLoc = gl.getAttribLocation(program, "aNormal");
    gl.vertexAttribPointer(normalLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLoc);

    var tangentBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(tangentsArray), gl.STATIC_DRAW);
    var tangentLoc = gl.getAttribLocation(program, "aTangent");
    gl.vertexAttribPointer(tangentLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(tangentLoc);
}

//Init
window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2', {
        alpha: true
    });
    //ALPHA CHANNEL ACTIVATE FOR TRANSPARENT OBJECTS

    if (!gl) { alert("WebGL 2.0 isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.4, 0.7, 0.8, 1.0);

    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    modelViewMatrixLoc = gl.getUniformLocation(program, "uModelViewMatrix")
    rotationMatrixLoc = gl.getUniformLocation(program, "uRotationMatrix")

    setTextures();

    cube();

    setBuffers();

    setLight();

    setListeners();

    for (i = 0; i < numNodes; i++) initNodes(i);

    render();
}


//Animation of the cat
function catAnimation(flagForMotionBlur) {
    var motionBlurActive = (typeof flagForMotionBlur === 'undefined') ? false : flagForMotionBlur;
    if (!buttonFlag && !motionBlurActive) return;

    if (NumberOfIteration < 1750) {
        //WALK 0
        NumberOfIteration += 1;

        if (animationStep == 0) {
            Iteration += 1;
            if (Iteration % 50 == 0) {
                Iteration = 0;
                animationStep = 1;
            }
            catPos[0] -= 0.01;

            initNodes(bodyId);

            theta[leftBackUpperLegId] -= 0.22;
            initNodes(leftBackUpperLegId);
            theta[leftBackLowerLegId] -= 0.22;
            initNodes(leftBackLowerLegId);
            theta[rightBackUpperLegId] += 0.22;
            initNodes(rightBackUpperLegId);
            theta[rightBackLowerLegId] += 0.22;
            initNodes(rightBackLowerLegId);

            theta[leftFrontUpperLegId] += 0.22;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] += 0.22;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] -= 0.22;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] -= 0.22;
            initNodes(rightFrontLowerLegId);

            theta[tailId] += 0.22;
            initNodes(tailId);
            theta[tail1Id] -= 0.3;
            initNodes(tail1Id);
            theta[tail2Id] -= 0.22;
            initNodes(tail2Id);

            theta[headId] -= 0.1;
            initNodes(headId);

        } else if (animationStep == 1) {
            //WALK 1
            Iteration += 1;
            if (NumberOfIteration == 700) {
                animationStep = 3;
            } else if (Iteration % 100 == 0) {
                animationStep = 2;
            }
            catPos[0] -= 0.01;

            initNodes(bodyId);

            theta[leftBackUpperLegId] += 0.22;
            initNodes(leftBackUpperLegId);
            theta[leftBackLowerLegId] += 0.22;
            initNodes(leftBackLowerLegId);
            theta[rightBackUpperLegId] -= 0.22;
            initNodes(rightBackUpperLegId);
            theta[rightBackLowerLegId] -= 0.22;
            initNodes(rightBackLowerLegId);

            theta[leftFrontUpperLegId] -= 0.22;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] -= 0.22;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] += 0.22;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] += 0.22;
            initNodes(rightFrontLowerLegId);

            theta[tailId] -= 0.22;
            initNodes(tailId);
            theta[tail1Id] += 0.3;
            initNodes(tail1Id);
            theta[tail2Id] += 0.22;
            initNodes(tail2Id);

            theta[headId] += 0.1;
            initNodes(headId);


        } else if (animationStep == 2) {
            //WALK 2
            Iteration += 1;
            if (NumberOfIteration == 1650) {
                animationStep = 7;
            } else if (Iteration % 100 == 0) {
                animationStep = 1;
            }
            catPos[0] -= 0.01;

            initNodes(bodyId);

            theta[leftBackUpperLegId] -= 0.22;
            initNodes(leftBackUpperLegId);
            theta[leftBackLowerLegId] -= 0.22;
            initNodes(leftBackLowerLegId);
            theta[rightBackUpperLegId] += 0.22;
            initNodes(rightBackUpperLegId);
            theta[rightBackLowerLegId] += 0.22;
            initNodes(rightBackLowerLegId);

            theta[leftFrontUpperLegId] += 0.22;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] += 0.22;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] -= 0.22;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] -= 0.22;
            initNodes(rightFrontLowerLegId);

            theta[tailId] += 0.22;
            initNodes(tailId);
            theta[tail1Id] -= 0.3;
            initNodes(tail1Id);
            theta[tail2Id] -= 0.22;
            initNodes(tail2Id);

            theta[headId] -= 0.1;
            initNodes(headId);
        } else if (animationStep == 3) {
            //CROUNCHING
            Iteration += 1;
            if (Iteration == 1100) {
                animationStep = 6;
            } else if (Iteration % 100 == 0) {

                //Initialization of parabolic motion
                x0 = catPos[0];
                y0 = catPos[1];
                t_vol = Math.sqrt((2 * Math.abs(y0 - yTableArriaval)) / g);
                distanceFromArrival = Math.abs(x0 - xTableArrival);
                v0y = g * t_vol;
                v0x = distanceFromArrival / t_vol;

                animationStep = 4;
            }
            theta[body2Id] += 0.1 * SecondPart;
            initNodes(bodyId);

            theta[leftFrontUpperLegId] += 0.7 * SecondPart;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] -= 1 * SecondPart;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] += 0.7 * SecondPart;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] -= 1 * SecondPart;
            initNodes(rightFrontLowerLegId);

            theta[tailId] += 0.1;
            initNodes(tailId);
            theta[tail1Id] += 0.11;
            initNodes(tail1Id);
            theta[tail2Id] += 0.05;
            initNodes(tail2Id);

            theta[headId] -= 0.05;
            initNodes(headId);
        } else if (animationStep == 4) {
            //JUMP UP
            Iteration += 1;
            if (Iteration == 900) {
                animationStep = 5;
            }
            ParabolicJump();
            theta[body2Id] -= 0.16;
            initNodes(bodyId);

            theta[leftFrontUpperLegId] -= 0.3;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] += 0.4;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] -= 0.3;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] += 0.4;
            initNodes(rightFrontLowerLegId);

            theta[leftBackUpperLegId] += 0.22;
            initNodes(leftBackUpperLegId);
            theta[leftBackLowerLegId] += 0.22;
            initNodes(leftBackLowerLegId);
            theta[rightBackUpperLegId] += 0.22;
            initNodes(rightBackUpperLegId);
            theta[rightBackLowerLegId] += 0.22;
            initNodes(rightBackLowerLegId);

            theta[tailId] -= 0.12;
            initNodes(tailId);
            theta[tail1Id] += 0.1;
            initNodes(tail1Id);
            theta[tail2Id] += 0.12;
            initNodes(tail2Id);

            theta[headId] += 0.1;
            initNodes(headId);

        } else if (animationStep == 5) {
            //JUMP DOWN
            Iteration += 1;
            if (Iteration % 100 == 0) {
                animationStep = 3;
                SecondPart = 0.5;
            }
            ParabolicJump();
            theta[body2Id] += 0.27;
            initNodes(bodyId);

            theta[leftFrontUpperLegId] += 0.25;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] -= 0.54;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontUpperLegId] += 0.25;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontLowerLegId] -= 0.54;
            initNodes(rightFrontLowerLegId);

            theta[leftBackUpperLegId] -= 0.430;
            initNodes(leftBackUpperLegId);
            theta[leftBackLowerLegId] -= 0.430;
            initNodes(leftBackLowerLegId);
            theta[rightBackUpperLegId] -= 0.43;
            initNodes(rightBackUpperLegId);
            theta[rightBackLowerLegId] -= 0.43;
            initNodes(rightBackLowerLegId);



            theta[tailId] += 0.32;
            initNodes(tailId);
            theta[tail1Id] -= 0.4;
            initNodes(tail1Id);
            theta[tail2Id] -= 0.32;
            initNodes(tail2Id);

            theta[headId] -= 0.1;
            initNodes(headId);
        } else if (animationStep == 6) {
            //STAND UP
            Iteration += 1;
            if (Iteration == 1200) {
                animationStep = 0;
            }
            theta[body2Id] -= 0.05;
            initNodes(bodyId);

            theta[leftFrontUpperLegId] -= 0.35;
            initNodes(leftFrontUpperLegId);
            theta[leftFrontLowerLegId] += 0.74;
            initNodes(rightFrontUpperLegId);
            theta[rightFrontUpperLegId] -= 0.35;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] += 0.74;
            initNodes(rightFrontLowerLegId);

            theta[tailId] -= 0.1;
            initNodes(tailId);
            theta[tail1Id] -= 0.11;
            initNodes(tail1Id);
            theta[tail2Id] -= 0.05;
            initNodes(tail2Id);

            theta[headId] -= 0.05;
            initNodes(headId);
        } else if (animationStep == 7) {
            //SIT DOWN
            Iteration += 1;
            if (NumberOfIteration <= 1700) {
                catPos[1] -= 0.0096;
                theta[body2Id] -= 0.12;
                theta[leftBackUpperLegId] -= 0.8;
                theta[leftBackLowerLegId] -= 0.1;
                theta[rightBackUpperLegId] -= 0.8;
                theta[rightBackLowerLegId] -= 0.1;
            } else {
                catPos[1] -= 0.0288;
                theta[body2Id] -= 0.32;
                theta[leftBackUpperLegId] -= 0.346;
                theta[leftBackLowerLegId] -= 0.0764;
                theta[rightBackUpperLegId] -= 0.346;
                theta[rightBackLowerLegId] -= 0.0764;
            }

            initNodes(leftBackUpperLegId);
            initNodes(leftBackLowerLegId);
            initNodes(rightBackUpperLegId);
            initNodes(rightBackLowerLegId);
            initNodes(bodyId);

            theta[leftFrontLowerLegId] -= 0.3;
            initNodes(leftFrontLowerLegId);
            theta[rightFrontLowerLegId] -= 0.3;
            initNodes(rightFrontLowerLegId);

            theta[tailId] += 1.1;
            initNodes(tailId);
            theta[tail1Id] += 0.1;
            initNodes(tail1Id);
            theta[tail2Id] += 0.08;
            initNodes(tail2Id);

            theta[headId] += 0.18;
            initNodes(headId);
        }

        if (NumberOfIteration >= 1750) {
            //COMPLETED ANIMATION
            buttonFlag = false;
            finishAnimation = true;
            document.getElementById("Play").disabled = true
            document.getElementById("Play").classList.toggle("active")
            clearInterval(interval);
        }
    }
}

//Configuration of the camera
function setCamera() {
    eye = vec3(radius * Math.sin(phi), radius * Math.sin(thetaEye), radius * Math.cos(phi));
    modelViewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    nMatrix = normalMatrix(modelViewMatrix, true);

    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uModelViewMatrix"), false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "uProjectionMatrix"), false, flatten(projectionMatrix));
    gl.uniformMatrix3fv(gl.getUniformLocation(program, "uNormalMatrix"), false, flatten(nMatrix));
}

//Draw all Independent Hierarchical model
function drawHierarchicalModel() {
    traverse(bodyId);
    traverse(carpetId);
    traverse(tableId);
}

//Render function
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    setCamera();

    gl.uniform1f(gl.getUniformLocation(program, "uMotionBlurFlag"), motionBlurFlag);

    //RENDER NON-TRANSPARENT OBJECTS
    traverse(carpetId);
    traverse(tableId);

    //MOTION BLUR EFFECT
    if (motionBlurFlag && !finishAnimation) {
        //RENDER TRANSPARENT OBJECTS
        gl.depthMask(false);

        //NOT WHITE TRANSPARENT CATS
        gl.enable(gl.BLEND);
        //BLEND FOR GIVE EFFECT OF MOTION BLUR
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        //SAVING VARIABLES
        var thetaBefore = Array.from(theta);
        var catPreviousPosition = Array.from(catPos);
        var PreviousAnimationStep = animationStep;
        var PreviousIteration = Iteration;
        var PreviousNumberOfIteration = NumberOfIteration;
        var PreviousTime = t;

        // BLUR LOOP:
        //BLUR INTENSITY FOR INCREASE EFFECT WHEN SPEED UP THE ANIMATION
        motionBlurQuantity = 0.0;
        //CHANGE NUMBER OF CATS BASED ON INTENSITY
        var CurrentBlurIntensity = BlurIntensity + 2 * (10 / currentSpeed);
        //INCREASE OF BLUR EACH TIME
        var increasing = (1.0 - motionBlurQuantity) / (defaultIntensity + CurrentBlurIntensity);

        for (var i = 0; i < defaultIntensity + CurrentBlurIntensity; i++) {
            //INCREASE OPACITY OF EACH CAT RENDERED
            motionBlurQuantity += increasing;
            gl.uniform1f(gl.getUniformLocation(program, "motionBlurQuantity"), motionBlurQuantity);
            //OBTAIN NEXT POSITION OF THE CAT
            catAnimation(motionBlurFlag);
            //RENDER CAT 
            traverse(bodyId);
        }

        //LOAD VARIABLES
        catPos = Array.from(catPreviousPosition);
        theta = Array.from(thetaBefore);
        NumberOfIteration = PreviousNumberOfIteration;
        animationStep = PreviousAnimationStep;
        Iteration = PreviousIteration;
        t = PreviousTime;
    }

    //FINISH RENDER TRANSPARENT OBJECTS
    gl.disable(gl.BLEND);
    gl.depthMask(true);

    //DRAW NORMAL CAT
    motionBlurQuantity = 1.0;
    gl.uniform1f(gl.getUniformLocation(program, "motionBlurQuantity"), motionBlurQuantity);
    traverse(bodyId);

    requestAnimationFrame(render);
}

//Configuration of all listeners
function setListeners() {
    // CAMERA SLIDER
    document.getElementById("zFarSlider").onchange = function (event) {
        far = parseFloat(event.target.value);
    };
    document.getElementById("zNearSlider").onchange = function (event) {
        near = parseFloat(event.target.value);
    };
    document.getElementById("radiusSlider").onchange = function (event) {
        radius = parseFloat(event.target.value);
    };
    document.getElementById("thetaSlider").onchange = function (event) {
        thetaEye = parseFloat(event.target.value) * Math.PI / 180.0;
    };
    document.getElementById("phiSlider").onchange = function (event) {
        phi = parseFloat(event.target.value) * Math.PI / 180.0;
    };
    document.getElementById("aspectSlider").onchange = function (event) {
        aspect = parseFloat(event.target.value);
    };
    document.getElementById("fovSlider").onchange = function (event) {
        fovy = parseFloat(event.target.value);
    };

    //SET SPEED OF ANIMATION
    document.getElementById("speed0").onclick = function (event) {
        currentSpeed = defaultSpeed * 2;
        event.target.classList.add("active");
        document.getElementById("speed1").classList.remove("active");
        document.getElementById("speed2").classList.remove("active");
        document.getElementById("speed3").classList.remove("active");
        clearInterval(interval);
        interval = setInterval(function () {
            catAnimation();
        }, currentSpeed);
    };
    document.getElementById("speed1").onclick = function (event) {
        currentSpeed = defaultSpeed;
        event.target.classList.add("active");
        document.getElementById("speed0").classList.remove("active");
        document.getElementById("speed2").classList.remove("active");
        document.getElementById("speed3").classList.remove("active");
        clearInterval(interval);
        interval = setInterval(function () {
            catAnimation();
        }, currentSpeed);
    };
    document.getElementById("speed2").onclick = function (event) {
        currentSpeed = defaultSpeed / 2;
        event.target.classList.add("active");
        document.getElementById("speed0").classList.remove("active");
        document.getElementById("speed1").classList.remove("active");
        document.getElementById("speed3").classList.remove("active");
        clearInterval(interval);
        interval = setInterval(function () {
            catAnimation();
        }, currentSpeed);
    };
    document.getElementById("speed3").onclick = function (event) {
        currentSpeed = defaultSpeed / 3;
        event.target.classList.add("active");
        document.getElementById("speed0").classList.remove("active");
        document.getElementById("speed1").classList.remove("active");
        document.getElementById("speed2").classList.remove("active");
        clearInterval(interval);
        interval = setInterval(function () {
            catAnimation();
        }, currentSpeed);
    };

    //PLAY/STOP ANIMATION
    document.getElementById("Play").onclick = function (event) {
        if (!buttonFlag) {
            clearInterval(interval);
            interval = setInterval(function () {
                catAnimation();
            }, currentSpeed);
            buttonFlag = true;
            finishAnimation = false;
        } else {
            buttonFlag = false;
        }
        event.target.classList.toggle("active");
        event.target.classList.toggle("toggler");
    };

    //RESET TO INITIAL SITUATION
    document.getElementById("Reset").onclick = function () {
        buttonFlag = false;
        clearInterval(interval);
        theta = Array.from(thetaStart);
        document.getElementById("Play").disabled = false;
        document.getElementById("Play").classList.remove("active");
        document.getElementById("Play").classList.add("toggler");
        catPos[0] = 23
        catPos[1] = 0.3;
        animationStep = 0;
        Iteration = 0;
        SecondPart = 1.0;
        t = 0;
        NumberOfIteration = 0;
        for (i = 0; i < numNodes; i++) initNodes(i);
    };

    //MOTION BLUR FLAG
    document.getElementById("motionBlur").onclick = function (event) {
        event.target.classList.toggle("active");
        motionBlurFlag = !motionBlurFlag;
    };
    //MOTION SLIDER INTENSITY
    document.getElementById("MBslider").onchange = function (event) {
        BlurIntensity = parseFloat(event.target.value);
    };
}
