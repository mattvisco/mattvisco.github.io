/**
 * Created by M on 11/16/15.
 */

var initPoint, endPoint, rect, path, width, rotate;

var intersectionPaths = [];

//MODE CONSTANTS
var IDLE = 0;
var FOUNDPOINT = 1;
var FOUNDROTATE = 2;

var clickMode = IDLE;
var RIGHTHELPTIME = 8000;
var rightTimeout;

var rectanglePaths = [];
var removeStoredPaths = [];
var backgroundColor = '#FFFFFF';
var colors = ['#AA3939', '#550000', '#801515', '#D46A6A', '#FFAAAA'];
var redColors = ['#AA3939', '#550000', '#801515', '#D46A6A', '#FFAAAA'];
var blueColors = ['#2E4172', '#061539', '#162955', '#4F628E', '#7887AB'];
var greenColors = ['#2B803E', '#00400E', '#106022', '#50A162', '#80C18E'];
var yellowColors = ['#AAA339', '#555000', '#807915', '#D4CE6A', '#FFFAAA'];

var layerCount = 0;

function onMouseDown(event) {
    var which = event.event.which;
    switch(clickMode) {
        case IDLE:
            if(which == 1) {
                findPoint(event);
                if(onboarding) onboardClicked();
            }
            break;
        case FOUNDPOINT:
            if(rightTimeout) {
                clearTimeout(rightTimeout);
                rightTimeout = null;
            }
            if(showingRightClickHelp) rightClickHelp(false);
            if(which == 1) {
                if(onboarding) onboardLined();
                findRotate(event);
            }
            else if(which == 3) {
                if(onboarding) onboardRestart();
                resetDefaults();
            }
            break;
        case FOUNDROTATE:
            if(which == 1) {
                if(onboarding) onboardEnd();
                lockRectangle();
            }
            break;
    }
}

function resetDefaults() {
    clickMode = IDLE;
    if(path) path.remove();
}

function findPoint(event) {
    clickMode = FOUNDPOINT;
    initPoint = event.point;
    if(!onboarding) rightTimeout = setTimeout(function(){rightClickHelp(true)}, RIGHTHELPTIME);
}

function findRotate(event) {
    clickMode = FOUNDROTATE;
    endPoint = event.point;
    makeLine(initPoint, endPoint);
    var edgeVector = endPoint - initPoint;
    width = initPoint.getDistance(endPoint);
    rotate = edgeVector.angle;
}

function lockRectangle() {
    clickMode = IDLE;
    removeStoredPaths.forEach(function(path){
        path.remove();
        removeFromArray(rectanglePaths, path);
    });
    var contained = checkIfPathContainedInArr(path,rectanglePaths);
    if(contained) path.remove();
    else {
        rectanglePaths.push(path);
        setLargeSmall(path);
    }
    // TODO: this should remove any paths that are now contained within new paths
    //rectanglePaths.forEach(function(rectPath){
    //    contained = checkIfPathContainedInArr(rectPath,intersectionPaths);
    //    if(contained) rectPath.remove();
    //});
    var intersectionsCopy = intersectionPaths.slice();
    intersectionPaths.forEach(function(intersectPath){
        removeFromArray(intersectPath, intersectionsCopy);
        contained = checkIfPathContainedInArr(intersectPath,intersectionsCopy);
        if(contained) intersectPath.remove();
        else {
            rectanglePaths.push(intersectPath);
            setLargeSmall(intersectPath);
        }
    });
    path = null;
    removeStoredPaths = [];
    intersectionPaths = [];
}

// TODO: Use to help sort and increase efficiency
function setLargeSmall(rectangle) {
    rectangle.largeX = getLargestX(rectangle);
    rectangle.smallX = getSmallestX(rectangle);
    rectangle.largeY = getLargestY(rectangle);
    rectangle.smallY = getSmallestY(rectangle);
    rectangle.layerCount = layerCount; // TODO: This might be used to reorder list based on layer
    layerCount++;
}

function checkIfPathContainedInArr(pathToCheck,checkAgainst) {
    var contained = false;
    checkAgainst.forEach(function(checkPath) {
        contained = checkIfPathContained(pathToCheck,checkPath);
    });
    return contained;
}

function checkIfPathContained(pathToCheck,checkPath) {
    var tmpArr = [];
    iterateSegments(pathToCheck,checkPath,tmpArr);
    return (tmpArr.length == 4);
}


function onMouseMove(event) {
    if(clickMode == FOUNDPOINT) {
        makeLine(initPoint, event.point);
    } else if(clickMode == FOUNDROTATE) {
        var height = distanceToLine(initPoint, endPoint, event.point);
        makeRectangle(height);
    }
}

function distanceToLine(start, end, point) {
    var twiceArea = (end.y - start.y)*point.x - (end.x - start.x)*point.y + end.x * start.y - end.y * start.x;
    return -1 * twiceArea / width;
}

function makeLine(point1, point2) {
    if(path) path.remove();
    path = new Path();
    path.add(point1, point2);
    path.strokeWidth = 4;
    path.strokeColor = 'black';
}

function makeRectangle(height) {
    rect = new Rectangle(initPoint.x, initPoint.y, width, height);
    if(path) path.remove();
    path = new Path.Rectangle(rect);
    path.rotate(rotate,initPoint);
    path.colorIndex = 0;
    path.fillColor = colors[0];
    makeIntersectionRectangles(path);
}

function iterateSegments(path1, path2, intersectionPoints) {
    var segments = path1.segments;
    for(var i = 0; i < segments.length; i++ ) {
        var segPt = segments[i].point;
        if( path2.contains(segPt) ) intersectionPoints.push(segPt);
    }
}

function findLeftPoint(points) {
    var leftPoint = points[0];
    points.forEach(function(point){
       if(point.x < leftPoint.x) leftPoint = point;
    });
    return leftPoint;
}

function findRightPoint(points) {
    var rightPoint = points[0];
    points.forEach(function(point){
        if(point.x > rightPoint.x) rightPoint = point;
    });
    return rightPoint;
}

function getSlope(point1, point2) {
    return (point1.y - point2.y) / (point1.x - point2.x);
}

function getYIntercept(point, slope) {
    return point.y - slope*point.x;
}

function getYValue(point, left, right) {
    var slope = getSlope(left,right);
    var b = getYIntercept(left,slope);
    return point.x * slope + b;
}

function aboveCheck(point, leftPoint, rightPoint) {
    return point.y > getYValue(point, leftPoint, rightPoint);
}

function getAbovePoint(points, leftPoint, rightPoint) {
    var aboveArr = [];
    points.forEach(function(point){
        if(aboveCheck(point, leftPoint, rightPoint)) aboveArr.push(point);
    });
    return aboveArr;
}

function getBelowPoint(points, leftPoint, rightPoint) {
    var belowArr = [];
    points.forEach(function(point){
        if(!aboveCheck(point, leftPoint, rightPoint)) belowArr.push(point);
    });
    return belowArr;
}

function xDec(point1, point2) {
    if(point1.x < point2.x) return 1;
    else return -1;
}

function xInc(point1, point2) {
    return xDec(point1,point2) * -1;
}

function removeFromArray(obj, array) {
    var index = array.indexOf(obj);
    return array.splice(index, 1);
}

function reorderPoints(intersectionPoints) {
    var leftPt = findLeftPoint(intersectionPoints);
    var rightPt = findRightPoint(intersectionPoints);
    var leftArr = removeFromArray(leftPt, intersectionPoints);
    var rightArr = removeFromArray(rightPt, intersectionPoints);
    var abovePoints = getAbovePoint(intersectionPoints, leftPt, rightPt);
    abovePoints.sort(xInc);
    var belowPoints = getBelowPoint(intersectionPoints, leftPt, rightPt);
    belowPoints.sort(xDec);
    return leftArr.concat(abovePoints).concat(rightArr).concat(belowPoints);
}

function makeIntersectionPath(intersectionPoints) {
    var reorderedPoints = reorderPoints(intersectionPoints);
    var intersectionPath = new Path();
    reorderedPoints.forEach(function(point) {
        intersectionPath.add(point);
    });
    return intersectionPath;
}

function rectangleXInc(rectangle1, rectangle2) {
    if ( rectangle1.largeX > rectangle2.largeX ) return 1;
    else return -1;
}

function rectangleYInc(rectangle1, rectangle2) {
    if ( rectangle1.largeY > rectangle2.largeY ) return 1;
    else return -1;
}

function getSmallestX(rectangle) {
    var segments = rectangle.segments;
    var currSmallest = segments[0].point.x;
    for(var i = 1; i < segments.length; i++ ) {
        var segPt = segments[i].point;
        if (segPt.x < currSmallest) currSmallest = segPt.x;
    }
    return currSmallest;
}

function getLargestX(rectangle) {
    var segments = rectangle.segments;
    var currLargest = segments[0].point.x;
    for(var i = 1; i < segments.length; i++ ) {
        var segPt = segments[i].point;
        if (segPt.x > currLargest) currLargest = segPt.x;
    }
    return currLargest;
}

function getSmallestY(rectangle) {
    var segments = rectangle.segments;
    var currSmallest = segments[0].point.y;
    for(var i = 1; i < segments.length; i++ ) {
        var segPt = segments[i].point;
        if (segPt.y < currSmallest) currSmallest = segPt.y;
    }
    return currSmallest;
}

function getLargestY(rectangle) {
    var segments = rectangle.segments;
    var currLargest = segments[0].point.y;
    for(var i = 1; i < segments.length; i++ ) {
        var segPt = segments[i].point;
        if (segPt.y > currLargest) currLargest = segPt.y;
    }
    return currLargest;
}

function getRectanglesToUseX(rectangle,paths) {
    rectangle.smallX = getSmallestX(rectangle);
    rectangle.largeX = getLargestX(rectangle);
    var rectanglesToUse = [];
    for(var i=0; i < paths.length; i++) {
        if(rectangle.smallX < paths[i].largeX && rectangle.largeX > paths[i].smallX) rectanglesToUse.push(paths[i]);
        else if(rectangle.smallX > paths[i].largeX) break;
    }
    return rectanglesToUse;
}

function getRectanglesToUseY(rectangle,paths) {
    rectangle.smallY = getSmallestY(rectangle);
    rectangle.largeY = getLargestY(rectangle);
    var rectanglesToUse = [];
    for(var i=0; i < paths.length; i++) {
        if(rectangle.smallY < paths[i].largeY && rectangle.largeY > paths[i].smallY) rectanglesToUse.push(paths[i]);
        else if(rectangle.smallY > paths[i].largeY) break;
    }
    return rectanglesToUse;
}

function layerInc(rectangle1, rectangle2) {
    if ( rectangle1.layerCount > rectangle2.layerCount ) return 1;
    else return -1;
}

function removePaths(rectanglePath) {
    rectanglePaths.sort(rectangleXInc);
    var rectanglesToUse = getRectanglesToUseX(rectanglePath, rectanglePaths);
    rectanglesToUse.sort(rectangleYInc);
    rectanglesToUse = getRectanglesToUseY(rectanglePath, rectanglesToUse);
    rectanglesToUse.sort(layerInc);
    return rectanglesToUse;
}

function makeIntersectionRectangles(rectanglePath) {
    intersectionPaths.forEach(function(path){
        path.remove();
    });
    intersectionPaths = [];
    removeStoredPaths = [];
    var rectanglesToUse = rectanglePaths;
    //var rectanglesToUse = removePaths(rectanglePath); // TODO: this removes paths that necessarily won't intersect
    rectanglesToUse.forEach(function(rectPathStored) {
        var intersections = rectanglePath.getIntersections(rectPathStored);
        var intersectionPoints = [];
        iterateSegments(rectPathStored,rectanglePath,intersectionPoints);
        if(intersectionPoints == 4) removeStoredPaths.push(rectPathStored);
        iterateSegments(rectanglePath,rectPathStored,intersectionPoints);
        intersections.forEach(function(intersection) {
            intersectionPoints.push(intersection.point);
        });
        if (intersectionPoints.length > 2 ) {
            var intersectionPath = makeIntersectionPath(intersectionPoints);
            intersectionPaths.push(intersectionPath);
            var colorIndex = rectPathStored.colorIndex + 1;
            if(colorIndex >= colors.length) colorIndex = 0;
            intersectionPath.colorIndex= colorIndex;
            intersectionPath.fillColor = colors[colorIndex];
            intersectionPath.closePath(true);
        }
    });
}


// CONTROLS
function clear() {
    project.clear();
    rectanglePaths = [];
}

function getImageData() {
    var context = canvas.getContext("2d");

    //cache height and width
    var w = canvas.width;
    var h = canvas.height;

    var data;

    if(backgroundColor)
    {
        //get the current ImageData for the canvas.
        data = context.getImageData(0, 0, w, h);

        //store the current globalCompositeOperation
        var compositeOperation = context.globalCompositeOperation;

        //set to draw behind current content
        context.globalCompositeOperation = "destination-over";

        //set background color
        context.fillStyle = backgroundColor;

        //draw background / rect on entire canvas
        context.fillRect(0,0,w,h);
    }

    //get the image data from the canvas
    var imageData = this.canvas.toDataURL("image/png");

    if(backgroundColor)
    {
        //clear the canvas
        context.clearRect (0,0,w,h);

        //restore it with original / cached ImageData
        context.putImageData(data, 0,0);

        //reset the globalCompositeOperation to what it was
        context.globalCompositeOperation = compositeOperation;
    }

    //return the Base64 encoded data url string
    return imageData;
}

function download() {
    imageData = getImageData();
    this.href = imageData;
};

$('#clear').on('click', clear);
$('#save').on('click', download);

$('.color-picker').on('click', function() {
  console.log(this.id)
  if (this.id == 'red') {
    colors = redColors;
  } else if (this.id == 'blue') {
    colors = blueColors
  } else if (this.id == 'green') {
    colors = greenColors;
  } else {
    colors = yellowColors;
  }
});
