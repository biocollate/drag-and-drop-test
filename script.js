var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ElementNotFoundError = /** @class */ (function (_super) {
    __extends(ElementNotFoundError, _super);
    function ElementNotFoundError(elementId) {
        var _this = _super.call(this, "Element with ID '".concat(elementId, "' not found")) || this;
        _this.name = "ElementNotFoundError";
        return _this;
    }
    return ElementNotFoundError;
}(Error));
function isClone(element) {
    var id = element.id;
    var pattern = /.*clone[0-9]+$/;
    return pattern.test(id);
}
function modifyID(parent) {
    var id = parent.id;
    var cloneCount = Number(parent.getAttribute('data-numclones'));
    parent.setAttribute('data-numclones', String(cloneCount + 1));
    var newID = id + "-clone" + String(cloneCount + 1);
    return newID;
}
function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
    var id = event
        .dataTransfer
        .getData('text');
    var element = document.getElementById(id);
    if (!element)
        throw new ElementNotFoundError(id);
    if (element.getAttribute('data-cloneondrag') == 'true') {
        event.currentTarget.style.backgroundColor = 'yellow';
    }
    else {
        event.currentTarget.style.backgroundColor = 'red';
    }
}
function onDragEnd(event) {
    var id = event
        .dataTransfer
        .getData('text');
    var element = document.getElementById(id);
    event.currentTarget.style.backgroundColor = '#4AAE9B';
}
function onDragOver(event) {
    event.preventDefault();
}
function swapClones(clone1, clone2) {
    var c1Parent = clone1.parentElement;
    var c2Parent = clone2.parentElement;
    console.log("Swapping");
    if (c1Parent != c2Parent) {
        c1Parent === null || c1Parent === void 0 ? void 0 : c1Parent.appendChild(clone2);
        c2Parent === null || c2Parent === void 0 ? void 0 : c2Parent.appendChild(clone1);
    }
    else {
        console.log("Swapping children of same parent");
        c1Parent === null || c1Parent === void 0 ? void 0 : c1Parent.insertBefore(clone1, clone2);
    }
}
function onDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = event
        .dataTransfer
        .getData('text');
    var draggableElement = document.getElementById(id);
    var nestedDE = draggableElement.getAttribute("class") == "nested-draggable";
    var DEclone = isClone(draggableElement);
    var dropZone = event.target;
    var trashDZ = dropZone.getAttribute("class") == "trash-dropzone";
    var nestedDZ = dropZone.getAttribute("class") == "nested-dropzone";
    var normalDZ = dropZone.getAttribute("class") == "example-dropzone";
    var DZclone = isClone(dropZone);
    var DZ = trashDZ || nestedDZ || normalDZ;
    var hasChild = dropZone.childElementCount > 0;
    var simple = dropZone.getAttribute("class") == "example-draggable";
    console.log("DropZone:");
    console.log(dropZone);
    if (!draggableElement)
        throw new ElementNotFoundError(id);
    if (draggableElement.getAttribute('data-cloneondrag') == 'true') // root element
     {
        if (DZ && !trashDZ && !simple && (!nestedDZ || (nestedDZ && !hasChild && !nestedDE))) 
        // allow element to clone in IF this isnt the trash zone
        // AND this is either a page dropzone or a childless nested dropzone
        {
            var copyElement = draggableElement.cloneNode(true);
            copyElement.setAttribute('data-cloneondrag', 'false');
            copyElement.setAttribute('id', modifyID(draggableElement));
            dropZone.appendChild(copyElement);
        }
    }
    else {
        if (trashDZ) {
            var parent_1 = draggableElement.parentElement;
            if (!parent_1)
                return;
            parent_1.removeChild(draggableElement);
        }
        else if (DZ && !nestedDZ || (nestedDZ && !hasChild && !nestedDE))
            dropZone.appendChild(draggableElement);
        else if (simple || (DZclone && DEclone))
            swapClones(draggableElement, dropZone);
    }
    console.log(draggableElement);
    event
        .dataTransfer
        .clearData();
}
