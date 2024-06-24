class ElementNotFoundError extends Error
{
    constructor(elementId: string) {
        super(`Element with ID '${elementId}' not found`);
        this.name = "ElementNotFoundError";
    }
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

function onDrop(event) {
    event.preventDefault();
    event.stopPropagation();

    const id = event
      .dataTransfer
      .getData('text');

    const draggableElement = document.getElementById(id);

    const dropZone = event.target as HTMLElement;
    const trash = dropZone.getAttribute("class")=="trash-dropzone";
    const nested = dropZone.getAttribute("class")=="nested-dropzone";
    const hasChild = dropZone.childElementCount > 0;

    console.log("DropZone:");
    console.log(dropZone);

    if (!draggableElement) throw new ElementNotFoundError(id);
    if (draggableElement.getAttribute('data-cloneondrag')=='true') // root element
    {
        if(!trash && (!nested || (nested && !hasChild)))
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
        if(trash)
        {
            const parent = draggableElement.parentElement;
            if (!parent) return;
            parent.removeChild(draggableElement);
        }
        else if (!nested || (nested && !hasChild))
            dropZone.appendChild(draggableElement);
    }

    console.log(draggableElement);
    
    event
        .dataTransfer
        .clearData();
  }