// Expense Tracker - Frontend Logic

const API_URL = "http://localhost:3000/api/expenses";

let allExpenses = [];
let expensesChart = null;


// =========================
// Bootstrap Alert
// =========================

function showAlert(message, type = "danger") {
  const alertContainer = document.getElementById("alertContainer");

  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
      ></button>
    </div>
  `;

  alertContainer.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}


// =========================
// Get Expenses
// =========================

async function getExpenses() {
  const spinner = document.getElementById("loadingSpinner");

  try {
    spinner.classList.remove("d-none");

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load expenses");
    }

    const expenses = await response.json();

    allExpenses = expenses;

    applyFilters();
    updateChart();

  } catch (error) {
    showAlert(
      "Cannot connect to the server. Please make sure the backend is running."
    );

  } finally {
    spinner.classList.add("d-none");
  }
}


// =========================
// Display Expenses
// =========================

function displayExpenses(expenses) {
  const tableBody =
    document.getElementById("expensesTableBody");

  tableBody.innerHTML = "";

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>

      <td>
        ${Number(expense.amount).toFixed(2)}
      </td>

      <td>
        <span class="badge bg-primary">
          ${expense.category}
        </span>
      </td>

      <td>${expense.date}</td>

      <td>
        <button
          class="btn btn-warning btn-sm"
          onclick="editExpense(${expense.id})"
        >
          Edit
        </button>
      </td>

      <td>
        <button
          class="btn btn-danger btn-sm"
          onclick="deleteExpense(${expense.id})"
        >
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  updateSummary();
}


// =========================
// Update Summary Cards
// =========================

function updateSummary() {
  const totalAmount = allExpenses.reduce(
    (total, expense) =>
      total + Number(expense.amount),
    0
  );

  const expenseCount = allExpenses.length;

  const highestExpense =
    allExpenses.length > 0
      ? allExpenses.reduce((highest, expense) =>
          Number(expense.amount) >
          Number(highest.amount)
            ? expense
            : highest
        )
      : null;

  document.getElementById("totalAmount").textContent =
    totalAmount.toFixed(2);

  document.getElementById("expenseCount").textContent =
    expenseCount;

  document.getElementById("highestExpense").textContent =
    highestExpense
      ? Number(highestExpense.amount).toFixed(2)
      : "0.00";

  document.getElementById("highestExpenseTitle").textContent =
    highestExpense
      ? highestExpense.title
      : "";
}


// =========================
// Expenses Chart
// =========================

function updateChart() {
  const categories = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other"
  ];

  const categoryTotals = categories.map((category) => {
    return allExpenses
      .filter(
        (expense) =>
          expense.category === category
      )
      .reduce(
        (total, expense) =>
          total + Number(expense.amount),
        0
      );
  });

  const ctx =
    document.getElementById("expensesChart");

  if (expensesChart) {
    expensesChart.destroy();
  }

  expensesChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: categories,

      datasets: [
        {
          label: "Expenses",
          data: categoryTotals
        }
      ]
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          display: true
        }
      },

      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}


// =========================
// Add Expense
// =========================

const expenseForm =
  document.getElementById("expenseForm");

expenseForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const title =
      document
        .getElementById("title")
        .value
        .trim();

    const amount =
      document.getElementById("amount").value;

    const category =
      document.getElementById("category").value;

    const date =
      document.getElementById("date").value;

    if (
      !title ||
      !amount ||
      !category ||
      !date
    ) {
      showAlert(
        "All fields are required",
        "warning"
      );

      return;
    }

    if (Number(amount) <= 0) {
      showAlert(
        "Amount must be greater than 0"
      );

      return;
    }

    const expense = {
      title,
      amount: Number(amount),
      category,
      date
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(expense)
      });

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.message
        );
      }

      expenseForm.reset();

      await getExpenses();

    } catch (error) {
      showAlert(error.message);
    }
  }
);


// =========================
// Delete Expense
// =========================

async function deleteExpense(id) {
  try {
    const response = await fetch(
      `${API_URL}/${id}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      const errorData =
        await response.json();

      throw new Error(
        errorData.message
      );
    }

    await getExpenses();

  } catch (error) {
    showAlert(error.message);
  }
}


// =========================
// Edit Expense
// =========================

function editExpense(id) {
  const expense =
    allExpenses.find(
      (expense) =>
        expense.id === id
    );

  if (!expense) {
    return;
  }

  document.getElementById("editId").value =
    expense.id;

  document.getElementById("editTitle").value =
    expense.title;

  document.getElementById("editAmount").value =
    expense.amount;

  document.getElementById("editCategory").value =
    expense.category;

  document.getElementById("editDate").value =
    expense.date;

  const modal =
    new bootstrap.Modal(
      document.getElementById("editModal")
    );

  modal.show();
}


// =========================
// Save Edited Expense
// =========================

const saveEditBtn =
  document.getElementById("saveEditBtn");

saveEditBtn.addEventListener(
  "click",
  async () => {
    const id =
      document.getElementById("editId").value;

    const title =
      document
        .getElementById("editTitle")
        .value
        .trim();

    const amount =
      document.getElementById(
        "editAmount"
      ).value;

    const category =
      document.getElementById(
        "editCategory"
      ).value;

    const date =
      document.getElementById(
        "editDate"
      ).value;

    if (
      !title ||
      !amount ||
      !category ||
      !date
    ) {
      showAlert(
        "All fields are required"
      );

      return;
    }

    if (Number(amount) <= 0) {
      showAlert(
        "Amount must be greater than 0"
      );

      return;
    }

    const updatedExpense = {
      title,
      amount: Number(amount),
      category,
      date
    };

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(
            updatedExpense
          )
        }
      );

      if (!response.ok) {
        const errorData =
          await response.json();

        throw new Error(
          errorData.message
        );
      }

      const modalElement =
        document.getElementById(
          "editModal"
        );

      const modal =
        bootstrap.Modal.getInstance(
          modalElement
        );

      modal.hide();

      await getExpenses();

    } catch (error) {
      showAlert(error.message);
    }
  }
);


// =========================
// Filters
// =========================

const categoryFilter =
  document.getElementById(
    "categoryFilter"
  );

const titleSearch =
  document.getElementById(
    "titleSearch"
  );

const monthFilter =
  document.getElementById(
    "monthFilter"
  );


// =========================
// Apply Filters
// =========================

function applyFilters() {
  const selectedCategory =
    categoryFilter.value;

  const searchText =
    titleSearch.value
      .toLowerCase()
      .trim();

  const selectedMonth =
    monthFilter.value;

  const filteredExpenses =
    allExpenses.filter(
      (expense) => {
        const matchesCategory =
          selectedCategory === "All" ||
          expense.category ===
            selectedCategory;

        const matchesTitle =
          expense.title
            .toLowerCase()
            .includes(searchText);

        const matchesMonth =
          !selectedMonth ||
          expense.date.startsWith(
            selectedMonth
          );

        return (
          matchesCategory &&
          matchesTitle &&
          matchesMonth
        );
      }
    );

  displayExpenses(
    filteredExpenses
  );
}


// =========================
// Filter Events
// =========================

categoryFilter.addEventListener(
  "change",
  () => {
    applyFilters();
  }
);

titleSearch.addEventListener(
  "input",
  () => {
    applyFilters();
  }
);

monthFilter.addEventListener(
  "change",
  () => {
    applyFilters();
  }
);


// =========================
// Sort Table
// =========================

let sortColumn = "";
let sortDirection = "asc";

function sortExpenses(column) {
  if (sortColumn === column) {
    sortDirection =
      sortDirection === "asc"
        ? "desc"
        : "asc";
  } else {
    sortColumn = column;
    sortDirection = "asc";
  }

  const selectedCategory =
    categoryFilter.value;

  const searchText =
    titleSearch.value
      .toLowerCase()
      .trim();

  const selectedMonth =
    monthFilter.value;

  const filteredExpenses =
    allExpenses.filter(
      (expense) => {
        const matchesCategory =
          selectedCategory === "All" ||
          expense.category ===
            selectedCategory;

        const matchesTitle =
          expense.title
            .toLowerCase()
            .includes(searchText);

        const matchesMonth =
          !selectedMonth ||
          expense.date.startsWith(
            selectedMonth
          );

        return (
          matchesCategory &&
          matchesTitle &&
          matchesMonth
        );
      }
    );

  const sortedExpenses =
    [...filteredExpenses].sort(
      (a, b) => {
        let valueA = a[column];
        let valueB = b[column];

        if (column === "amount") {
          valueA = Number(valueA);
          valueB = Number(valueB);
        } else {
          valueA =
            String(valueA).toLowerCase();

          valueB =
            String(valueB).toLowerCase();
        }

        if (valueA < valueB) {
          return sortDirection === "asc"
            ? -1
            : 1;
        }

        if (valueA > valueB) {
          return sortDirection === "asc"
            ? 1
            : -1;
        }

        return 0;
      }
    );

  displayExpenses(
    sortedExpenses
  );
}


// =========================
// Export CSV
// =========================

const exportCsvBtn =
  document.getElementById(
    "exportCsvBtn"
  );

exportCsvBtn.addEventListener(
  "click",
  () => {
    if (allExpenses.length === 0) {
      showAlert(
        "There are no expenses to export.",
        "warning"
      );

      return;
    }

    const headers = [
      "Title",
      "Amount",
      "Category",
      "Date"
    ];

    const rows =
      allExpenses.map(
        (expense) => [
          `"${String(
            expense.title
          ).replace(
            /"/g,
            '""'
          )}"`,

          Number(
            expense.amount
          ).toFixed(2),

          `"${String(
            expense.category
          ).replace(
            /"/g,
            '""'
          )}"`,

          expense.date
        ]
      );

    const csvContent = [
      headers.join(","),
      ...rows.map(
        (row) =>
          row.join(",")
      )
    ].join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = "expenses.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }
);


// =========================
// Dark Mode
// =========================

const darkModeBtn =
  document.getElementById(
    "darkModeBtn"
  );

darkModeBtn.addEventListener(
  "click",
  () => {
    document.body.classList.toggle(
      "dark-mode"
    );

    if (
      document.body.classList.contains(
        "dark-mode"
      )
    ) {
      darkModeBtn.textContent =
        "Light Mode";
    } else {
      darkModeBtn.textContent =
        "Dark Mode";
    }
  }
);


// =========================
// Initial Load
// =========================

getExpenses();