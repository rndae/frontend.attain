document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap Datepicker for start date
    $('#start-date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });

    // Initialize Bootstrap Datepicker for end date
    $('#end-date').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });

    // JavaScript code for handling download button click

    document.getElementById('download-button').addEventListener('click', function() {
        // Step 1: Show loading indicator
        showLoading();

        // Step 2: Get start and end dates
        var startDate = document.getElementById('start-date').value;
        var endDate = document.getElementById('end-date').value;

        console.log(startDate)

        // Step 3: Send request to server with start and end dates
        sendDownloadRequest(startDate, endDate);

    
    });
    
    function showLoading() {
        // Clear previous content of the container
        document.getElementById('loading-container').innerHTML = '';
    
        // Create and append a loading spinner or text to the container
        var loadingIndicator = document.createElement('div');
        loadingIndicator.classList.add('d-flex', 'justify-content-center', 'align-items-center'); // Flexbox utilities to center the spinner
        var spinner = document.createElement('div');
        spinner.classList.add('spinner-border', 'text-primary');
        spinner.setAttribute('role', 'status');
        var spanElement = document.createElement('span');
        spanElement.classList.add('visually-hidden');
        spanElement.textContent = 'Loading...';
        spinner.appendChild(spanElement);
        loadingIndicator.appendChild(spinner);
    
        document.getElementById('loading-container').appendChild(loadingIndicator);
    }
    
    
    function hideLoading() {
        // Hide loading indicator
        document.getElementById('loading-container').style.display = 'none';
    }

    function sendDownloadRequest(startDate, endDate) {
        fetch('http://localhost:5000/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                startDate: startDate,
                endDate: endDate
            })
        })
        .then(response => {
            if (response.ok) {
                console.log(response.ok)
                return response.blob(); // Convert response to a Blob
            } else {
                console.error('Failed to generate PDF:', response.statusText);
            }
        })
        .then(blob => {
            // Create a URL for the Blob
            const pdfUrl = URL.createObjectURL(blob);
            // Display or download the PDF as needed
            //window.open(pdfUrl, '_blank');
            document.getElementById('pdf-viewer').src = pdfUrl;
            hideLoading();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
    
    
    
});
