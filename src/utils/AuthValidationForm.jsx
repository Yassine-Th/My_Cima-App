
/**
 * Validation function for authentication forms.
 * @param {{ email: string, username: string }} { email, username }
 * @param {string} password
 * @param {boolean} isItLogin
 * @param {function} setErr
 * @returns {boolean} true if the form is valid, false otherwise
 */
export default function AuthValidationForm(
    { email, username},
    password,
    isItLogin,
    setErr
) {
    let valid = true;

    const patternEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const patternUsername = /^[a-zA-Z0-9\s]{1,30}$/;
    const patternPassword = /^[a-zA-Z0-9\s]{8,30}$/;

    if (!email && !username) {
        setErr((prevErr) => ({
            ...prevErr,
            emailUsernameErr: "L'email ou le nom d'utilisateur est requis.",
        }));
        valid = false;
    } else {
        setErr((prevErr) => ({
            ...prevErr,
            emailUsernameErr: "",
        }));
    }

    if(isItLogin){
        if (!email && !patternEmail.test(email)) {
            setErr((prevErr) => ({
                ...prevErr,
                emailErr: "L'email n'est pas valide.",
            }));
            valid = false;
        } else {
            setErr((prevErr) => ({
                ...prevErr,
                emailErr: "",
            }));
        }
    
        if (!username && !patternUsername.test(username)) {
            setErr((prevErr) => ({
                ...prevErr,
                usernameErr: "Le nom d'utilisateur n'est pas valide.",
            }));
            valid = false;
        } else {
            setErr((prevErr) => ({
                ...prevErr,
                usernameErr: "",
            }));
        }
    }


    if (!patternPassword.test(password)) {
        setErr((prevErr) => ({
            ...prevErr,
            passwordErr: "Le mot de passe n'est pas valide.",
        }));
        valid = false;
    } else {
        setErr((prevErr) => ({
            ...prevErr,
            passwordErr: "",
        }));
    }

    return valid;
}
