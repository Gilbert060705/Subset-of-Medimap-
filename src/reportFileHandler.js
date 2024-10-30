import { storage, getDownloadURL, ref, uploadBytes} from "./firebase";

async function storeReportFile(inputFile){
    const storageRef = ref(storage, `fileUploads/${inputFile.name}`);
    try {
        // Upload the file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, inputFile);
        console.log('File uploaded successfully:', snapshot);

        // Get the download URL
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error('File upload failed:', error);
        return null; // Or handle error as needed
    }
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