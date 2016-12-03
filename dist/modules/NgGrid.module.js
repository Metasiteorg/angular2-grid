"use strict";
var core_1 = require('@angular/core');
var main_1 = require('../main');
var NgGridModule = (function () {
    function NgGridModule() {
    }
    NgGridModule.decorators = [
        { type: core_1.NgModule, args: [{
                    declarations: [main_1.NgGrid, main_1.NgGridItem, main_1.NgGridPlaceholder],
                    entryComponents: [main_1.NgGridPlaceholder],
                    exports: [main_1.NgGrid, main_1.NgGridItem]
                },] },
    ];
    /** @nocollapse */
    NgGridModule.ctorParameters = [];
    return NgGridModule;
}());
exports.NgGridModule = NgGridModule;
//# sourceMappingURL=NgGrid.module.js.map