
/* ==========================================================
   INITIATION DES JEUNES ÉTUDIANTS À L'ENTREPRENEURIAT
   SCRIPT.JS — PARTIE 1/2
   Navigation et fonctionnalités générales
   ========================================================== */


/* 01 — MENU DE NAVIGATION MOBILE */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        menuToggle.addEventListener("click", function () {

            navigation.classList.toggle("active");

            const menuIsOpen = navigation.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", menuIsOpen);

            menuToggle.innerHTML = menuIsOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';

        });

        // Fermer le menu après avoir cliqué sur un lien

        const navigationLinks = navigation.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

            });

        });

        // Fermer le menu lorsqu'on clique à l'extérieur

        document.addEventListener("click", function (event) {

            const clickInsideMenu = navigation.contains(event.target);
            const clickOnButton = menuToggle.contains(event.target);

            if (!clickInsideMenu && !clickOnButton) {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

            }

        });

    }


    /* 02 — ANNÉE AUTOMATIQUE DANS LE FOOTER */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* 03 — FERMER LE MENU AVEC LA TOUCHE ÉCHAP */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && navigation && menuToggle) {

            navigation.classList.remove("active");

            menuToggle.setAttribute("aria-expanded", "false");

            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';

        }

    });


    /* 04 — VÉRIFICATION DES LIENS INTERNES */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

});

/* ==========================================================
   INITIATION DES JEUNES ÉTUDIANTS À L'ENTREPRENEURIAT
   SCRIPT.JS — PARTIE 2/2
   Gestion du formulaire de préinscription
   ========================================================== */


/* 05 — FORMULAIRE DE PRÉINSCRIPTION */

document.addEventListener("DOMContentLoaded", function () {

    const registrationForm = document.getElementById("registration-form");

    if (!registrationForm) {
        return;
    }

    const submitButton = registrationForm.querySelector(".submit-button");
    const formMessage = document.getElementById("form-message");

    const originalButtonText = submitButton
        ? submitButton.textContent
        : "Envoyer ma préinscription";


    /* 06 — AFFICHAGE DES MESSAGES */

    function showFormMessage(message, type) {

        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;

        formMessage.style.display = "block";

        formMessage.style.padding = "14px";

        formMessage.style.borderRadius = "8px";

        formMessage.style.marginTop = "18px";

        if (type === "success") {

            formMessage.style.backgroundColor = "#E6F8EF";
            formMessage.style.color = "#147A49";
            formMessage.style.border = "1px solid #A9E5C6";

        } else {

            formMessage.style.backgroundColor = "#FFF0F0";
            formMessage.style.color = "#B42318";
            formMessage.style.border = "1px solid #F5C2C0";

        }

    }


    /* 07 — VALIDATION DES DONNÉES */

    function validateRegistrationForm() {

        if (!registrationForm.checkValidity()) {

            registrationForm.reportValidity();

            return false;

        }

        const phoneInput = registrationForm.querySelector(
            'input[name="whatsapp"]'
        );

        if (phoneInput) {

            const phoneNumber = phoneInput.value.trim();

            if (phoneNumber.length < 8) {

                showFormMessage(
                    "Veuillez saisir un numéro WhatsApp valide.",
                    "error"
                );

                phoneInput.focus();

                return false;

            }

        }

        return true;

    }


    /* 08 — ENVOI DU FORMULAIRE */

    registrationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (!validateRegistrationForm()) {
            return;
        }

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.textContent = "Envoi en cours...";

        }

        showFormMessage(
            "Veuillez patienter pendant l'envoi de votre préinscription...",
            "success"
        );

        try {

            const formData = new FormData(registrationForm);

            const response = await fetch(registrationForm.action, {

                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }

            });

            let result;

            try {

                result = await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Le serveur a retourné une réponse non reconnue."
                );

            }

            const submissionSucceeded =
                response.ok &&
                (
                    result.success === true ||
                    result.success === "true"
                );

            if (submissionSucceeded) {

                showFormMessage(
                    "Votre préinscription a bien été envoyée. Redirection...",
                    "success"
                );

                // Redirection après confirmation de FormSubmit

                window.location.href = "merci.html";

                return;

            }

            throw new Error(
                result.message ||
                "L'envoi n'a pas été confirmé. Veuillez réessayer."
            );

        } catch (error) {

            console.error("Erreur du formulaire :", error);

            showFormMessage(
                "Impossible de confirmer l'envoi. Vérifiez votre connexion Internet et réessayez. " +
                (error.message || ""),
                "error"
            );

            if (submitButton) {

                submitButton.disabled = false;

                submitButton.textContent = originalButtonText;

            }

        }

    });

});
