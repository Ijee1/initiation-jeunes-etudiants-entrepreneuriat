
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. MENU DE NAVIGATION MOBILE
    ========================================= */

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

        menuToggle.addEventListener("click", function () {

            const isOpen = navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

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

        // Fermer en cliquant en dehors du menu
        document.addEventListener("click", function (event) {

            if (
                !menuToggle.contains(event.target) &&
                !navigation.contains(event.target)
            ) {
                closeMenu();
            }

        });

        // Fermer avec la touche Échap
        document.addEventListener("keydown", function (event) {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =========================================
       2. ANNÉE AUTOMATIQUE
    ========================================= */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }


    /* =========================================
       3. DÉFILEMENT FLUIDE
    ========================================= */

    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

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


    /* =========================================
       4. FORMULAIRE DE PRÉINSCRIPTION IDJEE
    ========================================= */

    const registrationForm = document.getElementById(
        "registration-form"
    );

    if (registrationForm) {

        const submitButton = document.getElementById("submit-button");

        const whatsappInput = document.getElementById("whatsapp");

        const formMessage = document.getElementById("form-message");

        let formIsSubmitting = false;


        /* -----------------------------------------
           4.1 VALIDATION DU NUMÉRO WHATSAPP
        ----------------------------------------- */

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


        /* -----------------------------------------
           4.2 RÉCUPÉRATION DES INFORMATIONS
        ----------------------------------------- */

        function saveRegistrationData() {

            const formData = new FormData(registrationForm);

            const inscription = {

                nom: formData.get("nom") || "",

                prenoms: formData.get("prenoms") || "",

                whatsapp: formData.get("whatsapp") || "",

                email: formData.get("email") || "",

                statut: formData.get("statut") || "",

                pays: formData.get("pays") || "",

                universite: formData.get("universite") || "",

                filiere: formData.get("filiere") || "",

                niveau: formData.get("niveau") || "",

                ville: formData.get("ville") || "",

                idee: formData.get("idee_projet") || "",

                projet: formData.get("description_projet") || ""

            };

            // Vérifier que les informations principales existent
            if (
                !inscription.nom ||
                !inscription.prenoms ||
                !inscription.whatsapp ||
                !inscription.statut ||
                !inscription.pays
            ) {

                throw new Error(
                    "Certaines informations obligatoires sont manquantes."
                );

            }

            // Enregistrer les informations dans la session
            sessionStorage.setItem(
                "idjeeInscription",
                JSON.stringify(inscription)
            );

            // Vérifier que l'enregistrement a réussi
            const savedData = sessionStorage.getItem(
                "idjeeInscription"
            );

            if (!savedData) {

                throw new Error(
                    "Impossible d'enregistrer les informations."
                );

            }

            return true;

        }


        /* -----------------------------------------
           4.3 SOUMISSION DU FORMULAIRE
        ----------------------------------------- */

        registrationForm.addEventListener("submit", function (event) {

            // Empêcher les doubles clics
            if (formIsSubmitting) {

                event.preventDefault();

                return;

            }

            // Vérifier le numéro WhatsApp
            if (!validateWhatsApp()) {

                event.preventDefault();

                return;

            }

            // Enregistrer les informations avant l'envoi
            try {

                saveRegistrationData();

            } catch (error) {

                event.preventDefault();

                console.error(
                    "Erreur de sauvegarde :",
                    error
                );

                if (formMessage) {

                    formMessage.textContent =
                        "Impossible de préparer votre préinscription. Veuillez réessayer.";

                }

                alert(
                    "Une erreur est survenue lors de la récupération de vos informations. Veuillez réessayer."
                );

                return;

            }

            // Autoriser un seul envoi
            formIsSubmitting = true;

            // Modifier le bouton
            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

            }

            /*
              IMPORTANT :
              Ne pas utiliser event.preventDefault() ici.
              Le navigateur doit transmettre directement
              les informations à FormSubmit.
            */

        });

    }

});
