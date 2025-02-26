export default function CheckOutValidation(name, ville, address, setErr) {
  const regexName = /^(?:(?!<[\/]>).){3,}$/;

  const regexAddress = /^(?:(?!<[\/]>).){3,}$/;

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

  console.log(ville);

  if (ville === "-1") {
    setErr((prevErr) => ({
      ...prevErr,
      errVille: "la ville est requise.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errVille: "",
    }));
  }

  if (!address) {
    setErr((prevErr) => ({
      ...prevErr,
      errAddress: "L'adresse est requise.",
    }));
    valid = false;
  } else if (!regexAddress.test(address)) {
    setErr((prevErr) => ({
      ...prevErr,
      errAddress: "L'adresse doit contenir au moins 10 caractères.",
    }));
    valid = false;
  } else {
    setErr((prevErr) => ({
      ...prevErr,
      errAddress: "",
    }));
  }

  return valid;
}
