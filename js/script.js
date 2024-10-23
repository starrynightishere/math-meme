// Get elements
const canvas = document.getElementById('meme-canvas');
const ctx = canvas.getContext('2d');
const templateSelector = document.getElementById('template');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const addTextFieldBtn = document.getElementById('add-text-field');
const removeTextFieldBtn = document.getElementById('remove-text-field');
const textInputs = document.getElementById('text-inputs');

// Initialize an array to store dynamic text fields and their positions
let textFields = [
    { text: '', x: 50, y: 50, inputId: 'top-text' },
    { text: '', x: 50, y: 350, inputId: 'bottom-text' }
];

// Image object
let img = new Image();

// Event to add a new text field
addTextFieldBtn.addEventListener('click', () => {
    const newId = `text-field-${Date.now()}`;
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.placeholder = 'Additional Text';
    newInput.id = newId;
    textInputs.appendChild(newInput);

    // Add new text field to the array
    textFields.push({ text: '', x: 50, y: 200, inputId: newId });
});

// Event to remove a text field
removeTextFieldBtn.addEventListener('click', () => {
    if (textFields.length > 2) {
        const lastField = textFields.pop();
        const inputToRemove = document.getElementById(lastField.inputId);
        textInputs.removeChild(inputToRemove);
    }
});

// Function to render the meme
function renderMeme() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image on the canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw each text field
    textFields.forEach((field) => {
        const input = document.getElementById(field.inputId);
        field.text = input.value;

        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.fillText(field.text, field.x, field.y);
        ctx.strokeText(field.text, field.x, field.y);
    });
}

// Load selected template
templateSelector.addEventListener('change', () => {
    img.src = templateSelector.value;
    img.onload = renderMeme;
});

// Update the canvas when text fields change
textInputs.addEventListener('input', renderMeme);

// Generate meme
generateBtn.addEventListener('click', renderMeme);

// Download meme
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Initialize variables for dragging
let isDragging = false;
let dragIndex = null;
let offsetX = 0;
let offsetY = 0;

// Event listeners for mouse down, move, and up
canvas.addEventListener('mousedown', (e) => {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Check if mouse is over any text field
    textFields.forEach((field, index) => {
        const input = document.getElementById(field.inputId);
        const textWidth = ctx.measureText(field.text).width;
        const textHeight = parseInt(ctx.font, 10); // Approximate height of text

        // Check if mouse is within the bounds of the text
        if (mouseX >= field.x - textWidth / 2 && mouseX <= field.x + textWidth / 2 &&
            mouseY >= field.y - textHeight && mouseY <= field.y) {
            isDragging = true;
            dragIndex = index;
            offsetX = mouseX - field.x;
            offsetY = mouseY - field.y;
        }
    });
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging && dragIndex !== null) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Update the position of the dragged text field
        textFields[dragIndex].x = mouseX - offsetX;
        textFields[dragIndex].y = mouseY - offsetY;
        
        renderMeme(); // Re-render the meme with updated position
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    dragIndex = null; // Reset drag index
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false; // Reset dragging if mouse leaves canvas
});

