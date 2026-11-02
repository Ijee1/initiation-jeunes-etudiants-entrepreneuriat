/* ==========================================
   IDJEE — JAVASCRIPT PRINCIPAL
   PARTIE 1 : NAVIGATION ET FONCTIONNALITÉS
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================
       1. MENU DE NAVIGATION MOBILE
    ====================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    if (menuToggle && navigation) {

        // Ouvrir et fermer le menu
        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

            // Modifier l'icône du bouton
            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-times", isOpen);
            }

        });


        // Fermer le menu après un clic sur un lien
        const navigationLinks = navigation.querySelectorAll("a");

        navigationLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

                const icon = menuToggle.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }

            });

        });


        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener("click", function (event) {

            if (
                !menuToggle.contains(event.target) &&
                !navigation.contains(event.target)
            ) {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

                const icon = menuToggle.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }

            }

        });


        // Fermer le menu avec la touche Échap
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {

                navigation.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Ouvrir le menu"
                );

                const icon = menuToggle.querySelector("i");

                if (icon) {
                    icon.classList.remove("fa-times");
                    icon.classList.add("fa-bars");
                }

            }

        });

    }


    /* ======================================
       2. ANNÉE AUTOMATIQUE DU COPYRIGHT
    ====================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* ======================================
       3. DÉFILEMENT FLUIDE DES LIENS INTERNES
    ====================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            // Ignorer les liens vides
            if (!href || href === "#") {
                return;
            }

            const targetId = href.substring(1);

            const targetElement = document.getElementById(targetId);

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
/* ==========================================
   IDJEE — JAVASCRIPT
   PARTIE 2 : FORMULAIRE DE PRÉINSCRIPTION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ======================================
       1. RÉCUPÉRATION DES ÉLÉMENTS
    ====================================== */

    const registrationForm = document.getElementById("registration-form");

    // Arrêter si le formulaire n'existe pas
    if (!registrationForm) {
        return;
    }

    const submitButton = document.getElementById("submit-button");

    const formMessage = document.getElementById("form-message");

    const whatsappInput = document.getElementById("whatsapp");

    // Mémoriser le contenu initial du bouton
    const originalButtonContent = submitButton
        ? submitButton.innerHTML
        : "";


    /* ======================================
       2. AFFICHAGE DES MESSAGES
    ====================================== */

    function showFormMessage(message, type) {

        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;

        formMessage.style.display = "block";

        formMessage.style.padding = "14px 16px";

        formMessage.style.marginTop = "15px";

        formMessage.style.borderRadius = "8px";

        formMessage.style.fontSize = "14px";

        formMessage.style.lineHeight = "1.6";

        if (type === "success") {

            formMessage.style.color = "#087A4B";

            formMessage.style.backgroundColor = "#E8F8F0";

            formMessage.style.border = "1px solid #A5E6C5";

        } else {

            formMessage.style.color = "#B42318";

            formMessage.style.backgroundColor = "#FEF0EF";

            formMessage.style.border = "1px solid #F5B8B4";

        }

    }


    /* ======================================
       3. VALIDATION DU NUMÉRO WHATSAPP
    ====================================== */

    function validateWhatsApp() {

        if (!whatsappInput) {
            return true;
        }

        // Garder uniquement les chiffres
        const phoneNumber = whatsappInput.value.replace(/\D/g, "");

        if (phoneNumber.length < 8) {

            whatsappInput.setCustomValidity(
                "Veuillez saisir un numéro WhatsApp valide."
            );

            whatsappInput.reportValidity();

            whatsappInput.setCustomValidity("");

            return false;

        }

        return true;

    }


    /* ======================================
       4. GESTION DE L'ENVOI DU FORMULAIRE
    ====================================== */

    registrationForm.addEventListener("submit", async function (event) {

        // Empêcher le rechargement de la page
        event.preventDefault();


        // Vérifier les champs obligatoires
        if (!registrationForm.checkValidity()) {

            registrationForm.reportValidity();

            return;

        }


        // Vérifier le numéro WhatsApp
        if (!validateWhatsApp()) {
            return;
        }


        // Empêcher plusieurs envois simultanés
        if (submitButton && submitButton.disabled) {
            return;
        }


        /* ==================================
           5. PRÉPARATION DE L'ENVOI
        ================================== */

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        }

        showFormMessage(
            "Veuillez patienter pendant l'envoi de votre préinscription...",
            "success"
        );


        try {

            /* ==============================
               6. ENVOI VERS FORMSUBMIT
            ============================== */

            const response = await fetch(registrationForm.action, {

                method: "POST",

                body: new FormData(registrationForm),

                headers: {
                    "Accept": "application/json"
                }

            });


            // Lire la réponse du serveur
            const result = await response.json();


            // Vérifier que FormSubmit a accepté la demande
            const isSuccess =
                response.ok &&
                String(result.success).toLowerCase() === "true";


            if (!isSuccess) {

                throw new Error(
                    result.message ||
                    "L'envoi n'a pas pu être confirmé. Veuillez réessayer."
                );

            }


            /* ==============================
               7. CONFIRMATION DE L'ENVOI
            ============================== */

            showFormMessage(
                "Votre préinscription a été transmise avec succès ! Vous allez être redirigé vers la page de confirmation.",
                "success"
            );


            // Garder le bouton désactivé après réussite
            if (submitButton) {

                submitButton.innerHTML =
                    '<i class="fas fa-check-circle"></i> Préinscription envoyée';

            }


            /* ==============================
               8. REDIRECTION VERS MERCI.HTML
            ============================== */

            setTimeout(function () {

                window.location.href = "merci.html";

            }, 1200);


        } catch (error) {

            /* ==============================
               9. GESTION DES ERREURS
            ============================== */

            console.error(
                "Erreur lors de l'envoi du formulaire :",
                error
            );

            showFormMessage(
                error.message ||
                "Une erreur est survenue. Vérifiez votre connexion Internet et réessayez.",
                "error"
            );


            // Réactiver le bouton pour permettre un nouvel essai
            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerHTML = originalButtonContent;

            }

        }

    });

});