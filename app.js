// ========================================
// NCBFT Dashboard - Application Logic
// ========================================

// Global state
let appState = {
    selectedYear: '',
    sortColumn: 0,
    sortAscending: true,
    currentPage: 1,
    rowsPerPage: 25,
    filteredData: [],
    charts: {}
};

// Color palette for donors
const donorColors = {
    'FMoH': '#003DA5',
    'FCDO/DFID': '#27AE60',
    'UNFPA': '#E74C3C',
    'USAID': '#F39C12',
    'GAC/DFATD': '#9B59B6',
    'SURE-P': '#1ABC9C',
    'GOMBE STATE': '#E67E22',
    'OGUN STATE': '#2980B9',
    'LAGOS STATE': '#C0392B',
    'DELTA STATE': '#16A085',
    'ADAMAWA STATE': '#8E44AD',
    'RIVERS STATE': '#2C3E50',
    'BAUCHI STATE': '#D35400',
    'SOKOTO STATE': '#27AE60',
    'CROSS RIVER STATE': '#2980B9',
    'AKWA-IBOM STATE': '#C0392B',
    'BMGF': '#16A085',
    'CIFF': '#8E44AD',
    'EU-SARAH': '#E74C3C'
};

// Get color for donor (cycle through if not predefined)
function getDonorColor(donor) {
    if (donorColors[donor]) {
        return donorColors[donor];
    }
    const colors = Object.values(donorColors);
    const index = getUniqueDonors().indexOf(donor) % colors.length;
    return colors[index];
}

// Initialize dashboard
function initializeDashboard() {
    populateYearFilters();
    updateDashboard();
    initializeCharts();
    updateTable();
}

// Populate year filter dropdowns
function populateYearFilters() {
    const years = getUniqueYears();
    const yearFilter = document.getElementById('year-filter');
    const contributionYearFilter = document.getElementById('contribution-year-filter');

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
        
        const option2 = document.createElement('option');
        option2.value = year;
        option2.textContent = year;
        contributionYearFilter.appendChild(option2);
    });

    // Set to latest year
    if (years.length > 0) {
        yearFilter.value = years[years.length - 1];
        contributionYearFilter.value = years[years.length - 1];
        appState.selectedYear = years[years.length - 1].toString();
    }
}

// Update KPI cards
function updateKPICards() {
    const selectedYear = appState.selectedYear ? parseInt(appState.selectedYear) : null;
    const metrics = calculateYearMetrics(selectedYear);
    const aggregateMetrics = calculateAggregateMetrics();

    document.getElementById('funding-requirement').textContent = formatCurrency(metrics.totalFundingRequirement);
    document.getElementById('funds-disbursed').textContent = formatCurrency(metrics.totalFundsDisbursed);
    document.getElementById('funding-gap').textContent = formatCurrency(metrics.fundingGap);
    document.getElementById('aggregate-funds').textContent = formatCurrency(aggregateMetrics.totalFundsDisbursed);
}

// Update dashboard
function updateDashboard() {
    appState.selectedYear = document.getElementById('year-filter').value;
    updateKPICards();
    updateAllCharts();
}

// Initialize all charts
function initializeCharts() {
    const years = getUniqueYears();

    // Chart 1: Funds Disbursed by Donor by Year
    createChart1();

    // Chart 2: Contribution Proportion
    updateContributionChart();

    // Chart 3: Funding Requirement vs Funds Disbursed vs Funding Gap
    createChart3();

    // Chart 4: Funding by Year
    createChart4();

    // Chart 5: Percentage of Commitment Disbursed
    createChart5();

    // Chart 6: Funding Commitment by Donor by Year
    createChart6();

    // Chart 7: Funding Requirement by Year
    createChart7();

    // Chart 8: Funding Gap by Year
    createChart8();

    // Chart 9: Women Receiving Care by Year
    createChart9();

    // Chart 10: Unsafe Abortions by Year
    createChart10();

    // Chart 11: Unintended Pregnancies by Year
    createChart11();

    // Chart 12: Maternal Deaths by Year
    createChart12();
}

// Update all charts
function updateAllCharts() {
    createChart1();
    updateContributionChart();
    createChart3();
    createChart4();
    createChart5();
    createChart6();
    createChart7();
    createChart8();
    createChart9();
    createChart10();
    createChart11();
    createChart12();
}

// Chart 1: Funds Disbursed by Donor by Year
function createChart1() {
    const years = getUniqueYears();
    const donors = getUniqueDonors();
    
    const datasets = donors.map(donor => {
        const data = years.map(year => {
            const yearData = getDataByYear(year);
            const donorData = yearData.filter(d => d.donor === donor);
            return donorData.reduce((sum, d) => sum + d.fundsDisbursed, 0);
        });
        
        return {
            label: donor,
            data: data,
            backgroundColor: getDonorColor(donor),
            borderColor: getDonorColor(donor),
            borderWidth: 1
        };
    });

    destroyChart('chart1');
    const ctx = document.getElementById('chart1').getContext('2d');
    appState.charts.chart1 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    stacked: false
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 2: Contribution Proportion by Donor
function updateContributionChart() {
    const selectedYear = document.getElementById('contribution-year-filter').value;
    const year = selectedYear ? parseInt(selectedYear) : getUniqueYears()[getUniqueYears().length - 1];
    
    const fundsByDonor = getFundsByDonorYear(year);
    const donors = Object.keys(fundsByDonor).sort();
    const values = donors.map(d => fundsByDonor[d]);
    const colors = donors.map(d => getDonorColor(d));

    destroyChart('chart2');
    const ctx = document.getElementById('chart2').getContext('2d');
    appState.charts.chart2 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: donors,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(2);
                            return context.label + ': ' + formatCurrency(context.parsed) + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Chart 3: Funding Requirement vs Funds Disbursed vs Funding Gap
function createChart3() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    
    const requirementData = years.map(y => aggregated[y].totalFundingRequirement);
    const disbursedData = years.map(y => aggregated[y].totalFundsDisbursed);
    const gapData = years.map(y => aggregated[y].fundingGap);

    destroyChart('chart3');
    const ctx = document.getElementById('chart3').getContext('2d');
    appState.charts.chart3 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Funding Requirement',
                    data: requirementData,
                    backgroundColor: '#003DA5',
                    borderColor: '#003DA5',
                    borderWidth: 1
                },
                {
                    label: 'Funds Disbursed',
                    data: disbursedData,
                    backgroundColor: '#27AE60',
                    borderColor: '#27AE60',
                    borderWidth: 1
                },
                {
                    label: 'Funding Gap',
                    data: gapData,
                    backgroundColor: '#E74C3C',
                    borderColor: '#E74C3C',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 4: Funding by Year (Requirement, Disbursed, Commitment)
function createChart4() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    
    const requirementData = years.map(y => aggregated[y].totalFundingRequirement);
    const disbursedData = years.map(y => aggregated[y].totalFundsDisbursed);
    const commitmentData = years.map(y => aggregated[y].totalFundingCommitment);

    destroyChart('chart4');
    const ctx = document.getElementById('chart4').getContext('2d');
    appState.charts.chart4 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Funding Requirement',
                    data: requirementData,
                    borderColor: '#003DA5',
                    backgroundColor: 'rgba(0, 61, 165, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#003DA5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: 'Funds Disbursed',
                    data: disbursedData,
                    borderColor: '#27AE60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#27AE60',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                },
                {
                    label: 'Funding Commitment',
                    data: commitmentData,
                    borderColor: '#F39C12',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointBackgroundColor: '#F39C12',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 5: Percentage of Commitment Disbursed
function createChart5() {
    const donors = getUniqueDonors();
    const years = getUniqueYears();
    
    const datasets = donors.map(donor => {
        const data = years.map(year => {
            const yearData = getDataByYear(year);
            const donorData = yearData.filter(d => d.donor === donor);
            const disbursed = donorData.reduce((sum, d) => sum + d.fundsDisbursed, 0);
            const commitment = donorData.reduce((sum, d) => sum + d.fundingCommitment, 0);
            return commitment > 0 ? (disbursed / commitment) * 100 : 0;
        });
        
        return {
            label: donor,
            data: data,
            backgroundColor: getDonorColor(donor),
            borderColor: getDonorColor(donor),
            borderWidth: 1
        };
    });

    destroyChart('chart5');
    const ctx = document.getElementById('chart5').getContext('2d');
    appState.charts.chart5 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            indexAxis: 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
}

// Chart 6: Funding Commitment by Donor by Year
function createChart6() {
    const years = getUniqueYears();
    const donors = getUniqueDonors();
    
    const datasets = donors.map(donor => {
        const data = years.map(year => {
            const yearData = getDataByYear(year);
            const donorData = yearData.filter(d => d.donor === donor);
            return donorData.reduce((sum, d) => sum + d.fundingCommitment, 0);
        });
        
        return {
            label: donor,
            data: data,
            backgroundColor: getDonorColor(donor),
            borderColor: getDonorColor(donor),
            borderWidth: 1
        };
    });

    destroyChart('chart6');
    const ctx = document.getElementById('chart6').getContext('2d');
    appState.charts.chart6 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 7: Funding Requirement by Year
function createChart7() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const requirementData = years.map(y => aggregated[y].totalFundingRequirement);

    destroyChart('chart7');
    const ctx = document.getElementById('chart7').getContext('2d');
    appState.charts.chart7 = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Funding Requirement',
                data: requirementData,
                backgroundColor: '#003DA5',
                borderColor: '#003DA5',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 8: Funding Gap by Year
function createChart8() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const gapData = years.map(y => aggregated[y].fundingGap);

    destroyChart('chart8');
    const ctx = document.getElementById('chart8').getContext('2d');
    appState.charts.chart8 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Funding Gap',
                data: gapData,
                borderColor: '#E74C3C',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#E74C3C',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
}

// Chart 9: Women Receiving Care by Year
function createChart9() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const data = years.map(y => aggregated[y].totalWomenCare);

    destroyChart('chart9');
    const ctx = document.getElementById('chart9').getContext('2d');
    appState.charts.chart9 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Women Receiving Care',
                data: data,
                borderColor: '#27AE60',
                backgroundColor: 'rgba(39, 174, 96, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#27AE60',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Chart 10: Unsafe Abortions by Year
function createChart10() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const data = years.map(y => aggregated[y].totalUnsafeAbortion);

    destroyChart('chart10');
    const ctx = document.getElementById('chart10').getContext('2d');
    appState.charts.chart10 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Unsafe Abortions',
                data: data,
                borderColor: '#E74C3C',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#E74C3C',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Chart 11: Unintended Pregnancies by Year
function createChart11() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const data = years.map(y => aggregated[y].totalUnintendedPregnancy);

    destroyChart('chart11');
    const ctx = document.getElementById('chart11').getContext('2d');
    appState.charts.chart11 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Unintended Pregnancies',
                data: data,
                borderColor: '#F39C12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#F39C12',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Chart 12: Maternal Deaths by Year
function createChart12() {
    const aggregated = getAggregatedByYear();
    const years = getUniqueYears();
    const data = years.map(y => aggregated[y].totalMaternalDeaths);

    destroyChart('chart12');
    const ctx = document.getElementById('chart12').getContext('2d');
    appState.charts.chart12 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Maternal Deaths',
                data: data,
                borderColor: '#C0392B',
                backgroundColor: 'rgba(192, 57, 43, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#C0392B',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    });
}

// Destroy chart if exists
function destroyChart(chartId) {
    if (appState.charts[chartId]) {
        appState.charts[chartId].destroy();
    }
}

// Update data table
function updateTable() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    appState.filteredData = ncbftData.filter(row => {
        const searchableText = `${row.donor} ${row.year} ${row.procurementModality}`.toLowerCase();
        return searchableText.includes(searchTerm);
    });

    // Sort data
    const sortColumns = ['donor', 'year', 'fundsDisbursed', 'fundingCommitment', 'fundingRequirement', 'procurementModality', 'contributionProportion'];
    const sortKey = sortColumns[appState.sortColumn] || 'donor';

    appState.filteredData.sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];

        if (aVal < bVal) return appState.sortAscending ? -1 : 1;
        if (aVal > bVal) return appState.sortAscending ? 1 : -1;
        return 0;
    });

    appState.currentPage = 1;
    renderTable();
}

// Render table rows
function renderTable() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';

    const rowsPerPage = parseInt(document.getElementById('rows-per-page').value);
    const startIndex = (appState.currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = appState.filteredData.slice(startIndex, endIndex);

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.donor}</td>
            <td>${row.year}</td>
            <td>${formatCurrency(row.fundsDisbursed)}</td>
            <td>${formatCurrency(row.fundingCommitment)}</td>
            <td>${formatCurrency(row.fundingRequirement)}</td>
            <td>${row.procurementModality}</td>
            <td>${row.contributionProportion}%</td>
            <td>${formatNumber(row.womenReceivingCare)}</td>
            <td>${formatNumber(row.unsafeAbortion)}</td>
            <td>${formatNumber(row.unintendedPregnancy)}</td>
            <td>${formatNumber(row.maternalDeaths)}</td>
        `;
        tbody.appendChild(tr);
    });

    updatePagination();
}

// Update pagination
function updatePagination() {
    const rowsPerPage = parseInt(document.getElementById('rows-per-page').value);
    const totalPages = Math.ceil(appState.filteredData.length / rowsPerPage);

    document.getElementById('pagination-text').textContent = `Page ${appState.currentPage} of ${totalPages}`;
    document.getElementById('prev-btn').disabled = appState.currentPage === 1;
    document.getElementById('next-btn').disabled = appState.currentPage === totalPages;
}

// Pagination functions
function previousPage() {
    if (appState.currentPage > 1) {
        appState.currentPage--;
        renderTable();
    }
}

function nextPage() {
    const rowsPerPage = parseInt(document.getElementById('rows-per-page').value);
    const totalPages = Math.ceil(appState.filteredData.length / rowsPerPage);
    if (appState.currentPage < totalPages) {
        appState.currentPage++;
        renderTable();
    }
}

// Sort table
function sortTable(columnIndex) {
    if (appState.sortColumn === columnIndex) {
        appState.sortAscending = !appState.sortAscending;
    } else {
        appState.sortColumn = columnIndex;
        appState.sortAscending = true;
    }
    updateTable();
}

// Search input handler
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', updateTable);
    }
});

// Download as Excel
function downloadExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(ncbftData.map(row => ({
        'Donor': row.donor,
        'Year': row.year,
        'Funds Disbursed': row.fundsDisbursed,
        'Funding Commitment': row.fundingCommitment,
        'Funding Requirement': row.fundingRequirement,
        'Procurement Modality': row.procurementModality,
        'Contribution Proportion': row.contributionProportion,
        'Women Receiving Care': row.womenReceivingCare,
        'Unsafe Abortion': row.unsafeAbortion,
        'Unintended Pregnancy': row.unintendedPregnancy,
        'Maternal Deaths': row.maternalDeaths
    })));
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NCBFT Data');
    XLSX.writeFile(workbook, 'NCBFT-Dashboard-Data.xlsx');
}

// Download as CSV
function downloadCSV() {
    const headers = ['Donor', 'Year', 'Funds Disbursed', 'Funding Commitment', 'Funding Requirement', 'Procurement Modality', 'Contribution Proportion', 'Women Receiving Care', 'Unsafe Abortion', 'Unintended Pregnancy', 'Maternal Deaths'];
    
    const rows = ncbftData.map(row => [
        row.donor,
        row.year,
        row.fundsDisbursed,
        row.fundingCommitment,
        row.fundingRequirement,
        row.procurementModality,
        row.contributionProportion,
        row.womenReceivingCare,
        row.unsafeAbortion,
        row.unintendedPregnancy,
        row.maternalDeaths
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'NCBFT-Dashboard-Data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Smooth scroll function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeDashboard);