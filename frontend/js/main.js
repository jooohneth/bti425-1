/********************************************************************************
 * BTI425 – Assignment 2
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Thai Zyong Nguyen Student ID: 153467220 Date: 2025-01-29
 *
 ********************************************************************************/
let page = 1;
let searchName = undefined;
const perPage = 10;

async function loadListingsData() {
  const url = searchName
    ? `https://bti425-1.vercel.app/api/listings?page=${page}&perPage=${perPage}&name=${encodeURIComponent(searchName)}`
    : `https://bti425-1.vercel.app/api/listings?page=${page}&perPage=${perPage}`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    let data = await res.json();

    if (data.length) {
      let row = `
      ${data
        .map(
          (element) => `
          <tr data-id="${element._id}">    
              <td>${element.name}</td> 
              <td>${element.room_type}</td>
              <td>${element.address.street || "No address available"}</td>
              <td>${element.summary || "No summary available"} <br><br>
              <strong>Accommodates:</strong> ${element.accommodates}<br>
              <strong>Rating:</strong> ${
                element.review_scores.review_scores_rating
              } (${element.number_of_reviews || 0} Reviews)
              </td>
          </tr>`
        )
        .join("")}`;


      document.querySelector("#listingsTable tbody ").innerHTML = row;

      document.querySelectorAll("#listingsTable tbody tr").forEach((row) => {
        row.addEventListener("click", async (e) => {
          let listingId = row.getAttribute("data-id");
          let res = await fetch(
            `https://bti-425.vercel.app/api/listings/${listingId}`
          );
          let listingData = await res.json();

          showDetailsModal(listingData);
        });
      });
    } else {
      if (page > 1) {
        page--;
      } else {
        document.querySelector(
          "#listingsTable tbody"
        ).innerHTML = `<tr><td colspan="4"><strong>No data available</td></tr>`;
      }
    }
  } catch (err) {
    document.querySelector(
      "#listingsTable tbody"
    ).innerHTML = `<tr><td colspan="4"><strong>No data available! ${err}</td></tr>`;
  }
}

function showDetailsModal(data) {
  console.log("Modal Data:", data);
  document.querySelector("#detailsModal .modal-title").textContent = data.name;
  let modelBody = `<div class="modal-body">
                       <img id= "photo" onerror = "this.onerror=null;this.src =
                        'https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100"
                          src="${
                            data.images.picture_url
                          }"  alt="Image not available" ><br><br>
                      ${
                        data.neighborhood_overview ||
                        "No neighborhood overview available."
                      } <br><br>
                        <strong>Price: </strong>${data.price.toFixed(2)}<br>
                        <strong>Room: </strong>${data.room_type}<br>
                        <strong>Bed: </strong>${data.bed_type} (${data.beds})
                        <br><br>
                  </div>`;

  document.querySelector("#detailsModal .modal-body").innerHTML = modelBody;

  let myModal = new bootstrap.Modal(document.getElementById("detailsModal"), {
    backdrop: "static", 
  });
  myModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
  loadListingsData();

  const updatePage = () => {
    document.getElementById("Current").textContent = `${page}`;
  };

  document.getElementById("Previous").addEventListener("click", (e) => {
    e.preventDefault();
    if (page > 1) {
      page--;
      loadListingsData();
      updatePage();
    }
  });

  document.getElementById("Next").addEventListener("click", (e) => {
    e.preventDefault();
    page++;
    loadListingsData();
    updatePage();
  });

  document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    searchName = document.getElementById("name").value;
    page = 1;
    loadListingsData();
    updatePage();
  });

  document.getElementById("clearForm").addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("name").value = "";
    searchName = null;
    page = 1;
    loadListingsData();
  });

  updatePage();
});