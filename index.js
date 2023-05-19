import { request } from "./config.js";
import { createBlogApi, fetchAllBlogs, updateBlogApi } from "./api.js";

const tableBlogs = document.querySelector("#table-blogs");
const modal = document.querySelector("#modal-blog");
let pageSize = 5;
let startIndex = 0;
let endIndex = pageSize;
let totalCount = 0;
let currentPage = Math.ceil((startIndex - 1) / pageSize) + 1;

const formatTime = (str) => {
  return str.length === 1 ? `0${str}` : str;
};

const renderBlogs = async (start, end) => {
  const response = await fetchAllBlogs();
  const data = JSON.parse(response);

  totalCount = data.length;

  const tbody = tableBlogs.querySelector("tbody");

  tbody.innerHTML = data
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(start, end)
    .map((item) => {
      const date = new Date(item.createdAt);
      const dateFormat = `${formatTime(date.getDate().toString())}/${formatTime(
        (date.getMonth() + 1).toString()
      )}/${date
        .getFullYear()
        .toString()
        .split("")
        .slice(2)
        .join("")} ${formatTime(date.getUTCHours().toString())}:${formatTime(
        date.getMinutes().toString()
      )}`;

      return `
          <tr>
              <td class="w-[5%]">
                  <div class="table-text">${item.id}</div>
              </td>
              <td class="w-[20%]">
                  <div class="table-text">${item.title}</div>
              </td>
              <td class="w-[10%]">
                  <div class="table-text">
                    <img class="w-[70px] rounded h-[70px]"
                    src="${item.image}"
                    alt=""
                    onerror="this.onerror=null; this.src='https://phutungnhapkhauchinhhang.com/wp-content/uploads/2020/06/default-thumbnail.jpg'" />
                  </div>
              </td>
              <td class="w-[40%]">
                  <div class="table-text">${item.content}</div>
              </td>
              <td class="w-[10%]">
                  <div class="table-text">${dateFormat}</div>
              </td>
              <td class="w-[15%]">
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
      modal.querySelector("#blog_title").value = dataObj.title;
      modal.querySelector("#blog_content").value = dataObj.content;
      modal.querySelector("#blog_image").value =
        typeof dataObj.image === "string" ? dataObj.image : "";
      modal.querySelector("h3").innerText = "Edit";
    });
  });
};

renderBlogs(startIndex, endIndex);

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

  const requestObj = {
    title,
    content,
    image,
  };

  if (!dataObj) {
    await createBlogApi(JSON.stringify(requestObj));
  } else {
    await updateBlogApi(dataObj.id, JSON.stringify(requestObj))
  }

  renderBlogs(startIndex, endIndex);
  modal.classList.add("hidden");
  clearData();

});

document.querySelector("#btn-open-create").addEventListener("click", () => {
  modal.classList.remove("hidden");
});

const btnPagination = document.querySelectorAll(".pagination .btn-pagi");

btnPagination.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
    const totalPage = Math.ceil(totalCount / pageSize);
    if (type === "first") {
      if (currentPage <= 1) return;
      startIndex = 0;
      endIndex = pageSize;
      currentPage = 1;
    } else if (type === "last") {
      if (currentPage >= totalPage) return;
      endIndex = totalCount;
      startIndex = (Math.ceil(totalCount / pageSize) - 1) * pageSize;
      currentPage = Math.ceil(totalCount / pageSize);
    } else if (type === "prev") {
      if (currentPage <= 1) return;
      startIndex = (currentPage - 2) * pageSize;
      endIndex = (currentPage - 1) * pageSize;
      currentPage -= 1;
    } else {
      if (currentPage >= totalPage) return;
      startIndex = currentPage * pageSize;
      currentPage += 1;
      endIndex = currentPage * pageSize;
    }

    renderBlogs(startIndex, endIndex);
    document.getElementById("current-page").innerText = currentPage;
  });
});

document.querySelector("#select-per-page").addEventListener("change", (e) => {
  pageSize = Number(e.target.value);
  const currentIndex = (currentPage - 1) * pageSize;
  startIndex = currentIndex;
  endIndex = Math.min(currentIndex + pageSize, totalCount);
  renderBlogs(startIndex, endIndex);
});
