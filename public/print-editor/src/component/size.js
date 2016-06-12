"use strict";
var Size = (function () {
    function Size(_width, _height) {
        this._width = _width;
        this._height = _height;
    }
    Size.prototype.width = function (converter) {
        return this._width.sizeInPx(converter);
    };
    Size.prototype.widthAndUnit = function () {
        return this._width.toString();
    };
    Size.prototype.height = function (converter) {
        return this._height.sizeInPx(converter);
    };
    Size.prototype.heightAndUnit = function () {
        return this._height.toString();
    };
    return Size;
}());
exports.Size = Size;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUdBO0lBQ0ksY0FBb0IsTUFBYSxFQUFVLE9BQWM7UUFBckMsV0FBTSxHQUFOLE1BQU0sQ0FBTztRQUFVLFlBQU8sR0FBUCxPQUFPLENBQU87SUFDekQsQ0FBQztJQUVELG9CQUFLLEdBQUwsVUFBTSxTQUFxQjtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELDJCQUFZLEdBQVo7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0lBRUQscUJBQU0sR0FBTixVQUFPLFNBQXFCO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsNEJBQWEsR0FBYjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFDTCxXQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSxZQUFJLE9BbUJoQixDQUFBIn0=