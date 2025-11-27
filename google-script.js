function onSubmit(e) {
    var formResponse = e.response;
    var itemResponses = formResponse.getItemResponses();
    var name = "";
    var email = "";

    // Adjust these titles based on your actual Google Form questions
    for (var i = 0; i < itemResponses.length; i++) {
        var itemResponse = itemResponses[i];
        var title = itemResponse.getItem().getTitle();
        var response = itemResponse.getResponse();

        if (title.toLowerCase().includes("name")) {
            name = response;
        } else if (title.toLowerCase().includes("email")) {
            email = response;
        }
    }

    // Fallback if email collection is enabled in settings
    if (email === "" && e.response.getRespondentEmail()) {
        email = e.response.getRespondentEmail();
    }

    var payload = {
        "name": name,
        "email": email
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    // REPLACE THIS URL with your Vercel URL
    // Example: https://your-project-name.vercel.app/webhook
    var url = "https://YOUR_VERCEL_PROJECT.vercel.app/webhook";

    try {
        UrlFetchApp.fetch(url, options);
    } catch (error) {
        Logger.log("Error sending webhook: " + error);
    }
}
