import questions from "./questions.js";
import f from "./fonctions.js";

(function () {

    // Au lancement d'une partie

    // On récupère les éléments de la page
    const jauge = f.s(".jauge");
    const valeurJauge = f.s(".jauge .valeur");
    const qCompteur = f.s(".question-num .question-compteur");
    const elQuestion = f.s(".question");
    const elsPropositions = f.s(".proposition p");

    // On crée des variables de travail
    let numQuestionCourante = 0;
    const nbreMaxQuestions = 9;
    let questionCourante = {};
    let tempsRestant = 20;
    let tempsMax = 20;
    let chrono = -1;

    // On mélange les questions
    f.melanger(questions);

    // On affiche la première question
    nouvelleQuestion();

    // Lorsqu'on clique sur une proposition
    f.s(".proposition").clic((e, proposition) => {
        f.s(".proposition").forEach(p => {
            p.classList.remove("choix");
        });
        proposition.classList.add("choix");
    })

    // Lorsqu'on clique sur le bouton suivant
    f.s("button.suivant").clic(() => {
        // On vérifie si une réponse a été choisie
        let choix = document.querySelector(".choix");
        if (choix) {
            // On bloque le chrono
            arreterChrono();

            // On vérifie si la réponse choisie est correcte ou pas
            let trouve = f.verifierReponse(questionCourante.propositions, choix.dataset.pos);

            // Une demi seconde plus tard on affiche la question suivante
            nouvelleQuestion();

        }
    });

    function nouvelleQuestion() {
        // Si nous somme à la dernière question on ne fait rien
        if (numQuestionCourante === nbreMaxQuestions) return;
        else numQuestionCourante++;

        // On initialise le temps
        tempsRestant = 20;

        // On déselectionne le précédent choix
        let ancienChoix = document.querySelector(".choix");
        if (ancienChoix) ancienChoix.classList.remove('choix');

        // On récupère une question
        questionCourante = questions[numQuestionCourante - 1];

        // On mélange les propositions de la question
        f.melanger(questionCourante.propositions);

        // On initialise le temps
        jauge.css("width", "100%");
        valeurJauge.valeur(tempsMax);

        // On modifie le compteur de questions
        qCompteur.valeur(`Question ${numQuestionCourante}`);

        // On affiche la question
        elQuestion.valeur(questionCourante.question);

        // On affiche les trois propositions
        f.afficherPropositions(questionCourante.propositions, elsPropositions)

        // On lance le chrono
        lancerChrono();

    }

    function lancerChrono() {
        chrono = setInterval(() => {
            if (tempsRestant >= 0) {
                if (tempsRestant <= 6) {
                    jauge.style.backgroundColor = "#be0000";
                } else if (tempsRestant <= 11) {
                    jauge.style.backgroundColor = "#be5500";
                } else {
                    jauge.style.backgroundColor = "#3cbe00";
                }
                jauge.css("width", `${(tempsRestant / tempsMax) * 100}%`);
                valeurJauge.valeur(Math.floor(tempsRestant));
                tempsRestant -= 0.01;
            } else {
                clearInterval(chrono);
                nouvelleQuestion();
            }
        }, 10);
    }

    function arreterChrono() {
        clearInterval(chrono);
    }

})();