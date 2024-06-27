"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var id = event.target.id;
    console.log("Dragging item:", id);
    var element = document.getElementById(id);
    if (element)
        element.style.opacity = "0.5";
}
function onDragEnd(event) {
    var id = event.target.id;
    console.log("Drag End item:", id);
    var element = document.getElementById(id);
    if (element)
        element.style.opacity = "1.0";
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
// for when user drops one draggable element on another
function onDropSwap(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = event
        .dataTransfer
        .getData('text');
    var draggableElement = document.getElementById(id);
    var isDEnested = draggableElement.getAttribute("class") == "nested-draggable";
    var isDEsimple = draggableElement.getAttribute("class") == "simple-draggable";
    var isDEclone = isClone(draggableElement);
    var dropZone = event.target;
    var DZclass = dropZone.getAttribute("class");
    var isDZclone = isClone(dropZone);
    var isDZsimple = DZclass == "simple-draggable";
    var isDZnested = DZclass == "nested-draggable";
    var validSwap = isDEclone && isDZclone;
    validSwap = validSwap && ((isDEnested && isDZnested) || (isDEsimple && isDZsimple));
    console.log("DropZone:");
    console.log(dropZone);
    console.log("DraggableElement:");
    console.log(draggableElement);
    if (validSwap) {
        swapClones(draggableElement, dropZone);
    }
}
function onDropNested(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = event
        .dataTransfer
        .getData('text');
    var draggableElement = document.getElementById(id);
    var isDEnested = draggableElement.getAttribute("class") == "nested-draggable";
    var isDEclone = isClone(draggableElement);
    var dropZone = event.target;
    var DZhasChild = dropZone.childElementCount > 0;
    console.log("DropZone:");
    console.log(dropZone);
    if (!isDEclone) {
        if (!DZhasChild && !isDEnested) 
        // allow element to clone in IF dropzone is empty
        {
            var copyElement = draggableElement.cloneNode(true);
            copyElement.style.opacity = "1.0";
            copyElement.setAttribute('id', modifyID(draggableElement));
            dropZone.appendChild(copyElement);
        }
    }
    else // dragging a clone
     {
        if (!DZhasChild && !isDEnested) 
        // allow element to clone in IF dropzone is empty
        {
            dropZone.appendChild(draggableElement);
        }
    }
    console.log(draggableElement);
    event
        .dataTransfer
        .clearData();
}
// use for any elements that are dropping in the canvas
function onDropCanvas(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = event
        .dataTransfer
        .getData('text');
    var draggableElement = document.getElementById(id);
    var isDEnested = draggableElement.getAttribute("class") == "nested-draggable";
    var isDEclone = isClone(draggableElement);
    var dropZone = event.target;
    console.log("DropZone:");
    console.log(dropZone);
    if (isDEnested && !isDEclone) {
        var copyElement = draggableElement.cloneNode(true);
        copyElement.style.opacity = "1.0";
        copyElement.setAttribute('id', modifyID(draggableElement));
        dropZone.appendChild(copyElement);
    }
    console.log(draggableElement);
    event
        .dataTransfer
        .clearData();
}
function onDropDelete(event) {
    event.preventDefault();
    event.stopPropagation();
    var id = event
        .dataTransfer
        .getData('text');
    var draggableElement = document.getElementById(id);
    var isDEclone = isClone(draggableElement);
    if (isDEclone) {
        var parent_1 = draggableElement.parentElement;
        parent_1.removeChild(draggableElement);
    }
}
