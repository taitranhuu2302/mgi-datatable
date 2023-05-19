const tableBlogs = document.querySelector("#table-blogs");
const modal = document.querySelector("#modal-blog");
let startRecord = 0;
let endRecord = 5;

const fetchAllBlogs = async (start, end) => {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs");
  let data = [];

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      data = JSON.parse(xhr.response);

      if (start <= 0) {
        start = 0;
        startRecord = 0;
        end = 5;
        endRecord = 5;
      }

      if (end > data.length) {
        end = data.length;
        endRecord = data.length;
      }

      const tbody = tableBlogs.querySelector("tbody");
      const totalRecord = document.getElementById("total-record");
      totalRecord.innerHTML = `
      <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">${start + 1}</span>
          to
          <span class="font-medium">${end}</span>
          of
          <span class="font-medium">${data.length}</span>
          results
      </p>
    `;

      tbody.innerHTML = data
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(start, end)
        .map((item) => {
          const date = new Date(item.createdAt);
          const dateFormat = `${date.getDate()}/${
            (date.getMonth() + 1).toString().length === 1
              ? `0${date.getMonth() + 1}`
              : date.getMonth() + 1
          }/${date
            .getFullYear()
            .toString()
            .split("")
            .slice(2)
            .join("")} ${date.getHours()}:${date.getMinutes()}`;
          return `
          <tr>
              <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">${item.id}</div>
              </td>
              <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">${item.title}</div>
              </td>
              <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">
                      <img
                      class="w-[70px] rounded h-[70px]"
                      src="${item.image}"
                      alt=""
                      />
                  </div>
              </td>
              <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">${item.content}</div>
              </td>
              <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">${dateFormat}</div>
              </td>
              <td class="px-6 py-4">
                  <button
                      data-obj='${JSON.stringify(item)}'
                      class="px-3 py-3 text-white rounded btn-open-edit max-w-1/2 hover:bg-blue-400 bg-blue-500"
                  >
                      Edit
                  </button>
              </td>
          </tr>
          `;
        })
        .join("");

      const editButtons = document.querySelectorAll(".btn-open-edit");

      editButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          modal.classList.remove("hidden");
          const dataObj = JSON.parse(btn.getAttribute("data-obj"));
          modal.setAttribute("data-obj", btn.getAttribute("data-obj"));
          console.log(btn.getAttribute("data-obj"));
          modal.querySelector("#blog_title").value = dataObj.title;
          modal.querySelector("#blog_content").value = dataObj.content;
          modal.querySelector("#blog_image").value =
            typeof dataObj.image === "string" ? dataObj.image : "";
          modal.querySelector("h3").innerText = "Edit";
        });
      });
    }
  };
  xhr.send();
};

fetchAllBlogs(startRecord, endRecord);

const clearData = () => {
  modal.querySelector("#blog_title").value = "";
  modal.querySelector("#blog_content").value = "";
  modal.querySelector("#blog_image").value = "";
  modal.removeAttribute("data-obj");
  modal.querySelector("h3").innerText = "Create";
};

modal.querySelector("#btn-cancel").addEventListener("click", () => {
  modal.classList.add("hidden");
  clearData();
});

modal.querySelector("#btn-save").addEventListener("click", async () => {
  const dataObj = modal.getAttribute("data-obj")
    ? JSON.parse(modal.getAttribute("data-obj"))
    : null;
  const title = modal.querySelector("#blog_title").value;
  const content = modal.querySelector("#blog_content").value;
  const image = modal.querySelector("#blog_image").value;
  const xhr = new XMLHttpRequest();

  const requestObj = {
    title,
    content,
    image,
  };

  if (!dataObj) {
    xhr.open(
      "POST",
      `https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs`
    );
  } else {
    xhr.open(
      "PUT",
      `https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs/${dataObj.id}`
    );
  }
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = () => {
    fetchAllBlogs(startRecord, endRecord);
    modal.classList.add("hidden");
    clearData();
  };

  xhr.send(JSON.stringify(requestObj));
});

document.querySelector("#btn-open-create").addEventListener("click", () => {
  modal.classList.remove("hidden");
});

document.querySelector("#btn-next-page").addEventListener("click", () => {
  startRecord = endRecord;
  endRecord += 5;
  fetchAllBlogs(startRecord, endRecord);
});

document.querySelector("#btn-prev-page").addEventListener("click", () => {
  endRecord = startRecord;
  startRecord -= 5;
  fetchAllBlogs(startRecord, endRecord);
});