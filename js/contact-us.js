
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const msgDiv = document.createElement("div");
    msgDiv.id = "msgDiv";
    form.parentNode.insertBefore(msgDiv, form);

    form.addEventListener("submit", (e) => {
        let messages = [];

        messages = checkInput("first-name", messages, "First name is required");
        messages = checkInput("last-name", messages, "Last name is required");
        messages = checkGender("gender", messages, "Gender selection is required");
        messages = checkMobile("telephone", messages, "Please enter a valid 10-digit mobile number");
        messages = checkFutureDate("date-of-birth", messages, "Date of birth cannot be in the future");
        messages = checkInput("email", messages, "Email address is required");
        messages = checkEmail("email", messages, "Email format is invalid");
        messages = checkInput("language", messages, "Language is required");
        messages = checkInput("message", messages, "Message is required");

        if (messages.length > 0) {
            msgDiv.innerHTML = "Issues found [" + messages.length + "]:<br>" + messages.join("<br>");
            msgDiv.style.color = "red";
            e.preventDefault();
        } else {
            msgDiv.innerHTML = "";
        }
    });

    function checkInput(name, messages, msg) {
        const element = document.getElementsByName(name)[0];
        if (!element || element.value.trim() === "") {
            messages.push(msg);
        }
        return messages;
    }

    function checkGender(name, messages, msg) {
        const element = document.getElementsByName(name)[0];
        if (!element || element.value === "") {
            messages.push(msg);
        }
        return messages;
    }

    function checkMobile(name, messages, msg) {
        const element = document.getElementsByName(name)[0];
        const phone = element.value.trim();
        if (!/^\d{10}$/.test(phone)) {
            messages.push(msg);
        }
        return messages;
    }

    function checkEmail(name, messages, msg) {
        const element = document.getElementsByName(name)[0];
        const email = element.value.trim();
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!pattern.test(email)) {
            messages.push(msg);
        }
        return messages;
    }

    function checkFutureDate(name, messages, msg) {
        const dob = new Date(document.getElementsByName(name)[0].value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dob > today) {
            messages.push(msg);
        }
        return messages;
    }
});
