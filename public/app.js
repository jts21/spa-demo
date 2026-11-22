const app = document.getElementById('app');

const views = {
  '/': () => {
    app.innerHTML = `
      <h1 data-test="page-title">Home</h1>
      <p>Estimate mortgage payments, upfront costs, rental income, operating expenses, and returns for your next property investment.</p>
      <div class="home-cards">
        <section class="card" aria-labelledby="mortgage-title">
          <h2 id="mortgage-title">Monthly mortgage estimate</h2>
          <p>Estimate your monthly principal and interest payment.</p>
          <form id="mortgage-form" class="mortgage-form">
            <label for="purchase-price">Purchase price ($)</label>
            <input id="purchase-price" name="purchasePrice" type="number" min="0.01" step="0.01" required />
            <label for="down-payment-percent">Down payment (%)</label>
            <input id="down-payment-percent" name="downPaymentPercent" type="number" min="0" max="100" step="0.01" value="0" data-clear-zero required />
            <label for="down-payment-amount">Down payment amount ($)</label>
            <input id="down-payment-amount" name="downPaymentAmount" type="text" value="$0.00" readonly aria-live="polite" />
            <label for="interest-rate">Annual interest rate (%)</label>
            <input id="interest-rate" name="interestRate" type="number" min="0" step="0.01" required />
            <label for="loan-term">Loan term (years)</label>
            <input id="loan-term" name="loanTerm" type="number" min="1" step="1" value="30" required />
            <label for="closing-cost-percent">Closing cost (%)</label>
            <input id="closing-cost-percent" name="closingCostPercent" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <button type="submit" data-test="calculate-mortgage">Calculate</button>
          </form>
          <p id="mortgage-error" class="error" role="alert"></p>
          <p id="total-purchase-cost" class="mortgage-result" data-test="total-purchase-cost" aria-live="polite" hidden></p>
          <p id="mortgage-result" class="mortgage-result" data-test="mortgage-result" aria-live="polite" hidden></p>
          <p class="disclaimer">Estimate excludes property taxes, homeowners insurance, and other costs.</p>
        </section>
        <section class="card" aria-labelledby="income-title">
          <h2 id="income-title">Gross annual property income</h2>
          <p>Enter monthly income before expenses to estimate gross annual income.</p>
          <form id="income-form" class="mortgage-form">
            <label for="rental-income">Monthly rental income ($)</label>
            <input id="rental-income" name="rentalIncome" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="parking-income">Monthly parking income ($)</label>
            <input id="parking-income" name="parkingIncome" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="other-income">Other monthly income ($)</label>
            <input id="other-income" name="otherIncome" type="number" min="0" step="0.01" value="0" data-clear-zero required />
          </form>
          <p id="annual-income-result" class="mortgage-result" data-test="annual-income-result" aria-live="polite">Gross annual income: $0.00</p>
          <p class="disclaimer">Calculated as the total monthly income multiplied by 12, before expenses.</p>
        </section>
        <section class="card" aria-labelledby="expenses-title">
          <h2 id="expenses-title">Operating expenses</h2>
          <p>Enter estimated monthly property operating expenses.</p>
          <form id="expenses-form" class="mortgage-form">
            <label for="mortgage-payment-expense">Monthly mortgage ($/month)</label>
            <input id="mortgage-payment-expense" name="mortgagePayment" type="number" min="0" step="0.01" value="0" readonly />
            <label for="insurance-expense">Insurance ($/year)</label>
            <input id="insurance-expense" name="insurance" type="number" min="0" step="0.01" value="0" data-clear-zero data-annual required />
            <label for="property-tax-expense">Property tax ($/year)</label>
            <input id="property-tax-expense" name="propertyTax" type="number" min="0" step="0.01" value="0" data-clear-zero data-annual required />
            <label for="water-expense">Water bill ($/month)</label>
            <input id="water-expense" name="water" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="gas-expense">Gas bill ($/month)</label>
            <input id="gas-expense" name="gas" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="electricity-expense">Electricity ($/month)</label>
            <input id="electricity-expense" name="electricity" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="maintenance-expense">Maintenance ($/month)</label>
            <input id="maintenance-expense" name="maintenance" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="hoa-expense">HOA fees ($/month)</label>
            <input id="hoa-expense" name="hoa" type="number" min="0" step="0.01" value="0" data-clear-zero required />
            <label for="other-expense">Other expenses ($/month)</label>
            <input id="other-expense" name="other" type="number" min="0" step="0.01" value="0" data-clear-zero required />
          </form>
          <p id="monthly-expenses-result" class="mortgage-result" data-test="monthly-expenses-result" aria-live="polite">Total monthly expenses: $0.00</p>
        </section>
      </div>
      <section class="card summary-card" aria-labelledby="investment-summary-title">
        <h2 id="investment-summary-title">Investment summary</h2>
        <div class="summary-results" aria-live="polite">
          <p><span>Total investment</span><strong id="summary-investment" data-test="summary-investment">$0.00</strong></p>
          <p><span>Net operating income monthly</span><strong id="summary-monthly-noi" data-test="summary-monthly-noi">$0.00</strong></p>
          <p><span>Net operating income annually</span><strong id="summary-annual-noi" data-test="summary-annual-noi">$0.00</strong></p>
          <p><span>Cap Rate</span><strong id="summary-cap-rate" data-test="summary-cap-rate">0.00%</strong></p>
        </div>
        <p class="disclaimer">Total investment is down payment plus closing costs. Cap Rate is annual operating income after operating expenses, before mortgage payments, divided by purchase price. Net operating income shown above subtracts all listed monthly expenses, including the mortgage payment.</p>
      </section>`;

    const form = document.getElementById('mortgage-form');
    const error = document.getElementById('mortgage-error');
    const result = document.getElementById('mortgage-result');
    const totalPurchaseCostResult = document.getElementById('total-purchase-cost');
    const purchasePriceInput = form.elements.purchasePrice;
    const downPaymentPercentInput = form.elements.downPaymentPercent;
    const downPaymentAmountInput = form.elements.downPaymentAmount;
    const currency = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });

    document.querySelectorAll('input[data-clear-zero]').forEach(input => {
      input.addEventListener('focus', () => {
        if (input.value === '0') {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      input.addEventListener('blur', () => {
        if (input.value === '') {
          input.value = '0';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
    });

    function updateDownPaymentAmount() {
      const purchasePrice = Number(purchasePriceInput.value);
      const downPaymentPercent = Number(downPaymentPercentInput.value);
      const isValid = purchasePrice > 0
        && downPaymentPercentInput.value !== ''
        && downPaymentPercent >= 0
        && downPaymentPercent <= 100;

      downPaymentAmountInput.value = isValid
        ? currency.format(purchasePrice * downPaymentPercent / 100)
        : '';
    }

    purchasePriceInput.addEventListener('input', updateDownPaymentAmount);
    downPaymentPercentInput.addEventListener('input', updateDownPaymentAmount);

    const incomeForm = document.getElementById('income-form');
    const annualIncomeResult = document.getElementById('annual-income-result');
    const incomeInputs = [
      incomeForm.elements.rentalIncome,
      incomeForm.elements.parkingIncome,
      incomeForm.elements.otherIncome
    ];

    function updateAnnualIncome() {
      const monthlyIncome = incomeInputs.reduce((total, input) => total + Number(input.value), 0);
      annualIncomeResult.textContent = `Gross annual income: ${currency.format(monthlyIncome * 12)}`;
    }

    incomeForm.addEventListener('input', updateAnnualIncome);

    const expensesForm = document.getElementById('expenses-form');
    const monthlyExpensesResult = document.getElementById('monthly-expenses-result');
    const mortgagePaymentExpense = expensesForm.elements.mortgagePayment;
    const expenseInputs = Array.from(expensesForm.querySelectorAll('input'));
    const investmentResult = document.getElementById('summary-investment');
    const monthlyNoiResult = document.getElementById('summary-monthly-noi');
    const annualNoiResult = document.getElementById('summary-annual-noi');
    const capRateResult = document.getElementById('summary-cap-rate');

    function getMonthlyExpenses() {
      return expenseInputs.reduce((total, input) => {
        const amount = Number(input.value);
        return total + (input.hasAttribute('data-annual') ? amount / 12 : amount);
      }, 0);
    }

    function updateSummary() {
      const purchasePrice = Number(purchasePriceInput.value);
      const downPayment = purchasePrice * Number(downPaymentPercentInput.value) / 100;
      const closingCosts = purchasePrice * Number(form.elements.closingCostPercent.value) / 100;
      const monthlyIncome = incomeInputs.reduce((total, input) => total + Number(input.value), 0);
      const monthlyExpenses = getMonthlyExpenses();
      const monthlyNoi = monthlyIncome - monthlyExpenses;
      const operatingExpenses = expenseInputs.reduce((total, input) => {
        if (input === mortgagePaymentExpense) return total;
        const amount = Number(input.value);
        return total + (input.hasAttribute('data-annual') ? amount / 12 : amount);
      }, 0);
      const annualOperatingIncome = (monthlyIncome - operatingExpenses) * 12;
      const capRate = purchasePrice > 0 ? annualOperatingIncome / purchasePrice * 100 : 0;

      investmentResult.textContent = currency.format(downPayment + closingCosts);
      monthlyNoiResult.textContent = currency.format(monthlyNoi);
      annualNoiResult.textContent = currency.format(monthlyNoi * 12);
      capRateResult.textContent = `${capRate.toFixed(2)}%`;
    }

    function updateMonthlyExpenses() {
      const monthlyExpenses = getMonthlyExpenses();
      monthlyExpensesResult.textContent = `Total monthly expenses: ${currency.format(monthlyExpenses)}`;
      updateSummary();
    }

    expensesForm.addEventListener('input', updateMonthlyExpenses);
    incomeForm.addEventListener('input', updateSummary);
    form.addEventListener('input', updateSummary);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const purchasePrice = Number(purchasePriceInput.value);
      const downPaymentPercent = Number(downPaymentPercentInput.value);
      const downPayment = purchasePrice * downPaymentPercent / 100;
      const annualRate = Number(form.elements.interestRate.value);
      const loanTermYears = Number(form.elements.loanTerm.value);
      const closingCostPercent = Number(form.elements.closingCostPercent.value);

      if (downPaymentPercent < 0 || downPaymentPercent > 100 || closingCostPercent < 0) {
        error.textContent = 'Down payment must be between 0% and 100%, and closing costs cannot be negative.';
        result.hidden = true;
        totalPurchaseCostResult.hidden = true;
        return;
      }

      const closingCosts = purchasePrice * closingCostPercent / 100;
      const upfrontCashNeeded = downPayment + closingCosts;
      const principal = purchasePrice - downPayment;
      const monthlyRate = annualRate / 100 / 12;
      const numberOfPayments = loanTermYears * 12;
      const monthlyPayment = monthlyRate === 0
        ? principal / numberOfPayments
        : principal * monthlyRate / (1 - (1 + monthlyRate) ** -numberOfPayments);

      error.textContent = '';
      totalPurchaseCostResult.textContent = `Estimated cash needed before mortgage: ${currency.format(upfrontCashNeeded)}`;
      totalPurchaseCostResult.hidden = false;
      result.textContent = `Estimated monthly payment: ${currency.format(monthlyPayment)}`;
      result.hidden = false;
      mortgagePaymentExpense.value = monthlyPayment.toFixed(2);
      updateMonthlyExpenses();
    });
  },
  '/about': () => {
    app.innerHTML = `<h1 data-test="page-title">About</h1><p>Built with Node.js, Docker and GitHub Actions.</p>`;
  },
  '/tasks': async () => {
    app.innerHTML = `
      <h1 data-test="page-title">Tasks</h1>
      <form id="task-form">
        <input id="task-input" data-test="task-input" placeholder="New task" />
        <button type="submit" data-test="add-task">Add</button>
      </form>
      <p id="error" data-test="error" style="color:#b91c1c"></p>
      <ul id="task-list" data-test="task-list"></ul>`;

    const list = document.getElementById('task-list');
    const error = document.getElementById('error');

    async function load() {
      const tasks = await (await fetch('/api/tasks')).json();
      list.innerHTML = tasks.map(t => `
        <li data-test="task-item">
          <span>${escapeHtml(t.title)}</span>
          <button data-id="${t.id}" data-test="delete-task">Delete</button>
        </li>`).join('');
    }

    document.getElementById('task-form').addEventListener('submit', async e => {
      e.preventDefault();
      const input = document.getElementById('task-input');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.value })
      });
      error.textContent = res.ok ? '' : 'Title is required';
      if (res.ok) input.value = '';
      load();
    });

    list.addEventListener('click', async e => {
      const id = e.target.dataset.id;
      if (!id) return;
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      load();
    });

    load();
  }
};

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function router() {
  const route = location.hash.slice(1) || '/';
  app.classList.toggle('home-page', route === '/');
  (views[route] || views['/'])();
  document.querySelectorAll('nav a').forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + route));
}

window.addEventListener('hashchange', router);
router();
