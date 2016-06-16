"use strict";
var length_1 = require("./length");
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
function size(width, height) {
    return new Size(new length_1.Length(width), new length_1.Length(height));
}
exports.size = size;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVCQUFxQixVQUFVLENBQUMsQ0FBQTtBQUdoQztJQUNJLGNBQW9CLE1BQWEsRUFBVSxPQUFjO1FBQXJDLFdBQU0sR0FBTixNQUFNLENBQU87UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFPO0lBQ3pELENBQUM7SUFFRCxvQkFBSyxHQUFMLFVBQU0sU0FBcUI7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCwyQkFBWSxHQUFaO1FBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVELHFCQUFNLEdBQU4sVUFBTyxTQUFxQjtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELDRCQUFhLEdBQWI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQyxDQUFDO0lBQ0wsV0FBQztBQUFELENBQUMsQUFuQkQsSUFtQkM7QUFuQlksWUFBSSxPQW1CaEIsQ0FBQTtBQUVELGNBQXFCLEtBQVksRUFBRSxNQUFhO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFGZSxZQUFJLE9BRW5CLENBQUEifQ==