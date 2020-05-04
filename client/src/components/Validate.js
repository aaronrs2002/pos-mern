const validate = () => {
  const category = document.querySelector("input[name='category']").value;
  if (!category) {
    document.querySelector("input[name='category']").classList.add("error");
    return false;
  } else {
    document.querySelector("input[name='category']").classList.remove("error");
  }

  const name = document.querySelector("input[name='name']").value;
  if (!name) {
    document.querySelector("input[name='name']").classList.add("error");
    return false;
  } else {
    document.querySelector("input[name='name']").classList.remove("error");
  }

  const description = document.querySelector("input[name='description']").value;
  if (!description) {
    document.querySelector("input[name='description']").classList.add("error");
    return false;
  } else {
    document
      .querySelector("input[name='description']")
      .classList.remove("error");
  }

  const price = document.querySelector("input[name='price']").value;
  if (!price || isNaN(price)) {
    document.querySelector("input[name='price']").classList.add("error");
    return false;
  } else {
    document.querySelector("input[name='price']").classList.remove("error");
  }

  const quantity = document.querySelector("input[name='quantity']").value;
  if (!quantity || isNaN(quantity)) {
    document.querySelector("input[name='quantity']").classList.add("error");
    return false;
  } else {
    document.querySelector("input[name='quantity']").classList.remove("error");
  }
};

export default validate;
