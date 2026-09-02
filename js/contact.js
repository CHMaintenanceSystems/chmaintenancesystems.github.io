(() => {
    "use strict";

    const form = document.getElementById("project-enquiry-form");
    if (!form) return;

    const status = document.getElementById("contact-form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const endpoint = "https://portal.chmaintenancesystems.co.uk/api/v1/public/contact-enquiry";

    function setStatus(message, type = "") {
        if (!status) return;
        status.textContent = message;
        status.className = `chms-contact-status${type ? ` is-${type}` : ""}`;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        setStatus("");

        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const payload = Object.fromEntries(data.entries());

        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        const originalText = submitButton.textContent;
        submitButton.textContent = "Sending...";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            let result = {};
            try {
                result = await response.json();
            } catch {
                result = {};
            }

            if (!response.ok) {
                throw new Error(result.error || "Unable to send your enquiry right now.");
            }

            form.reset();
            setStatus("Thank you. Your enquiry has been sent to CH Maintenance Systems. We will respond as soon as possible.", "success");
        } catch (error) {
            setStatus(error.message || "Unable to send your enquiry right now. Please try again shortly.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            submitButton.textContent = originalText;
        }
    });
})();
