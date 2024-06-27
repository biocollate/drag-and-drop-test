import colors from './colors.js'

function isClone(element : HTMLElement) {
    const id : string = element.id;
    const pattern = /.*clone[0-9]+$/

    return pattern.test(id);
}

function modifyID(parent : HTMLElement) {
    const id : string = parent.id;
    const cloneCount : number = Number(parent.getAttribute('data-numclones'));
    parent.setAttribute('data-numclones', String(cloneCount + 1));
    
    var newID : string = id + "-clone" + String(cloneCount + 1);
    return newID;
}

function onDragStart(event) {
    event
        .dataTransfer
        .setData('text/plain', event.target.id);
    
    const id = event.target.id;

    // console.log("Dragging item:", id);
    
    const element = document.getElementById(id);
    if(element) element.style.opacity = "0.5";
}

function onDragEnd(event) {
    const id = event.target.id;

    // console.log("Drag End item:", id);
    
    const element = document.getElementById(id);
    if (element) element.style.opacity = "1.0";
}

function onDragOver(event) {
    event.preventDefault();
}

function swapClones(clone1 : HTMLElement, clone2 : HTMLElement) {
    const c1Parent = clone1.parentElement;
    const c2Parent = clone2.parentElement;
    // console.log("Swapping");
    if (c1Parent != c2Parent) {
        c1Parent?.appendChild(clone2);
        c2Parent?.appendChild(clone1);
    }
    else {
        console.log("Swapping children of same parent");
        c1Parent?.insertBefore(clone1, clone2);
    }
    
}

// for when user drops one draggable element on another
function onDropSwap(event) {
    event.preventDefault();
    event.stopPropagation();

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement : HTMLElement = document.getElementById(id) as HTMLElement;
    const isDEnested : boolean = draggableElement.getAttribute("class")=="nested-draggable";
    const isDEsimple : boolean = draggableElement.getAttribute("class")=="simple-draggable";
    const isDEclone : boolean = isClone(draggableElement);

    const dropZone : HTMLElement = event.target as HTMLElement;
    const DZclass : string = dropZone.getAttribute("class") as string;
    
    const isDZclone : boolean = isClone(dropZone);
    const isDZsimple : boolean = DZclass=="simple-draggable";
    const isDZnested : boolean = DZclass=="nested-draggable";

    let validSwap : boolean = isDEclone && isDZclone;
    validSwap = validSwap && ((isDEnested && isDZnested) || (isDEsimple && isDZsimple));

    // console.log("DropZone:");
    // console.log(dropZone);

    // console.log("DraggableElement:");
    // console.log(draggableElement);

    if (validSwap) {
        swapClones(draggableElement, dropZone);
    }
}

function onDropNested(event) {
    event.preventDefault();
    event.stopPropagation();

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement : HTMLElement = document.getElementById(id) as HTMLElement;
    const isDEnested : boolean = draggableElement.getAttribute("class") == "nested-draggable";
    const isDEclone : boolean = isClone(draggableElement);

    const dropZone : HTMLElement = event.target as HTMLElement;
    const DZhasChild : boolean = dropZone.childElementCount > 0;

    // console.log("DropZone:");
    // console.log(dropZone);

    if (!isDEclone)
    {
        if(!DZhasChild && !isDEnested)
        // allow element to clone in IF dropzone is empty
        {
            const copyElement = draggableElement.cloneNode(true) as HTMLElement;
            copyElement.style.opacity = "1.0";
            copyElement.setAttribute('id', modifyID(draggableElement));
            dropZone.appendChild(copyElement);
        }
    }
    else // dragging a clone
    {
        if(!DZhasChild && !isDEnested)
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

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement : HTMLElement = document.getElementById(id) as HTMLElement;
    const isDEnested : boolean = draggableElement.getAttribute("class")=="nested-draggable";
    const isDEclone : boolean = isClone(draggableElement);

    const dropZone : HTMLElement = event.target as HTMLElement;

    // console.log("DropZone:");
    // console.log(dropZone);

    if (isDEnested && !isDEclone)
    {
        const copyElement = draggableElement.cloneNode(true) as HTMLElement;
        copyElement.style.opacity = "1.0";
        copyElement.setAttribute('id', modifyID(draggableElement))
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

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement : HTMLElement = document.getElementById(id) as HTMLElement;
    const isDEclone : boolean = isClone(draggableElement);

    if (isDEclone) {
        const parent : HTMLElement = draggableElement.parentElement as HTMLElement;
        parent.removeChild(draggableElement);
    }
}