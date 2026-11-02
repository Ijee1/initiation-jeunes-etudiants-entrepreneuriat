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
   IDJEE — PARTIE 2
   FORMULAIRE DE PRÉINSCRIPTION
   ENVOI HTML CLASSIQUE FORMSUBMIT
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const registrationForm =
        document.getElementById("registration-form");

    if (!registrationForm) {
        return;
    }

    const submitButton =
        document.getElementById("submit-button");

    const whatsappInput =
        document.getElementById("whatsapp");

    const formRedirect =
        document.getElementById("form-redirect");


    /* ======================================
       1. VALIDATION DU NUMÉRO WHATSAPP
    ====================================== */

    function validateWhatsApp() {

        if (!whatsappInput) {
            return true;
        }

        const phoneNumber =
            whatsappInput.value.replace(/\D/g, "");

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
       2. PRÉPARATION DE LA REDIRECTION
    ====================================== */

    function prepareRedirect() {

        if (!formRedirect) {
            return;
        }

        let currentPath = window.location.pathname;

        // Retirer index.html si présent
        currentPath = currentPath.replace(/index\.html$/i, "");

        // Garantir un chemin se terminant par /
        if (!currentPath.endsWith("/")) {
            currentPath += "/";
        }

        // Construire l'adresse absolue de merci.html
        const thankYouURL =
            window.location.origin +
            currentPath +
            "merci.html";

        formRedirect.value = thankYouURL;
    }


    /* ======================================
       3. GESTION DE LA SOUMISSION
    ====================================== */

    registrationForm.addEventListener("submit", function (event) {

        // Vérifier le numéro WhatsApp
        if (!validateWhatsApp()) {

            event.preventDefault();

            return;
        }

        // Préparer l'adresse de la page de confirmation
        prepareRedirect();

        // Afficher l'état d'envoi
        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        }

        // IMPORTANT :
        // Ne pas utiliser preventDefault() ici.
        // Le navigateur transmet directement le formulaire
        // à FormSubmit.
    });

});