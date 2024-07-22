const canvas = document.querySelector('canvas');
const Tool_Btns = document.querySelectorAll('.tool')
const Fill_Color = document.querySelector('#fill')
const Slider = document.querySelector('#Size_Slider')
const Color_Btns = document.querySelectorAll('.Color_Option')
const Color_Picker = document.querySelector('#color_picker')
const Clear_Canvas = document.querySelector('.Clear_Canvas')
const Save_Canvas = document.querySelector('.Save_image')
const Initial_selected = document.querySelector('.initial')


let ctx = canvas.getContext('2d');

//global variables
let isDrawing = false;
let Selected_Tool = 'brush';
let Prev_MouseX, Prev_MouseY, snapshot;
let brush_width = 2;
let Selected_Color = 'black';
let previouslySelected = Initial_selected;


//Shapes functions
const Draw_Rectangle = (e) => {
    if (!Fill_Color.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, Prev_MouseX - e.offsetX, Prev_MouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, Prev_MouseX - e.offsetX, Prev_MouseY - e.offsetY);
}
const Draw_Circle = (e) => {
    ctx.beginPath()
    let radius = Math.sqrt(Math.pow(Prev_MouseX - e.offsetX, 2) + Math.pow(Prev_MouseY - e.offsetY, 2))
    ctx.arc(Prev_MouseX, Prev_MouseY, radius, 0, 2 * Math.PI);
    Fill_Color.checked ? ctx.fill() : ctx.stroke();
};
const Draw_Triangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(Prev_MouseX, Prev_MouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(Prev_MouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    Fill_Color.checked ? ctx.fill() : ctx.stroke();
}

//Drawing Settings
const Start_Drawing = (e) => {
    isDrawing = true; //start when mouse is clicked within canvas

    Prev_MouseX = e.offsetX;
    Prev_MouseY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = brush_width;
    ctx.strokeStyle = Selected_Color;
    ctx.fillStyle = Selected_Color;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const Drawing = (e) => {
    if (!isDrawing) {
        return;
    }
    ctx.putImageData(snapshot, 0, 0)
    if (Selected_Tool == 'brush' || Selected_Tool == 'eraser') {
        ctx.strokeStyle = Selected_Tool === "eraser" ? "#fff" : Selected_Color;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (Selected_Tool == 'rectangle') {
        Draw_Rectangle(e);
    } else if (Selected_Tool == 'circle') {
        Draw_Circle(e);
    } else if (Selected_Tool == 'triangle') {
        Draw_Triangle(e);
    }
}

//Method to select a tool from tool options

Tool_Btns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (document.querySelector(".options .active")) {
            document.querySelector(".options .active").classList.remove("active");
        }
        btn.classList.add("active");
        Selected_Tool = btn.id;

    })
});

//Method to change colors

Color_Btns.forEach(clr => {
  clr.addEventListener('click', (e) => {
    if (previouslySelected) {
      previouslySelected.classList.remove("selected");
    }
    clr.classList.add("selected");
    previouslySelected = clr;
    Selected_Color = window.getComputedStyle(clr).getPropertyValue('background-color');
  })
})

//Method to set background for downloading image
const Set_Canvas_Background = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = Selected_Color;
}

//Event Listeners

window.addEventListener('load', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    Set_Canvas_Background();
})

Slider.addEventListener('change', () => {
    brush_width = Slider.value;
})

Color_Picker.addEventListener('change', () => {
    Color_Picker.parentElement.style.background = Color_Picker.value;
    Color_Picker.parentElement.click();
})

Clear_Canvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Set_Canvas_Background();
})

Save_Canvas.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener('mousedown', Start_Drawing)
canvas.addEventListener('mousemove', Drawing)
canvas.addEventListener('mouseup', () => {
    isDrawing = false; //stop 
})