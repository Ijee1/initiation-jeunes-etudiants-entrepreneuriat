
document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       1. MENU MOBILE
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

        navigation.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("click", function (event) {

            if (
                !menuToggle.contains(event.target) &&
                !navigation.contains(event.target)
            ) {
                closeMenu();
            }
        });

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

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = link.getAttribute("href");

            if (!href || href === "#") return;

            const target = document.getElementById(href.substring(1));

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    /* =========================================
       4. FORMULAIRE IJEE - FORMSUBMIT AJAX
    ========================================= */

    const registrationForm = document.getElementById(
        "registration-form"
    );

    if (!registrationForm) return;

    const submitButton = document.getElementById("submit-button");
    const whatsappInput = document.getElementById("whatsapp");
    const formMessage = document.getElementById("form-message");

    const formEndpoint =
        "https://formsubmit.co/ajax/odilonlaly000@gmail.com";

    let formIsSubmitting = false;


    /* -----------------------------------------
       4.1 AFFICHER UN MESSAGE
    ----------------------------------------- */

    function showMessage(message, color) {

        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.style.color = color;
    }


    /* -----------------------------------------
       4.2 VALIDATION WHATSAPP
    ----------------------------------------- */

    function validateWhatsApp() {

        if (!whatsappInput) return true;

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
       4.3 RÉCUPÉRATION DES DONNÉES
    ----------------------------------------- */

    function getRegistrationData() {

        const formData = new FormData(registrationForm);

        return {

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
    }


    /* -----------------------------------------
       4.4 ENVOI DES INFORMATIONS
    ----------------------------------------- */

    registrationForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (formIsSubmitting) return;

        if (!validateWhatsApp()) return;

        if (!registrationForm.reportValidity()) return;

        formIsSubmitting = true;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Envoi en cours...";
        }

        showMessage(
            "Veuillez patienter pendant l'envoi de votre préinscription...",
            "#2563eb"
        );

        try {

            // Récupérer les données
            const inscription = getRegistrationData();

            // Vérifier les informations principales
            if (
                !inscription.nom ||
                !inscription.prenoms ||
                !inscription.whatsapp ||
                !inscription.statut ||
                !inscription.pays
            ) {
                throw new Error(
                    "Certains champs obligatoires sont manquants."
                );
            }

            // Sauvegarder les informations pour merci.html
            localStorage.setItem(
                "idjeeInscription",
                JSON.stringify(inscription)
            );

            // Envoyer le formulaire à FormSubmit
            const response = await fetch(formEndpoint, {

                method: "POST",

                headers: {
                    "Accept": "application/json"
                },

                body: new FormData(registrationForm)

            });

            // Lire la réponse du service
            const data = await response.json();

            // Vérifier la véritable réponse FormSubmit
            if (
                !response.ok ||
                String(data.success).toLowerCase() !== "true"
            ) {

                throw new Error(
                    data.message || "FormSubmit n'a pas accepté votre demande."
                );
            }

            // Envoi accepté : redirection
            showMessage(
                "Préinscription transmise avec succès ! Redirection...",
                "green"
            );

            setTimeout(function () {

                window.location.href = "merci.html";

            }, 1200);

        } catch (error) {

            console.error("Erreur FormSubmit :", error);

            // Retirer les données si l'envoi a échoué
            localStorage.removeItem("idjeeInscription");

            showMessage(
                "Échec de l'envoi : " + error.message,
                "red"
            );

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Envoyer ma préinscription";
            }

            formIsSubmitting = false;
        }

    });

});
