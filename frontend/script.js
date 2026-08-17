document.addEventListener("DOMContentLoaded", function () {

    const analyzeButton = document.getElementById("analyzeButton");
    const contentInput = document.getElementById("contentInput");
    const exampleButton = document.getElementById("exampleButton");
    const startButton = document.getElementById("startButton");

    const resultTitle = document.getElementById("resultTitle");
    const resultMessage = document.getElementById("resultMessage");
    const status = document.getElementById("status");
    const confidence = document.getElementById("confidence");
    const explanation = document.getElementById("explanation");


    // ANALYZE BUTTON
    analyzeButton.addEventListener("click", function () {
        const content = contentInput.value.trim();
        fetch("http://localhost:5000/analyze", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        content: content
    })
})
.then(response => response.json())
.then(data => {
    console.log("Backend response:", data);

    resultTitle.textContent = data.result;
    resultMessage.textContent = data.message;
    status.textContent = data.status;
    confidence.textContent = data.confidence;
    explanation.textContent = data.explanation;
    const sourcesContainer = document.getElementById("sources");

if (sourcesContainer) {
    sourcesContainer.innerHTML = "";

    if (data.sources && data.sources.length > 0) {
        data.sources.forEach(source => {
            const link = document.createElement("a");

            link.href = source.url;
            link.textContent = source.title;
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            sourcesContainer.appendChild(link);
            sourcesContainer.appendChild(document.createElement("br"));
        });
    }
}
})
.catch(error => {
    console.error("Backend error:", error);
});


        if (content === "") {

            resultTitle.textContent = "Please Enter Content";

            resultMessage.textContent =
                "Paste a news article or some text before analyzing.";

            status.textContent = "Waiting";

            confidence.textContent = "--";

            explanation.textContent =
                "Please enter some content to begin the analysis.";

            return;
        }


        // Show loading state
        resultTitle.textContent = "Analyzing...";

        resultMessage.textContent =
            "Please wait while we analyze your content.";

        status.textContent = "Processing";

        confidence.textContent = "--";

        explanation.textContent =
            "TruthLens AI is analyzing the submitted content.";


        

    });


    // TRY AN EXAMPLE BUTTON
    exampleButton.addEventListener("click", function () {

        contentInput.value =
            "Scientists have discovered a new planet that may support life.";

    });


    // START ANALYZING BUTTON
    if (startButton) {

        startButton.addEventListener("click", function () {

            contentInput.scrollIntoView({
                behavior: "smooth"
            });

            contentInput.focus();

        });

    }

});
