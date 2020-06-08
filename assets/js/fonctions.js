export default {
    nouvelleQuestion: () => {

    },
    afficherPropositions: (propositions, elements) => {
        for (let i = 0; i < propositions.length; i++)
            elements[i].textContent = propositions[i].reponse;
    },
    verifierReponse: (propositions, choix) => {
        for (let i = 0; i < propositions.length; i++)
            if (propositions[choix - 1].correcte) return true;
        return false;
    },
    s: (selector) => {
        let els = document.querySelectorAll(selector);
        if (els.length == 1) {
            let el = els[0];
            el.clic = (cb) => {
                el.addEventListener("click", cb);
                return el;
            }
            el.valeur = contenu => {
                if (contenu !== undefined) el.innerHTML = contenu;
                else return el.innerHTML;
            }
            el.css = (prop, val) => {
                el.style[prop] = val;
                return el;
            }
            return el;
        } else if (els.length > 1) {
            els.clic = (cb) => {
                els.forEach(one => {
                    one.addEventListener("click", e => {
                        cb(e, one);
                    });
                })
            }
            return els;
        } else {
            return els;
        }
    },
    melanger: (tableau) => {
        for (let i = tableau.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = tableau[i]
            tableau[i] = tableau[j]
            tableau[j] = temp
        }
    }
}