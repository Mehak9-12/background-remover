const imageInput = document.getElementById('imageInput');
const removeBtn = document.getElementById('removeBtn');
const clearBtn = document.getElementById('clearBtn');
const resultImage = document.getElementById('resultImage');
const resultContainer = document.getElementById('resultContainer');
const placeholderText = document.getElementById('placeholderText');
const downloadLink = document.getElementById('downloadLink');
const toast = document.getElementById('toast');

// Helper to show popup notifications
function showNotification(message, color = 'white') {
  toast.innerText = message;
  toast.style.background = color === 'red' ? '#ef4444' : '#ffffff';
  toast.style.color = color === 'red' ? 'white' : 'black';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Handle Preview
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (file) {
    resultImage.src = URL.createObjectURL(file);
    resultImage.style.display = 'block';
    placeholderText.style.display = 'none';
    resultContainer.classList.add('active');
  }
});

// Remove Background
removeBtn.addEventListener('click', async () => {
  const file = imageInput.files[0];

  // Check if image is selected
  if (!file) {
    showNotification('Please select an image first!', 'red');
    return;
  }

  removeBtn.disabled = true;
  removeBtn.innerText = 'Processing...';

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:5000/remove-bg', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error();

    const blob = await response.blob();
    const outputUrl = URL.createObjectURL(blob);

    resultImage.src = outputUrl;
    downloadLink.href = outputUrl;
    downloadLink.download = 'processed-image.png';
    downloadLink.style.display = 'block';

    showNotification('✨ Image is ready!');
  } catch (err) {
    showNotification('Error connecting to server', 'red');
  } finally {
    removeBtn.disabled = false;
    removeBtn.innerText = 'Remove Background';
  }
});

// Clear
clearBtn.addEventListener('click', () => {
  imageInput.value = '';
  resultImage.src = '';
  resultImage.style.display = 'none';
  placeholderText.style.display = 'block';
  resultContainer.classList.remove('active');
  downloadLink.style.display = 'none';
});
