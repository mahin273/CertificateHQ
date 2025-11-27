function onSubmit(e) {
    var formResponse = e.response;
    var itemResponses = formResponse.getItemResponses();
    var name = "";
    var email = "";

    // Get name and email from form responses
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

    // FOR LOCAL TESTING - Use localhost
    var url = "http://localhost:3000/webhook";

    try {
        UrlFetchApp.fetch(url, options);
        Logger.log("Webhook sent successfully for: " + name);
    } catch (error) {
        Logger.log("Error sending webhook: " + error);
    }
}

// TEST FUNCTION - Run this manually to test
function testWebhook() {
    var payload = {
        "name": "Test User",
        "email": "hitmanlabib2@gmail.com"
    };

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };

    var url = "http://localhost:3000/webhook";

    try {
        var response = UrlFetchApp.fetch(url, options);
        Logger.log("Success! Response: " + response.getContentText());
    } catch (error) {
        Logger.log("Error: " + error);
    }
}
