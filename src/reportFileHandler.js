import { storage } from "./firebase";

function storeReportFile(inputFile){
//    const file = inputFile.files[0]; //This is to get selected file from input, given that inputFile is HTML element (idk if later the input will be directly a file or no, ill just put this in case it is not.)
    if (!inputFile) {
        alert("Please select a file first.");
        return;
    }

    // Create a reference to the file in Firebase Storage
    const storageRef = storage.ref(`fileUploads/${file.name}`);

    // Upload the file to Firebase Storage
    storageRef.put(file).then((snapshot) => {
    console.log('File uploaded successfully:', snapshot);
    }).catch((error) => {
    console.error('File upload failed:', error);
    });
}

function deletereportFile(inputFileName){
//    const fileName = fileNameInput.value;  //This is to get fileName from input, given that inputFileName is HTML element (idk if later the input will be directly a fileName or no, ill just put this in case it is not.)
    if (inputFileName) {
      const storageRef2 = storage.ref(`uploads/${inputFileName}`);  // Reference the file to delete

      // Delete the file
      storageRef2.delete()
        .then(() => {
          console.log("File deleted successfully!");
          alert("File deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting file:", error);
          alert("Error deleting file: " + error.message);
        });
    } else {
      alert("Please enter a file name.");
    }
}

export{
    storeReportFile,
    deletereportFile
}