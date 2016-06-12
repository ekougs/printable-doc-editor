"use strict";
var length_unit_1 = require("./length-unit");
var Length = (function () {
    function Length(_length, unit) {
        if (unit === void 0) { unit = length_unit_1.LengthUnit.px; }
        this._length = _length;
        this.unit = unit;
    }
    Length.prototype.sizeInPx = function (converter) {
        var length = this._length;
        if (length_unit_1.LengthUnit.px === this.unit) {
            return length;
        }
        return converter.toPx(length);
    };
    Length.prototype.toString = function () {
        return this._length + '' + length_unit_1.LengthUnit[this.unit];
    };
    return Length;
}());
exports.Length = Length;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVuZ3RoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGVuZ3RoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw0QkFBeUIsZUFBZSxDQUFDLENBQUE7QUFHekM7SUFDSSxnQkFBb0IsT0FBYyxFQUFVLElBQWtCO1FBQTFCLG9CQUEwQixHQUExQixPQUFhLHdCQUFVLENBQUMsRUFBRTtRQUExQyxZQUFPLEdBQVAsT0FBTyxDQUFPO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBYztJQUM5RCxDQUFDO0lBRUQseUJBQVEsR0FBUixVQUFTLFNBQXFCO1FBQzFCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDMUIsRUFBRSxDQUFBLENBQUMsd0JBQVUsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNsQixDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELHlCQUFRLEdBQVI7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLEdBQUcsd0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNMLGFBQUM7QUFBRCxDQUFDLEFBZkQsSUFlQztBQWZZLGNBQU0sU0FlbEIsQ0FBQSJ9