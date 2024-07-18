const dataRow = document.getElementById("data");
let transactions = [];
let customers = [];
let myChart;
//~====get data from api====~//
async function transictions() {
  let response = await fetch(`http://localhost:3000/transactions`);
  transactions = await response.json();
  return transactions;
}
async function customer() {
  let response = await fetch(`http://localhost:3000/customers`);
  customers = await response.json();
  return customers;
}
//!=======show table=======!//
async function showTable() {
  let tableBox = ` `;
  await customer();
 await transictions();
  for (let i = 0; i < customers.length; i++) {
    for (let j = 0; j < transactions.length; j++) {
      if (customers[i].id == transactions[j].customer_id) {
        // customersName.push(customers[i].name);
        // data.push(transactions[j].amount);
        tableBox += `
        <tr data-name="${customers[i].name}" data-amount="${transactions[j].amount} " class="tbody-row  rows">
                <td class="text-center">${customers[i].id}</td>
                <td class="text-center">${customers[i].name}</td>
                <td class="text-center">${transactions[j].amount}</td>
                <td class="text-center">${transactions[j].date}</td>
                <td class="text-center"><button class="btn btn-primary chart " data-customer-id="${transactions[j].customer_id}">Chart</button> </td>
            </tr>
        `;
      }
    }
  }
  dataRow.innerHTML = tableBox;
  search();
  getChartData();
}
showTable();
//~======get data by search amount===~//
function search() {
  const searchInput = document.getElementById("searchInput");
  const tableRows = document.querySelectorAll("tr");
  searchInput.addEventListener("keyup", () => {
    let searchTable = " ";
    dataRow.innerHTML = " ";
    tableRows.forEach((row) => {
      if (row.getAttribute("data-name")) {
        if (
            row.getAttribute("data-name").toLowerCase().includes(searchInput.value.toLowerCase()) ||
           row.getAttribute("data-amount").includes(searchInput.value)
        ) {
          searchTable += row.outerHTML;
        } else if (searchInput.value == ` `) {
          showTable();
        }
      }
    });
    dataRow.innerHTML = searchTable;
    getChartData();
  });
}
//!=======chart====!//
const ctx = document.getElementById("myChart");
function DrawChart(date, amount) {
  if(myChart)
  {
    myChart.destroy();
  }
  myChart=new Chart(ctx, {
    type: "bar",
    data: {
      labels: date,
      datasets: [
        {
          label: "transcitions",
          data: amount,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function getChartData() {
  
  document.querySelectorAll(".chart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const date = [];
      const amount = [];
      for (let i = 0; i < transactions.length; i++) {
       
        if (
          btn.getAttribute("data-customer-id") == transactions[i].customer_id
        ) {
          date.push(transactions[i].date);
          amount.push(transactions[i].amount);
        }
      }
      DrawChart(date, amount);
    });
  });
}
