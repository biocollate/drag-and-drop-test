import colors from './colors.js'

class ElementNotFoundError extends Error
{
    constructor(elementId: string) {
        super(`Element with ID '${elementId}' not found`);
        this.name = "ElementNotFoundError";
    }
}

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
    
    const id = event
        .dataTransfer
        .getData('text');
    
    const element = document.getElementById(id);

    if (!element) throw new ElementNotFoundError(id);
    if (element.getAttribute('data-cloneondrag')=='true') 
    {
        event.currentTarget.style.backgroundColor = 'yellow';
    }
    else
    {
        event.currentTarget.style.backgroundColor = 'red';
    }
    
}

function onDragEnd(event) {
    const id = event
        .dataTransfer
        .getData('text');
    
    const element = document.getElementById(id);
    event.currentTarget.style.backgroundColor = '#4AAE9B';
}

function onDragOver(event) {
    event.preventDefault();
}

function swapClones(clone1 : HTMLElement, clone2 : HTMLElement) {
    const c1Parent = clone1.parentElement;
    const c2Parent = clone2.parentElement;
    console.log("Swapping");
    if (c1Parent != c2Parent) {
        c1Parent?.appendChild(clone2);
        c2Parent?.appendChild(clone1);
    }
    else {
        console.log("Swapping children of same parent");
        c1Parent?.insertBefore(clone1, clone2);
    }
    
}

function onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement = document.getElementById(id) as HTMLElement;
    const nestedDE = draggableElement.getAttribute("class")=="nested-draggable";
    const DEclone = isClone(draggableElement);

    const dropZone = event.target as HTMLElement;
    const trashDZ = dropZone.getAttribute("class")=="trash-dropzone";
    const nestedDZ = dropZone.getAttribute("class")=="nested-dropzone";
    const normalDZ = dropZone.getAttribute("class")=="example-dropzone";
    const DZclone = isClone(dropZone);

    const DZ = trashDZ || nestedDZ || normalDZ;
    const hasChild = dropZone.childElementCount > 0;

    const simple = dropZone.getAttribute("class")=="example-draggable";

    console.log("DropZone:");
    console.log(dropZone);

    if (!draggableElement) throw new ElementNotFoundError(id);
    if (draggableElement.getAttribute('data-cloneondrag')=='true') // root element
    {
        if(DZ && !trashDZ && !simple && (!nestedDZ || (nestedDZ && !hasChild && !nestedDE)))
        // allow element to clone in IF this isnt the trash zone
        // AND this is either a page dropzone or a childless nested dropzone
        {
            const copyElement = draggableElement.cloneNode(true) as HTMLElement;
            copyElement.setAttribute('data-cloneondrag', 'false');
            copyElement.setAttribute('id', modifyID(draggableElement))
            dropZone.appendChild(copyElement);
        }
    }
    else
    {
        if(trashDZ)
        {
            const parent = draggableElement.parentElement;
            if (!parent) return;
            parent.removeChild(draggableElement);
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