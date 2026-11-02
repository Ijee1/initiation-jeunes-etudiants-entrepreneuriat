
document.addEventListener("DOMContentLoaded", function () {

    /* ======================================
       1. MENU DE NAVIGATION MOBILE
    ====================================== */

    const menuToggle = document.getElementById("menu-toggle");
    const navigation = document.getElementById("navigation");

    function closeMenu() {

        if (!menuToggle || !navigation) return;

        navigation.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-times");
            icon.classList.add("fa-bars");
        }
    }

    if (menuToggle && navigation) {

        // Ouvrir et fermer le menu
        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute("aria-expanded", String(isOpen));

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

            const icon = menuToggle.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", !isOpen);
                icon.classList.toggle("fa-times", isOpen);
            }

        });

        // Fermer le menu après un clic sur un lien
        navigation.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", closeMenu);

        });

        // Fermer le menu en cliquant à l'extérieur
        document.addEventListener("click", function (event) {

            if (
                !menuToggle.contains(event.target) &&
                !navigation.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Fermer le menu avec la touche Échap
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
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
       3. DÉFILEMENT FLUIDE
    ====================================== */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const targetElement = document.getElementById(
                href.substring(1)
            );

            if (targetElement) {

                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    /* ======================================
       4. FORMULAIRE DE PRÉINSCRIPTION
       FORMSUBMIT - ENVOI CLASSIQUE
    ====================================== */

    
const registrationForm = document.getElementById("registration-form");

if (registrationForm) {

    const submitButton = document.getElementById("submit-button");
    const whatsappInput = document.getElementById("whatsapp");

    let formIsSubmitting = false;

    /* ==================================
       4.1 VALIDATION WHATSAPP
    ================================== */

    function validateWhatsApp() {

        if (!whatsappInput) {
            return true;
        }

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

    /* ==================================
       4.2 SOUMISSION DU FORMULAIRE
    ================================== */

    registrationForm.addEventListener("submit", function (event) {

        // Empêcher les doubles soumissions
        if (formIsSubmitting) {
            event.preventDefault();
            return;
        }

        // Vérifier le numéro WhatsApp
        if (!validateWhatsApp()) {
            event.preventDefault();
            return;
        }

        // Mémoriser l'état d'envoi
        formIsSubmitting = true;

        // Modifier le bouton
        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerHTML =
                '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        }

        // Laisser le navigateur envoyer directement
        // le formulaire à FormSubmit.

    });

}


});
