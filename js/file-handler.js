function handleFileUpload(file, callback) {
    const reader = new FileReader();
    reader.onload = function () {
        const fileData = {
            name: file.name,
            type: file.type,
            data: reader.result
        };
        callback(fileData);
    };
    reader.readAsDataURL(file);
}

function previewFile(file) {
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <html>
            <head>
                <title>Vista previa del archivo</title>
            </head>
            <body>
                ${file.type.startsWith('image/')
                    ? `<img src="${file.data}" alt="Vista previa">`
                    : `<iframe src="${file.data}" width="100%" height="100%"></iframe>`
                }
            </body>
        </html>
    `);
}
