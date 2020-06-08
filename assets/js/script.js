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
    const elScore = f.s(".score p span.vert");

    // On crée des variables de travail
    let numQuestionCourante = 0;
    const nbreMaxQuestions = 9;
    let questionCourante = {};
    let tempsRestant = 20;
    let choisi = false;
    let tempsMax = 20;
    let chrono = -1;
    let score = 0;

    // On mélange les questions
    f.melanger(questions);

    // On affiche la première question
    nouvelleQuestion();

    // Lorsqu'on clique sur une proposition
    f.s(".proposition").clic((e, proposition) => {
        f.s(".proposition").forEach(p => {
            if (choisi) {
                p.classList.remove("clic");
            } else {
                p.classList.remove("choix");
                p.classList.remove("juste");
                p.classList.remove("incorrecte");
                p.classList.add("clic");
            }

        });
        if (!choisi) proposition.classList.add("choix");
    })

    // Lorsqu'on clique sur le bouton suivant
    f.s("button.suivant").clic(() => {
        // On vérifie si une réponse a été choisie
        let choix = document.querySelector(".choix");
        if (choix) {
            // On bloque le chrono
            arreterChrono();

            // On marque qu'il a choisi
            choisi = true;

            // On vérifie si la réponse choisie est correcte ou pas
            let trouve = f.verifierReponse(questionCourante.propositions, choix.dataset.pos);

            if (trouve) {
                choix.classList.remove('choix');
                choix.classList.add('juste');
                score++;
            } else {
                choix.classList.remove('choix');
                choix.classList.add('incorrecte');
            }

            // Une demi seconde plus tard on affiche la question suivante
            setTimeout(nouvelleQuestion, 500);

        }
    });

    function nouvelleQuestion() {
        // Si nous somme à la dernière question on ne fait rien
        if (numQuestionCourante === nbreMaxQuestions) {
            afficherScore();
            return;
        }
        else numQuestionCourante++;

        // On initialise le temps
        tempsRestant = 20;

        // On marque que le joueur n'a pas encore choisi
        choisi = false;

        // On déselectionne le précédent choix
        let ancienChoix = document.querySelector(".proposition.choix, .proposition.juste, .proposition.incorrecte");
        if (ancienChoix) {
            ancienChoix.classList.remove('choix');
            ancienChoix.classList.remove('juste');
            ancienChoix.classList.remove('incorrecte');
        }

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

    function afficherScore() {
        f.s("body").css("backgroundImage", "");
        f.s(".partie").cacher();
        elScore.valeur(score);
        f.s(".fenetre.score").afficher();
        f.s(".score button").clic(() => {
            location.reload();
        })
    }

})();