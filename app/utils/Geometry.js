/**
 * Math utility class to help with some common formulas.
 * @constructor
 */
function Geometry() {
  this.angleDiff = function (currentAngle, angleTo) {
    currentAngle = this.toRadians(currentAngle);
    angleTo = this.toRadians(angleTo);
    return this.toDegrees(Math.atan2(Math.sin(angleTo - currentAngle), Math.cos(angleTo - currentAngle)));
  }.bind(this);

  this.getAngle = function (point1, point2) {
    var dx = point2.x - point1.x;
    var dy = point2.y - point1.y;
    return Math.atan2(dy, dx);
  };

  this.getGlobalAngle = function (point1, point2) {
    var dx = point2.x - point1.x;
    var dy = point2.y - point1.y;
    return Math.atan2(dy, dx);
  };

  this.distanceBetween = function (point1, point2) {
    return Math.sqrt(
      (point1.x - point2.x) *
      (point1.x - point2.x) +
      (point1.y - point2.y) *
      (point1.y - point2.y)
    );
  };

  this.moveAtAngle = function (target, angle, distance) {
    target.x = target.x + distance * Math.cos(angle);
    target.y = target.y + distance * Math.sin(angle);
    return target;
  };

  this.toDegrees = function (r) {
    return Math.round(r * 180 / Math.PI);
  };

  this.toRadians = function (d) {
    return d * Math.PI / 180;
  };

  this.angleDifference = function (angle0, angle1) {
    var da = Number(angle0);
    var db = Number(angle1);
    return Math.abs((da + 180 -  db) % 360 - 180);
  };
}

module.exports = new Geometry();
