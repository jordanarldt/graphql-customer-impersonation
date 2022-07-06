
const form = document.getElementById("form");
const responseContainer = document.getElementById("response");

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(form);
  const serialized = new URLSearchParams(data).toString();

  fetch(`/graphql?${serialized}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
    }
  })
  .then(res => res.json())
  .then(json => {
    responseContainer.innerHTML = JSON.stringify(json);
  })
  .catch(console.log);
});
