"use strict";
var BoundingRectangle = (function () {
    function BoundingRectangle(_topLeft, _size) {
        this._topLeft = _topLeft;
        this._size = _size;
    }
    Object.defineProperty(BoundingRectangle.prototype, "topLeft", {
        get: function () {
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundingRectangle.prototype, "size", {
        get: function () {
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    BoundingRectangle.prototype.within = function (position, size, converter) {
        return this.withinWidth(position, size, converter) && this.withinHeight(position, size, converter);
    };
    BoundingRectangle.prototype.withinWidth = function (position, size, converter) {
        var x = position.x + this._topLeft.x;
        var furthestPointX = x + size.width(converter);
        return this._topLeft.x <= x && furthestPointX <= this._topLeft.x + this._size.width(converter);
    };
    BoundingRectangle.prototype.withinHeight = function (position, size, converter) {
        var y = position.y + this._topLeft.y;
        var furthestPointY = y + size.height(converter);
        return this._topLeft.y <= y && furthestPointY <= this._topLeft.y + this._size.height(converter);
    };
    return BoundingRectangle;
}());
exports.BoundingRectangle = BoundingRectangle;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm91bmRpbmctcmVjdGFuZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYm91bmRpbmctcmVjdGFuZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFJQTtJQUNJLDJCQUFvQixRQUFjLEVBQVUsS0FBVTtRQUFsQyxhQUFRLEdBQVIsUUFBUSxDQUFNO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBSztJQUN0RCxDQUFDO0lBRUQsc0JBQUksc0NBQU87YUFBWDtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQsc0JBQUksbUNBQUk7YUFBUjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBRUQsa0NBQU0sR0FBTixVQUFPLFFBQWMsRUFBRSxJQUFTLEVBQUUsU0FBcUI7UUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUVELHVDQUFXLEdBQVgsVUFBWSxRQUFjLEVBQUUsSUFBUyxFQUFFLFNBQXFCO1FBQ3hELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVELHdDQUFZLEdBQVosVUFBYSxRQUFjLEVBQUUsSUFBUyxFQUFFLFNBQXFCO1FBQ3pELElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDcEcsQ0FBQztJQUNMLHdCQUFDO0FBQUQsQ0FBQyxBQTNCRCxJQTJCQztBQTNCWSx5QkFBaUIsb0JBMkI3QixDQUFBIn0=