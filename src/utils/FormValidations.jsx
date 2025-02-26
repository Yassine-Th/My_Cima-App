export default function FormValidations(name, img, price, description, setErr) {
  const regexName = /^(?:(?!<[\/]>).){3,}$/;
  const regexPrice = /^[1-9][0-9]*$/;

  const regexDesc = /^(?:(?!<[\/]>).){10,}$/;

  let valid = true;

  if (!name) {
    setErr((prevErr) => ({
      ...prevErr,
      errName: "Le nom est requis.",
    }));
    valid = false;
  } else if (!regexName.test(name)) {
    setErr((prevErr) => ({
      ...prevErr,
      errName: "Le nom doit contenir uniquement des lettres et des espaces.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errName: "",
    }));
  }

  if (!img) {
    setErr((prevErr) => ({
      ...prevErr,
      errImg: "L'image est requise.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errImg: "",
    }));
  }

  if (!price) {
    setErr((prevErr) => ({
      ...prevErr,
      errPrice: "Le prix est requis.",
    }));
    valid = false;
  } else if (!regexPrice.test(price)) {
    setErr((prevErr) => ({
      ...prevErr,
      errPrice: "Le prix doit contenir un nombre entier supérieur à 0.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errPrice: "",
    }));
  }

  if (!description) {
    setErr((prevErr) => ({
      ...prevErr,
      errDescription: "La description est requise.",
    }));
    valid = false;
  } else if (!regexDesc.test(description)) {
    setErr((prevErr) => ({
      ...prevErr,
      errDescription: "La description doit contenir au moins 10 caractères.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errDescription: "",
    }));
  }

  return valid;
}
