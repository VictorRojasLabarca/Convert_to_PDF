// Navbar burger
document.addEventListener('DOMContentLoaded', () => {
    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
      });
    });
  });

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop_zone');
    const fileInput = document.getElementById('input_file');
    let selectFile = null; //Save file selected

    fileInput.addEventListener('change', (e) =>{
        selectFile = e.target.files[0];
        if (selectFile && selectFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            alert('Upload a DOCX file');
            selectFile = null;//Reset file
        }
    });

    //Manejar arrastrar y soltar
    dropZone.addEventListener('dragover', (e) =>{
        e.preventDefault();
        dropZone.classList.add('is-dragover');
    });

    dropZone.addEventListener('dragleave', () =>{
        dropZone.classList.remove('is-dragover');
    });

    dropZone.addEventListener('drop', (e) =>{
        e.preventDefault();
        dropZone.classList.remove('is-dragover');

        selectFile = e.dataTransfer.files[0];
        if(selectFile && selectFile.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            alert('Upload a DOCX file');
            selectFile = null;//Reset file
        }
    });

    const convertButton = document.querySelector('.button[type=submit]');
    convertButton.addEventListener('click', (e) =>{
        e.preventDefault();
        if(selectFile){
            uploadFile(selectFile);
        }else{
            alert('Select a file to upload');
        }
    });

    //Función para subir el archivo
    function uploadFile(file){

        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload',{
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            if(!response.ok){
                throw new Error('Error converting file');
            }
            return response.blob();
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'convert.pdf';
            a.click();
        })
        .catch((error) =>{
            console.error('Error:', error);
        });
    }
});